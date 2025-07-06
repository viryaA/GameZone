import { NavigationContainer } from '@react-navigation/native';
import RootStack from './Navigation/RootStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import './global.css';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import CustomToast from './CustomToast';

// Optional: prevent splash screen from hiding before font is loaded
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'), // 👈 required!
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <StatusBar style="light" />
            <NavigationContainer>
                <RootStack />
            </NavigationContainer>
            <Toast
              config={{
                success: (props) => <CustomToast {...props} type="success" />,
                error: (props) => <CustomToast {...props} type="error" />,
              }}
            />

        </SafeAreaProvider>
    );
}
