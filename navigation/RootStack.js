import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsStack from './SettingsStack'
import "../global.css"
import CustomHeader from "../Header/CustomHeader";

const Stack = createNativeStackNavigator()

export default function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}
                options={{
                header: (props) => <CustomHeader {...props} />
            }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SettingsStack" component={SettingsStack} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
