import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RentalHome from "../screens/Pelanggan/Rental/RentalHome";
import "../global.css";
import MasterlHeader from "../Header/MasterlHeader";
import DetailRentalHome from "../screens/Transaction/DetailRentail/DetailRentalHome";
import ProfileScreen from "../screens/Pelanggan/ProfileScreenPelanggan";
import RequestToPay from "../screens/Transaction/RequestToPay";
import FormBooking from "../screens/Transaction/FormBooking";
import DetailRuanganHome from '../screens/Transaction/DetailRuangan/DetailRuanganHome';
import MyListTransactionHome from '../screens/Transaction/MyListTransaction/MyListTransactionHome';
import BookingDetail from '../screens/Transaction/MyListTransaction/components/BookingDetail';
import ProfileScreenPelanggan from "../screens/Pelanggan/ProfileScreenPelanggan";

const Stack = createNativeStackNavigator();

export default function UserTabs() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "fade", // atau 'fade', 'simple_push', 'slide_from_bottom'
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={RentalHome}
        options={{
          header: (props) => <MasterlHeader {...props} />,
          title: "Rental",
          headerShown: false,
        }}
      />
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
        name="Profile"
        component={ProfileScreenPelanggan}
        options={{
          title: "Profile",
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
        <Stack.Screen
            name="Bag"
            component={MyListTransactionHome}
            options={{
                title: 'My Transaction',
                headerShown: false,
            }}
        />

        <Stack.Screen
            name="DetailBooking"
            component={BookingDetail}
            options={{
                title: 'Booking Detail Transaction',
                headerShown: false,
            }}
        />
    </Stack.Navigator>
  );
}
