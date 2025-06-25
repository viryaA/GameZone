import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsStack from './SettingsStack'
import "../global.css"

const Stack = createNativeStackNavigator()

export default function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SettingsStack" component={SettingsStack} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
