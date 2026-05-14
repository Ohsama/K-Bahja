import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Card } from '../../components/common';
import { Star, MapPin, ChevronLeft } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';

// We map the Supabase table output back to our internal expectations
interface Provider {
  id: string;
  name: string;
  rating: string;
  location: string;
  priceRange: string;
  imageUrl?: string;
}

type RootStackParamList = {
  Home: undefined;
  Service: { serviceId: string; title: string };
  BusinessProfile: { businessId: string };
};

type ServiceScreenRouteProp = RouteProp<RootStackParamList, 'Service'>;
type ServiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Service'>;

export default function ServiceScreen() {
  const route = useRoute<ServiceScreenRouteProp>();
  const navigation = useNavigation<ServiceScreenNavigationProp>();
  const { serviceId, title } = route.params;
  const { selectedDairaId, locationLabel, currentUser } = useAppContext();

  const [businesses, setBusinesses] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleProviderTap = (providerId: string) => {
      if (!currentUser?.phone) {
          if (Platform.OS === 'web') {
             window.alert('مطلوب رقم هاتف: يجب إدخال رقم هاتفك في صفحة (حسابي) لتمكين الإدارة من الاتصال بك وتأكيد مواعيدك.');
          } else {
             Alert.alert('مطلوب رقم هاتف', 'يجب إدخال رقم هاتفك في صفحة (حسابي) للتمكن الإدارة من الاتصال بك وتأكيد مواعيدك.', [
                { text: 'حسناً', style: 'cancel' }
             ]);
          }
          return;
      }
      navigation.navigate('BusinessProfile', { businessId: providerId });
  };

  useEffect(() => {
    fetchProviders();
  }, [selectedDairaId, serviceId]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('providers')
        .select(`
           id,
           name,
           rating,
           image_url,
           priceRange:price_range,
           location:locations ( daira_name )
        `)
        .eq('service_id', serviceId);

      if (selectedDairaId) {
        query = query.eq('daira_id', selectedDairaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (data) {
        // Map the payload to strictly matched format
        const mapped = data.map((item: any) => ({
             id: item.id,
             name: item.name,
             rating: item.rating?.toString() || '0.0',
             priceRange: item.priceRange || 'N/A',
             location: item.location?.daira_name || 'N/A',
             imageUrl: item.image_url
        }));
        setBusinesses(mapped);
      }
    } catch (e) {
      console.error(e);
      // For dev prototype visual testing, if table fails or missing, silently render empty
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviders();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Provider }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      className="bg-white rounded-2xl mb-4 flex-row-reverse border border-gray-100 shadow-sm h-32" 
      style={{ overflow: 'hidden' }}
      onPress={() => handleProviderTap(item.id)}
    >
        {item.imageUrl ? (
           <Image source={{ uri: item.imageUrl }} className="w-24 h-full rounded-r-2xl ml-4" resizeMode="cover" />
        ) : (
           <View className="w-24 h-full bg-gray-100 rounded-r-2xl items-center justify-center ml-4 relative">
               <Text className="text-gray-400 font-bold text-3xl opacity-30">{item.name[0]}</Text>
           </View>
        )}
        <View className="flex-1 py-3 pr-4 items-end justify-center">
          <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
          <View className="flex-row items-center mb-2 flex-row-reverse">
            <Star color="#f59e0b" size={16} fill="#f59e0b" />
            <Text className="text-gray-600 font-medium mr-1 text-sm">{item.rating}</Text>
          </View>
          <View className="flex-row flex-1 items-end justify-between w-full">
            <Text className="font-bold text-primary text-sm">{item.priceRange}</Text>
            <View className="flex-row-reverse items-center bg-gray-50 px-2 py-1 rounded-md">
                <MapPin color="#9ca3af" size={12} />
                <Text className="text-gray-500 text-xs mr-1">{item.location}</Text>
            </View>
          </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row-reverse items-center justify-between px-6 pt-16 pb-6 bg-white border-b border-gray-100 shadow-sm relative z-10">
        <View className="flex-row-reverse items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="ml-4 bg-gray-50 p-2 rounded-full">
               <ChevronLeft color="#1f2937" size={24} className="rotate-180" />
            </TouchableOpacity>
            <View>
               <Text className="text-2xl font-bold text-gray-900 text-right">خدمات {title}</Text>
               <Text className="text-xs text-gray-500 font-medium text-right mt-1">{locationLabel}</Text>
            </View>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#7e22ce" />
        </View>
      ) : (
        <FlatList
            data={businesses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-center text-gray-500 font-bold text-lg">لم يتم العثور على مزودين.</Text>
                <Text className="text-center text-gray-400 text-sm mt-2 px-10">
                  حاول تغيير الدائرة الجغرافية أو ابحث عن خدمة أخرى.
                </Text>
              </View>
            }
        />
      )}
    </View>
  );
}
