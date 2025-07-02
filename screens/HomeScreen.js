import { View, Text, Button } from 'react-native'
import "../global.css"
import ScreenWithBottomBar from "../TemplateComponent/ScreenWithBottomBar";

export default function HomeScreen({ navigation }) {
    return (
        <ScreenWithBottomBar>
            <Text className="text-xl font-bold text-black dark:text-white">🏠 Home Screen</Text>
            <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
            <Button title="Go to Settings" onPress={() => navigation.navigate('SettingsStack')} />
        </ScreenWithBottomBar>
    )
}
