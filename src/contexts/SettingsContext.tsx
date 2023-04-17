import {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Settings = {
  shouldAutoPronounce: {
    value: boolean;
    label: string;
  };
};

type SettingsContextType = {
  settings: Settings;
  finishedLoading: boolean;
  updateSettings: (newSettings: Settings) => Promise<void>;
};

const DEFAULT_SETTINGS: Settings = {
  shouldAutoPronounce: {
    value: false,
    label: 'Tự động phát âm từ',
  },
};

const INITIAL_STATE: SettingsContextType = {
  settings: DEFAULT_SETTINGS,
  finishedLoading: false,
  updateSettings: () => Promise.resolve(),
};

const SettingsContext = createContext<SettingsContextType>(INITIAL_STATE);

export const SettingsProvider = ({children}: any) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);

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

  const updateSettings = async (newSettings: Settings) => {
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
        settings,
        finishedLoading,
        updateSettings,
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
