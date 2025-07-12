import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RentalHome from "../screens/Pelanggan/Rental/RentalHome";
import "../global.css";
import MasterlHeader from "../Header/MasterlHeader";
import DetailRentalHome from "../screens/Transaction/DetailRentail/DetailRentalHome";
import ProfileScreen from "../screens/Pelanggan/ProfileScreenPelanggan";
import RequestToPay from "../screens/Transaction/RequestToPay";
import FormBooking from "../screens/Transaction/FormBooking";

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
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
