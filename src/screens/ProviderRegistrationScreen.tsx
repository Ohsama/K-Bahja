import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Camera, MapPin } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { LocationPicker } from '../components/common/LocationPicker';

export default function ProviderRegistrationScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brandName, setBrandName] = useState('');
  const [ninRc, setNinRc] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  // Location Picker State
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [locationLabel, setLocationLabel] = useState<string>('اختر الولاية والدائرة');

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const handleRegistration = async () => {
    if (!firstName || !lastName || !email || !password || !brandName || !ninRc || !selectedServiceId || !selectedLocationId || !description) {
      return Alert.alert('خطأ', 'الرجاء ملء جميع الحقول الإلزامية بما في ذلك الوصف والموقع.');
    }

    setLoading(true);
    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: `${firstName} ${lastName}` } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('فشل في إنشاء الحساب');

      const userId = authData.user.id;

      // 2. The database trigger forces them to 'customer'. We MUST override it to 'provider'.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'provider', name: `${firstName} ${lastName}` })
        .eq('id', userId);
        
      if (profileError) throw profileError;

      // 3. Mount their official initial Business Profile in the providers table
      const { error: providerError } = await supabase
        .from('providers')
        .insert([{
           user_id: userId,
           name: brandName,
           service_id: selectedServiceId,
           location_id: selectedLocationId,
           description: description,
           nin_or_rc: ninRc,
           price_range: priceRange || 'حسب الطلب',
           is_approved: false
        }]);

      if (providerError) throw providerError;

      // Force sign-out so that AppContext doesn't trap them into Customer UI due to Trigger latency
      await supabase.auth.signOut();

      Alert.alert('تم التسجيل بنجاح', 'لقد تم إنشاء حسابك كمقدم خدمة. سيقوم الإدارة بمراجعته والموافقة عليه قريباً. الرجاء تسجيل الدخول مجدداً.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('فشل التسجيل', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2 flex-row-reverse justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">مقدم خدمة جديد</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">سجل أعمالك للبدء في استقبال الطلبات</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-gray-50 p-3 rounded-full mb-1">
           <ChevronLeft color="#1f2937" size={24} className="rotate-180" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
         enableOnAndroid={true}
         extraScrollHeight={20}
         showsVerticalScrollIndicator={false} 
         className="px-6 pt-4 pb-12 flex-1"
         keyboardShouldPersistTaps="handled"
      >
        
        <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
           <Text className="text-xl font-bold text-gray-800 text-right mb-2">معلومات الدخول</Text>
           
           <TextInput placeholder="البريد الإلكتروني" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black" />
           <TextInput placeholder="كلمة المرور" value={password} onChangeText={setPassword} secureTextEntry className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black" />
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
           <Text className="text-xl font-bold text-gray-800 text-right mb-2">معلومات الهوية</Text>
           
           <View className="flex-row justify-between space-x-2">
             <TextInput placeholder="اللقب" value={lastName} onChangeText={setLastName} className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black ml-2" />
             <TextInput placeholder="الاسم" value={firstName} onChangeText={setFirstName} className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black" />
           </View>

           <TextInput placeholder="رقم الهوية الوطنية (NIN) أو السجل التجاري" value={ninRc} onChangeText={setNinRc} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black" />
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
           <Text className="text-xl font-bold text-gray-800 text-right mb-2">معلومات النشاط</Text>
           
           <TextInput placeholder="الاسم التجاري (ما يراه الزبائن)" value={brandName} onChangeText={setBrandName} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black" />
           <TextInput placeholder="تسعيرة الخدمة (مثال: 6000 - 12000 دج)" value={priceRange} onChangeText={setPriceRange} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-right text-black" />
           <TextInput placeholder="وصف الخدمة ونبذة عن خبراتك..." value={description} onChangeText={setDescription} multiline className="bg-gray-50 border border-gray-200 px-4 py-4 rounded-xl text-right text-black h-24" />
           
           <View className="flex-row-reverse items-center justify-between border border-gray-200 p-4 rounded-xl bg-gray-50">
               <Text className="font-bold text-gray-700">مقر العمل:</Text>
               <LocationPicker 
                   currentLabel={locationLabel}
                   onLocationSelected={(id, label) => {
                       setSelectedLocationId(id);
                       setLocationLabel(label);
                   }}
               />
           </View>
           
           <View>
              <Text className="text-right text-gray-500 font-bold mb-2">صنف الخدمة التي تقدمها:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row-reverse -mr-1" contentContainerStyle={{ paddingRight: 4 }}>
                 {services.map(s => (
                   <TouchableOpacity 
                     key={s.id} 
                     onPress={() => setSelectedServiceId(s.id)}
                     className={`px-4 py-3 rounded-full ml-2 border ${selectedServiceId === s.id ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                   >
                     <Text className={`font-bold ${selectedServiceId === s.id ? 'text-white' : 'text-gray-600'}`}>{s.name}</Text>
                   </TouchableOpacity>
                 ))}
              </ScrollView>
           </View>
        </View>

        <TouchableOpacity 
          onPress={handleRegistration} 
          disabled={loading}
          className={`bg-primary p-4 rounded-xl items-center shadow-sm mb-10 ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text className="text-white font-bold text-lg">تقديم الطلب كـ مزود خدمة</Text>
          )}
        </TouchableOpacity>

      </KeyboardAwareScrollView>
    </View>
  );
}
