import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import PayslipListScreen from '../screens/paylipsList/PayslipListScreen';
import PayslipDetailsScreen from '../screens/payslipDetails/PayslipDetailsScreen';
import PDFViewer from '../screens/PDFViewer';

export type RootStackParamList = {
  List: undefined;
  Details: { payslipId: string };
    Preview: { uri: string; title: string };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="List">
    <Stack.Screen name="List" component={PayslipListScreen} />
    <Stack.Screen name="Details" component={PayslipDetailsScreen} />
    <Stack.Screen
  name="Preview"
  component={PDFViewer}
  options={{ title: 'PDF Preview', presentation: 'modal' }}
/>
  </Stack.Navigator>
);

export default RootNavigator;
