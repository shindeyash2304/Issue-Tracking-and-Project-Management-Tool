import { Theme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';
import { NAV_THEME } from '@/lib/constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    bold: {
      fontFamily: 'SpaceMono',
      fontWeight: 'bold',
    },
    regular: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'SpaceMono',
      fontWeight: '500',
    },
    heavy: {
      fontFamily: 'SpaceMono',
      fontWeight: '800',
    }
  }
  };
  const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    bold: {
      fontFamily: 'SpaceMono',
      fontWeight: 'bold',
    },
    regular: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'SpaceMono',
      fontWeight: '500',
    },
    heavy: {
      fontFamily: 'SpaceMono',
      fontWeight: '800',
    }
  }
  };

  export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
    } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
  
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <SafeAreaView className='h-full bg-white dark:bg-neutral-900'>
    <ThemeProvider value={colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
    </SafeAreaView>
  );
}
