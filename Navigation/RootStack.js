import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ProfileScreen from '../screens/ProfileScreen'
import SettingsStack from './SettingsStack'
// import SelectLocationScreen from '../screens/Rental/components/SelectLocationScreen'
import WellcomeScreen from "../screens/WellcomeScreen"

import { ActivityIndicator, View } from 'react-native'
import ScanQRHome from "../screens/ScanQR/ScanQRHome";
import RentalHome from '../screens/Rental/RentalHome'

const Stack = createNativeStackNavigator()

export default function RootStack() {
    const [isLoading, setIsLoading] = useState(true)
    const [hasLaunched, setHasLaunched] = useState(false)

    useEffect(() => {
        const checkLaunch = async () => {
            const value = await AsyncStorage.getItem('hasLaunched')
            if (value === 'true') {
                setHasLaunched(true)
            }
            setIsLoading(false)
        }
        checkLaunch()
    }, [])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#661BEA" />
            </View>
        )
    }

    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'fade', // atau 'fade', 'simple_push', 'slide_from_bottom'
                headerShown: false,
            }}
        >
            {!hasLaunched ? (
                <Stack.Screen name="Welcome" component={WellcomeScreen} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="SettingsStack" component={SettingsStack} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={RentalHome} options={{ headerShown: false }}/>
                    <Stack.Screen name="Scan" component={ScanQRHome} options={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
                    {/*<Stack.Screen name="SelectLocation" component={SelectLocationScreen} />*/}
                </>
            )}
        </Stack.Navigator>
    )
}
