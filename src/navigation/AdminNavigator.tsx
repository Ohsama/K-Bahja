import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Home, Calendar, User } from 'lucide-react-native';
// Using Home instead of Settings because the mockups show Services as a Home icon 

import DashboardScreen from '../screens/admin/DashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';

const Tab = createBottomTabNavigator();

// Temporary Stubs
const AccountScreen = () => <View className="flex-1 items-center justify-center bg-surface"><Text className="text-xl font-bold">الحساب</Text></View>;

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#7e22ce',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontFamily: 'sans-serif', fontSize: 12, paddingBottom: 4, fontWeight: '600' },
        tabBarStyle: { height: 65, borderTopWidth: 1, borderColor: '#f3f4f6', backgroundColor: '#ffffff', elevation: 10 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') return <Home color={color} size={24} />;
          if (route.name === 'Appointments') return <Calendar color={color} size={24} />;
          if (route.name === 'Account') return <User color={color} size={24} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'الخدمات' }} />
      <Tab.Screen name="Appointments" component={AdminOrdersScreen} options={{ title: 'الحجوزات' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'الحساب' }} />
    </Tab.Navigator>
  );
}
