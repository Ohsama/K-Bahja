import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { StatusBadge, AppButton } from '../../components/common';
import { Star, MapPin, ChevronLeft, PhoneCall, Clock, CheckCircle, ShieldCheck } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';

type RootStackParamList = {
  BusinessProfile: { businessId: string };
};
type BusinessProfileRouteProp = RouteProp<RootStackParamList, 'BusinessProfile'>;
type BusinessProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BusinessProfile'>;

export default function BusinessProfile() {
  const route = useRoute<BusinessProfileRouteProp>();
  const navigation = useNavigation<BusinessProfileNavigationProp>();
  const { businessId } = route.params;
  
  const { addOrder, currentUser } = useAppContext();

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  // Booking State
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  const fetchBusinessData = async () => {
    setLoading(true);
    const { data, error } = await supabase
        .from('providers')
        .select(`
            *,
            locations(daira_name, wilaya_name),
            services(name)
        `)
        .eq('id', businessId)
        .single();
    
    if (data) {
        setBusiness({
            ...data,
            locationString: data.locations ? `${data.locations.daira_name}، ${data.locations.wilaya_name}` : 'غير محدد',
            categoryName: data.services ? data.services.name : 'خدمة'
        });
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!currentUser) {
        Alert.alert('تنبيه', 'يجب تسجيل الدخول أولاً لإتمام الحجز.');
        return;
    }
    
    setIsBooking(true);
    
    try {
        await addOrder({
            businessId,
            customerId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            time: "10:00", // Hardcoded mock time for prototype
            serviceId: business.service_id
        });
        
        Alert.alert(
            'تم تسجيل طلبك!',
            'تم إرسال طلب الحجز إلى مزود الخدمة بنجاح، سيقوم بالتأكيد قريباً.',
            [{ text: 'فهمت', onPress: () => navigation.goBack() }]
        );
    } catch(e) {
        Alert.alert('خطأ', 'فشل في إرسال الطلب!');
    } finally {
        setIsBooking(false);
    }
  };

  if (loading || !business) {
    return (
        <View className="flex-1 items-center justify-center bg-surface">
            <ActivityIndicator size="large" color="#7e22ce" />
        </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Advanced Image Header with Skeleton Buffer */}
        <View className="relative w-full h-72 bg-gray-200">
          {imageLoading && (
            <View className="absolute inset-0 items-center justify-center bg-gray-200 z-0">
               <ActivityIndicator size="small" color="#9ca3af" />
            </View>
          )}
          {business.image_url ? (
            <Image 
               source={{ uri: business.image_url }} 
               className="w-full h-full"
               resizeMode="cover"
               onLoad={() => setImageLoading(false)}
            />
          ) : (
            <View className="w-full h-full bg-primary/10 items-center justify-center">
                <Text className="text-primary opacity-30 text-8xl font-bold">{business.name[0]}</Text>
            </View>
          )}
          
          <View className="absolute top-12 left-4 z-10 w-full flex-row">
            <TouchableOpacity onPress={() => navigation.goBack()} className="bg-black/30 p-3 rounded-full ml-2">
                <ChevronLeft color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>
          
          <View className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />
        </View>

        <View className="px-6 -mt-8 relative z-20">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 items-end">
             <Text className="text-3xl font-bold text-gray-900 mb-1">{business.name}</Text>
             <Text className="text-primary font-bold mb-3">{business.categoryName}</Text>
             
             <View className="flex-row-reverse items-center justify-between w-full mb-4">
                <View className="flex-row-reverse items-center">
                    <Star color="#f59e0b" size={20} fill="#f59e0b" />
                    <Text className="text-gray-900 font-bold ml-1 text-lg">{business.rating || '5.0'}</Text>
                </View>
                <View className="flex-row-reverse items-center">
                    <MapPin color="#6b7280" size={18} />
                    <Text className="text-gray-500 font-medium ml-1">{business.locationString}</Text>
                </View>
             </View>
             
             <View className="w-full h-px bg-gray-100 my-4" />
             
             <Text className="text-right text-gray-700 font-bold mb-2">عن المزود</Text>
             <Text className="text-right text-gray-500 leading-6 mb-6">
                 {business.description || 'لا يوجد وصف متاح لهذا المزود حالياً.'}
             </Text>

             <View className="bg-purple-50 p-4 rounded-xl w-full flex-row-reverse items-center">
                 <ShieldCheck color="#7e22ce" size={24} />
                 <View className="items-end mr-3">
                    <Text className="font-bold text-gray-900">حجز آمن ومضمون</Text>
                    <Text className="text-xs text-gray-500 mt-1">اموالك محمية عبر منصة بهجة</Text>
                 </View>
             </View>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Floating Action Strip */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-6 flex-row-reverse justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <View className="items-end">
            <Text className="text-gray-500 text-sm font-medium mb-1">يبدأ من</Text>
            <Text className="text-2xl font-bold text-primary">{business.price_range || 'حسب الطلب'}</Text>
         </View>
         
         <AppButton 
            title={isBooking ? "جاري الإرسال..." : "طلب حجز الآن"}
            onPress={handleBooking}
            variant="primary"
            className="w-1/2"
            disabled={isBooking}
         />
      </View>
    </View>
  );
}
