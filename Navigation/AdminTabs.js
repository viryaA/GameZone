import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RentalHome from '../screens/Admin/Home/RentalHome';
import "../global.css"
import MasterlHeader from "../Header/MasterlHeader";
import React from "react";
import ScanQRHome from "../screens/Admin/ScanQR/ScanQRHome";
import ProfileScreenAdmin from "../screens/Admin/ProfileScreenAdmin"
import HistoryHome from "../screens/Admin/History/HistoryHome";
import DetailTransactionHistoryHome from "../screens/Admin/DetailTransactionHistoryHome";
import DetailRentalHome from "../screens/Transaction/DetailRentail/DetailRentalHome";
import RequestToPay from "../screens/Transaction/RequestToPay";
import FormBooking from "../screens/Transaction/FormBooking";
import DetailRuanganHome from "../screens/Transaction/DetailRuangan/DetailRuanganHome";
const Stack = createNativeStackNavigator()

export default function AdminTabs() {

    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'fade', // atau 'fade', 'simple_push', 'slide_from_bottom'
                headerShown: false,
            }}
        >
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
                name="History"
                component={HistoryHome}
                options={{
                    header: (props) => <MasterlHeader {...props}  />,
                    title: 'Rental',
                    headerShown: false,
                }}
            />


            <Stack.Screen
                name="HistoryDetail"
                component={DetailTransactionHistoryHome}
                options={{
                    header: (props) => <MasterlHeader {...props}  />,
                    title: 'Rental',
                    headerShown: false,
                }}
            />

            <Stack.Screen name="Scan" component={ScanQRHome} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreenAdmin} options={{ headerShown: false }} />


            <Stack.Screen
                name="DetailRental"
                component={DetailRentalHome}
                options={{
                    title: "Detail Rental Home",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="RequestToPay"
                component={RequestToPay}
                options={{
                    title: "Request To Pay",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="FormBooking"
                component={FormBooking}
                options={{
                    title: "Form Booking",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DetailRuangan"
                component={DetailRuanganHome}
                options={{
                    title: 'Detail Ruangan',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}
