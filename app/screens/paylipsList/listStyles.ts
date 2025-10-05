import { StyleSheet } from 'react-native';

import { themeColors } from '../../_styles/themeColors';
import { themeSpacing } from '../../_styles/themeSpacing';
import { themeTypography } from '../../_styles/themeTypography';


export const listStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColors.background },
  item: { padding: themeSpacing.lg, backgroundColor: themeColors.background },
  period: { ...themeTypography.subtitle, color: themeColors.textPrimary },
  id: { marginTop: themeSpacing.sm, color: themeColors.textSecondary },
  sep: { height: 1, backgroundColor: themeColors.separator },
});

