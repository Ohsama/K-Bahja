import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { t } = useAppContext();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      return Alert.alert('تنبيه', 'الرجاء إدخال كلمة المرور وتأكيدها.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('خطأ', 'كلمتي المرور غير متطابقتين.');
    }
    if (password.length < 6) {
      return Alert.alert('خطأ', 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.');
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      Alert.alert('نجاح', 'تم تحديث كلمة المرور بنجاح!', [
        { text: 'حسناً', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('خطأ', e.message || 'فشل في عملية تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2 flex-row justify-between items-end">
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-gray-50 p-3 rounded-full mb-1">
           <ChevronLeft color="#9ca3af" size={24} />
        </TouchableOpacity>
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">{t('accountSettingsTitle')}</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">{t('accountSettingsSubtitle')}</Text>
        </View>
      </View>

      <ScrollView className="p-6">
        <View className="mb-6">
          <Text className="text-right text-gray-700 font-bold mb-2">{t('newPasswordLabel')}</Text>
          <View className="flex-row-reverse bg-gray-50 border border-gray-200 p-4 rounded-xl items-center">
            <Lock color="#9ca3af" size={20} className="ml-3" />
            <TextInput 
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 text-right text-lg text-gray-900"
              placeholder="••••••••"
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-right text-gray-700 font-bold mb-2">{t('confirmPasswordLabel')}</Text>
          <View className="flex-row-reverse bg-gray-50 border border-gray-200 p-4 rounded-xl items-center">
            <Lock color="#9ca3af" size={20} className="ml-3" />
            <TextInput 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="flex-1 text-right text-lg text-gray-900"
              placeholder="••••••••"
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleUpdatePassword} 
          disabled={saving || !password}
          className={`bg-primary p-4 rounded-xl items-center shadow-sm ${saving ? 'opacity-70' : ''}`}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">{t('updatePasswordBtn')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
