import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Home, Calendar, User } from 'lucide-react-native';
// Using Home instead of Settings because the mockups show Services as a Home icon 

import DashboardScreen from '../screens/admin/DashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminServicesScreen from '../screens/admin/AdminServicesScreen';
import AdminProvidersScreen from '../screens/admin/AdminProvidersScreen';
import AdminPostsScreen from '../screens/admin/AdminPostsScreen';
import ProfileStack from './ProfileStack';
import { Briefcase, Layers, Image as ImageIcon } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#a21caf',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontFamily: 'sans-serif', fontSize: 12, paddingBottom: 4, fontWeight: '600' },
        tabBarStyle: { height: 65, borderTopWidth: 1, borderColor: '#f3f4f6', backgroundColor: '#ffffff', elevation: 10 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') return <Home color={color} size={24} />;
          if (route.name === 'Services') return <Layers color={color} size={24} />;
          if (route.name === 'Providers') return <Briefcase color={color} size={24} />;
          if (route.name === 'Posts') return <ImageIcon color={color} size={24} />;
          if (route.name === 'Appointments') return <Calendar color={color} size={24} />;
          if (route.name === 'Account') return <User color={color} size={24} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'الرئيسية' }} />
      <Tab.Screen name="Services" component={AdminServicesScreen} options={{ title: 'الخدمات' }} />
      <Tab.Screen name="Providers" component={AdminProvidersScreen} options={{ title: 'المزودين' }} />
      <Tab.Screen name="Posts" component={AdminPostsScreen} options={{ title: 'المحتوى' }} />
      <Tab.Screen name="Appointments" component={AdminOrdersScreen} options={{ title: 'الحجوزات' }} />
      <Tab.Screen name="Account" component={ProfileStack} options={{ title: 'حسابي' }} />
    </Tab.Navigator>
  );
}
