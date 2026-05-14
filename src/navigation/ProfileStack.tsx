import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/common/ProfileScreen';
import PersonalInfoScreen from '../screens/common/PersonalInfoScreen';
import AccountSettingsScreen from '../screens/common/AccountSettingsScreen';
import PaymentMethodsScreen from '../screens/common/PaymentMethodsScreen';

export type ProfileStackParamList = {
  ProfileOverview: undefined;
  PersonalInfo: undefined;
  AccountSettings: undefined;
  PaymentMethods: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileOverview">
      <Stack.Screen name="ProfileOverview" component={ProfileScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    </Stack.Navigator>
  );
}
