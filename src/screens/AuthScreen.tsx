import React, { useState } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppContext } from '../context/AppContext';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ChevronRight, Globe } from 'lucide-react-native';

export default function AuthScreen({ navigation }: any) {
  const { login, t, toggleLanguage, language } = useAppContext();
  
  // Clean state management without aggressive touch handlers
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
    setLoading(true);
    try {
       await login(email, password);
    } catch (error: any) {
       Alert.alert('فشل الدخول', error.message || 'بيانات خاطئة');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password || !name) return Alert.alert('خطأ', 'الرجاء ملء جميع الحقول');
    setLoading(true);
    try {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });
        if (error) throw error;
        Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح! الرجاء التحقق من بريدك الإلكتروني والضغط على رابط التفعيل لتتمكن من تسجيل الدخول.');
        setActiveTab('login');
    } catch (error: any) {
        Alert.alert('فشل التسجيل', error.message);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-[#fdf2f8] relative">
      <View className="absolute top-0 left-0 w-full h-full overflow-hidden">
         <View className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#fce7f3] rounded-full blur-3xl opacity-80" />
         <View className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#ede9fe] rounded-full blur-3xl opacity-70" />
      </View>

      <KeyboardAwareScrollView
         enableOnAndroid={true}
         extraScrollHeight={20}
         contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
         showsVerticalScrollIndicator={false}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
         keyboardShouldPersistTaps="handled"
         className="flex-1 px-6"
      >
            {/* Language Toggle */}
            <TouchableOpacity 
               onPress={toggleLanguage}
               className="absolute top-12 left-0 z-50 bg-white/50 p-2 rounded-full border border-white/60 shadow-sm flex-row items-center"
            >
               <Globe color="#9333ea" size={20} />
               <Text className="text-[#9333ea] font-bold ml-1 text-xs">{language === 'ar' ? 'FR' : 'AR'}</Text>
            </TouchableOpacity>

            {/* Authentic Golden Logo perfectly masked to the surrounding circle */}
            <View className="items-center mb-8 mt-10">
                <View className="w-32 h-32 rounded-full overflow-hidden shadow-sm items-center justify-center bg-[#fdf2f8] border-2 border-[#fff0f6]">
                    <Image 
                       source={require('../../assets/golden_b_logo.png')} 
                       style={{ width: 164, height: 164 }}
                       resizeMode="cover" 
                    />
                </View>
                <Text className="text-[#a21caf] text-2xl font-bold mt-4 tracking-widest text-shadow-sm">{t('appName')}</Text>
                <Text className="text-gray-500 text-sm mt-1">{t('appSlogan')}</Text>
            </View>

            {/* Elegant Soft Card */}
            <View className="bg-white/70 p-6 rounded-[32px] border border-white/50 shadow-sm overflow-hidden backdrop-blur-xl mb-10">
                
                {/* Tab Switcher */}
                <View className="flex-row bg-[#f3e8ff] rounded-2xl p-1 mb-8 shadow-sm">
                   <TouchableOpacity 
                      onPress={() => setActiveTab('login')} 
                      className="flex-1 py-3 items-center rounded-xl"
                      style={activeTab === 'login' ? { backgroundColor: '#9333ea', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 } : { backgroundColor: 'transparent' }}
                   >
                      <Text style={{ fontWeight: 'bold', color: activeTab === 'login' ? '#ffffff' : '#7e22ce' }}>{t('loginTab')}</Text>
                   </TouchableOpacity>
                   <TouchableOpacity 
                      onPress={() => setActiveTab('register')} 
                      className="flex-1 py-3 items-center rounded-xl"
                      style={activeTab === 'register' ? { backgroundColor: '#9333ea', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 } : { backgroundColor: 'transparent' }}
                   >
                      <Text style={{ fontWeight: 'bold', color: activeTab === 'register' ? '#ffffff' : '#7e22ce' }}>{t('registerTab')}</Text>
                   </TouchableOpacity>
                </View>

                {/* Forms */}
                <View className="space-y-5">
                  {activeTab === 'register' && (
                    <View style={{ flexDirection: 'row-reverse', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, alignItems: 'center', borderColor: '#fae8ff', borderWidth: 1 }}>
                      <User color="#c084fc" size={20} />
                      <TextInput 
                        placeholder={t('fullNamePlaceholder')} 
                        placeholderTextColor="#e879f9"
                        value={name} 
                        onChangeText={setName} 
                        style={{ flex: 1, color: '#1f2937', textAlign: 'right', marginRight: 12, fontWeight: '600' }}
                      />
                    </View>
                  )}

                  <View className="flex-row-reverse bg-white/90 rounded-2xl px-5 py-4 items-center border border-fuchsia-100 shadow-sm">
                    <Mail color="#c084fc" size={20} />
                    <TextInput 
                      placeholder={t('emailPlaceholder')} 
                      placeholderTextColor="#e879f9"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      className="flex-1 text-gray-800 text-right mr-3 font-semibold"
                    />
                  </View>

                  <View className="flex-row-reverse bg-white/90 rounded-2xl px-5 py-4 items-center border border-fuchsia-100 shadow-sm mb-6">
                    <Lock color="#c084fc" size={20} />
                    <TextInput 
                      placeholder={t('passwordPlaceholder')}
                      placeholderTextColor="#e879f9"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry 
                      className="flex-1 text-gray-800 text-right mr-3 font-semibold"
                    />
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity 
                     onPress={activeTab === 'login' ? handleLogin : handleRegister} 
                     disabled={loading}
                     className="bg-gradient-to-r bg-[#9333ea] py-4 rounded-2xl items-center flex-row justify-center shadow-md shadow-[#d8b4fe]"
                     style={loading ? { opacity: 0.5 } : {}}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <>
                        <View className="absolute left-6 opacity-80">
                           <ChevronRight color="#ffffff" size={20} />
                        </View>
                        <Text className="text-white font-bold text-lg">{activeTab === 'login' ? t('submitLogin') : t('submitRegister')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Sub Action */}
                {activeTab === 'register' && (
                  <TouchableOpacity onPress={() => navigation.navigate('ProviderRegistration')} style={{ alignItems: 'center', marginTop: 24, padding: 16, borderColor: '#f3e8ff', borderWidth: 1, borderRadius: 16, backgroundColor: '#faf5ff' }}>
                     <Text style={{ color: '#9333ea', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{t('providerQueryTitle')}</Text>
                     <Text style={{ color: '#6b7280', fontSize: 12 }}>{t('providerQuerySubtitle')}</Text>
                  </TouchableOpacity>
                )}
            </View>

      </KeyboardAwareScrollView>
    </View>
  );
}
