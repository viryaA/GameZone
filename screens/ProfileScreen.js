import { View, Text, Button } from 'react-native'
import "../global.css"

export default function ProfileScreen({ navigation }) {
    return (
        <View className="flex-1 items-center justify-center bg-blue-100">
            <Text className="text-xl font-bold text-blue-900">👤 Profile Screen</Text>
            <Button title="Go Back Home" onPress={() => navigation.navigate('Home')} />
        </View>
    )
}
