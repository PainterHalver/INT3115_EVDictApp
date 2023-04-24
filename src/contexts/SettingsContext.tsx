import {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BooleanSettings = {
  shouldAutoPronounce: {
    value: boolean;
    label: string;
  };
};

type SettingsContextType = {
  booleanSettings: BooleanSettings;
  defaultPronunciation: 'UK' | 'US';
  finishedLoading: boolean;
  updateBooleanSettings: (newSettings: BooleanSettings) => Promise<void>;
  setDefaultPronunciation: (pronunciation: 'UK' | 'US') => void;
};

const DEFAULT_BOOLEAN_SETTINGS: BooleanSettings = {
  shouldAutoPronounce: {
    value: false,
    label: 'Tự động phát âm từ',
  },
};

const INITIAL_STATE: SettingsContextType = {
  booleanSettings: DEFAULT_BOOLEAN_SETTINGS,
  defaultPronunciation: 'UK',
  finishedLoading: false,
  updateBooleanSettings: () => Promise.resolve(),
  setDefaultPronunciation: () => Promise.resolve(),
};

const SettingsContext = createContext<SettingsContextType>(INITIAL_STATE);

export const SettingsProvider = ({children}: any) => {
  const [settings, setSettings] = useState<BooleanSettings>(DEFAULT_BOOLEAN_SETTINGS);
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  const [defaultPronunciation, setDefaultPronunciation] = useState<'UK' | 'US'>('UK');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setFinishedLoading(true);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: BooleanSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        booleanSettings: settings,
        defaultPronunciation,
        finishedLoading,
        updateBooleanSettings: updateSettings,
        setDefaultPronunciation,
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
