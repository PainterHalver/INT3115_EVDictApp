import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import Home from './src/screens/Home';
import {DatabaseProvider} from './src/contexts/DatabaseContext';
import WordDetail from './src/screens/WordDetail';

export type RootStackParamList = {
  Home: undefined;
  WordDetail: {word: string};
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="WordDetail"
              component={WordDetail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

export default App;
