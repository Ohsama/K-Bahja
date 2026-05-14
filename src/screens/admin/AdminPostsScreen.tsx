import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Trash2, Image as ImageIcon } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';

export default function AdminPostsScreen() {
  const { t } = useAppContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('provider_posts')
      .select('*, providers(name)')
      .order('created_at', { ascending: false });
      
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (Platform.OS === 'web') {
        const confirm = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.");
        if (!confirm) return;
        executeDelete(postId);
    } else {
        Alert.alert(
            "تأكيد الحذف",
            "هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.",
            [
                { text: "إلغاء", style: "cancel" },
                { text: "حذف", style: "destructive", onPress: () => executeDelete(postId) }
            ]
        );
    }
  };

  const executeDelete = async (postId: string) => {
    const { error } = await supabase.from('provider_posts').delete().eq('id', postId);
    if (error) {
        if (Platform.OS === 'web') window.alert("حدث خطأ أثناء الحذف.");
        else Alert.alert("خطأ", "حدث خطأ أثناء الحذف.");
    } else {
        // Optimistic UI update
        setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const formatDate = (isoString: string) => {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB'); // DD/MM/YYYY formatting for simplicity
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 flex-row-reverse justify-between items-center shadow-sm z-10">
        <View className="items-end">
           <Text className="text-3xl font-bold text-gray-900 border-r-4 border-primary pr-3" style={{ fontFamily: 'serif' }}>{t('adminContentModTitle')}</Text>
           <Text className="text-gray-500 text-sm mt-1 font-medium">{t('adminContentModDesc')}</Text>
        </View>
        <View className="bg-pink-50 p-4 rounded-full shadow-sm">
           <ImageIcon color="#a21caf" size={28} />
        </View>
      </View>

      <ScrollView 
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading && posts.length === 0 ? (
           <Text className="text-center mt-10 text-gray-500">جاري التحميل...</Text>
        ) : posts.length === 0 ? (
           <Text className="text-center mt-10 text-gray-400 font-bold">لا توجد منشورات حتى الآن.</Text>
        ) : (
           <View className="mb-10">
              {posts.map(post => (
                  <View key={post.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 relative">
                      <View className="flex-row-reverse justify-between items-center mb-3">
                         <View className="items-end">
                            <Text className="font-bold text-gray-900 text-lg">{post.providers?.name || 'مزود غير معروف'}</Text>
                            <Text className="text-gray-400 text-xs">{formatDate(post.created_at)}</Text>
                         </View>
                         
                         {/* Delete Button */}
                         <TouchableOpacity onPress={() => handleDeletePost(post.id)} className="bg-red-50 p-2 rounded-xl flex-row items-center border border-red-100">
                            <Trash2 color="#ef4444" size={18} />
                            <Text className="text-red-500 font-bold ml-1 text-xs">حذف</Text>
                         </TouchableOpacity>
                      </View>

                      {post.image_url && (
                          <View className="w-full h-56 rounded-2xl overflow-hidden mb-3 bg-gray-100 relative shadow-sm border border-gray-50">
                              <Image source={{ uri: post.image_url }} className="w-full h-full" resizeMode="cover" />
                          </View>
                      )}

                      <Text className="text-gray-700 text-right text-base leading-relaxed p-2 bg-gray-50 rounded-xl border border-gray-100">
                          {post.caption || 'لا يوجد تعليق.'}
                      </Text>
                  </View>
              ))}
           </View>
        )}
      </ScrollView>
    </View>
  );
}
