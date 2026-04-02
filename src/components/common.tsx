import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ViewProps } from 'react-native';
import { OrderStatus } from '../data/mockData';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AppButton = ({ title, onPress, variant = 'primary', isLoading, disabled, className = '' }: ButtonProps) => {
  const getColors = () => {
    if (disabled) return 'bg-gray-300 text-gray-500';
    switch (variant) {
      case 'primary': return 'bg-primary text-white';
      case 'secondary': return 'bg-gray-800 text-white';
      case 'danger': return 'bg-red-500 text-white';
      case 'outline': return 'bg-transparent border-2 border-primary text-primary';
    }
  };

  const getTextColor = () => {
    if (disabled) return 'text-gray-500';
    switch (variant) {
      case 'outline': return 'text-primary';
      default: return 'text-white';
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || isLoading}
      className={`rounded-2xl py-4 items-center justify-center flex-row ${getColors()} ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#4f46e5' : '#fff'} />
      ) : (
        <Text className={`font-bold text-base ${getTextColor()}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export const Card = ({ children, className = '', ...props }: ViewProps & { className?: string }) => {
  return (
    <View 
      className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
};

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'SUBMITTED': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'CONFIRMED': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'CANCELLED': return { bg: 'bg-red-100', text: 'text-red-700' };
      case 'PAID': return { bg: 'bg-purple-100', text: 'text-purple-700' };
    }
  };

  const styles = getStatusStyles();

  return (
    <View className={`px-3 py-1 rounded-full ${styles.bg} self-start`}>
      <Text className={`font-bold text-xs ${styles.text}`}>{status}</Text>
    </View>
  );
};
