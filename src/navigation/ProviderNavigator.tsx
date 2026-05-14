import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, Image as ImageIcon, User } from 'lucide-react-native';

import ProviderOrdersScreen from '../screens/provider/ProviderOrdersScreen';
import ProviderPortfolioScreen from '../screens/provider/ProviderPortfolioScreen';
import ProfileStack from './ProfileStack';
import PendingApprovalScreen from '../screens/provider/PendingApprovalScreen';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function ProviderNavigator() {
  const { currentUser, t } = useAppContext();
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    if (!currentUser) return;
    const { data } = await supabase.from('providers').select('status, is_approved').eq('user_id', currentUser.id).single();
    if (data) {
        // Fallback boolean parsing in case SQL Migration column hasn't updated immediately
        if (data.status) {
            setStatus(data.status);
        } else {
            setStatus(data.is_approved ? 'APPROVED' : 'PENDING');
        }
    }
    setLoading(false);
  };

  React.useEffect(() => {
     fetchStatus();
  }, [currentUser]);

  if (loading) {
     return <View className="flex-1 items-center justify-center bg-surface"><ActivityIndicator size="large" color="#7e22ce" /></View>;
  }

  if (status === 'PENDING' || status === 'REJECTED') {
      return <PendingApprovalScreen status={status} onRefresh={fetchStatus} />;
  }

  return (
    <Tab.Navigator
      initialRouteName="Orders"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#a21caf',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontFamily: 'sans-serif', fontSize: 12, paddingBottom: 4, fontWeight: '600' },
        tabBarStyle: { height: 65, borderTopWidth: 1, borderColor: '#f3f4f6', backgroundColor: '#ffffff', elevation: 10 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Orders') return <Calendar color={color} size={24} />;
          if (route.name === 'Portfolio') return <ImageIcon color={color} size={24} />;
          if (route.name === 'Account') return <User color={color} size={24} />;
        },
      })}
    >
      <Tab.Screen name="Orders" component={ProviderOrdersScreen} options={{ title: t('tabProviderOrders') }} />
      <Tab.Screen name="Portfolio" component={ProviderPortfolioScreen} options={{ title: t('tabProviderPortfolio') }} />
      <Tab.Screen name="Account" component={ProfileStack} options={{ title: t('tabProfile') }} />
    </Tab.Navigator>
  );
}
