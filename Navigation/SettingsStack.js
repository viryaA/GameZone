import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SettingsScreen from '../screens/SettingsScreen'
import JenisPlaystationHome from "../screens/JenisPlayStation/JenisPlaystationHome";
import RentalHome from '../screens/Rental/RentalHome';
import "../global.css"
import SelectLocationScreen from '../screens/Rental/components/SelectLocationScreen';
import RentalModal from '../screens/Rental/components/RentalModal';
import MasterlHeader from "../Header/MasterlHeader";

const Stack = createNativeStackNavigator()

export default function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="JenisPlayMain" component={JenisPlaystationHome} options={{
                header: (props) => <MasterlHeader {...props}  />,
                title: 'Jenis Playstation' }} />
            <Stack.Screen
                name="RentalMain"
                component={RentalHome}
                options={{
                    header: (props) => <MasterlHeader {...props}  />,
                    title: 'Rental'
                }}
            />
            <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
            <Stack.Screen name="RentalModal" component={RentalModal} />
        </Stack.Navigator>
    )
}
