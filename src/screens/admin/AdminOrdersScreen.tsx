import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { Card, StatusBadge } from '../../components/common';
import { Calendar, Clock, CheckCircle } from 'lucide-react-native';

export default function AdminOrdersScreen() {
  const { orders, updateOrderStatus } = useAppContext();
  
  // As requested, the Admin can view all orders to manipulate state
  const activeOrders = orders.filter(o => 
    o.status === 'SUBMITTED' || o.status === 'CASH_PENDING' || o.status === 'AWAITING_PAYMENT'
  );

  const handleRequestPayment = (orderId: string) => {
    Alert.alert('تأكيد الموعد', 'هل أنت متأكد من تأكيد هذا الموعد وطلب الدفع من الزبون؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'نعم، أطلب الدفع', onPress: () => updateOrderStatus(orderId, 'AWAITING_PAYMENT') }
    ]);
  };

  const handleConfirmCash = (orderId: string) => {
    Alert.alert('تأكيد استلام النقود', 'هل تؤكد أنك استلمت عمولة الشركة نقداً؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'تأكيد التسديد', onPress: () => updateOrderStatus(orderId, 'PAID') }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card className="mb-4">
        <View className="flex-row justify-between items-start mb-3 bg-gray-50 border border-gray-100 p-3 rounded-xl flex-row-reverse">
          <View className="items-end">
            <Text className="text-sm text-gray-500 font-bold mb-1">طلب رقم: {item.id.slice(0, 8)}</Text>
            <StatusBadge status={item.status} />
          </View>
        </View>

        <View className="flex-row flex-row-reverse items-center justify-between mb-4 mt-2 px-2">
            <View className="flex-row-reverse items-center">
               <Calendar color="#6b7280" size={16} />
               <Text className="text-gray-900 font-bold mr-2 text-base">{item.date}</Text>
            </View>
            <View className="flex-row-reverse items-center">
               <Clock color="#6b7280" size={16} />
               <Text className="text-gray-900 font-bold mr-2 text-base">{item.time}</Text>
            </View>
        </View>

        <View className="mt-2 border-t border-gray-100 pt-4">
            {item.status === 'SUBMITTED' && (
            <TouchableOpacity 
                onPress={() => handleRequestPayment(item.id)}
                className="bg-primary rounded-xl py-3 flex-row justify-center items-center"
            >
                <Text className="text-white font-bold mr-2">تأكيد الموعد وطلب الدفع</Text>
                <CheckCircle color="#ffffff" size={18} />
            </TouchableOpacity>
            )}

            {item.status === 'CASH_PENDING' && (
            <TouchableOpacity 
                onPress={() => handleConfirmCash(item.id)}
                className="bg-green-600 rounded-xl py-3 flex-row justify-center items-center"
            >
                <Text className="text-white font-bold mr-2">تأكيد استلام الدفع النقدي</Text>
                <CheckCircle color="#ffffff" size={18} />
            </TouchableOpacity>
            )}

            {item.status === 'AWAITING_PAYMENT' && (
            <View className="bg-orange-50 rounded-xl py-3 items-center border border-orange-100">
                <Text className="text-orange-600 font-bold">بانتظار دفع الزبون...</Text>
            </View>
            )}
        </View>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2">
        <Text className="text-3xl font-bold text-gray-900 text-right">إدارة الحجوزات</Text>
        <Text className="text-gray-500 text-right mt-1 font-medium">مراقبة الطلبات الواردة وتأكيدها</Text>
      </View>
      
      <FlatList
        data={activeOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-10 font-bold">لا توجد طلبات جديدة حالياً.</Text>}
      />
    </View>
  );
}
