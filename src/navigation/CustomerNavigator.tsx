import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Home, Calendar, User } from 'lucide-react-native';

import HomeScreen from '../screens/customer/HomeScreen';
import ServiceScreen from '../screens/customer/ServiceScreen';
import BusinessProfile from '../screens/customer/BusinessProfile';
import AppointmentsScreen from '../screens/customer/AppointmentsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Temporary Stubs
const ProfileScreen = () => <View className="flex-1 items-center justify-center bg-surface"><Text className="text-xl font-bold">Profile</Text></View>;

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Service" component={ServiceScreen} />
      <Stack.Screen name="BusinessProfile" component={BusinessProfile} />
    </Stack.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#7e22ce', // Purple theme
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontFamily: 'sans-serif', fontSize: 12, paddingBottom: 4, fontWeight: '600' },
        tabBarStyle: { height: 65, borderTopWidth: 1, borderColor: '#f3f4f6', backgroundColor: '#ffffff', elevation: 10 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HomeStack') return <Home color={color} size={24} />;
          if (route.name === 'Appointments') return <Calendar color={color} size={24} />;
          if (route.name === 'Profile') return <User color={color} size={24} />;
        },
      })}
    >
      {/* Notice the visual right-to-left layout: the tabs are arranged logically but React Navigation on LTR puts first tab on left. The mockup has Account on right, Home on left, which implies natural ordering. So Home is left. */}
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'الرئيسية' }} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'حجوزاتي' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'حسابي' }} />
    </Tab.Navigator>
  );
}
