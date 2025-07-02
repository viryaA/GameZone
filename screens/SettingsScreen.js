import { View, Text, Button } from 'react-native';
import "../global.css";
import ScreenWithBottomBar from '../TemplateComponent/ScreenWithBottomBar';

export default function SettingsScreen({ navigation }) {
    return (
        <ScreenWithBottomBar>
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-xl font-bold text-green-900">⚙️ Settings Screen</Text>
                <Button title="Go Back Home" onPress={() => navigation.navigate('Home')} />
                <Button title="Master Jenis Play Station" onPress={() => navigation.navigate('JenisPlayMain')} />
                <Button title="Master Rental" onPress={() => navigation.navigate('RentalMain')} />
                <Button title="Master User" onPress={() => navigation.navigate('UserMain')} />
                <Button title="Ruangan" onPress={() => navigation.navigate('RuanganMain')} />
            </View>
        </ScreenWithBottomBar>
    );
}
