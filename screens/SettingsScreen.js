import { View, Text, Button } from 'react-native'
import "../global.css"

export default function SettingsScreen({ navigation }) {
    return (
        <View className="flex-1 items-center justify-center bg-green-100">
            <Text className="text-xl font-bold text-green-900">⚙️ Settings Screen</Text>
            <Button title="Go Back Home" onPress={() => navigation.navigate('Home')} />
            <Button title="Master Jenis Play Station" onPress={() => navigation.navigate('JenisPlayMain')} />
            <Button title="Master Playstation" onPress={() => navigation.navigate('PlaystationMain')} />
            <Button title="Detail Rental" onPress={() => navigation.navigate('DetailRental')} />
            <Button title="Master Rental" onPress={() => navigation.navigate('RentalMain')} />
            <Button title="Master User" onPress={() => navigation.navigate('UserMain')} />
        </View>
    )
}
