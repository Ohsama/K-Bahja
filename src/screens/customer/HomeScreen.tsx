import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceCategory } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { Bell, Search, ShieldCheck, User } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { AppButton } from '../../components/common';
import { LocationPicker } from '../../components/common/LocationPicker';

type RootStackParamList = {
  Home: undefined;
  Service: { serviceId: string, title: string };
  BusinessProfile: { businessId: string };
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { locationLabel, setLocationFilter, currentUser, t } = useAppContext();

  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoadingServices(true);
    const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (servicesData) setServices(servicesData);
    
    // Fetch providers for dynamic search
    const { data: providersData } = await supabase.from('providers').select('*, services(name)').eq('is_approved', true);
    if (providersData) setProviders(providersData);

    setLoadingServices(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const handleProviderTap = (provider: any) => {
    navigation.navigate('BusinessProfile', { businessId: provider.id });
  };

  const handleServiceTap = (service: ServiceCategory) => {
    navigation.navigate('Service', { serviceId: service.id, title: service.name });
  };

  return (
    <View className="flex-1 bg-surface">
      <ScrollView 
         showsVerticalScrollIndicator={false} 
         contentContainerStyle={{ paddingBottom: 100 }}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* Soft Pink/White Header Layout */}
        <View className="bg-white pt-14 pb-16 px-6 rounded-b-[40px] shadow-sm relative overflow-hidden">
          {/* Subtle decoration elements for gradient feel */}
          <View className="absolute top-0 right-[-50px] w-48 h-48 bg-[#fdf2f8] rounded-full blur-3xl opacity-80" />
          <View className="absolute top-10 left-[-20px] w-32 h-32 bg-[#fce7f3] rounded-full blur-2xl opacity-70" />
          
          {/* Top Navbar */}
          <View className="flex-row justify-between items-center mb-6 z-10">
             {/* Left side (Bell) */}
             {/* Left side (Avatar) */}
             <TouchableOpacity onPress={() => navigation.navigate('Profile')} className="w-10 h-10 bg-white/20 rounded-full border border-white/40 items-center justify-center overflow-hidden">
               {currentUser?.avatar_url ? (
                   <Image source={{ uri: currentUser.avatar_url }} className="w-full h-full" resizeMode="cover" />
               ) : (
                   <User color="#ffffff" size={20} />
               )}
             </TouchableOpacity>

             {/* Center (Title/Logo) */}
             <Text className="text-4xl text-primary tracking-widest leading-relaxed pt-2" style={{ fontFamily: 'Cairo_800ExtraBold' }}>{t('appName')}</Text>

             {/* Right side (Location) */}
             <View className="flex-row items-center">
                 <LocationPicker 
                   currentLabel={locationLabel} 
                   onLocationSelected={setLocationFilter} 
                 />
             </View>
          </View>
          
          {/* Subtle decoration elements for gradient feel could be added here */}
          
        </View>

        {/* Floating Search Bar (overlaps header) */}
        <View className="-mt-8 px-6 z-20">
            <View className="bg-fuchsia-50/40 rounded-2xl flex-row-reverse items-center px-4 py-3 border border-fuchsia-100 shadow-sm">
                <Search color="#e879f9" size={20} className="ml-2" />
                <TextInput 
                  placeholder={t('searchHint')}
                  className="flex-1 text-right text-base text-gray-800"
                  placeholderTextColor="#e879f9"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
            </View>
        </View>

        {/* Main Content Body */}
        <View className="pt-8 px-5">
            {/* Section Title */}
            <Text className="text-2xl font-bold text-gray-900 text-right mb-4">{t('servicesSection')}</Text>
            
            {/* Services Grid */}
            <View className="flex-row flex-wrap justify-between">
                {loadingServices ? (
                   <View className="flex-1 items-center justify-center p-10">
                      <ActivityIndicator size="large" color="#7e22ce" />
                   </View>
                ) : services.length === 0 ? (
                   <Text className="text-center text-gray-500 font-bold w-full mt-4">{t('noServicesText')}</Text>
                ) : (
                  services
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map((item: any) => {
                      const IconComponent = (Icons as any)[item.icon_name] || Icons.CircleDashed;
                      return (
                          <TouchableOpacity 
                              key={item.id}
                              onPress={() => handleServiceTap(item)}
                              className="bg-pink-50/30 rounded-3xl p-4 mb-4 shadow-sm border border-pink-100 items-center justify-center w-[48%]"
                          >
                              <View className="bg-[#fce7f3] w-16 h-16 rounded-full items-center justify-center mb-3">
                                  <IconComponent color="#7e22ce" size={28} />
                              </View>
                              <Text className="text-gray-900 font-bold text-base text-center mb-1">{item.name}</Text>
                              <Text className="text-gray-500 text-xs text-center leading-tight h-8 numberOfLines={2} mb-3">
                                  {item.description}
                              </Text>
                              <View className="bg-[#fdf2f8] px-4 py-2 rounded-xl w-full">
                                  <Text className="text-primary text-xs font-bold text-center">{t('viewMore')}</Text>
                              </View>
                          </TouchableOpacity>
                      );
                  })
                )}
            </View>

            {/* Dynamic Provider Search Results */}
            {searchQuery.length > 0 && providers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
               <View className="mt-2 mb-4">
                  <Text className="text-xl font-bold text-gray-900 text-right mb-4">{t('matchingProviders')}</Text>
                  {providers
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item: any) => (
                           <TouchableOpacity 
                               key={item.id}
                               onPress={() => handleProviderTap(item)}
                               className="bg-pink-50/30 rounded-3xl p-4 mb-3 shadow-sm border border-pink-100 flex-row-reverse items-center justify-between"
                           >
                               <View className="flex-row-reverse items-center">
                                   <View className="bg-purple-50 w-12 h-12 rounded-full items-center justify-center ml-3">
                                       <User color="#a21caf" size={24} />
                                   </View>
                                   <View className="items-end">
                                      <Text className="text-gray-900 font-bold text-base">{item.name}</Text>
                                      <Text className="text-gray-500 text-xs">{item.services?.name || t('serviceLabel')} • {item.price_range || t('onDemand')}</Text>
                                   </View>
                               </View>
                               <View className="bg-[#fce7f3] px-3 py-1 rounded-lg">
                                   <Text className="text-primary text-xs font-bold">{t('profileLabel')}</Text>
                               </View>
                           </TouchableOpacity>
                      ))
                  }
               </View>
            )}

            {/* Payment Banner */}
            <View className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-4 flex-row-reverse items-center mt-4 mb-8">
               <View className="bg-white p-2 rounded-full shadow-sm ml-3 border border-indigo-100">
                  <ShieldCheck color="#4f46e5" size={24} />
               </View>
               <View className="flex-1 items-end">
                   <Text className="text-gray-900 font-bold text-base">{t('securePaymentTitle')}</Text>
                   <Text className="text-gray-500 text-xs">{t('securePaymentDesc')}</Text>
               </View>
            </View>

            {/* How to Book Section */}
            <Text className="text-xl font-bold text-gray-900 text-right mb-4">{t('howToBookTitle')}</Text>
            
            {/* 3 Steps */}
            <View className="flex-row justify-between flex-row-reverse mb-8">
                {/* Step 1 */}
                <View className="bg-white rounded-3xl p-4 shadow-sm w-[31%] items-center">
                    <View className="bg-[#fce7f3] w-8 h-8 rounded-full items-center justify-center mb-2">
                        <Text className="text-primary font-bold">1</Text>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm mb-1 text-center">{t('step1Title')}</Text>
                    <Text className="text-xs text-gray-500 text-center leading-tight">{t('step1Desc')}</Text>
                </View>
                {/* Step 2 */}
                <View className="bg-white rounded-3xl p-4 shadow-sm w-[31%] items-center">
                    <View className="bg-[#fce7f3] w-8 h-8 rounded-full items-center justify-center mb-2">
                        <Text className="text-primary font-bold">2</Text>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm mb-1 text-center">{t('step2Title')}</Text>
                    <Text className="text-xs text-gray-500 text-center leading-tight">{t('step2Desc')}</Text>
                </View>
                 {/* Step 3 */}
                 <View className="bg-white rounded-3xl p-4 shadow-sm w-[31%] items-center">
                    <View className="bg-[#fce7f3] w-8 h-8 rounded-full items-center justify-center mb-2">
                        <Text className="text-primary font-bold">3</Text>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm mb-1 text-center">{t('step3Title')}</Text>
                    <Text className="text-xs text-gray-500 text-center leading-tight">{t('step3Desc')}</Text>
                </View>
            </View>
        </View>

      </ScrollView>

      <View className="absolute bottom-6 w-full px-6">
          <AppButton 
            title={t('bookNowBtn')} 
            onPress={() => {
               if (Platform.OS === 'web') {
                  window.alert(t('bookFirstAlertContent'));
               } else {
                  Alert.alert(t('instructionsTitle'), t('bookFirstAlertContent'), [{ text: t('okGotItBtn') }]);
               }
            }} 
            className="shadow-md"
            variant="primary"
          />
      </View>

    </View>
  );
}
