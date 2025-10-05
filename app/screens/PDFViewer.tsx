// src/screens/PDFViewer.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

const PDFViewer: React.FC<Props> = ({ route }) => {
  const { uri, title } = route.params ?? { uri: '', title: 'PDF Preview' };
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  if (!uri) {
    return (
      <View style={styles.center}>
        <Text>No PDF to preview</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!failed ? (
        <WebView
          originWhitelist={['*']}
          source={{ uri }}
          onLoadEnd={() => setLoading(false)}
          onError={(e) => {
            console.warn('WebView load error', e.nativeEvent);
            setLoading(false);
            setFailed(true);
          }}
          style={styles.webview}
          startInLoadingState
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}>
            Could not preview this PDF in-app. Use the share/open action to open it in another app.
          </Text>
        </View>
      )}
    </View>
  );
};

export default PDFViewer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
