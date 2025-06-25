import { View, Text, Button } from 'react-native'
import "../global.css"

export default function HomeScreen({ navigation }) {
    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-black">
            <Text className="text-xl font-bold text-black dark:text-white">🏠 Home Screen</Text>
            <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
            <Button title="Go to Settings" onPress={() => navigation.navigate('SettingsStack')} />
        </View>
    )
}
