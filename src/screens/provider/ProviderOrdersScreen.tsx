import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';
import { Card } from '../../components/common';
import { CheckCircle, XCircle, Calendar, Clock, DollarSign } from 'lucide-react-native';
import { OrderStatus } from '../../types';

export default function ProviderOrdersScreen() {
  const { currentUser, t } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profit Tracking State
  const [completeModal, setCompleteModal] = useState({ visible: false, orderId: '', rate: 10 });
  const [finalPrice, setFinalPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    if (!currentUser) return;
    setLoading(true);
    
    try {
      // 1. Get the provider ID for the current user
      const { data: providerData } = await supabase
         .from('providers')
         .select('id')
         .eq('user_id', currentUser.id)
         .single();
         
      if (!providerData) {
         setLoading(false);
         return;
      }

      // 2. Fetch orders mapped to this provider that are actively CONFIRMED
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(name, phone), services(name), providers(commission_rate)')
        .eq('provider_id', providerData.id)
        .in('status', ['CONFIRMED', 'WAITING_FOR_PAYMENT'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
     const execCancel = async () => {
         const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
         if (!error) {
           fetchOrders();
         if (Platform.OS === 'web') window.alert(t('postFailMsg'));
         else Alert.alert('!', t('postFailMsg'));
       }
     };

     if (Platform.OS === 'web') {
        if (window.confirm(t('cancelConfirmDesc'))) execCancel();
     } else {
        Alert.alert('!', t('cancelConfirmDesc'), [
          { text: t('goBack'), style: 'cancel' },
          { text: t('confirmCancel'), onPress: execCancel }
        ]);
     }
  };

  const handleOrderCompletion = async () => {
      const price = parseFloat(finalPrice);
      if (isNaN(price) || price <= 0) {
         return Alert.alert('!', t('postValidation'));
      }

      setIsSubmitting(true);
      const commissionDue = (price * completeModal.rate) / 100;

      const { error } = await supabase.from('orders').update({ 
         status: 'WAITING_FOR_PAYMENT', // Triggers "commission owed" phase automatically
         price_collected: price,
         commission_due: commissionDue
      }).eq('id', completeModal.orderId);

      setIsSubmitting(false);

      if (!error) {
         setCompleteModal({ visible: false, orderId: '', rate: 10 });
         setFinalPrice('');
         fetchOrders();
         const msg = `تم تسجيل العملية بنجاح. عمولة المنصة بانتظار السداد: ${commissionDue} دج.`;
         if (Platform.OS === 'web') window.alert(msg);
         else Alert.alert('تم الإنهاء!', msg);
      } else {
         if (Platform.OS === 'web') window.alert('فشل تسجيل الإنهاء.');
         else Alert.alert('خطأ', 'فشل تسجيل الإنهاء.');
      }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <Card className="mb-4 p-4">
       <View className="flex-row-reverse justify-between items-start mb-2">
         <View className="flex-1 items-end pl-2">
            {/* Fallback to dictionary for dynamic services if available, else literal string */}
            <Text className="text-lg font-bold text-gray-900">{t(item.services?.name) || item.services?.name}</Text>
            <Text className="text-gray-600 text-sm mt-1">{t('orderCustomerLabel')}{item.profiles?.name}</Text>
            <Text className="text-gray-600 font-bold mt-1 text-right">{t('orderPhoneLabel')}{item.profiles?.phone || t('phoneUnavailable')}</Text>
         </View>
         <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 text-xs font-bold">{t('orderStatusConfirmed')}</Text>
         </View>
       </View>

       <View className="flex-row-reverse bg-gray-50 rounded-xl p-3 mb-4 space-x-4 space-x-reverse items-center justify-start mt-2 border border-gray-100">
          <View className="flex-row-reverse items-center">
             <Calendar color="#6b7280" size={16} />
             <Text className="text-gray-700 mr-2 text-sm font-bold">{item.date}</Text>
          </View>
          <View className="flex-row-reverse items-center">
             <Clock color="#6b7280" size={16} />
             <Text className="text-gray-700 mr-2 text-sm font-bold">{item.time}</Text>
          </View>
       </View>

       {item.notes && (
         <Text className="text-sm text-gray-500 text-right mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">{item.notes}</Text>
       )}

       {/* Actions */}
       {item.status === 'CONFIRMED' ? (
           <View className="flex-row justify-between border-t border-gray-100 pt-4">
              <TouchableOpacity 
                 onPress={() => updateOrderStatus(item.id, 'CANCELLED')} 
                 className="flex-1 bg-red-50 border border-red-100 py-3 rounded-xl mr-2 flex-row justify-center items-center"
              >
                 <XCircle color="#ef4444" size={20} />
                 <Text className="text-red-600 font-bold ml-2">{t('cancelOrderBtn')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                 onPress={() => setCompleteModal({ visible: true, orderId: item.id, rate: item.providers?.commission_rate || 10 })} 
                 className="flex-1 bg-green-500 border border-green-600 py-3 rounded-xl ml-2 flex-row justify-center items-center shadow-sm"
              >
                 <CheckCircle color="#ffffff" size={20} />
                 <Text className="text-white font-bold ml-2">{t('finishOrderBtn')}</Text>
              </TouchableOpacity>
           </View>
       ) : (
           <View className="border-t border-gray-100 pt-4 items-center">
              <View className="bg-yellow-100 border border-yellow-200 px-6 py-3 rounded-full flex-row items-center">
                 <CheckCircle color="#ca8a04" size={20} />
                 <Text className="text-yellow-700 font-bold ml-2">{t('orderCompletedWaitCommission')}</Text>
              </View>
           </View>
       )}
    </Card>
  );

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 flex-row-reverse justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">{t('providerOrdersTitle')}</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">{t('providerOrdersSubtitle')}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" className="mt-10" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10 font-bold">{t('emptyOrdersText')}</Text>
          }
        />
      )}

      {/* Completion Modal */}
      <Modal visible={completeModal.visible} animationType="fade" transparent={true}>
         <View className="flex-1 justify-center items-center bg-black/60 px-6">
            <View className="bg-white w-full rounded-3xl p-6 border-t-4 border-t-green-500 items-end">
               <View className="bg-green-50 items-center justify-center p-4 rounded-full mb-4 self-center">
                  <DollarSign color="#10b981" size={40} />
               </View>
               <Text className="text-2xl font-bold text-gray-900 mb-2 w-full text-center">{t('payCompleteTitle')}</Text>
               <Text className="text-gray-500 text-center mb-6 w-full text-sm">
                  {t('payCompleteDesc')}
               </Text>

               <Text className="text-right text-gray-700 font-bold mb-2">{t('amountReceivedLabel')}</Text>
               <TextInput 
                  value={finalPrice}
                  onChangeText={setFinalPrice}
                  keyboardType="numeric"
                  className="bg-gray-50 border border-gray-200 text-right font-bold text-xl rounded-xl p-4 w-full mb-6"
                  placeholder={t('amountPlaceholder')}
               />

               <View className="flex-row w-full justify-between mt-2">
                  <TouchableOpacity onPress={() => setCompleteModal({ visible: false, orderId: '', rate: 10 })} className="flex-1 py-4 bg-gray-100 rounded-xl mr-2 items-center">
                     <Text className="text-gray-600 font-bold text-lg">{t('goBack')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={isSubmitting} onPress={handleOrderCompletion} className="flex-1 py-4 bg-green-500 rounded-xl ml-2 items-center shadow-sm">
                     {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">{t('confirmSendBtn')}</Text>}
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>

    </View>
  );
}
