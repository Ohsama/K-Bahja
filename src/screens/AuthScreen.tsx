import React, { useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useAppContext } from '../context/AppContext';

export default function AuthScreen() {
  const { login } = useAppContext();
  const [activeSide, setActiveSide] = useState<'login' | 'register'>('login');
  
  // 0 = login active, 1 = register active
  const transition = useSharedValue(0);

  const toggleSide = (side: 'login' | 'register') => {
    setActiveSide(side);
    transition.value = withSpring(side === 'login' ? 0 : 1, {
      damping: 15,
      stiffness: 100,
    });
  };

  const loginStyle = useAnimatedStyle(() => ({
    flex: interpolate(transition.value, [0, 1], [3, 1]),
  }));

  const registerStyle = useAnimatedStyle(() => ({
    flex: interpolate(transition.value, [0, 1], [1, 3]),
  }));

  const loginFormStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transition.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
    display: transition.value > 0.5 ? 'none' : 'flex',
  }));

  const registerFormStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transition.value, [0.8, 1], [0, 1], Extrapolation.CLAMP),
    display: transition.value < 0.5 ? 'none' : 'flex',
  }));

  const loginTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transition.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    display: transition.value < 0.5 ? 'none' : 'flex',
  }));

  const registerTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transition.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    display: transition.value > 0.5 ? 'none' : 'flex',
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-center items-center bg-surface px-4">
        {/* The Split Card */}
        <View className="w-full max-w-md h-[450px] flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Left Side: Login */}
          <TouchableWithoutFeedback onPress={() => toggleSide('login')}>
            <Animated.View className="bg-white border-r border-gray-100 justify-center items-center px-4" style={loginStyle}>
              
               {/* Login Inactive State */}
               <Animated.View style={[loginTitleStyle, { position: 'absolute' }]}>
                  <Text className="text-xl font-bold text-gray-400 rotate-[-90deg] whitespace-nowrap">
                    LOGIN
                  </Text>
               </Animated.View>

              {/* Login Active Form */}
              <Animated.View style={[loginFormStyle, { width: '100%' }]}>
                <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</Text>
                
                <View className="space-y-4">
                  <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 mb-3">
                    <TextInput 
                      placeholder="Email" 
                      className="text-gray-800"
                      autoCapitalize="none"
                    />
                  </View>
                  <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 mb-6">
                    <TextInput 
                      placeholder="Password"
                      secureTextEntry 
                      className="text-gray-800"
                    />
                  </View>
                  
                  <TouchableWithoutFeedback onPress={() => login('customer@test.com').catch(() => login('user@test.com'))}>
                    <View className="bg-primary-light rounded-xl py-4 items-center mb-3">
                      <Text className="text-white font-bold text-base">Customer Login</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  
                  <TouchableWithoutFeedback onPress={() => login('admin@test.com')}>
                    <View className="bg-gray-800 rounded-xl py-4 items-center">
                      <Text className="text-white font-bold text-base">Admin Login</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </Animated.View>

            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Right Side: Register */}
          <TouchableWithoutFeedback onPress={() => toggleSide('register')}>
            <Animated.View className="bg-gray-50 justify-center items-center px-4" style={registerStyle}>
              
               {/* Register Inactive State */}
               <Animated.View style={[registerTitleStyle, { position: 'absolute' }]}>
                  <Text className="text-xl font-bold text-gray-400 rotate-[90deg] whitespace-nowrap">
                    REGISTER
                  </Text>
               </Animated.View>

              {/* Register Active Form */}
              <Animated.View style={[registerFormStyle, { width: '100%' }]}>
                <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</Text>
                
                <View className="space-y-4">
                  <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 mb-3">
                    <TextInput placeholder="Full Name" className="text-gray-800" />
                  </View>
                  <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 mb-3">
                    <TextInput placeholder="Email" autoCapitalize="none" className="text-gray-800" />
                  </View>
                  <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 mb-6">
                    <TextInput placeholder="Password" secureTextEntry className="text-gray-800" />
                  </View>
                  
                  <TouchableWithoutFeedback onPress={() => toggleSide('login')}>
                    <View className="bg-primary-light rounded-xl py-4 items-center">
                      <Text className="text-white font-bold text-base">Create Account</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </Animated.View>

            </Animated.View>
          </TouchableWithoutFeedback>

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
