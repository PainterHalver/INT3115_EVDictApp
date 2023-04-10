import {validatePathConfig} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
  Keyboard,
  ScrollView,
  BackHandler,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IoIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {Word} from '../../types';
import SearchSuggestion from './SearchSuggestion';
import Card from '../../component/Card';
import {HistoryIcon} from '../../icons/HistoryIcon';
import {TranslateTextIcon} from '../../icons/TranslateTextIcon';
import {SettingsIcon} from '../../icons/SettingsIcon';
import {HeartIcon} from '../../icons/HeartIcon';
import {BookIcon} from '../../icons/BookIcon';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({navigation}: Props) => {
  const {db, initFinished, getWord, getWordsStartsWith, getTodaysWord} = useDatabase();
  const [query, setQuery] = React.useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = React.useState<Word[]>([]);
  const [randomWord, setRandomWord] = React.useState<Word | null>(null);

  useEffect(() => {
    if (initFinished) {
      SplashScreen.hide();
    }
  }, [initFinished]);

  const querySubmitHandler = async (query: string) => {
    try {
      const result = await getWord(query);
      if (result) {
        navigation.navigate('WordDetail', {word: result});
      } else {
        // TODO: Redirect to translate screen
      }
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  useEffect(() => {
    if (query.length === 0) {
      return setSearchSuggestions([]);
    }

    const timeout = setTimeout(async () => {
      const result = await getWordsStartsWith(query, 20);

      if (result) {
        setSearchSuggestions(result);
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    if (!db) return;

    (async () => {
      const result = await getTodaysWord();
      if (result) {
        setRandomWord(result);
      }
    })();
  }, [db]);

  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        animated={true}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <FontawesomeIcon name="book" size={30} color={COLORS.TEXT_WHITE} />
            <Text
              style={{
                alignSelf: 'center',
                color: '#fff',
                fontSize: 25,
                fontWeight: '500',
              }}>
              EV - Dictionary
            </Text>
          </View>
          <View>
            <View
              style={{
                marginHorizontal: 15,
                paddingHorizontal: 15,
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderRadius: 100,
                alignItems: 'center',
                gap: 5,
                position: 'relative',
              }}>
              <IoIcon name="md-search-sharp" size={25} color={COLORS.TEXT_GRAY} />
              <TextInput
                style={{fontSize: 17, flex: 1}}
                placeholder="Nhập từ khóa tìm kiếm"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={event => {
                  querySubmitHandler(event.nativeEvent.text);
                }}
                autoCapitalize="none"
                cursorColor={COLORS.BACKGROUND_PRIMARY}
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('');
                  }}>
                  <IoIcon name="close" size={30} color={COLORS.TEXT_GRAY} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.function}>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate('History');
              }}>
              <View style={styles.functionButton}>
                <HistoryIcon size={25} color={COLORS.TEXT_BLACK} />
                <Text style={styles.functionName}>Từ đã tra</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.function}>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate('TranslateText', {});
              }}>
              <View style={styles.functionButton}>
                <TranslateTextIcon size={25} color={COLORS.TEXT_BLACK} />
                <Text style={styles.functionName}>Dịch văn bản</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.function}>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate('YourWord');
              }}>
              <View style={styles.functionButton}>
                <BookIcon size={25} color={COLORS.TEXT_BLACK} />
                <Text style={styles.functionName}>Sổ tay</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.function}>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <View style={styles.functionButton}>
                <SettingsIcon size={25} color={COLORS.TEXT_BLACK} />
                <Text style={styles.functionName}>Cài đặt</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.dailyWordContainer}>
            <TouchableNativeFeedback
              onPress={() => {
                if (randomWord) {
                  navigation.navigate('WordDetail', {word: randomWord});
                }
              }}>
              <View
                style={{
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: COLORS.BACKGROUND_WHITE,
                  elevation: 1,
                }}>
                <Text style={{fontSize: 20, fontWeight: '500', color: COLORS.TEXT_BLACK}}>
                  Từ của ngày hôm nay
                </Text>
                <Text
                  style={{
                    marginVertical: 20,
                    fontSize: 18,
                    fontWeight: '400',
                    color: COLORS.TEXT_BLACK,
                  }}>
                  {randomWord?.word}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={{marginTop: 'auto', alignItems: 'center', marginBottom: 15}}>
            <Text style={{fontSize: 15}}>v0.0.8</Text>
          </View>

          <SearchSuggestion searchSuggestions={searchSuggestions} />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_WHITE_DARK,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 180,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  bodyContainer: {
    flex: 1,
    // backgroundColor: '#123654',
    paddingVertical: 10,
  },
  function: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 7,
    overflow: 'hidden',
    elevation: 1,
  },
  functionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_WHITE,
    padding: 15,
    gap: 10,
    alignItems: 'center',
  },
  functionName: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.TEXT_BLACK,
  },
  dailyWordContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
