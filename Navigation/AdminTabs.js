import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminBottomBar from '../components/AdminBottomBar';
import AdminHome from '../screens/Admin/Home';
import AdminScan from '../screens/Admin/Scan';
import AdminHistory from '../screens/Admin/History';
import AdminProfile from '../screens/Admin/Profile';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator tabBar={() => <AdminBottomBar />}>
      <Tab.Screen name="Home" component={AdminHome} />
      <Tab.Screen name="Scan" component={AdminScan} />
      <Tab.Screen name="History" component={AdminHistory} />
      <Tab.Screen name="Profile" component={AdminProfile} />
    </Tab.Navigator>
  );
}
