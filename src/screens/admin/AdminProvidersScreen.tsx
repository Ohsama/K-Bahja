import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView, Platform, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/common';
import { CheckCircle, XCircle, ShieldCheck, Percent, Save } from 'lucide-react-native';

export default function AdminProvidersScreen() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const TABS: { label: string; value: 'PENDING' | 'APPROVED' | 'REJECTED' }[] = [
    { label: 'طلبات جديدة (معلقة)', value: 'PENDING' },
    { label: 'نشطة ومقبولة', value: 'APPROVED' },
    { label: 'مرفوضة', value: 'REJECTED' }
  ];

  useEffect(() => {
    fetchProviders();
  }, [activeTab]);

  const fetchProviders = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    // Since SQL fallback handles lack of column, we query manually and gracefully map it in the code if needed
    const { data, error } = await supabase
      .from('providers')
      .select('*, profiles(name), services(name)')
      .order('created_at', { ascending: false });

    if (error) {
       console.error("Fetch Providers Error:", error);
    }
      
    if (data) {
       // Filter locally to support fallback seamlessly while DB migrations propagate
       const filtered = data.filter(p => {
          const s = p.status || (p.is_approved ? 'APPROVED' : 'PENDING');
          return s === activeTab;
       });
       setProviders(filtered);
    }
    if (!isRefresh) setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviders(true);
    setRefreshing(false);
  };

  const setProviderStatus = async (providerId: string, newStatus: 'APPROVED' | 'REJECTED', providerName: string) => {
    const actionName = newStatus === 'APPROVED' ? 'تفعيل حساب' : 'رفض وحظر';
    
    const executeUpdate = async () => {
         // Update both legacy and new column synchronously
         const { error } = await supabase.from('providers').update({ status: newStatus, is_approved: newStatus === 'APPROVED' }).eq('id', providerId);
         if (!error) {
            fetchProviders();
         } else {
            if (Platform.OS === 'web') {
               window.alert('خطأ: فشل تغيير الحالة.');
            } else {
               Alert.alert('خطأ', 'فشل تغيير الحالة.');
            }
         }
    };

    if (Platform.OS === 'web') {
       if (window.confirm(`هل أنت متأكد من ${actionName} مزود الخدمة "${providerName}"؟`)) {
          executeUpdate();
       }
    } else {
       Alert.alert(`تأكيد ${actionName}`, `هل أنت متأكد من ${actionName} مزود الخدمة "${providerName}"؟`, [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تأكيد', onPress: executeUpdate }
       ]);
    }
  };

  const CommissionEditor = ({ provider, refreshFallback }: { provider: any, refreshFallback: () => void }) => {
    const [rate, setRate] = useState(provider.commission_rate?.toString() || '10');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
       const numericRate = parseFloat(rate);
       if (isNaN(numericRate) || numericRate < 0 || numericRate > 100) {
          Alert.alert('خطأ', 'النسبة يجب أن تكون رقماً صالحاً بين 0 و 100');
          return;
       }
       setSaving(true);
       const { error } = await supabase.from('providers').update({ commission_rate: numericRate }).eq('id', provider.id);
       setSaving(false);
       if (error) {
          Alert.alert('خطأ', 'فشل ضبط النسبة');
       } else {
          Alert.alert('نجاح', 'تم تحديث نسبة العمولة لهذا المزود.');
          refreshFallback();
       }
    };

    return (
       <View className="flex-row-reverse items-center justify-between mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <View className="flex-row-reverse items-center">
             <Percent color="#6b7280" size={16} />
             <Text className="text-gray-700 font-bold mr-1 text-xs">نسبة عمولة المنصة:</Text>
          </View>
          <View className="flex-row items-center">
             <TouchableOpacity onPress={handleSave} disabled={saving || rate === provider.commission_rate?.toString()} className={`ml-2 p-2 rounded-lg ${rate !== provider.commission_rate?.toString() ? 'bg-primary' : 'bg-gray-200'}`}>
                {saving ? <ActivityIndicator size="small" color="#fff" /> : <Save color={rate !== provider.commission_rate?.toString() ? "#fff" : "#9ca3af"} size={16} />}
             </TouchableOpacity>
             <TextInput 
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
                className="bg-white border border-gray-300 px-3 py-1 rounded-md text-center font-bold text-gray-900 w-16"
                placeholder="10"
             />
             <Text className="ml-2 text-gray-500 font-bold text-xs">%</Text>
          </View>
       </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const badgeColor = item.status === 'APPROVED' ? 'bg-green-100 border-green-200 text-green-800' : item.status === 'REJECTED' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-yellow-100 border-yellow-200 text-yellow-800';
    return (
      <Card className="mb-4 flex-col p-4 border border-gray-100 py-4">
        <View className="flex-row-reverse justify-between items-start mb-4">
          <View className="flex-1 items-end pl-3">
            <Text className="text-xl font-bold text-gray-900 mb-1">{item.name}</Text>
            <Text className="text-gray-500 text-sm">{item.profiles?.name} (المالك)</Text>
            <Text className="text-gray-500 text-sm mt-1">الخدمة: {item.services?.name}</Text>
            <Text className="text-gray-500 font-bold mt-1 text-right text-xs">الهوية/السجل: {item.nin_or_rc || 'غير مرفق'}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full border ${badgeColor}`}>
             <Text className="font-bold text-xs">{item.status}</Text>
          </View>
        </View>

        <View className="flex-row justify-between border-t border-gray-50 pt-3">
           {item.status !== 'APPROVED' && (
             <TouchableOpacity onPress={() => setProviderStatus(item.id, 'APPROVED', item.name)} className="flex-1 mr-2 px-4 py-3 bg-green-500 rounded-xl flex-row justify-center items-center">
               <Text className="text-white font-bold ml-2">اعتماد وقبول</Text>
               <ShieldCheck color="#ffffff" size={18} />
             </TouchableOpacity>
           )}
           {item.status !== 'REJECTED' && (
             <TouchableOpacity onPress={() => setProviderStatus(item.id, 'REJECTED', item.name)} className="flex-1 ml-2 px-4 py-3 bg-red-100 rounded-xl flex-row justify-center items-center border border-red-200">
               <Text className="text-red-700 font-bold ml-2">رفض نهائي</Text>
               <XCircle color="#ef4444" size={18} />
             </TouchableOpacity>
           )}
        </View>

        {item.status !== 'REJECTED' && (
           <CommissionEditor provider={item} refreshFallback={fetchProviders} />
        )}
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-4 px-6 bg-white border-b border-gray-100">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">إدارة المزودين والطلبات</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">مراقبة واعتماد مقدمي الخدمات الجدد</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row-reverse mt-6" contentContainerStyle={{ paddingRight: 4 }}>
           {TABS.map(t => (
             <TouchableOpacity 
               key={t.value} 
               onPress={() => setActiveTab(t.value)}
               className={`px-4 py-2 rounded-full ml-2 border ${activeTab === t.value ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
             >
               <Text className={`font-bold text-sm ${activeTab === t.value ? 'text-white' : 'text-gray-600'}`}>{t.label}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#7e22ce" className="mt-10" />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7e22ce"]} />
          }
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10 font-bold">لا يوجد مزودين تحت هذا الصنف.</Text>}
        />
      )}
    </View>
  );
}
