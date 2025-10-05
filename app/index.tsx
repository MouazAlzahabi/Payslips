import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PayslipProvider } from '../app/_context/PayslipsContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <PayslipProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
          <RootNavigator /> 
      </GestureHandlerRootView>
    </PayslipProvider>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
