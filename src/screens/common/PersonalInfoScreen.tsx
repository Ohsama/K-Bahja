import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Image, RefreshControl } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, User, Phone, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export default function PersonalInfoScreen() {
  const navigation = useNavigation();
  const { currentUser, updateProfileLocally, t } = useAppContext();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || null);
  const [localImageBase64, setLocalImageBase64] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
        setName(currentUser?.name || '');
        setPhone(currentUser?.phone || '');
        setAvatarUrl(currentUser?.avatar_url || null);
        setRefreshing(false);
    }, 800);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3, // Compressed to save bandwidth
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
       setAvatarUrl(result.assets[0].uri); // For instant local render preview
       setLocalImageBase64(result.assets[0].base64); // Queued for upload
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    if (!name.trim()) return Alert.alert('خطأ', 'يرجى إدخال اسم صحيح');
    
    setSaving(true);
    let finalAvatarUrl = currentUser?.avatar_url;

    try {
      // 1. Upload new image strictly via base64 to avoid web Blob issues
      if (localImageBase64) {
          const fileName = `avatar_${currentUser.id}_${Date.now()}.jpg`;
          const decodedFile = decode(localImageBase64);

          const { error: uploadError } = await supabase.storage
               .from('avatars')
               .upload(fileName, decodedFile, { contentType: 'image/jpeg' });

          if (uploadError) throw new Error('فشل رفع الصورة: ' + uploadError.message);

          const { data: pbUrl } = supabase.storage.from('avatars').getPublicUrl(fileName);
          finalAvatarUrl = pbUrl.publicUrl;
      }

      // 2. Update Database Vector
      const { error } = await supabase
        .from('profiles')
        .update({ name, phone, avatar_url: finalAvatarUrl })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Ensure local state synchronizes so blockers resolve immediately
      updateProfileLocally(name, phone, finalAvatarUrl);

      if (Platform.OS === 'web') {
          window.alert('نجاح: تم تحديث المعلومات الشخصية بنجاح!');
          navigation.goBack();
      } else {
          Alert.alert('نجاح', 'تم تحديث المعلومات الشخصية بنجاح!', [
            { text: 'حسناً', onPress: () => navigation.goBack() }
          ]);
      }
    } catch (e: any) {
      if (Platform.OS === 'web') {
          window.alert('خطأ: ' + (e.message || 'فشل تحديث البيانات'));
      } else {
          Alert.alert('خطأ', e.message || 'فشل تحديث البيانات');
      }
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
          <Text className="text-3xl font-bold text-gray-900 text-right">{t('personalInfoTitle')}</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">{t('personalInfoSubtitle')}</Text>
        </View>
      </View>

      <KeyboardAwareScrollView 
         enableOnAndroid={true}
         extraScrollHeight={20}
         showsVerticalScrollIndicator={false}
         className="p-6"
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
         keyboardShouldPersistTaps="handled"
      >
        
        {/* Avatar Editor Widget */}
        <View className="items-center mb-8">
           <TouchableOpacity onPress={pickImage} className="relative">
              <View className="w-28 h-28 bg-gray-100 rounded-full border-4 border-white shadow-sm overflow-hidden items-center justify-center">
                 {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                 ) : (
                    <User color="#d1d5db" size={50} />
                 )}
              </View>
              <View className="absolute bottom-0 right-0 bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-sm">
                 <Camera color="#ffffff" size={18} />
              </View>
           </TouchableOpacity>
           <Text className="text-gray-400 text-xs font-bold mt-3">{t('changeAvatarLabel')}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-right text-gray-700 font-bold mb-2">{t('fullNameLabel')}</Text>
          <View className="flex-row-reverse bg-gray-50 border border-gray-200 p-4 rounded-xl items-center">
            <User color="#9ca3af" size={20} className="ml-3" />
            <TextInput 
              value={name}
              onChangeText={setName}
              className="flex-1 text-right text-lg text-gray-900"
              placeholder={t('fullNameLabel')}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-right text-gray-700 font-bold mb-2">{t('phoneLabel')}</Text>
          <View className="flex-row-reverse bg-gray-50 border border-gray-200 p-4 rounded-xl items-center">
            <Phone color="#9ca3af" size={20} className="ml-3" />
            <TextInput 
              value={phone}
              onChangeText={setPhone}
              className="flex-1 text-right text-lg text-gray-900 font-sans"
              placeholder={t('phonePlaceholder')}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSave} 
          disabled={saving || !name.trim()}
          className={`bg-primary p-4 rounded-xl items-center shadow-sm ${saving ? 'opacity-70' : ''}`}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">{t('saveChangesBtn')}</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
