import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldCheck, AlertOctagon, RefreshCw, LogOut } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';

interface Props {
  status: 'PENDING' | 'REJECTED';
  onRefresh: () => void;
}

export default function PendingApprovalScreen({ status, onRefresh }: Props) {
  const { logout, currentUser } = useAppContext();

  return (
    <View className="flex-1 bg-surface py-16 px-6">
       <View className="flex-row-reverse justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-right">مرحباً {currentUser?.name}</Text>
          <TouchableOpacity onPress={logout} className="p-3 bg-red-50 rounded-full">
             <LogOut color="#ef4444" size={20} />
          </TouchableOpacity>
       </View>

       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {status === 'PENDING' ? (
             <View className="bg-white p-8 rounded-3xl shadow-sm border border-yellow-100 items-center">
                <View className="bg-yellow-50 p-6 rounded-full mb-6">
                   <ShieldCheck color="#eab308" size={64} />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">طلبك قيد المراجعة</Text>
                <Text className="text-gray-500 text-center leading-7 text-lg">
                   لقد قمنا باستلام طلب الانضمام الخاص بك بنجاح. تقوم إدارة المنصة حالياً بمراجعة حسابك والتحقق من هويتك المهنية. 
                   سنقوم بالاتصال بك قريباً!
                </Text>
             </View>
          ) : (
             <View className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 items-center">
                <View className="bg-red-50 p-6 rounded-full mb-6">
                   <AlertOctagon color="#ef4444" size={64} />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">عذراً، تم رفض طلبك</Text>
                <Text className="text-gray-500 text-center leading-7 text-lg">
                   تمت مراجعة معلومات حسابك ولكن للأسف لم يتم قبول طلبك كـ مزود خدمة في منصتنا في الوقت الحالي. 
                   يرجى التواصل مع الدعم الفني لمزيد من التفاصيل.
                </Text>
             </View>
          )}

          <TouchableOpacity 
             onPress={onRefresh}
             className="mt-8 bg-white border border-gray-200 py-4 px-6 rounded-xl flex-row justify-center items-center"
          >
             <Text className="font-bold text-gray-700 mr-2 text-lg">تحديث وتأكد من الحالة</Text>
             <RefreshCw color="#374151" size={20} />
          </TouchableOpacity>
       </ScrollView>
    </View>
  );
}
