import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import AuthScreen from '../screens/AuthScreen';
import ProviderRegistrationScreen from '../screens/ProviderRegistrationScreen';
import ProviderNavigator from './ProviderNavigator';
import CustomerNavigator from './CustomerNavigator';
import AdminNavigator from './AdminNavigator';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { currentUser, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <>
             <Stack.Screen name="Auth" component={AuthScreen} />
             <Stack.Screen name="ProviderRegistration" component={ProviderRegistrationScreen} />
          </>
        ) : currentUser.role === 'admin' ? (
          <Stack.Screen name="AdminRoot" component={AdminNavigator} />
        ) : currentUser.role === 'provider' ? (
          <Stack.Screen name="ProviderRoot" component={ProviderNavigator} />
        ) : (
          <Stack.Screen name="CustomerRoot" component={CustomerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
