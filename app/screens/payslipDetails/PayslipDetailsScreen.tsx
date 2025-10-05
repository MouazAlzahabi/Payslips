// src/screens/PayslipDetailsScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { usePayslips } from '../../_context/PayslipsContext';
import { formatPeriod } from '../../_utils/date';
import { previewBundledAsset, saveBundledAssetCompat, saveUriToGalleryCompat } from '../../_utils/file';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { detailsStyles } from './detailsStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function PayslipDetailsScreen({ navigation, route }: Props) {
  const { payslipId } = route.params;
  const { state } = usePayslips();
  const payslip = state.payslips.find((p) => p.id === payslipId);

  const [busy, setBusy] = useState(false);
  const [savedUri, setSavedUri] = useState<string | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);

  if (!payslip) {
    return (
      <View style={detailsStyles.centered}>
        <Text style={detailsStyles.errorTitle}>Payslip not found</Text>
      </View>
    );
  }

  const getExtension = () => {
    const lower = payslip.fileName.toLowerCase();
    if (payslip.fileType === 'image') {
      if (lower.endsWith('.png')) return '.png';
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return '.jpg';
      return '.png';
    }
    return lower.endsWith('.pdf') ? '.pdf' : '.pdf';
  };

  const handlePreview = async () => {
    setBusy(true);
    try {
      const uri = await previewBundledAsset(payslip.asset, payslip.fileType, {
        returnUriForPdf: true,
        skipShareForImages: true,
      });

      const isPdf = payslip.fileType === 'pdf' || payslip.fileName.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        navigation.navigate('Preview', { uri, title: payslip.fileName });
      } else if (payslip.fileType === 'image') {
        setPreviewImageUri(uri);
      } else {
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Preview', `File available at: ${uri}`);
        }
      }
    } catch (err: any) {
      console.error('Preview failed', err);
      Alert.alert('Preview failed', String(err?.message ?? err));
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    setBusy(true);
    try {
      const ext = getExtension();
      const filename = `${payslip.id}${ext}`;
      const uri = await saveBundledAssetCompat(payslip.asset, filename);
      setSavedUri(uri);

      if (payslip.fileType === 'image') {
        try {
          await saveUriToGalleryCompat(uri);
          Alert.alert('Saved', 'Image saved to your gallery.');
        } catch (e: any) {
          console.warn('Gallery save failed', e);
          Alert.alert(
            'Saved',
            `Image saved to app storage: ${uri}\n\nCould not save to gallery: ${String(e?.message ?? e)}`
          );
        }
      } else {
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
        } else {
          Alert.alert('Saved', `PDF saved to:\n\n${uri}`);
        }
      }
    } catch (err: any) {
      console.error('Save failed', err);
      Alert.alert('Save failed', String(err?.message ?? err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={detailsStyles.container}>
      <View style={detailsStyles.headerRow}>
        <View style={detailsStyles.meta}>
          <Text style={detailsStyles.title}>Payslip</Text>
          <Text style={detailsStyles.idText}>{payslip.id}</Text>
          <Text style={detailsStyles.periodText}>{formatPeriod(payslip.fromDate, payslip.toDate)}</Text>
        </View>
      </View>

      <View style={detailsStyles.actions}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Preview payslip"
          onPress={handlePreview}
          style={[detailsStyles.primaryButton, detailsStyles.previewButton]}
          disabled={busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={detailsStyles.primaryButtonText}>Preview</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Download payslip to device"
          onPress={handleDownload}
          style={[detailsStyles.primaryButton, { marginTop: 12 }]}
          disabled={busy}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={detailsStyles.primaryButtonText}>Download</Text>}
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.infoBlock}>
        <Text style={detailsStyles.infoTitle}>Details</Text>
        <Text style={detailsStyles.infoLine}>
          <Text style={detailsStyles.infoLabel}>From: </Text>
          {payslip.fromDate}
        </Text>
        <Text style={detailsStyles.infoLine}>
          <Text style={detailsStyles.infoLabel}>To: </Text>
          {payslip.toDate}
        </Text>
        <Text style={detailsStyles.infoLine}>
          <Text style={detailsStyles.infoLabel}>File: </Text>
          {payslip.fileName} ({payslip.fileType})
        </Text>
        <Text style={detailsStyles.smallNote}>
          Preview opens the bundled file directly (PDFs in-app, images modal). Download copies it into app storage; images are additionally saved to your gallery, PDFs prompt Save-to-Files.
        </Text>
        {savedUri ? <Text style={detailsStyles.savedPath}>Saved: {savedUri}</Text> : null}
      </View>

      {previewImageUri && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewImageUri(null)}
        >
          <TouchableWithoutFeedback onPress={() => setPreviewImageUri(null)}>
            <View style={detailsStyles.imageModalContainer}>
              <Image source={{ uri: previewImageUri }} style={detailsStyles.modalImage} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}
