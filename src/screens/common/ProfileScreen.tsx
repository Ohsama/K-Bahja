import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { Settings, User, CreditCard, LogOut, ShieldCheck, ChevronLeft } from 'lucide-react-native';

export default function ProfileScreen() {
  const { currentUser, logout } = useAppContext();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert('تسجيل الخروج', 'هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟', [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'تأكيد', 
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
          } catch(e) {
            console.error("Logout failed", e);
          } finally {
             // Let the AppNavigator natively switch to AuthStack via context update
             setLoggingOut(false);
          }
        }
      }
    ]);
  };

  const renderOption = (icon: React.ReactNode, title: string, subtitle?: string, showArrow: boolean = true) => (
    <TouchableOpacity className="flex-row-reverse items-center p-5 bg-white border-b border-gray-50 active:bg-gray-50">
       <View className="bg-purple-50 p-2 rounded-full ml-4">
          {icon}
       </View>
       <View className="flex-1 items-end">
          <Text className="text-gray-900 font-bold text-lg">{title}</Text>
          {subtitle && <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>}
       </View>
       {showArrow && <ChevronLeft color="#cbdbdf" size={20} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-surface">
       <View className="bg-primary px-6 pt-20 pb-8 rounded-b-3xl items-center relative shadow-sm">
           <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center border-4 border-white mb-4">
              <User color="#ffffff" size={48} />
           </View>
           <Text className="text-2xl font-bold text-white mb-1">{currentUser?.name}</Text>
           <Text className="text-white/80 font-medium mb-3">{currentUser?.email}</Text>
           
           <View className="flex-row-reverse items-center bg-black/20 px-4 py-1.5 rounded-full">
              <ShieldCheck color="#ffffff" size={16} />
              <Text className="text-white font-bold ml-2 text-sm">
                {currentUser?.role === 'admin' ? 'مدير النظام' : 'زبون مميز'}
              </Text>
           </View>
       </View>

       <View className="p-6">
          <Text className="text-right text-gray-500 font-bold mb-4 text-sm mt-2">الحساب والإعدادات</Text>
          
          <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
             {renderOption(<User color="#7e22ce" size={24} />, 'المعلومات الشخصية', 'تعديل التفضيلات واسم العرض')}
             {renderOption(<Settings color="#7e22ce" size={24} />, 'إعدادات الحساب', 'تغيير كلمة المرور وتفضيلات الإشعارات')}
             {currentUser?.role === 'customer' && renderOption(<CreditCard color="#7e22ce" size={24} />, 'طرق الدفع', 'إدارة البطاقات المرتبطة')}
          </View>

          <TouchableOpacity 
             onPress={handleLogout}
             disabled={loggingOut}
             className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-red-100 flex-row-reverse items-center justify-center p-5 ${loggingOut ? 'opacity-50' : ''}`}
          >
             {loggingOut ? (
                <ActivityIndicator color="#ef4444" size="small" />
             ) : (
                <>
                  <LogOut color="#ef4444" size={24} />
                  <Text className="text-red-500 font-bold text-lg mr-3">تسجيل الخروج</Text>
                </>
             )}
          </TouchableOpacity>
       </View>
    </ScrollView>
  );
}
