import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, ActivityIndicator, Modal, ScrollView, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Card, AppButton } from '../../components/common';
import { Plus, Edit2, Trash2, MoreHorizontal, X, Search } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';

const PRIMARY_ICONS = ['Home', 'Scissors', 'Music', 'Camera', 'Sparkles', 'Cake', 'Package', 'Leaf', 'Car'];
const EXTENDED_ICONS = [
  'Swords', 'Tent', 'Flame', 'Star', 'Heart', 'Briefcase', 'Truck', 'Wrench', 
  'Smartphone', 'Monitor', 'Stethoscope', 'Pill', 'Coffee', 'Utensils', 'Pizza', 
  'ShoppingBag', 'ShoppingCart', 'Gift', 'Book', 'GraduationCap', 'PenTool', 
  'Palette', 'Brush', 'Video', 'Mic', 'Headphones', 'Speaker', 'Key', 'Lock', 
  'Shield', 'Globe', 'Map', 'Navigation', 'Compass', 'Anchor', 'Cloud', 'Sun', 
  'Moon', 'Umbrella', 'Zap', 'Droplets', 'TreePine', 'Users', 'UserCheck', 
  'Smile', 'Clock', 'Calendar', 'Bell', 'Tag', 'Ticket', 'Shirt'
];

export default function AdminServicesScreen() {
  const { t } = useAppContext();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [isExtendedIconsVisible, setExtendedIconsVisible] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('CircleDashed');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (data) setServices(data);
    if (!isRefresh) setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices(true);
    setRefreshing(false);
  };

  const resetForm = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setIconName('CircleDashed');
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description || '');
    setIconName(service.icon_name || 'CircleDashed');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !iconName) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الصنف واسم الأيقونة.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        description,
        icon_name: iconName
      };

      if (editingService) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }

      setModalVisible(false);
      fetchServices();
    } catch (error: any) {
      console.error(error);
      Alert.alert('خطأ', error.message || 'تعذر حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, serviceName: string) => {
    Alert.alert('تحذير نهائي', `هل أنت متأكد من حذف صنف "${serviceName}" بالكامل؟ (سيتم حذف أي مزودين مرتبطين به إذا تطلب الأمر)`, [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'حذف', 
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('services').delete().eq('id', id);
          if (!error) fetchServices();
          else Alert.alert('خطأ', 'فشل الحذف');
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => {
    const IconComponent = (Icons as any)[item.icon_name] || Icons.CircleDashed;
    return (
      <Card className="mb-4 flex-row-reverse p-3 items-center">
        <View className="w-16 h-16 rounded-xl mr-3 bg-purple-100 items-center justify-center">
             <IconComponent color="#7e22ce" size={28} />
        </View>
        <View className="flex-1 items-end pl-3">
          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
          <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
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
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2 flex-row-reverse justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">{t('adminManageServicesTitle')}</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">{t('adminManageServicesDesc')}</Text>
        </View>
        <TouchableOpacity onPress={openAddModal} className="bg-primary p-3 rounded-full flex-row-reverse items-center shadow-sm">
           <Plus color="#ffffff" size={20} />
           <Text className="text-white font-bold mr-1">{t('adminAddNewBtn')}</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#7e22ce" className="mt-10" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7e22ce"]} />
          }
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10 font-bold">لا يوجد أي أصناف حالياً.</Text>}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View className="flex-1 bg-white pt-16 px-6">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => !saving && setModalVisible(false)}>
              <Text className="text-primary font-bold text-lg">إلغاء</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">{editingService ? 'تعديل الصنف' : 'صنف جديد'}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

             <View className="space-y-4 mb-10 mt-6">
                <View>
                  <Text className="text-right text-gray-700 font-bold mb-2">اسم الصنف</Text>
                  <TextInput 
                    value={name} onChangeText={setName}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-right text-lg"
                    placeholder="مثل: طبيب، حلاقة..." 
                  />
                </View>

                <View>
                  <Text className="text-right text-gray-700 font-bold mb-2">الوصف</Text>
                  <TextInput 
                    value={description} onChangeText={setDescription}
                    multiline numberOfLines={2}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-right text-lg h-20"
                    placeholder="اكتب نبذة عن الصنف..." 
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-right text-gray-700 font-bold mb-3 mt-4">{t('chooseServiceIcon')}</Text>
                  
                  {/* Dialpad Icon Grid */}
                  <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                     <View className="flex-row-reverse flex-wrap justify-between">
                        {PRIMARY_ICONS.map((iconStr, idx) => {
                           const IconComp = (Icons as any)[iconStr] || Icons.CircleDashed;
                           const isSelected = iconName === iconStr;
                           return (
                             <TouchableOpacity 
                                key={idx}
                                onPress={() => setIconName(iconStr)}
                                className={`w-[30%] aspect-square rounded-2xl items-center justify-center mb-3 ${isSelected ? 'bg-primary border-2 border-primary' : 'bg-white border border-gray-200 shadow-sm'}`}
                             >
                               <IconComp color={isSelected ? "#ffffff" : "#6b7280"} size={32} />
                             </TouchableOpacity>
                           );
                        })}
                     </View>

                     {/* The "0" Dial (More Options) */}
                     <View className="items-center mt-2">
                        <TouchableOpacity 
                           onPress={() => setExtendedIconsVisible(true)}
                           className={`w-[30%] aspect-square rounded-2xl items-center justify-center ${!PRIMARY_ICONS.includes(iconName) && iconName !== '' ? 'bg-purple-100 border-2 border-primary' : 'bg-gray-200 border border-gray-300'}`}
                        >
                           {(!PRIMARY_ICONS.includes(iconName) && iconName !== '') ? (
                              React.createElement((Icons as any)[iconName] || Icons.CircleDashed, { color: "#7e22ce", size: 32 })
                           ) : (
                              <MoreHorizontal color="#6b7280" size={32} />
                           )}
                           <Text className="text-[10px] text-gray-500 font-bold mt-1 text-center">{t('moreIcons')}</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
                </View>
             </View>

             <AppButton 
                title={saving ? "جاري الحفظ..." : "حفظ الصنف"} 
                onPress={handleSave} 
                className="mt-6"
                disabled={saving || !name || !iconName}
             />
             <View className="h-20" />
          </ScrollView>
        </View>
      </Modal>

      {/* Extended Icons Modal */}
      <Modal visible={isExtendedIconsVisible} animationType="fade" transparent={true}>
         <View className="flex-1 bg-black/60 justify-center px-4">
            <View className="bg-white rounded-3xl h-[80%] overflow-hidden relative">
               <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
                  <TouchableOpacity onPress={() => setExtendedIconsVisible(false)} className="p-2 bg-gray-200 rounded-full">
                     <X color="#4b5563" size={20} />
                  </TouchableOpacity>
                  <Text className="text-xl font-bold text-gray-900">{t('iconLibrary')}</Text>
               </View>

               <FlatList
                  data={EXTENDED_ICONS}
                  keyExtractor={item => item}
                  numColumns={4}
                  contentContainerStyle={{ padding: 16 }}
                  columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
                  renderItem={({ item }) => {
                     const IconComp = (Icons as any)[item] || Icons.CircleDashed;
                     const isSelected = iconName === item;
                     return (
                        <TouchableOpacity 
                           onPress={() => {
                              setIconName(item);
                              setExtendedIconsVisible(false);
                           }}
                           className={`w-[22%] aspect-square rounded-2xl items-center justify-center ${isSelected ? 'bg-primary border-2 border-primary shadow-sm' : 'bg-gray-50 border border-gray-200'}`}
                        >
                           <IconComp color={isSelected ? "#ffffff" : "#4b5563"} size={26} />
                        </TouchableOpacity>
                     );
                  }}
               />
            </View>
         </View>
      </Modal>
    </View>
  );
}
