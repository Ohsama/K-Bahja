import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MapPin, X, ChevronDown } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { LocationData } from '../../data/mockData';
import { AppButton } from '../common';

interface LocationPickerProps {
  onLocationSelected: (dairaId: string, locationLabel: string) => void;
  currentLabel?: string;
}

export const LocationPicker = ({ onLocationSelected, currentLabel = 'كل المدن' }: LocationPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<LocationData[]>([]);
  
  const [uniqueWilayas, setUniqueWilayas] = useState<string[]>([]);
  
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [selectedDaira, setSelectedDaira] = useState<LocationData | null>(null);

  // States for the active dropdown list
  const [activeList, setActiveList] = useState<'WILAYA' | 'DAIRA' | null>(null);

  useEffect(() => {
    if (modalVisible && locations.length === 0) {
      fetchLocations();
    }
  }, [modalVisible]);

  const fetchLocations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('locations').select('*');
    if (!error && data) {
      setLocations(data);
      const wilayas = Array.from(new Set(data.map((l: any) => l.wilaya_name)));
      setUniqueWilayas(wilayas);
    }
    setLoading(false);
  };

  const availableDairas = selectedWilaya 
    ? locations.filter(l => l.wilaya_name === selectedWilaya) 
    : [];

  const handleApply = () => {
    if (selectedDaira) {
      onLocationSelected(selectedDaira.id, `${selectedDaira.daira_name}، ${selectedWilaya}`);
    } else {
      // Clear filter
      onLocationSelected('', 'كل المدن');
    }
    setModalVisible(false);
  };

  const renderDropdownList = () => {
    if (activeList === 'WILAYA') {
      return (
        <FlatList
          data={uniqueWilayas}
          keyExtractor={(item) => item}
          style={{ maxHeight: 250 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className={`p-4 border-b border-gray-100 ${selectedWilaya === item ? 'bg-purple-50' : 'bg-white'}`}
              onPress={() => {
                setSelectedWilaya(item);
                setSelectedDaira(null);
                setActiveList(null);
              }}
            >
              <Text className="text-right text-gray-800 text-lg">{item}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    if (activeList === 'DAIRA') {
      return (
        <FlatList
          data={availableDairas}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 250 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className={`p-4 border-b border-gray-100 ${selectedDaira?.id === item.id ? 'bg-purple-50' : 'bg-white'}`}
              onPress={() => {
                setSelectedDaira(item);
                setActiveList(null);
              }}
            >
              <Text className="text-right text-gray-800 text-lg">{item.daira_name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        className="flex-row items-center border border-white/20 px-3 py-1 rounded-full bg-black/10"
      >
        <Text className="text-white font-medium mr-1 text-sm">{currentLabel}</Text>
        <MapPin color="#ffffff" size={16} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 min-h-[400px]">
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                <X color="#4b5563" size={20} />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900">اختر المدينة</Text>
              <View style={{ width: 36 }} /> 
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#7e22ce" className="mt-10" />
            ) : (
              <View className="space-y-4">
                
                {/* Wilaya Picker */}
                <View>
                  <Text className="text-right font-bold text-gray-700 mb-2">الولاية</Text>
                  <TouchableOpacity 
                    onPress={() => setActiveList(activeList === 'WILAYA' ? null : 'WILAYA')}
                    className="border border-gray-200 p-4 rounded-xl flex-row justify-between items-center bg-gray-50"
                  >
                    <ChevronDown color="#9ca3af" size={20} />
                    <Text className="text-lg text-gray-900">{selectedWilaya || 'اختر الولاية...'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Daira Picker */}
                <View className="mt-4">
                  <Text className="text-right font-bold text-gray-700 mb-2">الدائرة</Text>
                  <TouchableOpacity 
                    onPress={() => selectedWilaya && setActiveList(activeList === 'DAIRA' ? null : 'DAIRA')}
                    disabled={!selectedWilaya}
                    className={`border p-4 rounded-xl flex-row justify-between items-center ${!selectedWilaya ? 'border-gray-100 bg-gray-100' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <ChevronDown color={selectedWilaya ? "#9ca3af" : "#d1d5db"} size={20} />
                    <Text className={`text-lg ${selectedWilaya ? 'text-gray-900' : 'text-gray-400'}`}>
                      {selectedDaira ? selectedDaira.daira_name : 'اختر الدائرة...'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Dropdown Container */}
                <View className="mt-4">
                   {renderDropdownList()}
                </View>

                <View className="flex-1 justify-end mt-6">
                  <AppButton 
                    title="تطبيق الفلتر"
                    onPress={handleApply}
                    variant="primary"
                    disabled={!selectedDaira && currentLabel !== 'كل المدن'}
                  />
                  {selectedDaira && (
                     <AppButton 
                     title="مسح الاختيار"
                     onPress={() => {
                        setSelectedWilaya(null);
                        setSelectedDaira(null);
                        onLocationSelected('', 'كل المدن');
                        setModalVisible(false);
                     }}
                     variant="outline"
                     className="mt-2"
                   />
                  )}
                </View>

              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};
