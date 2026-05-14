import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, CreditCard, Plus } from 'lucide-react-native';
import { useAppContext } from '../../context/AppContext';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const { t } = useAppContext();
  const [cards, setCards] = useState([
    { id: '1', number: '**** **** **** 4242', type: t('edahabiaCardName') }
  ]);
  
  const [newCard, setNewCard] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = () => {
    if (newCard.length < 16) {
      return Alert.alert('!', 'يرجى إدخال رقم بطاقة صحيح مكون من 16 رقماً.');
    }
    setCards([...cards, { id: Date.now().toString(), number: `**** **** **** ${newCard.slice(-4)}`, type: t('edahabiaCardName') }]);
    setNewCard('');
    setIsAdding(false);
    Alert.alert('!', 'تمت إضافة البطاقة بنجاح!');
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert('!', 'هل أنت متأكد من حذف هذه البطاقة؟', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('deleteBtn'), style: 'destructive', onPress: () => setCards(cards.filter(c => c.id !== id)) }
    ]);
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 mb-2 flex-row justify-between items-end">
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-gray-50 p-3 rounded-full mb-1">
           <ChevronLeft color="#9ca3af" size={24} />
        </TouchableOpacity>
        <View>
          <Text className="text-3xl font-bold text-gray-900 text-right">{t('paymentMethodsTitle')}</Text>
          <Text className="text-gray-500 text-right mt-1 font-medium">{t('paymentMethodsSubtitle')}</Text>
        </View>
      </View>

      <ScrollView className="p-6">
        {cards.length === 0 ? (
          <Text className="text-center text-gray-500 font-bold mb-6">{t('emptyCardsText')}</Text>
        ) : (
          cards.map(card => (
            <View key={card.id} className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm flex-row-reverse justify-between items-center">
               <View className="flex-row-reverse items-center">
                  <View className="bg-purple-50 p-3 rounded-full ml-4">
                     <CreditCard color="#7e22ce" size={24} />
                  </View>
                  <View className="items-end">
                     <Text className="font-bold text-lg text-gray-900">{card.type}</Text>
                     <Text className="text-gray-500 text-sm mt-1" style={{ letterSpacing: 2 }}>{card.number}</Text>
                  </View>
               </View>
               <TouchableOpacity onPress={() => handleDeleteCard(card.id)} className="bg-red-50 px-3 py-1.5 rounded-lg">
                  <Text className="text-red-500 text-xs font-bold">{t('deleteBtn')}</Text>
               </TouchableOpacity>
            </View>
          ))
        )}

        {isAdding ? (
          <View className="bg-white p-5 rounded-2xl border border-gray-200 mt-4">
             <Text className="text-right font-bold text-gray-700 mb-2">{t('cardNumberLabel')}</Text>
             <TextInput
                value={newCard}
                onChangeText={setNewCard}
                keyboardType="number-pad"
                maxLength={16}
                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center text-lg mb-4"
                placeholder="0000 0000 0000 0000"
                style={{ letterSpacing: 4 }}
             />
             <View className="flex-row justify-between">
                <TouchableOpacity onPress={() => setIsAdding(false)} className="bg-gray-100 p-3 rounded-xl flex-1 mr-2 items-center">
                   <Text className="text-gray-600 font-bold">{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddCard} className="bg-primary p-3 rounded-xl flex-1 ml-2 items-center">
                   <Text className="text-white font-bold">{t('addSaveBtn')}</Text>
                </TouchableOpacity>
             </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsAdding(true)} className="border-2 border-dashed border-primary/30 p-6 rounded-2xl mt-4 items-center bg-purple-50/50">
             <Plus color="#7e22ce" size={24} className="mb-2" />
             <Text className="text-primary font-bold">{t('addNewCardLabel')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
