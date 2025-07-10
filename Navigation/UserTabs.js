import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RentalHome from '../screens/Pelanggan/Rental/RentalHome';
import "../global.css"
import MasterlHeader from "../Header/MasterlHeader";
import DetailRentalHome from "../screens/Transaction/DetailRentail/DetailRentalHome";
import ProfileScreen from "../screens/Admin/ProfileScreenAdmin";

const Stack = createNativeStackNavigator()

export default function UserTabs() {

    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'fade', // atau 'fade', 'simple_push', 'slide_from_bottom'
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="DetailRuangan"
                component={DetailRuanganHome}
                options={{
                    title: 'Detail Ruangan',
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Home"
                component={RentalHome}
                options={{
                    header: (props) => <MasterlHeader {...props}  />,
                    title: 'Rental',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DetailRental"
                component={DetailRentalHome}
                options={{
                    title: 'DetailRental Home',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerShown: false,
                }}
            />

        </Stack.Navigator>
    )
}
