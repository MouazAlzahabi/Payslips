import { StyleSheet } from 'react-native';

import { themeColors } from '../../_styles/themeColors';
import { themeSpacing } from '../../_styles/themeSpacing';
import { themeTypography } from '../../_styles/themeTypography';


export const detailsStyles = StyleSheet.create({
  container: { flex: 1, padding: themeSpacing.lg, backgroundColor: themeColors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  meta: { flex: 1 },
  title: { ...themeTypography.title, color: themeColors.textPrimary },
  idText: { marginTop: themeSpacing.sm, color: themeColors.textLight },
  periodText: { marginTop: themeSpacing.xs, color: themeColors.textSecondary },
  actions: { marginTop: themeSpacing.xxl },
  primaryButton: {
    backgroundColor: themeColors.primary,
    paddingVertical: themeSpacing.lg,
    borderRadius: 10,
    alignItems: 'center',
  },
  previewButton: {
    backgroundColor: themeColors.success,
    marginTop: themeSpacing.lg,
  },
  primaryButtonText: { color: themeColors.buttonText, fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    marginTop: themeSpacing.sm,
    paddingVertical: themeSpacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  secondaryButtonText: { fontWeight: '600' },
  infoBlock: { marginTop: themeSpacing.xxl, backgroundColor: themeColors.infoBackground, padding: themeSpacing.md, borderRadius: 8 },
  infoTitle: { fontWeight: '700', marginBottom: themeSpacing.sm, color: themeColors.textPrimary },
  infoLine: { marginTop: themeSpacing.sm, color: themeColors.textPrimary },
  infoLabel: { fontWeight: '600', color: themeColors.textPrimary },
  smallNote: { marginTop: themeSpacing.md, color: themeColors.textSecondary, fontSize: themeTypography.small.fontSize },
  savedPath: { marginTop: themeSpacing.sm, color: themeColors.textLight, fontSize: themeTypography.small.fontSize },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: themeSpacing.lg },
  errorTitle: { fontSize: themeTypography.title.fontSize, fontWeight: themeTypography.title.fontWeight, color: themeColors.textPrimary },
  imageModalContainer: {
    flex: 1,
    backgroundColor: themeColors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: themeSpacing.lg,
  },
  modalImage: { width: '100%', height: '80%' },
});
