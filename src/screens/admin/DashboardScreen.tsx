import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions, FlatList, Image } from 'react-native';
import { Card } from '../../components/common';
import { Users, TrendingUp, Calendar as CalendarIcon, Award, User } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';
import { PieChart, BarChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const { currentUser, t } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const [metrics, setMetrics] = useState({
     totalRevenue: 0,
     pendingActions: 0,
     activeProviders: 0
  });

  const [chartData, setChartData] = useState<{labels: string[], datasets: {data: number[]}[]}>({
     labels: ['-'], datasets: [{ data: [0] }]
  });

  const [providerRanking, setProviderRanking] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    if (!currentUser) return;
    
    // 1. Fetch Global Active/Approved Provider Count
    const { count: providerCount } = await supabase
       .from('providers')
       .select('*', { count: 'exact', head: true })
       .eq('status', 'APPROVED');

    // 2. Fetch Orders with Provider info for analytics
    const { data: allOrders } = await supabase
        .from('orders')
        .select('*, providers(id, name), services(name)');
    
    let revenue = 0;
    let pending = 0;
    
    // Analytics Maps
    const revenueByDate: Record<string, number> = {};
    const profitByProvider: Record<string, {name: string, profit: number}> = {};
    const profitByService: Record<string, number> = {};

    if (allOrders) {
       // Pending actions (SUBMITTED or WAITING)
       pending = allOrders.filter(o => o.status === 'SUBMITTED' || o.status === 'WAITING_FOR_PAYMENT').length;
       
       // Revenue Math based on completed or owed statuses
       const revenueOrders = allOrders.filter(o => ['PAID', 'WAITING_FOR_PAYMENT', 'DONE', 'CASH_PENDING'].includes(o.status));
       
       revenueOrders.forEach(o => {
           const comm = parseFloat(o.commission_due) || 0;
           revenue += comm;

           // Chart formatting by date
           if (o.date) {
               revenueByDate[o.date] = (revenueByDate[o.date] || 0) + comm;
           }

           // Provider Ranking
           if (o.providers?.name) {
               const pId = o.providers.id;
               if (!profitByProvider[pId]) {
                   profitByProvider[pId] = { name: o.providers.name, profit: 0 };
               }
               profitByProvider[pId].profit += comm;
           }

           // Service Pie Chart
           if (o.services?.name) {
               const sName = o.services.name;
               profitByService[sName] = (profitByService[sName] || 0) + comm;
           }
       });

       // Prepare Chart Array (Last 5 Active Days)
       const sortedDates = Object.keys(revenueByDate).sort().slice(-5);
       if (sortedDates.length > 0) {
           setChartData({
              labels: sortedDates.map(d => d.slice(5)), // Cut off year for display
              datasets: [{ data: sortedDates.map(d => revenueByDate[d]) }]
           });
       }

       // Prepare Ranking Array
       const ranked = Object.values(profitByProvider).sort((a, b) => b.profit - a.profit);
       setProviderRanking(ranked);

       // Prepare Pie Chart Array
       const predefinedColors = ['#f472b6', '#a855f7', '#fbbf24', '#38bdf8', '#34d399', '#f87171'];
       let colorIndex = 0;
       const pieData = Object.keys(profitByService).map(serviceName => {
           const val = profitByService[serviceName];
           const entry = {
               name: serviceName,
               profit: val,
               color: predefinedColors[colorIndex % predefinedColors.length],
               legendFontColor: '#374151',
               legendFontSize: 12
           };
           colorIndex++;
           return entry;
       }).sort((a,b) => b.profit - a.profit);
       setPieChartData(pieData);
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
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 flex-row-reverse justify-between items-center shadow-sm">
        <View className="items-end flex-1">
           <Text className="text-3xl font-bold text-gray-900 border-r-4 border-primary pr-3" style={{ fontFamily: 'serif' }}>{t('adminDashboardWelcome')}</Text>
           <Text className="text-gray-500 text-lg mt-1 font-medium">{currentUser?.name || t('adminDashboardSubtitle')} 👋</Text>
        </View>
        <View className="w-16 h-16 rounded-full border-2 border-primary/20 bg-gray-50 items-center justify-center overflow-hidden shadow-sm ml-4">
           {currentUser?.avatar_url ? (
              <Image source={{ uri: currentUser.avatar_url }} className="w-full h-full" resizeMode="cover" />
           ) : (
              <User color="#9ca3af" size={30} />
           )}
        </View>
      </View>
      
      <View className="p-6">
        <Text className="text-right text-gray-900 font-bold mb-4 text-xl">{t('adminDashboardStatsOverview')}</Text>
        
        <View className="flex-row justify-between mb-6">
           <View className="bg-white p-4 rounded-2xl flex-1 ml-2 border border-blue-50 shadow-sm items-center">
              <View className="bg-blue-100 p-3 rounded-full mb-2"><Users color="#2563eb" size={24} /></View>
              <Text className="text-3xl font-bold text-gray-900 mb-1">{metrics.activeProviders}</Text>
              <Text className="text-xs text-gray-500 text-center font-bold">{t('adminDashboardActiveProviders')}</Text>
           </View>
           <View className="bg-white p-4 rounded-2xl flex-1 mr-2 border border-orange-50 shadow-sm items-center">
              <View className="bg-orange-100 p-3 rounded-full mb-2"><CalendarIcon color="#ea580c" size={24} /></View>
              <Text className="text-3xl font-bold text-gray-900 mb-1">{metrics.pendingActions}</Text>
              <Text className="text-xs text-gray-500 text-center font-bold">{t('adminDashboardPendingActions')}</Text>
           </View>
        </View>

        <View className="bg-gray-900 p-6 rounded-3xl mb-8 shadow-md border border-gray-800 flex-row-reverse items-center justify-between">
           <View className="items-end">
              <Text className="text-gray-400 font-bold mb-1 text-sm uppercase tracking-wider">{t('adminDashboardTotalRevenue')}</Text>
              <Text className="text-4xl font-bold text-white tracking-widest">{metrics.totalRevenue.toLocaleString()} <Text className="text-lg text-green-400 font-bold">DZD</Text></Text>
           </View>
           <View className="bg-green-500/20 p-4 rounded-2xl border border-green-500/30">
              <TrendingUp color="#4ade80" size={32} />
           </View>
        </View>

        {/* --- Analytics Charts --- */}
        <Text className="text-right text-gray-900 font-bold mb-4 text-xl mt-4">{t('adminProfitAnalytics')}</Text>
        <Card className="bg-white p-4 items-center justify-center border border-gray-100 mb-8 w-full shadow-sm">
           <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 80} // Window width - padding
              height={220}
              yAxisLabel="دج "
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(126, 34, 206, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: { borderRadius: 16 },
                barPercentage: 0.6,
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
              fromZero
              showValuesOnTopOfBars
           />
        </Card>

        {/* --- Service Profit Share (Percentage) --- */}
        <Text className="text-right text-gray-900 font-bold mb-4 text-xl">{t('adminProfitByService')}</Text>
        <Card className="bg-white p-4 items-center justify-center border border-gray-100 mb-8 w-full shadow-sm">
           {pieChartData.length === 0 ? (
               <Text className="text-center text-gray-500 p-6 font-bold">{t('noProfitsYet')}</Text>
           ) : (
               <PieChart
                   data={pieChartData}
                   width={Dimensions.get('window').width - 80}
                   height={200}
                   chartConfig={{
                     backgroundColor: '#ffffff',
                     backgroundGradientFrom: '#ffffff',
                     backgroundGradientTo: '#ffffff',
                     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                   }}
                   accessor="profit"
                   backgroundColor="transparent"
                   paddingLeft="15"
                   absolute
               />
           )}
        </Card>

        {/* --- Provider Rankings --- */}
        <Text className="text-right text-gray-900 font-bold mb-4 text-xl">{t('adminTopProviders')}</Text>
        <Card className="bg-white p-2 border border-gray-100 mb-10 w-full shadow-sm">
           {providerRanking.length === 0 ? (
              <Text className="text-center text-gray-500 p-6 font-bold">{t('noProfitsYet')}</Text>
           ) : (
              providerRanking.map((provider, index) => (
                 <View key={index} className={`flex-row-reverse justify-between items-center p-4 ${index !== providerRanking.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <View className="flex-row-reverse items-center flex-1">
                       <View className={`w-8 h-8 rounded-full items-center justify-center ml-3 ${index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-50' : 'bg-purple-50'}`}>
                          {index < 3 ? <Award color={index === 0 ? '#ca8a04' : index === 1 ? '#6b7280' : '#ea580c'} size={18} /> : <Text className="font-bold text-primary">{index + 1}</Text>}
                       </View>
                       <Text className="font-bold text-gray-900 text-base">{provider.name}</Text>
                    </View>
                    <View className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
                       <Text className="text-green-700 font-bold">{provider.profit} دج</Text>
                    </View>
                 </View>
              ))
           )}
        </Card>

      </View>
    </ScrollView>
  );
}
