import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RentalHome from '../screens/Pelanggan/Rental/RentalHome';
import "../global.css"
// import SelectLocationScreen from '../screens/Rental/components/SelectLocationScreen';
// import RentalModal from '../screens/Rental/components/RentalModal';
import MasterlHeader from "../Header/MasterlHeader";
import LoginHome from "../screens/Login/LoginHome";
import CreateAccount from '../screens/SignIn/CreateAccount';
import FillAccount from '../screens/SignIn/FillAccount';
import ForgotPasswordToken from '../screens/Login/ForgotPasswordToken';
import ForgotPasswordEmail from '../screens/Login/ForgotPasswordEmail';
import ForgotPasswordNewPass from '../screens/Login/ForgotPasswordNewPass';
import DetailRentalHome from "../screens/Transaction/DetailRentail/DetailRentalHome";
import FormBooking from '../screens/Transaction/FormBooking';

const Stack = createNativeStackNavigator()

export default function SettingsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'fade', // atau 'fade', 'simple_push', 'slide_from_bottom'
                headerShown: false,
            }}
        >

            <Stack.Screen
                name="RentalMain"
                component={RentalHome}
                options={{
                    header: (props) => <MasterlHeader {...props}  />,
                    title: 'Rental',
                    headerShown: false,
                }}
            />
            <Stack.Screen name="LoginMain" component={LoginHome} options={{ title: 'Login', headerShown: false }} />
            <Stack.Screen name="FormBooking" component={FormBooking} options={{ title: 'FormBooking', headerShown: false }} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ title: 'Create Account', headerShown: false }} />
            <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail} options={{ title: 'Forgot Password', headerShown: false }}/>
            <Stack.Screen name="ForgotPasswordNewPass" component={ForgotPasswordNewPass} options={{ title: 'Forgot Password', headerShown: false }}/>
            <Stack.Screen name="ForgotPasswordToken" component={ForgotPasswordToken} options={{ title: 'Forgot Password', headerShown: false }}/>
            <Stack.Screen name="FillAccount" component={FillAccount} options={{ headerShown: false }} />

            <Stack.Screen
                name="DetailRental"
                component={DetailRentalHome}
                options={{
                    title: 'DetailRental Home',
                    headerShown: false,
                }}
            />
            {/* <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} /> */}
            {/* <Stack.Screen name="RentalModal" component={RentalModal} /> */}
        </Stack.Navigator>
    )
}
