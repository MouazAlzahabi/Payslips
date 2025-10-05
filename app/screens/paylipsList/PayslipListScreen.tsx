// src/screens/PayslipListScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { usePayslips } from '../../_context/PayslipsContext';
import { formatPeriod } from '../../_utils/date';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const PayslipListScreen: React.FC<Props> = ({ navigation }) => {
  const { state } = usePayslips();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Open payslip ${item.id}`}
      onPress={() => navigation.navigate('Details', { payslipId: item.id })}
      style={styles.item}
    >
      <Text style={styles.period}>{formatPeriod(item.fromDate, item.toDate)}</Text>
      <Text style={styles.id}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state.payslips}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

export default PayslipListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: { padding: 16, backgroundColor: '#fff' },
  period: { fontSize: 16, fontWeight: '600' },
  id: { marginTop: 6, color: '#666' },
  sep: { height: 1, backgroundColor: '#eee' },
});
