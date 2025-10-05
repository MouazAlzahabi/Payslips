import { Asset } from 'expo-asset';
import * as FS from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

/**
 * Save a bundled asset (moduleRef from require(...)) into the app's document directory.
 * - Prefer the new File/Directory API when available
 * - Else use the explicit legacy entry "expo-file-system/legacy" to avoid deprecation warnings
 * - Finally fall back to expo-file-system if necessary
 *
 * Returns the saved URI string on success.
 */
export async function saveBundledAssetCompat(moduleRef: any, filename: string): Promise<string> {
  // 1) Resolve bundled asset -> localUri via expo-asset
  const asset = Asset.fromModule(moduleRef);
  await asset.downloadAsync();
  if (!asset.localUri) throw new Error('Could not resolve bundled asset localUri');
  const sourceUri = asset.localUri;

  // 2) Try the NEW File/Directory API (if present)
  try {
    const MaybeFile: any = (FS as any).File;
    const MaybeDirectory: any = (FS as any).Directory;

    if (MaybeFile && MaybeDirectory && typeof MaybeDirectory.document === 'function') {
      const destPath = `${MaybeDirectory.document()}/${filename}`;
      const destFile = new MaybeFile(destPath);
      try { await destFile.deleteAsync({ idempotent: true }); } catch {}
      await destFile.copyFromUriAsync(sourceUri);
      return destFile.uri;
    }
  } catch (err) {
    console.warn('[fileCompat] New File/Directory API attempt failed — will try legacy API', err);
  }

  // 3) Try explicit legacy import to avoid deprecation warnings
  try {
    // dynamic require to avoid static resolution problems on some bundlers
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FSlegacy = require('expo-file-system/legacy') as typeof FS;

    if (FSlegacy && FSlegacy.copyAsync && typeof FSlegacy.documentDirectory === 'string') {
      const dest = `${FSlegacy.documentDirectory}${filename}`;
      const info = await FSlegacy.getInfoAsync?.(dest).catch(() => ({ exists: false }));
      if (info && (info as any).exists) {
        await FSlegacy.deleteAsync?.(dest, { idempotent: true }).catch(() => {});
      }
      await FSlegacy.copyAsync({ from: sourceUri, to: dest });
      return dest;
    }
  } catch (err) {
    console.warn('[fileCompat] explicit legacy import failed, falling back to default expo-file-system', err);
  }

  // 4) Fallback to the default expo-file-system (may produce deprecation warnings)
  try {
    const dest = `${FS.documentDirectory}${filename}`;
    const info = await FS.getInfoAsync(dest).catch(() => ({ exists: false }));
    if (info && (info as any).exists) {
      await FS.deleteAsync(dest, { idempotent: true }).catch(() => {});
    }
    await FS.copyAsync({ from: sourceUri, to: dest });
    return dest;
  } catch (err) {
    throw new Error(`File copy failed (fallback): ${String(err)}`);
  }
}

/**
 * Save local file URI to the device gallery (images only)
 */
export async function saveUriToGalleryCompat(uri: string): Promise<void> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Media library permission denied');
  await MediaLibrary.createAssetAsync(uri);
}

// default export for convenience
export default { saveBundledAssetCompat, saveUriToGalleryCompat, resolveBundledAssetUri,
  previewBundledAsset };


export type PreviewOptions = {
  /**
   * Called when a PDF is resolved and the caller wants to handle in-app navigation.
   * Example: onPdf = (uri) => navigation.navigate('Preview', { uri, title })
   */
  onPdf?: (uri: string) => Promise<void> | void;

  /**
   * If true, for images the helper will NOT call the share sheet and will instead
   * return the resolved URI to the caller so they can display an in-app modal.
   * Default: false (helper will open the share sheet for images).
   */
  skipShareForImages?: boolean;

  /**
   * If true, for PDFs the helper will NOT call onPdf or the share sheet and will
   * instead return the resolved URI to the caller.
   * Default: false.
   */
  returnUriForPdf?: boolean;
};

/**
 * Resolve a bundled module (require(...)) to a usable local URI.
 * Ensures downloadAsync is called only when necessary.
 */
export async function resolveBundledAssetUri(moduleRef: any, timeoutMs = 15000): Promise<string> {
  const asset = Asset.fromModule(moduleRef);

  // if localUri already available, return fast
  if (asset.localUri) return asset.localUri;

  // otherwise download with a safety timeout
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
  }, timeoutMs);

  try {
    await asset.downloadAsync();
    clearTimeout(timer);
    if (timedOut || !asset.localUri) {
      throw new Error('Timed out or could not obtain local URI for asset');
    }
    return asset.localUri;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Preview a bundled asset (PDF or image).
 *
 * Behavior:
 * - Resolves the bundled asset to a local URI.
 * - If PDF:
 *    - if options.returnUriForPdf true -> returns the uri
 *    - else if options.onPdf provided -> calls onPdf(uri)
 *    - else uses expo-sharing.shareAsync(uri, { mimeType: 'application/pdf' })
 * - If image:
 *    - if options.skipShareForImages true -> returns the uri
 *    - else uses expo-sharing.shareAsync(uri, { mimeType: 'image/*' })
 *
 * Always returns the resolved uri on success so the caller can do anything further.
 */
export async function previewBundledAsset(
  moduleRef: any,
  fileType: 'pdf' | 'image' | string,
  options: PreviewOptions = {}
): Promise<string> {
  const { onPdf, skipShareForImages = false, returnUriForPdf = false } = options;

  // 1) Resolve URI
  const uri = await resolveBundledAssetUri(moduleRef);

  // 2) Decide behavior
  const lowerType = String(fileType).toLowerCase();
  const isPdf = lowerType === 'pdf' || lowerType.endsWith('.pdf');
  const isImage = lowerType === 'image' || /\.(png|jpe?g|gif|webp)$/.test(lowerType);

  // PDF path
  if (isPdf) {
    if (returnUriForPdf) {
      return uri;
    }
    if (onPdf) {
      await onPdf(uri);
      return uri;
    }
    // fallback: share/preview via OS
    const available = await Sharing.isAvailableAsync();
    if (!available) throw new Error('Sharing/preview is not available on this device/runtime');
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    return uri;
  }

  // Image path
  if (isImage) {
    if (skipShareForImages) return uri;
    const available = await Sharing.isAvailableAsync();
    if (!available) throw new Error('Sharing/preview is not available on this device/runtime');
    await Sharing.shareAsync(uri, { mimeType: 'image/*' });
    return uri;
  }

  // Generic fallback: return the uri (caller can decide) or try share
  if (skipShareForImages) return uri;
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Sharing/preview is not available on this device/runtime');
  await Sharing.shareAsync(uri);
  return uri;
}
