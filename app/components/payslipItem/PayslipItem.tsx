// src/_components/PayslipItem.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Payslip } from '../../_context/PayslipsContext';
import { formatPeriod } from '../../_utils/date';
import { itemStyles } from './PayslipItemStyles';

type Props = {
  payslip: Payslip;
  onPress: () => void;
};

export default function PayslipItem({ payslip, onPress }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Open payslip ${payslip.id}`}
      onPress={onPress}
      style={itemStyles.container}
    >
      <Text style={itemStyles.period}>{formatPeriod(payslip.fromDate, payslip.toDate)}</Text>
      <Text style={itemStyles.id}>{payslip.id}</Text>
    </TouchableOpacity>
  );
}
