import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WellcomeScreen from "../screens/WellcomeScreen";
import LoginHome from "../screens/Login/LoginHome";
import CreateAccount from "../screens/SignIn/CreateAccount";
import ForgotPasswordEmail from "../screens/Login/ForgotPasswordEmail";
import ForgotPasswordNewPass from "../screens/Login/ForgotPasswordNewPass";
import ForgotPasswordToken from "../screens/Login/ForgotPasswordToken";
import FillAccount from "../screens/SignIn/FillAccount";
import SettingsStack from './SettingsStack' 
import FormBooking from '../screens/Transaction/FormBooking';
import RequestToPay from '../screens/Transaction/RequestToPay';

import UserTabs from"./UserTabs"
import AdminTabs from"./AdminTabs"

import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasLaunched, setHasLaunched] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const initApp = async () => {
            try {
                const launchValue = await AsyncStorage.getItem('hasLaunched');
                if (launchValue === 'true') {
                    setHasLaunched(true);
                }

                const userDataRaw = await AsyncStorage.getItem('userData');
                if (userDataRaw) {
                    const userData = JSON.parse(userDataRaw);
                    if (userData && userData.usr_role) {
                        setUserRole(userData.usr_role.toLowerCase()); // e.g., "admin" or "pelanggan"
                    }
                }
            } catch (e) {
                console.error('Error initializing app:', e);
            } finally {
                setIsLoading(false);
            }
        };

        initApp();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#661BEA" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'fade',
                headerShown: false,
            }}
        >
            <Stack.Screen name="Welcome" component={WellcomeScreen} />
            <Stack.Screen name="Pelanggan" component={UserTabs} />
            <Stack.Screen name="Admin" component={AdminTabs} />
            <Stack.Screen name="LoginMain" component={LoginHome} />
            <Stack.Screen name="SettingsStack" component={SettingsStack} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail} />
            <Stack.Screen name="ForgotPasswordNewPass" component={ForgotPasswordNewPass} />
            <Stack.Screen name="ForgotPasswordToken" component={ForgotPasswordToken} />
            <Stack.Screen name="FillAccount" component={FillAccount} />
        </Stack.Navigator>
    );
}
