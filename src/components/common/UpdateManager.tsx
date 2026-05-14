import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useOTAUpdate } from '../../hooks/useOTAUpdate';
import { DownloadCloud, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';

export const UpdateManager = () => {
  const { isChecking, isDownloading, updateAvailable, isUpToDate, error, checkForUpdates, applyUpdate } = useOTAUpdate();
  const { t } = useAppContext();

  return (
    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
       <View className="flex-row-reverse justify-between items-center mb-4">
           <View className="flex-row-reverse items-center">
              <View className="bg-primary/10 p-2 rounded-full ml-3">
                 <RefreshCw color="#a21caf" size={20} />
              </View>
              <Text className="text-lg font-bold text-gray-900 text-right">{t('appUpdateTitle')}</Text>
           </View>
       </View>

       <Text className="text-gray-500 text-right mb-4 leading-5 text-sm">
          {t('appUpdateDesc')}
       </Text>

       {error && (
         <View className="bg-red-50 p-3 rounded-lg flex-row-reverse items-center mb-4">
            <AlertCircle color="#ef4444" size={16} className="ml-2" />
            <Text className="text-red-700 text-xs flex-1 text-right">{error}</Text>
         </View>
       )}

       {updateAvailable && !isDownloading && (
          <View className="bg-green-50 p-3 rounded-lg flex-row-reverse items-center mb-4">
            <CheckCircle color="#10b981" size={16} className="ml-2" />
            <Text className="text-green-700 text-xs flex-1 text-right">{t('appUpdateSuccess')}</Text>
          </View>
       )}

       {isUpToDate && !updateAvailable && !isChecking && !isDownloading && (
          <View className="bg-blue-50 p-3 rounded-lg flex-row-reverse items-center mb-4 border border-blue-100">
             <CheckCircle color="#3b82f6" size={16} className="ml-2" />
             <Text className="text-blue-700 text-xs flex-1 text-right">{t('appUpdateUpToDate')}</Text>
          </View>
       )}

       {updateAvailable && !isDownloading ? (
           <TouchableOpacity 
             onPress={applyUpdate}
             className="bg-green-600 rounded-xl py-3 items-center"
           >
              <Text className="text-white font-bold">{t('appUpdateApplyBtn')}</Text>
           </TouchableOpacity>
       ) : (
           <TouchableOpacity 
             onPress={checkForUpdates}
             disabled={isChecking || isDownloading}
             className={`rounded-xl py-3 items-center flex-row justify-center ${isChecking || isDownloading ? 'bg-gray-100' : 'bg-gray-50 border border-gray-200'}`}
           >
              {isChecking ? (
                 <>
                    <ActivityIndicator color="#a21caf" size="small" />
                    <Text className="text-primary font-bold mr-2">{t('appUpdateSearching')}</Text>
                 </>
              ) : isDownloading ? (
                <>
                    <ActivityIndicator color="#a21caf" size="small" />
                    <Text className="text-primary font-bold mr-2">{t('appUpdateDownloading')}</Text>
                 </>
              ) : (
                 <>
                    <Text className="text-primary font-bold">{t('appUpdateCheckBtn')}</Text>
                    <DownloadCloud color="#a21caf" size={18} className="ml-2" />
                 </>
              )}
           </TouchableOpacity>
       )}
    </View>
  );
};
