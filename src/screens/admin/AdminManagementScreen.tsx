import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, ActivityIndicator, Image, Modal, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';
import { Card, AppButton } from '../../components/common';
import { LocationPicker } from '../../components/common/LocationPicker';
import { Plus, Edit2, Trash2, Camera, MapPin } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export default function AdminManagementScreen() {
  const { currentUser } = useAppContext();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedDairaId, setSelectedDairaId] = useState('');
  const [locationLabel, setLocationLabel] = useState('اختر المدينة');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    fetchMyProviders();
  }, [currentUser]);

  const fetchMyProviders = async () => {
    if (!currentUser) return;
    setLoading(true);
    const { data } = await supabase
      .from('providers')
      .select('*, locations(daira_name, wilaya_name)')
      .eq('user_id', currentUser.id);
    
    if (data) setProviders(data);
    setLoading(false);
  };

  const resetForm = () => {
    setEditingProvider(null);
    setName('');
    setDescription('');
    setPriceRange('');
    setSelectedDairaId('');
    setLocationLabel('اختر المدينة');
    setImageUri(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (provider: any) => {
    setEditingProvider(provider);
    setName(provider.name);
    setDescription(provider.description || '');
    setPriceRange(provider.priceRange || '');
    setSelectedDairaId(provider.daira_id);
    setLocationLabel(provider.locations?.daira_name ? `${provider.locations.daira_name}، ${provider.locations.wilaya_name}` : 'اختر المدينة');
    setImageUri(provider.image_url);
    setModalVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToSupabase = async (uri: string): Promise<string | null> => {
    try {
      // Create strict caching-proof name format: provider_{userId}_{timestamp}.jpg
      const fileName = `provider_${currentUser?.id}_${Date.now()}.jpg`;
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

      const { data, error } = await supabase.storage
        .from('provider-images')
        .upload(fileName, decode(base64), { contentType: 'image/jpeg' });

      if (error) throw error;
      
      const { data: publicData } = supabase.storage.from('provider-images').getPublicUrl(fileName);
      return publicData.publicUrl;
    } catch (e) {
      console.error('Image upload failed:', e);
      Alert.alert('خطأ', 'فشل رفع الصورة.');
      return null;
    }
  };

  const handleSave = async () => {
    if (!name || !selectedDairaId) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الخدمة وتحديد الدائرة.');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = imageUri;
      
      // If imageUri is a local device path (file://), upload it.
      if (imageUri && imageUri.startsWith('file://')) {
        const uploadedUrl = await uploadImageToSupabase(imageUri);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = {
        name,
        description,
        price_range: priceRange,
        daira_id: selectedDairaId,
        user_id: currentUser?.id,
        image_url: finalImageUrl,
        rating: editingProvider ? editingProvider.rating : 5.0 // default
      };

      if (editingProvider) {
        const { error } = await supabase.from('providers').update(payload).eq('id', editingProvider.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('providers').insert([payload]);
        if (error) throw error;
      }

      setModalVisible(false);
      fetchMyProviders();
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ', 'تعذر حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, providerName: string) => {
    Alert.alert('حذف نهائي', `هل أنت متأكد من حذف ${providerName} نهائياً؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'حذف', 
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('providers').delete().eq('id', id);
          if (!error) fetchMyProviders();
          else Alert.alert('خطأ', 'فشل الحذف');
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card className="mb-4 flex-row-reverse p-3 items-center">
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} className="w-16 h-16 rounded-xl mr-3 bg-gray-100" />
      ) : (
        <View className="w-16 h-16 rounded-xl mr-3 bg-gray-200 items-center justify-center">
           <Camera color="#9ca3af" size={24} />
        </View>
      )}
      <View className="flex-1 items-end pl-3">
        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
        <Text className="text-gray-500 text-sm mt-1">{item.locations?.daira_name}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} className="p-2 bg-red-50 rounded-full mr-2">
          <Trash2 color="#ef4444" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEditModal(item)} className="p-2 bg-purple-50 rounded-full">
          <Edit2 color="#7e22ce" size={20} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2 flex-row-reverse justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">إدارة خدماتي</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">التحكم في معارضك وأسعارك</Text>
        </View>
        <TouchableOpacity onPress={openAddModal} className="bg-primary p-3 rounded-full flex-row-reverse items-center shadow-sm">
           <Plus color="#ffffff" size={20} />
           <Text className="text-white font-bold mr-1">إضافة</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#7e22ce" className="mt-10" />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10 font-bold">لا يوجد لديك أي خدمات معروضة.</Text>}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View className="flex-1 bg-white pt-16 px-6">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => !saving && setModalVisible(false)}>
              <Text className="text-primary font-bold text-lg">إلغاء</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">{editingProvider ? 'تعديل الخدمة' : 'خدمة جديدة'}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
             {/* Image Upload */}
             <TouchableOpacity onPress={pickImage} className="items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl h-48 mb-6 overflow-hidden">
               {imageUri ? (
                 <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
               ) : (
                 <View className="items-center">
                   <Camera color="#9ca3af" size={32} />
                   <Text className="text-gray-500 mt-2 font-bold">ارفاق صورة العرض</Text>
                 </View>
               )}
             </TouchableOpacity>

             <View className="space-y-4 mb-10">
                <View>
                  <Text className="text-right text-gray-700 font-bold mb-2">الاسم التجاري</Text>
                  <TextInput 
                    value={name} onChangeText={setName}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-right text-lg"
                    placeholder="مثل: صالون التميز" 
                  />
                </View>

                <View>
                  <Text className="text-right text-gray-700 font-bold mb-2">الوصف</Text>
                  <TextInput 
                    value={description} onChangeText={setDescription}
                    multiline numberOfLines={3}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-right text-lg h-24"
                    placeholder="اكتب نبذة عن خدماتك..." 
                  />
                </View>

                <View>
                  <Text className="text-right text-gray-700 font-bold mb-2">نطاق السعر</Text>
                  <TextInput 
                    value={priceRange} onChangeText={setPriceRange}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-right text-lg"
                    placeholder="مثال: 5000 دج - 12000 دج" 
                  />
                </View>

                <View>
                  <Text className="text-right text-gray-700 font-bold mb-2">الموقع (الدائرة)</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    {/* Reusing LocationPicker. Note: Must pass the generic onLocationSelected callback */}
                    <LocationPicker 
                       currentLabel={locationLabel} 
                       onLocationSelected={(id, label) => {
                          setSelectedDairaId(id);
                          setLocationLabel(label);
                       }} 
                    />
                  </View>
                </View>
             </View>

             <AppButton 
                title={saving ? "جاري الحفظ..." : "حفظ الخدمة"} 
                onPress={handleSave} 
                disabled={saving || !name || !selectedDairaId}
             />
             <View className="h-10" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
