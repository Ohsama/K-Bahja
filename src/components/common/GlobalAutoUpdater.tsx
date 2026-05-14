import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CloudDownload } from 'lucide-react-native';
import { useOTAUpdate } from '../../hooks/useOTAUpdate';
import { useAppContext } from '../../context/AppContext';

export default function GlobalAutoUpdater() {
  const { t } = useAppContext();
  const { checkForUpdates, applyUpdate, updateAvailable, isChecking, isDownloading } = useOTAUpdate();
  
  // Local state to track if user dismissed the popup for this session
  const [dismissed, setDismissed] = useState(false);

  // Trigger silent check purely on launch exactly once
  useEffect(() => {
    if (!__DEV__) {
      checkForUpdates().catch(e => console.log('OTA Check suppressed in DEV'));
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
  };

  // Only render if there's an update available AND user hasn't dismissed it
  const isVisible = updateAvailable && !dismissed;

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true} statusBarTranslucent>
      <View className="flex-1 justify-center items-center px-6 bg-black/60">
        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-lg relative overflow-hidden">
           
           {/* Top Decorator Bar */}
           <View className="absolute top-0 left-0 right-0 h-2 bg-primary" />
           
           {/* Icon Badge */}
           <View className="w-20 h-20 bg-purple-50 rounded-full items-center justify-center mb-4 mt-2">
              <CloudDownload color="#7e22ce" size={36} />
           </View>

           {/* Texts */}
           <Text className="text-2xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Cairo_800ExtraBold' }}>
              {t('updateAvailableTitle')}
           </Text>
           <Text className="text-gray-500 text-center mb-8 leading-6 text-sm px-2">
              {t('updateAvailableDesc')}
           </Text>

           {/* Action Buttons */}
           <View className="w-full space-y-3 flex-col-reverse">
              <TouchableOpacity 
                 onPress={handleDismiss}
                 className="w-full py-4 rounded-xl items-center"
              >
                 <Text className="text-gray-500 font-bold">{t('updateLaterBtn')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                 onPress={applyUpdate}
                 disabled={isDownloading}
                 className={`w-full py-4 rounded-2xl items-center flex-row justify-center ${isDownloading ? 'bg-primary/70' : 'bg-primary shadow-sm'}`}
              >
                 {isDownloading ? (
                    <ActivityIndicator color="white" size="small" />
                 ) : (
                    <Text className="text-white font-bold text-lg">{t('updateNowBtn')}</Text>
                 )}
              </TouchableOpacity>
           </View>
        </View>
      </View>
    </Modal>
  );
}
