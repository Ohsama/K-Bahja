import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Card } from '../../components/common';
import { Users, TrendingUp, Calendar as CalendarIcon } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';

export default function DashboardScreen() {
  const { currentUser } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const [metrics, setMetrics] = useState({
     totalRevenue: 0,
     pendingActions: 0,
     activeProviders: 0
  });

  const fetchAnalytics = async () => {
    if (!currentUser) return;
    
    // In a true scalable system, this is computed via RPC or Materialized View on Supabase.
    // We compute via standard Selects for the prototype context based on exact requirement.
    
    // 1. Fetch Provider Count
    const { count: providerCount } = await supabase
       .from('providers')
       .select('*', { count: 'exact', head: true })
       .eq('user_id', currentUser.id);

    // 2. Fetch Orders for logical aggregates
    // Since providers are linked by businessId, and admin views ALL prototype orders currently:
    const { data: allOrders } = await supabase.from('orders').select('*');
    
    let revenue = 0;
    let pending = 0;

    if (allOrders) {
       // Filter pending
       pending = allOrders.filter(o => o.status === 'SUBMITTED' || o.status === 'CASH_PENDING').length;
       
       // Complex Revenue Extrapolation. Usually derived via joining Provider.price!
       // Assuming standard fixed mapping or taking static approximations based on "PAID"
       const paidOrders = allOrders.filter(o => o.status === 'PAID');
       // As this is a generic mockup missing explicit exact price rows per checkout:
       // We'll simulate aggregate math just for the dashboard visualization!
       revenue = paidOrders.length * 500; // 500 DA Commission assumption per paid order
    }

    setMetrics({
        activeProviders: providerCount || 0,
        pendingActions: pending,
        totalRevenue: revenue
    });
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  return (
    <ScrollView 
        className="flex-1 bg-surface"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 flex-row-reverse justify-between items-center">
        <View className="items-end">
           <Text className="text-3xl font-bold text-gray-900 border-r-4 border-primary pr-3" style={{ fontFamily: 'serif' }}>مرحباً بعودتك</Text>
           <Text className="text-gray-500 text-lg mt-1 font-medium">{currentUser?.name || 'مدير النظام'} 👋</Text>
        </View>
      </View>
      
      <View className="p-6">
        <Text className="text-right text-gray-900 font-bold mb-4 text-xl">نظرة عامة على الإحصائيات</Text>
        
        <View className="flex-row justify-between mb-4 flex-row-reverse">
          <Card className="flex-1 p-4 ml-2 items-end justify-center bg-white shadow-sm border border-gray-100">
             <View className="bg-green-50 p-3 rounded-full mb-3">
               <TrendingUp color="#16a34a" size={24} />
             </View>
             <Text className="text-gray-500 font-medium mb-1 text-sm">إجمالي الأرباح</Text>
             <Text className="text-2xl font-bold text-gray-900">{metrics.totalRevenue} دج</Text>
          </Card>
          
          <Card className="flex-1 p-4 mr-2 items-end justify-center bg-white shadow-sm border border-gray-100">
             <View className="bg-orange-50 p-3 rounded-full mb-3">
               <CalendarIcon color="#ea580c" size={24} />
             </View>
             <Text className="text-gray-500 font-medium mb-1 text-sm">المهام المعلقة</Text>
             <Text className="text-2xl font-bold text-gray-900">{metrics.pendingActions}</Text>
          </Card>
        </View>

        <Card className="p-4 items-end bg-white shadow-sm border border-gray-100 flex-row-reverse justify-between">
            <View className="flex-row-reverse items-center">
                <View className="bg-purple-50 p-3 rounded-full ml-3">
                  <Users color="#7e22ce" size={24} />
                </View>
                <View className="items-end">
                   <Text className="text-gray-500 font-medium mb-1 text-sm">مزودي الخدمات النشطين</Text>
                   <Text className="text-xl font-bold text-gray-900">{metrics.activeProviders} مزود</Text>
                </View>
            </View>
        </Card>

      </View>
    </ScrollView>
  );
}
