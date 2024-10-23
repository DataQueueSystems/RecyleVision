import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
} from 'react-native-paper';

// Define custom themes
const lightTheme = {
  ...DefaultTheme,
  custom: 'lightTheme',
  colors: {
    ...DefaultTheme.colors,
    // background: 'white',
    background: '#f2f2f2', // You can customize dark mode background color here
    // card:"rgba(117, 114, 114, 0.08)"
    card: 'rgba(244, 242, 242, 0.936)',
    card2: 'rgb(247, 245, 245)',
    grey: 'rgba(141, 140, 140, 0.071)', // Light transparent grey
    // appcolor: '#F4D39A',  //first 
    appcolor: '#373A40',
    blackGrey: '#2F2F2F',
    lightransparent: 'rgba(231, 227, 227, 0.237)',
    // error: '#e5383b',
    error: '#d9534f',
    warningcolor: '#FCCD2A',
    surfaceDisabled: 'grey',
    lightGrey: 'rgba(246, 246, 245, 0.835)',
    onlightGrey: 'rgba(57, 57, 57, 0.752)',
    transpgrey: 'rgba(228, 228, 227, 0.835)',
    success: 'green',
    blue: '#007aff',
    skeletonBg: '#F5F5F5',
    skeletonForg: '#D0D0D0',
    gradientcontent:"#2F2F2F"
  },
  roundness: 10, // Set global roundness
};

const darkTheme = {
  ...DarkTheme,
  custom: 'darkTheme',
  colors: {
    ...DarkTheme.colors,
    // background: 'rgb(5, 5, 5)', // You can customize dark mode background color here
    background: '#1a1c1e', // You can customize dark mode background color here

    card: 'rgba(16, 16, 16, 0.812)',
    card2: 'rgb(19, 19, 19)',
    grey: 'rgba(141, 140, 140, 0.071)', // Darker transparent grey
    blackGrey: '#2F2F2F',
     // appcolor: '#F4D39A',  //first 
     appcolor: '#373A40',
     appcolor: '#4A4E57',
     appcolor: '#5A5E67',
    lightransparent: 'rgba(231, 227, 227, 0.237)',
    // error: '#e5383b',
    error: '#d9534f',
    lightGrey: 'rgba(57, 57, 57, 0.752)',
    transpgrey: 'rgba(57, 57, 57, 0.752)',
    onlightGrey: 'rgba(246, 246, 245, 0.835)',
    success: 'green',
    blue: '#007aff',
    warningcolor: '#FCCD2A',
    skeletonBg: '#121212',
    skeletonForg: '#2B2B2B',
    gradientcontent:"#fff"

  },
  roundness: 10, // Set global roundness
};

const ThemeContext = createContext();
const THEME_KEY = '@app_theme';

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(null);

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          const systemTheme = Appearance.getColorScheme();
          setTheme(systemTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme to AsyncStorage when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        if (theme !== null) {
          await AsyncStorage.setItem(THEME_KEY, theme);
        }
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };
    saveTheme();
  }, [theme]);

  const currentTheme = useMemo(() => {
    if (theme === 'dark') return darkTheme;
    if (theme === 'light') return lightTheme;
    return Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;
  }, [theme]);

  const setThemeMode = useCallback(mode => {
    setTheme(mode);
  }, []);

  return (
    <ThemeContext.Provider value={{theme: currentTheme, setThemeMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export {ThemeContext, ThemeProvider};
