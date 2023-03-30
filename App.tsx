import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import Home from './src/screens/Home';
import {DatabaseProvider} from './src/contexts/DatabaseContext';
import WordDetail from './src/screens/WordDetail';
import {Word} from './src/types';
import TranslateText from './src/screens/TranslateText';
import {LoadingModalProvider} from './src/contexts/LoadingModalContext';

export type RootStackParamList = {
  Home: undefined;
  WordDetail: {word: Word};
  TranslateText: {text?: string};
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <LoadingModalProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen
                name="WordDetail"
                component={WordDetail}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
              <Stack.Screen
                name="TranslateText"
                component={TranslateText}
                options={{
                  ...TransitionPresets.SlideFromRightIOS,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LoadingModalProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

export default App;
