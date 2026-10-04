import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {AppConfigProvider} from './src/context/AppConfigContext';
import {colors} from './src/theme/colors';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AppConfigProvider>
          <AuthProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.primary}
            />
            <AppNavigator />
          </AuthProvider>
        </AppConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
