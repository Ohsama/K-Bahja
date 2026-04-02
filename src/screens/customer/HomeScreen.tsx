import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_SERVICES, ServiceCategory } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import { Bell, Search, ShieldCheck } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { AppButton } from '../../components/common';
import { LocationPicker } from '../../components/common/LocationPicker';

type RootStackParamList = {
  Home: undefined;
  Service: { serviceId: string, title: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { locationLabel, setLocationFilter } = useAppContext();

  const handleServiceTap = (service: ServiceCategory) => {
    navigation.navigate('Service', { serviceId: service.id, title: service.name });
  };

  return (
    <View className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Purple Gradient Header Background */}
        <View className="bg-primary pt-14 pb-16 px-6 rounded-b-[40px] shadow-sm relative">
          
          {/* Top Navbar */}
          <View className="flex-row justify-between items-center mb-6 z-10">
             {/* Left side (Bell) */}
             <TouchableOpacity>
               <Bell color="#ffffff" size={24} />
             </TouchableOpacity>

             {/* Center (Title/Logo) */}
             <Text className="text-3xl font-bold text-white tracking-widest" style={{ fontFamily: 'serif' }}>بهجة</Text>

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
            <View className="bg-white rounded-2xl flex-row-reverse items-center px-4 py-3 border border-gray-100 shadow-sm">
                <Search color="#9ca3af" size={20} className="ml-2" />
                <TextInput 
                  placeholder="ما الخدمة التي تبحث عنها؟"
                  className="flex-1 text-right text-base text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
            </View>
        </View>

        {/* Main Content Body */}
        <View className="pt-8 px-5">
            {/* Section Title */}
            <Text className="text-2xl font-bold text-gray-900 text-right mb-4">الخدمات</Text>
            
            {/* Services Grid (Mapped functionally without FlatList to allow seamless scroll flow) */}
            <View className="flex-row flex-wrap justify-between">
                {MOCK_SERVICES.map((item) => {
                    const IconComponent = (Icons as any)[item.iconName] || Icons.CircleDashed;
                    return (
                        <TouchableOpacity 
                            key={item.id}
                            onPress={() => handleServiceTap(item)}
                            className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-50 items-center justify-center w-[48%]"
                        >
                            <View className="bg-purple-100 w-16 h-16 rounded-full items-center justify-center mb-3">
                                <IconComponent color="#7e22ce" size={28} />
                            </View>
                            <Text className="text-gray-900 font-bold text-base text-center mb-1">{item.name}</Text>
                            <Text className="text-gray-500 text-xs text-center leading-tight h-8 numberOfLines={2} mb-3">
                                {item.description}
                            </Text>
                            <View className="bg-purple-50 px-4 py-2 rounded-xl w-full">
                                <Text className="text-primary text-xs font-bold text-center">عرض المزيد</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Payment Banner */}
            <View className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex-row-reverse items-center mt-4 mb-8">
               <View className="bg-white p-2 rounded-full shadow-sm ml-3 border border-gray-100">
                  <ShieldCheck color="#4f46e5" size={24} />
               </View>
               <View className="flex-1 items-end">
                   <Text className="text-gray-900 font-bold text-base">دفع آمن عبر بريدي موب</Text>
                   <Text className="text-gray-500 text-xs">احجز خدماتك بسهولة وادفع بأمان عبر تطبيق Baridimob</Text>
               </View>
            </View>

            {/* How to Book Section */}
            <Text className="text-xl font-bold text-gray-900 text-right mb-4">كيف تحجز؟</Text>
            
            {/* 3 Steps */}
            <View className="flex-row justify-between flex-row-reverse mb-8">
                {/* Step 1 */}
                <View className="bg-white rounded-3xl p-4 shadow-sm w-[31%] items-center">
                    <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mb-2">
                        <Text className="text-primary font-bold">1</Text>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm mb-1 text-center">اختر خدمة</Text>
                    <Text className="text-xs text-gray-500 text-center leading-tight">تصفح الخدمات المتاحة وحدد المناسبة</Text>
                </View>
                {/* Step 2 */}
                <View className="bg-white rounded-3xl p-4 shadow-sm w-[31%] items-center">
                    <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mb-2">
                        <Text className="text-primary font-bold">2</Text>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm mb-1 text-center">تواصل / احجز</Text>
                    <Text className="text-xs text-gray-500 text-center leading-tight">تواصل مع صاحب الخدمة وحدد التفاصيل</Text>
                </View>
                 {/* Step 3 */}
                 <View className="bg-white rounded-3xl p-4 shadow-sm w-[31%] items-center">
                    <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mb-2">
                        <Text className="text-primary font-bold">3</Text>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm mb-1 text-center">ادفع بأمان</Text>
                    <Text className="text-xs text-gray-500 text-center leading-tight">ادفع عبر Baridimob وتأكد من الحجز</Text>
                </View>
            </View>
        </View>

      </ScrollView>

      {/* Floating Action Bar */}
      <View className="absolute bottom-6 w-full px-6">
          <AppButton 
            title="احجز خدمتك الان" 
            onPress={() => {}} 
            className="shadow-md"
            variant="primary"
          />
      </View>

    </View>
  );
}
