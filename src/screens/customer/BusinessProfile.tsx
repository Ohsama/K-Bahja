import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, TextInput, FlatList, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppButton } from '../../components/common';
import { Star, MapPin, ChevronLeft, ShieldCheck, Camera, X, CheckCircle, Calendar, Clock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAppContext } from '../../context/AppContext';

export default function BusinessProfile() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { businessId } = route.params;
  const { currentUser } = useAppContext();

  // State mapping
  const [business, setBusiness] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModal, setBookingModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<{uri: string, base64?: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestedDate, setRequestedDate] = useState<Date>(new Date());
  const [requestedTime, setRequestedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Review State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchEverything();
  }, [businessId, currentUser]);

  const fetchEverything = async () => {
    setLoading(true);
    
    // 1. Fetch Business
    const { data: bData } = await supabase.from('providers').select('*, locations(daira_name, wilaya_name), services(name)').eq('id', businessId).single();
    if (bData) {
        setBusiness({
            ...bData,
            locationString: bData.locations ? `${bData.locations.daira_name}، ${bData.locations.wilaya_name}` : 'غير محدد',
            categoryName: bData.services ? bData.services.name : 'خدمة'
        });
    }

    // 2. Fetch Posts
    const { data: pData } = await supabase.from('provider_posts').select('*').eq('provider_id', businessId).order('created_at', { ascending: false });
    if (pData) setPosts(pData);

    // 3. Fetch Reviews
    const { data: rData } = await supabase.from('provider_reviews').select('*, profiles(name)').eq('provider_id', businessId).order('created_at', { ascending: false });
    if (rData) setReviews(rData);

    // 4. Check if Current User is Allowed to Review (Has a DONE order & hasn't reviewed yet)
    if (currentUser) {
       const { data: orderData } = await supabase.from('orders').select('id').eq('customer_id', currentUser.id).eq('provider_id', businessId).eq('status', 'DONE').limit(1);
       const { data: existingReview } = await supabase.from('provider_reviews').select('id').eq('customer_id', currentUser.id).eq('provider_id', businessId).limit(1);
       if (orderData && orderData.length > 0 && (!existingReview || existingReview.length === 0)) {
          setCanReview(true);
       }
    }

    setLoading(false);
  };

  const handleBookingStart = () => {
    if (!currentUser) return Alert.alert('تنبيه', 'يجب تسجيل الدخول أولاً لإتمام الحجز.');
    if (!currentUser.phone || currentUser.phone.trim() === '') {
        return Alert.alert('رقم الهاتف مطلوب', 'الرجاء الدخول إلى حسابك (Profile) وإضافة رقم هاتفك لكي يتمكن صاحب الخدمة من التواصل معك لتأكيد الحجز.', [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'الذهاب لحسابي', onPress: () => navigation.navigate('Profile') }
        ]);
    }
    setBookingModal(true);
  };

  const pickImage = async () => {
    if (attachments.length >= 4) return Alert.alert('الحد الأقصى', 'يمكنك إرفاق 4 صور كحد أقصى.');
    const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        quality: 0.7, 
        base64: true 
    });
    if (!result.canceled && result.assets[0]) {
      setAttachments([...attachments, { uri: result.assets[0].uri, base64: result.assets[0].base64 || undefined }]);
    }
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
        // 1. Create the Order
        const { data: orderData, error: orderError } = await supabase
           .from('orders')
           .insert([{
               provider_id: businessId,
               customer_id: currentUser!.id,
               service_id: business.service_id,
               date: requestedDate.toISOString().split('T')[0],
               time: `${requestedTime.getHours().toString().padStart(2, '0')}:${requestedTime.getMinutes().toString().padStart(2, '0')}`,
               notes: notes,
               status: 'SUBMITTED',
               payment_method: 'CASH'
           }])
           .select()
           .single();
           
        if (orderError) throw orderError;
        const newOrderId = orderData.id;

        // 2. Upload Attachments safely
        if (attachments.length > 0) {
            for (let attachment of attachments) {
                const fileName = `order_${newOrderId}_${Date.now()}.jpg`;

                let arrayBuffer;
                if (attachment.base64) {
                    arrayBuffer = decode(attachment.base64);
                } else {
                    const response = await fetch(attachment.uri);
                    arrayBuffer = await response.arrayBuffer();
                }

                const { error: uploadError } = await supabase.storage.from('order-attachments').upload(fileName, arrayBuffer, { contentType: 'image/jpeg' });
                if (!uploadError) {
                   const { data: pbUrl } = supabase.storage.from('order-attachments').getPublicUrl(fileName);
                   await supabase.from('order_attachments').insert([{ order_id: newOrderId, image_url: pbUrl.publicUrl }]);
                } else {
                   console.error("Upload Error inside Supabase Storage:", uploadError);
                }
            }
        }

        setBookingModal(false);
        if (Platform.OS === 'web') {
           window.alert('تم إرسال الطلب بنجاح! تم تحويل طلبك لمدير المنصة وهو قيد المراجعة.');
           navigation.goBack();
        } else {
           Alert.alert('تم إرسال الطلب بنجاح!', 'تم تحويل طلبك لمدير المنصة وهو قيد المراجعة.', [{ text: 'حسناً', onPress: () => navigation.goBack() }]);
        }
    } catch (e: any) {
        console.error("Booking Error:", e);
        if (Platform.OS === 'web') {
           window.alert('خطأ: تعذر إرسال الطلب. حاول مجدداً.');
        } else {
           Alert.alert('خطأ', 'تعذر إرسال الطلب. حاول مجدداً.');
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const submitReview = async () => {
      if (!reviewText) return Alert.alert('خطأ', 'الرجاء كتابة تعليقك.');
      setSubmittingReview(true);
      try {
         await supabase.from('provider_reviews').insert([{
             provider_id: businessId,
             customer_id: currentUser!.id,
             rating: rating,
             comment: reviewText
         }]);
         Alert.alert('شكراً', 'تم حفظ تقييمك بنجاح.');
         setCanReview(false);
         fetchEverything();
      } catch (e) {
          Alert.alert('خطأ', 'فشل إضافة التقييم.');
      } finally {
          setSubmittingReview(false);
      }
  };

  if (loading || !business) {
    return (
        <View className="flex-1 items-center justify-center bg-surface"><ActivityIndicator size="large" color="#7e22ce" /></View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Header Image */}
        <View className="relative w-full h-72 bg-gray-200">
          {business.image_url ? (
            <Image source={{ uri: business.image_url }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-primary/10 items-center justify-center"><Text className="text-primary opacity-30 text-8xl font-bold">{business.name[0]}</Text></View>
          )}
          <View className="absolute top-12 left-4 z-10 w-full flex-row"><TouchableOpacity onPress={() => navigation.goBack()} className="bg-black/30 p-3 rounded-full ml-2"><ChevronLeft color="#ffffff" size={24} /></TouchableOpacity></View>
          <View className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />
        </View>

        <View className="px-6 -mt-8 relative z-20 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 items-end">
             <Text className="text-3xl font-bold text-gray-900 mb-1">{business.name}</Text>
             <Text className="text-primary font-bold mb-3">{business.categoryName}</Text>
             
             <View className="flex-row-reverse items-center justify-between w-full mb-4">
                <View className="flex-row-reverse items-center">
                    <Star color="#f59e0b" size={20} fill="#f59e0b" />
                    <Text className="text-gray-900 font-bold ml-1 text-lg">{business.rating || '5.0'}</Text>
                </View>
                <View className="flex-row-reverse items-center">
                    <MapPin color="#6b7280" size={18} />
                    <Text className="text-gray-500 font-medium ml-1">{business.locationString}</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Portfolio Posts */}
        {posts.length > 0 && (
          <View className="px-6 mb-6">
             <Text className="text-xl font-bold text-gray-900 text-right mb-4">معرض الأعمال</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row-reverse -mr-4" contentContainerStyle={{ paddingRight: 16 }}>
                {posts.map(post => (
                  <View key={post.id} className="w-64 bg-white rounded-2xl overflow-hidden ml-4 shadow-sm border border-gray-100">
                     {post.image_url && <Image source={{ uri: post.image_url }} className="w-full h-48 bg-gray-100" resizeMode="cover" />}
                     {post.caption && <Text className="p-3 text-right text-gray-700 text-sm">{post.caption}</Text>}
                  </View>
                ))}
             </ScrollView>
          </View>
        )}

        {/* Reviews Section */}
        <View className="px-6 mb-6">
           <Text className="text-xl font-bold text-gray-900 text-right mb-4">آراء الزبائن</Text>
           {reviews.map(r => (
             <View key={r.id} className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100 items-end">
                <View className="flex-row-reverse justify-between items-center w-full mb-2">
                   <Text className="font-bold text-gray-800">{r.profiles?.name}</Text>
                   <View className="flex-row-reverse"><Star color="#f59e0b" size={14} fill="#f59e0b" /><Text className="font-bold text-gray-600 text-xs ml-1">{r.rating}</Text></View>
                </View>
                <Text className="text-gray-600 text-right text-sm">{r.comment}</Text>
             </View>
           ))}
           {reviews.length === 0 && <Text className="text-center text-gray-500 my-4">لا توجد تقييمات بعد.</Text>}

           {canReview && (
             <View className="bg-purple-50 border border-purple-100 p-4 rounded-2xl mt-4 items-end">
                <Text className="font-bold text-gray-900 mb-2">أضف تقييمك</Text>
                <Text className="text-xs text-gray-500 mb-4 text-right">نظراً لكونك أتممت طلبك مع هذا المزود، يمكنك إضافة تقييم.</Text>
                
                <View className="flex-row-reverse mb-4">
                  {[1,2,3,4,5].map(star => (
                     <TouchableOpacity key={star} onPress={() => setRating(star)} className="ml-2">
                       <Star color={star <= rating ? "#f59e0b" : "#d1d5db"} size={32} fill={star <= rating ? "#f59e0b" : "transparent"} />
                     </TouchableOpacity>
                  ))}
                </View>
                
                <TextInput value={reviewText} onChangeText={setReviewText} multiline className="bg-white p-3 rounded-lg w-full text-right h-24 mb-3 border border-gray-200" placeholder="اكتب تجربتك..." />
                <TouchableOpacity onPress={submitReview} disabled={submittingReview} className="bg-primary px-6 py-2 rounded-lg w-full items-center">
                   {submittingReview ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">إرسال التقييم</Text>}
                </TouchableOpacity>
             </View>
           )}
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Floating Action Strip */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-6 flex-row-reverse justify-between items-center z-50">
         <View className="items-end"><Text className="text-gray-500 text-sm font-medium mb-1">يبدأ من</Text><Text className="text-2xl font-bold text-primary">{business.price_range || 'حسب الطلب'}</Text></View>
         <AppButton title="طلب حجز الآن" onPress={handleBookingStart} variant="primary" className="w-1/2" />
      </View>

      {/* Booking Modal (Payment & Attachments) */}
      <Modal visible={bookingModal} animationType="slide" transparent={true}>
         <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl h-[85%] overflow-hidden relative">
               <KeyboardAwareScrollView 
                   enableOnAndroid={true} 
                   extraScrollHeight={20}
                   contentContainerStyle={{ padding: 24, paddingBottom: 60 }} 
                   keyboardShouldPersistTaps="handled"
                   showsVerticalScrollIndicator={false}
               >
               <View className="flex-row justify-between items-center mb-6">
                  <TouchableOpacity onPress={() => { setIsSubmitting(false); setBookingModal(false); }}><X color="#6b7280" size={24} /></TouchableOpacity>
                  <Text className="text-2xl font-bold text-gray-900 text-right">إتمام الحجز</Text>
               </View>

               <View>
                  <Text className="text-right text-gray-800 font-bold mb-3">طريقة الدفع</Text>
                  
                  {/* Edhahabia (Disabled) */}
                  <View className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex-row-reverse justify-between items-center mb-3 opacity-60">
                     <Text className="text-gray-600 font-bold text-lg">البطاقة الذهبية (Edhahabia)</Text>
                     <View className="bg-gray-300 px-2 py-1 rounded-md"><Text className="text-gray-600 text-xs font-bold">قريباً</Text></View>
                  </View>

                  {/* Cash (Active) */}
                  <View className="bg-green-50 p-4 rounded-xl border-2 border-green-500 flex-row-reverse justify-between items-center mb-6">
                     <Text className="text-green-800 font-bold text-lg">الدفع نقداً للمزود المباشر</Text>
                     <CheckCircle color="#10b981" size={24} />
                  </View>

                  <Text className="text-right text-gray-800 font-bold mb-3">توقيت الحجز المرغوب</Text>
                  <View className="flex-row-reverse justify-between items-center mb-6">
                     <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-xl ml-2 flex-row-reverse justify-between items-center">
                         <View className="items-end">
                            <Text className="text-gray-500 text-xs font-bold mb-1">تاريخ الحجز</Text>
                            <Text className="text-gray-900 font-bold text-base">{requestedDate.toLocaleDateString()}</Text>
                         </View>
                         <Calendar color="#4f46e5" size={20} />
                     </TouchableOpacity>

                     <TouchableOpacity onPress={() => setShowTimePicker(true)} className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-xl flex-row-reverse justify-between items-center">
                         <View className="items-end">
                            <Text className="text-gray-500 text-xs font-bold mb-1">الساعة</Text>
                            <Text className="text-gray-900 font-bold text-base">
                               {`${requestedTime.getHours().toString().padStart(2, '0')}:${requestedTime.getMinutes().toString().padStart(2, '0')}`}
                            </Text>
                         </View>
                         <Clock color="#4f46e5" size={20} />
                     </TouchableOpacity>
                  </View>

                  <Text className="text-right text-gray-800 font-bold mb-3">تفاصيل إضافية (اختياري)</Text>
                  <TextInput 
                     value={notes} onChangeText={setNotes} multiline
                     className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-right h-24 mb-6"
                     placeholder="تفاصيل الطلب، مكان التنفيذ..." 
                  />

                  <View className="flex-row-reverse justify-between items-center mb-3">
                     <Text className="text-right text-gray-800 font-bold">ملحقات نصية/صور (اختياري)</Text>
                     <Text className="text-xs text-gray-500">{attachments.length}/4 صور</Text>
                  </View>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row-reverse mb-8">
                     {attachments.length < 4 && (
                       <TouchableOpacity onPress={pickImage} className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center ml-3">
                          <Camera color="#9ca3af" size={24} />
                       </TouchableOpacity>
                     )}
                     {attachments.map((att, idx) => (
                       <Image key={idx} source={{ uri: att.uri }} className="w-24 h-24 rounded-xl ml-3 border border-gray-200" />
                     ))}
                  </ScrollView>

                  <AppButton 
                     title={isSubmitting ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"} 
                     onPress={submitBooking} 
                     disabled={isSubmitting}
                  />
                <View className="h-10" />
                </View>
               </KeyboardAwareScrollView>
            </View>
         </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={requestedDate}
              mode="date"
              display="default"
              onChange={(event, selected) => {
                 setShowDatePicker(false);
                 if (selected) setRequestedDate(selected);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={requestedTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selected) => {
                 setShowTimePicker(false);
                 if (selected) setRequestedTime(selected);
              }}
            />
          )}
      </Modal>

    </View>
  );
}
