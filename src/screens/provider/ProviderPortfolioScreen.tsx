import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, Modal, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';
import { Camera, Plus, Trash2 } from 'lucide-react-native';

export default function ProviderPortfolioScreen() {
  const { currentUser, t } = useAppContext();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    initProvider();
  }, [currentUser]);

  const initProvider = async () => {
    if (!currentUser) return;
    setLoading(true);
    const { data } = await supabase.from('providers').select('id').eq('user_id', currentUser.id).single();
    if (data) {
      setProviderId(data.id);
      fetchPosts(data.id);
    } else {
      setLoading(false);
    }
  };

  const fetchPosts = async (pId: string) => {
    const { data } = await supabase.from('provider_posts').select('*').eq('provider_id', pId).order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square images for portfolio
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!providerId) return;
    if (!imageUri && !caption) {
      Alert.alert('!', t('postValidation'));
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = null;
      if (imageUri) {
         const fileName = `post_${providerId}_${Date.now()}.jpg`;

         const response = await fetch(imageUri);
         const arrayBuffer = await response.arrayBuffer();

         const { error: uploadError } = await supabase.storage
           .from('post-images')
           .upload(fileName, arrayBuffer, { contentType: 'image/jpeg' });

         if (uploadError) throw uploadError;
         
         const { data: publicData } = supabase.storage.from('post-images').getPublicUrl(fileName);
         finalImageUrl = publicData.publicUrl;
      }

      const { error } = await supabase.from('provider_posts').insert([{
         provider_id: providerId,
         caption,
         image_url: finalImageUrl
      }]);

      if (error) throw error;

      setModalVisible(false);
      setCaption('');
      setImageUri(null);
      fetchPosts(providerId!);

    } catch (e: any) {
      console.error(e);
      Alert.alert('!', t('postFailMsg'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (postId: string) => {
    Alert.alert('!', t('confirmDeletePostMsg'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('deleteBtn'), style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('provider_posts').delete().eq('id', postId);
          if (!error && providerId) fetchPosts(providerId);
      }}
    ]);
  };

  const renderPost = ({ item }: { item: any }) => (
    <View className="bg-white rounded-3xl mb-6 shadow-sm border border-gray-100 overflow-hidden">
      {item.image_url && (
         <Image source={{ uri: item.image_url }} className="w-full h-64 bg-gray-100" resizeMode="cover" />
      )}
      <View className="p-4">
         {item.caption ? (
            <Text className="text-gray-800 text-right text-base leading-6">{item.caption}</Text>
         ) : null}
         
         <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2 bg-red-50 rounded-full">
               <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
            <Text className="text-gray-400 text-xs">
               {new Date(item.created_at).toLocaleDateString('ar-DZ')}
            </Text>
         </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 flex-row-reverse justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">{t('providerPortfolioTitle')}</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">{t('providerPortfolioSubtitle')}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-primary p-3 rounded-full flex-row-reverse items-center shadow-sm">
           <Plus color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7e22ce" className="mt-10" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10 font-bold">{t('providerNoPosts')}</Text>
          }
        />
      )}

      {/* New Post Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-surface pt-16 px-6">
           <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={() => !saving && setModalVisible(false)}>
                 <Text className="text-primary font-bold text-lg">{t('cancel')}</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900 text-right">{t('newPostModalTitle')}</Text>
           </View>

           <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={pickImage} className="bg-gray-100 rounded-3xl h-64 items-center justify-center mb-6 border-2 border-dashed border-gray-300 overflow-hidden">
                {imageUri ? (
                   <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                   <View className="items-center">
                     <Camera color="#9ca3af" size={40} />
                     <Text className="text-gray-500 font-bold mt-2">{t('attachImageHint')}</Text>
                   </View>
                )}
              </TouchableOpacity>

              <Text className="text-right text-gray-700 font-bold mb-2">{t('captionLabel')}</Text>
              <TextInput 
                value={caption} 
                onChangeText={setCaption} 
                multiline numberOfLines={4}
                className="bg-white border border-gray-200 p-4 rounded-xl text-right text-lg h-32 mb-8"
                placeholder={t('captionPlaceholder')} 
              />

              <TouchableOpacity 
                 onPress={handlePost} 
                 disabled={saving || (!imageUri && !caption)}
                 className={`bg-primary p-4 rounded-xl items-center shadow-sm ${saving ? 'opacity-70' : ''}`}
              >
                 {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">{t('publishNowBtn')}</Text>}
              </TouchableOpacity>
           </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
