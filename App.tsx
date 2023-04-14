import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {DatabaseProvider} from './src/contexts/DatabaseContext';
import {LoadingModalProvider} from './src/contexts/LoadingModalContext';
import History from './src/screens/History';
import Home from './src/screens/Home';
import TranslateText from './src/screens/TranslateText';
import WordDetail from './src/screens/WordDetail';
import Bookmark from './src/screens/Bookmark';
import {Category, Word} from './src/types';
import {MenuProvider} from 'react-native-popup-menu';
import CategoryScreen from './src/screens/Bookmark/CategoryScreen';
import Settings from './src/screens/Settings';

export type RootStackParamList = {
  SpashScreen: undefined;
  Home: undefined;
  WordDetail: {word: Word};
  TranslateText: {text?: string};
  History: undefined;
  YourWord: undefined;
  CategoryScreen: {category: Category};
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
// const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <MenuProvider backHandler={true}>
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
                <Stack.Screen
                  name="History"
                  component={History}
                  options={{
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
                <Stack.Screen
                  name="YourWord"
                  component={Bookmark}
                  options={{
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
                <Stack.Screen
                  name="CategoryScreen"
                  component={CategoryScreen}
                  options={{
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
                <Stack.Screen
                  name="Settings"
                  component={Settings}
                  options={{
                    ...TransitionPresets.SlideFromRightIOS,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </LoadingModalProvider>
        </DatabaseProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
}

export default App;
