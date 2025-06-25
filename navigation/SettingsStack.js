import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SettingsScreen from '../screens/SettingsScreen'
import "../global.css"

const Stack = createNativeStackNavigator()

export default function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
    )
}
