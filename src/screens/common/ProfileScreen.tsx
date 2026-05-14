import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useAppContext } from '../../context/AppContext';
import { Settings, User, CreditCard, LogOut, ShieldCheck, ChevronLeft, Globe } from 'lucide-react-native';
import { UpdateManager } from '../../components/common/UpdateManager';

export default function ProfileScreen() {
  const { currentUser, logout, t, toggleLanguage, language } = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Profile loads from context, just UX delay
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm(t('logoutConfirmBody'));
      if (confirmLogout) {
         executeLogout();
      }
    } else {
      Alert.alert(t('logoutConfirmTitle'), t('logoutConfirmBody'), [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('confirm'), 
          style: 'destructive',
          onPress: executeLogout
        }
      ]);
    }
  };

  const executeLogout = async () => {
      setLoggingOut(true);
      try {
        await logout();
      } catch(e) {
        console.error("Logout failed", e);
      } finally {
         setLoggingOut(false);
      }
  };

  const renderOption = (icon: React.ReactNode, title: string, subtitle?: string, showArrow: boolean = true, onPress?: () => void) => (
    <TouchableOpacity onPress={onPress} className="flex-row-reverse items-center p-5 bg-white border-b border-gray-50 active:bg-gray-50">
       <View className="bg-purple-50 p-2 rounded-full ml-4">
          {icon}
       </View>
       <View className="flex-1 items-end">
          <Text className="text-gray-900 font-bold text-lg">{title}</Text>
          {subtitle && <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>}
       </View>
       {showArrow && <ChevronLeft color="#cbdbdf" size={20} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
       className="flex-1 bg-surface" 
       contentContainerStyle={{ paddingBottom: 40 }}
       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
       <View className="bg-primary px-6 pt-16 pb-8 rounded-b-[40px] items-center shadow-lg">
           <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center border-4 border-white mb-4 shadow-sm">
              <User color="#ffffff" size={48} />
           </View>
           <Text className="text-2xl font-bold text-white mb-1">{currentUser?.name}</Text>
           <Text className="text-white/80 font-medium mb-4">{currentUser?.email}</Text>
           
           <View className="flex-row-reverse items-center bg-black/20 px-5 py-2 rounded-full">
              <ShieldCheck color="#ffffff" size={18} />
              <Text className="text-white font-bold ml-2 text-sm">
                {currentUser?.role === 'admin' ? t('adminRole') : t('customerRole')}
              </Text>
           </View>
       </View>

       <View className="p-6">
          <Text className="text-right text-gray-500 font-bold mb-4 text-sm mt-2">{t('profileSettingsLabel')}</Text>
          
          <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
             {renderOption(<User color="#7e22ce" size={24} />, t('personalInfoTitle'), t('personalInfoSubtitle'), true, () => navigation.navigate('PersonalInfo'))}
             {renderOption(<Settings color="#7e22ce" size={24} />, t('accountSettingsTitle'), t('accountSettingsSubtitle'), true, () => navigation.navigate('AccountSettings'))}
             {currentUser?.role === 'customer' && renderOption(<CreditCard color="#7e22ce" size={24} />, t('paymentMethodsTitle'), t('paymentMethodsSubtitle'), true, () => navigation.navigate('PaymentMethods'))}
             
             {/* Modern Language Toggle */}
             <View className="p-5 border-b border-gray-100 flex-row-reverse items-center justify-between">
                <View className="flex-row-reverse items-center">
                   <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center ml-3">
                      <Globe color="#7e22ce" size={24} />
                   </View>
                   <View className="items-end">
                      <Text className="text-gray-900 font-bold text-lg">{t('languageToggleTitle')}</Text>
                      <Text className="text-gray-400 text-xs mt-1">{t('languageToggleSubtitle')}</Text>
                   </View>
                </View>
                
                <TouchableOpacity 
                   onPress={toggleLanguage}
                   activeOpacity={0.8}
                   className={`w-16 h-8 rounded-full p-1 justify-center flex-row shadow-sm border border-gray-200 ${language === 'fr' ? 'bg-primary' : 'bg-gray-300'}`}
                >
                   <View className={`w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center ${language === 'fr' ? 'ml-auto' : 'mr-auto'}`}>
                       <Text className="text-[10px] font-bold text-gray-800">{language.toUpperCase()}</Text>
                   </View>
                </TouchableOpacity>
             </View>
          </View>

          <UpdateManager />

          <TouchableOpacity 
             onPress={handleLogout}
             disabled={loggingOut}
             className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-red-100 flex-row-reverse items-center justify-center p-5 ${loggingOut ? 'opacity-50' : ''}`}
          >
             {loggingOut ? (
                <ActivityIndicator color="#ef4444" size="small" />
             ) : (
                <>
                  <LogOut color="#ef4444" size={24} />
                  <Text className="text-red-500 font-bold text-lg mr-3">{t('logoutBtn')}</Text>
                </>
             )}
          </TouchableOpacity>
       </View>
    </ScrollView>
  );
}
