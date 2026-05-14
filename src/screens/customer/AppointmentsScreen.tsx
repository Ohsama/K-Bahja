import React, { useState } from 'react';
import { View, Text, FlatList, Modal, ActivityIndicator, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { Card, StatusBadge, AppButton } from '../../components/common';
import { Calendar, Clock, CreditCard, Banknote, CheckCircle } from 'lucide-react-native';

export default function AppointmentsScreen() {
  const { orders, currentUser, updateOrderStatus, refreshOrders, t } = useAppContext();
  
  // Filter orders by the current customer
  const myOrders = orders.filter(o => o.customerId === currentUser?.id);
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (refreshOrders) {
       await refreshOrders();
    }
    setRefreshing(false);
  };
  
  // Payment Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [processingDelay, setProcessingDelay] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const startPayment = (orderId: string) => {
    setPaymentOrder(orderId);
    setShowPayment(true);
  };

  const handleCardPay = () => {
    setProcessingDelay(true);
    // Simulate Edhahabia/CIB Gateway validation network delay
    setTimeout(() => {
      if (paymentOrder) {
        updateOrderStatus(paymentOrder, 'PAID');
      }
      setProcessingDelay(false);
      setShowSuccess(true);
      
      // Delay dismissing so user sees victory
      setTimeout(() => {
          setShowSuccess(false);
          setShowPayment(false);
          setPaymentOrder(null);
      }, 1500);

    }, 3000);
  };

  const handleCashPay = () => {
    if (paymentOrder) {
        updateOrderStatus(paymentOrder, 'CASH_PENDING');
    }
    setShowPayment(false);
    setPaymentOrder(null);
    Alert.alert(t('cashAlertTitle'), t('cashAlertDesc'));
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card className="mb-4">
        <View className="flex-row justify-between items-start mb-3 bg-gray-50 border border-gray-100 p-3 rounded-xl flex-row-reverse">
          <View className="items-end">
            <Text className="text-sm text-gray-500 font-bold mb-1">{t('orderIdPrefix')}{item.id.slice(0, 8)}</Text>
            <StatusBadge status={item.status} />
          </View>
        </View>

        <View className="flex-row items-center justify-between px-2 mb-4 mt-2 flex-row-reverse">
          <View className="flex-row-reverse items-center">
            <Calendar color="#6b7280" size={16} />
            <Text className="text-gray-900 font-bold mr-2">{item.date}</Text>
          </View>
          <View className="flex-row-reverse items-center">
            <Clock color="#6b7280" size={16} />
            <Text className="text-gray-900 font-bold mr-2">{item.time}</Text>
          </View>
        </View>

        {item.status === 'AWAITING_PAYMENT' && (
          <View className="mt-2 border-t border-gray-100 pt-4">
             <AppButton 
                title={t('payNowToAuth')} 
                variant="primary" 
                onPress={() => startPayment(item.id)}
             />
          </View>
        )}

        {item.status === 'CASH_PENDING' && (
          <View className="mt-2 border-t border-gray-100 pt-4 items-center flex-row-reverse justify-center bg-orange-50 rounded-xl py-3 border border-orange-100">
             <Banknote color="#f97316" size={18} />
             <Text className="text-orange-600 font-bold mr-2">{t('payCashToProvider')}</Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2">
        <Text className="text-3xl font-bold text-gray-900 text-right">{t('myAppointmentsTitle')}</Text>
      </View>
      
      <FlatList
        data={myOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10 font-bold">{t('noAppointments')}</Text>}
      />

      {/* Payment Gateway Modal */}
      <Modal visible={showPayment} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-3xl p-6 min-h-[350px]">
             
            <View className="flex-row justify-between items-center mb-6 relative">
              <TouchableOpacity onPress={() => !processingDelay && setShowPayment(false)} className="bg-gray-100 p-2 rounded-full z-10">
                <Text className="text-gray-500 font-bold">X</Text>
              </TouchableOpacity>
              <View className="absolute w-full z-0 items-center">
                 <Text className="text-2xl font-bold text-gray-900">{t('paymentMethodModal')}</Text>
              </View>
            </View>
            <Text className="text-gray-500 text-center mb-6 font-medium">{t('paymentGatewaySubtitle')}</Text>
            
            {showSuccess ? (
               <View className="items-center justify-center py-8">
                 <View className="bg-green-100 p-4 rounded-full mb-4">
                    <CheckCircle color="#16a34a" size={60} />
                 </View>
                 <Text className="text-green-600 font-bold text-xl">{t('successOp')}</Text>
                 <Text className="text-gray-500 mt-2">{t('successPaidCib')}</Text>
               </View>
            ) : processingDelay ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#7e22ce" />
                <Text className="text-primary font-bold mt-4 text-lg">{t('processingCIB')}</Text>
                <Text className="text-gray-400 text-sm mt-2">{t('dontCloseWindow')}</Text>
              </View>
            ) : (
              <View className="space-y-4">
                <TouchableOpacity 
                   onPress={handleCardPay}
                   className="bg-primary rounded-2xl py-4 flex-row-reverse justify-center items-center mb-3"
                >
                   <CreditCard color="#ffffff" size={24} />
                   <Text className="text-white font-bold text-lg mr-3">{t('edahabiaCib')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                   onPress={handleCashPay}
                   className="bg-white border-2 border-primary rounded-2xl py-4 flex-row-reverse justify-center items-center"
                >
                   <Banknote color="#7e22ce" size={24} />
                   <Text className="text-primary font-bold text-lg mr-3">{t('payCashOnArrival')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
