import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsStack from './SettingsStack'
import SelectLocationScreen from '../screens/Rental/components/SelectLocationScreen'
import WellcomeScreen from "../screens/WellcomeScreen"

import { ActivityIndicator, View } from 'react-native'
import ScanQRHome from "../screens/ScanQR/ScanQRHome";

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
        <Stack.Navigator>
            {!hasLaunched ? (
                // Show welcome screen only once
                <Stack.Screen name="Welcome" component={WellcomeScreen} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen name="SettingsStack" component={SettingsStack} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Scan" component={ScanQRHome} options={{ title: 'Scan QR' }} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
                </>
            )}
        </Stack.Navigator>
    )
}
