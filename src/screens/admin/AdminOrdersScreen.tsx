import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, Modal, ScrollView, Platform, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Card, StatusBadge } from '../../components/common';
import { Calendar, Clock, CheckCircle, Image as ImageIcon, MapPin, XCircle, Phone } from 'lucide-react-native';
import { OrderStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';

export default function AdminOrdersScreen() {
  const { t } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'SUBMITTED' | 'CONFIRMED' | 'WAITING_FOR_PAYMENT' | 'DONE' | 'CANCELLED'>('SUBMITTED');

  // Modal logic for attachments & notes
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);

  const TABS: { label: string; value: 'SUBMITTED' | 'CONFIRMED' | 'WAITING_FOR_PAYMENT' | 'DONE' | 'CANCELLED' }[] = [
    { label: t('tabNewOrders'), value: 'SUBMITTED' },
    { label: t('tabConfirmed'), value: 'CONFIRMED' },
    { label: t('tabWaiting'), value: 'WAITING_FOR_PAYMENT' },
    { label: t('tabDone'), value: 'DONE' },
    { label: t('tabCancelled'), value: 'CANCELLED' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    // Fetch orders with profiles (Customers) and providers
    let query = supabase
      .from('orders')
      .select('*, profiles(name, phone), services(name), providers(name, nin_or_rc)')
      .order('created_at', { ascending: false });

    // Handle Active Tab mapping (grouping PAID and DONE together or individually)
    if (activeTab === 'DONE') {
      query = query.in('status', ['DONE', 'PAID']);
    } else {
      query = query.eq('status', activeTab);
    }

    const { data } = await query;
    if (data) setOrders(data);
    if (!isRefresh) setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders(true);
    setRefreshing(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      fetchOrders();
      Alert.alert('نجاح', 'تم تحديث حالة الطلب بنجاح.');
      if (modalVisible) setModalVisible(false);
    } else {
      Alert.alert('خطأ', 'فشل تحديث الحالة');
    }
  };

  const openOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
    // Fetch attachments
    const { data } = await supabase.from('order_attachments').select('*').eq('order_id', order.id);
    if (data) setAttachments(data);
    else setAttachments([]);
  };

  const handleApproveAssignment = (orderId: string) => {
    const executeApprove = () => updateOrderStatus(orderId, 'CONFIRMED');
    if (Platform.OS === 'web') {
       if (window.confirm(t('confirmToProviderMsg'))) {
          executeApprove();
       }
    } else {
       Alert.alert(t('confirmToProvider'), t('confirmToProviderMsg'), [
         { text: t('cancel'), style: 'cancel' },
         { text: t('confirm'), onPress: executeApprove }
       ]);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card className="mb-4 p-4 border border-gray-100">
      <View className="flex-row-reverse justify-between items-start mb-3 border-b border-gray-50 pb-3">
        <View className="items-end pl-2 flex-1">
          <Text className="text-sm text-gray-500 font-bold mb-1">طلب رقم: {item.id.slice(0, 8)}</Text>
          <Text className="text-lg text-gray-900 font-bold">{item.services?.name}</Text>
          {item.providers?.name && <Text className="text-xs text-gray-500 mt-1">{t('adminTreatedBy')}{item.providers?.name}</Text>}
          {item.commission_due > 0 && (
            <View className="bg-red-50 px-2 py-1 rounded border border-red-100 mt-2 self-end">
              <Text className="text-xs text-red-700 font-bold">{t('adminCommissionDue')}{item.commission_due} DZD</Text>
            </View>
          )}
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View className="flex-row-reverse items-center justify-start mb-3 space-x-4 space-x-reverse">
          <View className="flex-row-reverse items-center">
             <Calendar color="#6b7280" size={16} />
             <Text className="text-gray-900 font-bold mr-2 text-sm">{item.date}</Text>
          </View>
          <View className="flex-row-reverse items-center">
             <Clock color="#6b7280" size={16} />
             <Text className="text-gray-900 font-bold mr-2 text-sm">{item.time}</Text>
          </View>
      </View>

      <View className="mt-2 flex-row justify-between pt-2">
         <TouchableOpacity 
            onPress={() => openOrderDetails(item)}
            className="flex-row items-center border border-gray-200 px-3 py-2 rounded-xl"
         >
            <Text className="text-gray-700 font-bold mr-2 text-xs">التفاصيل والملحقات</Text>
            <ImageIcon color="#374151" size={16} />
         </TouchableOpacity>

         {item.status === 'SUBMITTED' && (
          <TouchableOpacity 
              onPress={() => handleApproveAssignment(item.id)}
              className="bg-primary px-4 py-2 rounded-xl flex-row justify-center items-center"
          >
              <Text className="text-white font-bold mr-2 text-xs">{t('approveForProviderBtn')}</Text>
          </TouchableOpacity>
         )}

         {item.status === 'WAITING_FOR_PAYMENT' && (
          <TouchableOpacity 
              onPress={() => {
                  const execReceived = () => updateOrderStatus(item.id, 'PAID');
                  if (Platform.OS === 'web') {
                     if (window.confirm(t('confirmPaymentMsg'))) execReceived();
                  } else {
                     Alert.alert(t('confirmPaymentRecv'), t('confirmPaymentMsg'), [
                        { text: t('cancel'), style: 'cancel' },
                        { text: t('confirm'), onPress: execReceived }
                     ]);
                  }
              }}
              className="bg-green-500 border border-green-600 px-4 py-2 rounded-xl flex-row justify-center items-center"
          >
              <Text className="text-white font-bold mr-2 text-xs">{t('cashReceiptBtn')}</Text>
          </TouchableOpacity>
         )}
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-4 px-6 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 text-right">{t('adminOrdersTitle')}</Text>
        <Text className="text-gray-500 text-right mt-1 font-medium pb-2">{t('adminOrdersSubtitle')}</Text>
        
        {/* Dynamic Horizontal Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row-reverse mt-4" contentContainerStyle={{ paddingRight: 4 }}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab.value} 
                onPress={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full ml-2 border ${activeTab === tab.value ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
              >
                <Text className={`font-bold text-sm ${activeTab === tab.value ? 'text-white' : 'text-gray-600'}`}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" className="mt-10" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7e22ce"]} />
          }
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10 font-bold">{t('noOrdersInList')}</Text>}
        />
      )}

      {/* Details & Force Edit Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-surface pt-16 px-6">
           <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                 <Text className="text-primary font-bold text-lg">{t('closeBtn')}</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900 text-right">{t('orderDetailsTitle')}</Text>
           </View>

           {selectedOrder && (
             <ScrollView showsVerticalScrollIndicator={false}>
                <View className="bg-white p-4 rounded-xl border border-gray-100 mb-4 shadow-sm">
                   <Text className="text-gray-500 text-right text-xs mb-2">رقم الطلب: {selectedOrder.id}</Text>
                   <Text className="text-gray-900 font-bold text-xl text-right mb-4">{selectedOrder.services?.name}</Text>
                   
                   <View className="bg-gray-50 p-3 rounded-lg flex-row-reverse items-center justify-between mb-4">
                      <View className="flex-row-reverse items-center">
                         <Phone color="#4b5563" size={18} />
                         <Text className="text-gray-800 font-bold mr-2">{selectedOrder.profiles?.name}</Text>
                      </View>
                      <Text className="text-primary font-bold text-lg" style={{ textAlign: 'left' }}>{selectedOrder.profiles?.phone || t('noCustomerPhone')}</Text>
                   </View>

                   <Text className="text-right text-gray-700 font-bold mb-2">{t('customerNote')}</Text>
                   <Text className="text-right text-gray-600 bg-gray-50 p-4 rounded-xl leading-6">
                      {selectedOrder.notes || t('noCustomerNote')}
                   </Text>
                </View>

                {/* Attachments Mapping */}
                <Text className="text-right text-gray-800 font-bold mb-3 px-2">{t('attachmentsTitle')}</Text>
                {attachments.length === 0 ? (
                  <Text className="text-right text-gray-500 px-2 mb-6">{t('noAttachments')}</Text>
                ) : (
                  <View className="flex-row flex-wrap justify-between mb-6">
                    {attachments.map(att => (
                      <View key={att.id} className="w-[48%] h-32 mb-4 bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
                         <Image source={{ uri: att.image_url }} className="w-full h-full" resizeMode="cover" />
                      </View>
                    ))}
                  </View>
                )}

                {/* Admin Force Overrides */}
                <Text className="text-right text-gray-800 font-bold mb-3 px-2 text-xs">{t('adminForceOverrideStatus')}</Text>
                <View className="flex-row flex-wrap justify-between mb-10">
                   <TouchableOpacity onPress={() => updateOrderStatus(selectedOrder.id, 'SUBMITTED')} className="w-[48%] py-3 bg-gray-100 rounded-lg mb-3 items-center"><Text className="text-gray-700 font-bold">{t('statusNewSubmitted')}</Text></TouchableOpacity>
                   <TouchableOpacity onPress={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')} className="w-[48%] py-3 bg-blue-100 rounded-lg mb-3 items-center"><Text className="text-blue-700 font-bold">{t('statusConfirmedProvider')}</Text></TouchableOpacity>
                   <TouchableOpacity onPress={() => updateOrderStatus(selectedOrder.id, 'WAITING_FOR_PAYMENT')} className="w-[48%] py-3 bg-yellow-100 rounded-lg mb-3 items-center"><Text className="text-yellow-700 font-bold">{t('statusWaitingPay')}</Text></TouchableOpacity>
                   <TouchableOpacity onPress={() => updateOrderStatus(selectedOrder.id, 'PAID')} className="w-[48%] py-3 bg-green-100 rounded-lg mb-3 items-center"><Text className="text-green-700 font-bold">{t('statusPaidDone')}</Text></TouchableOpacity>
                   <TouchableOpacity onPress={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')} className="w-full py-3 bg-red-100 rounded-lg mb-3 items-center"><Text className="text-red-700 font-bold">{t('statusCancelFinal')}</Text></TouchableOpacity>
                </View>
             </ScrollView>
           )}
        </View>
      </Modal>
    </View>
  );
}
