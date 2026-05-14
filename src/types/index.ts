// ==========================================
// CENTRALIZED TYPES.TS
// ==========================================

export type RoleType = 'admin' | 'customer' | 'provider';

export type User = {
  id: string;
  email: string;
  role: RoleType;
  name: string;
  phone?: string;
  avatar_url?: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon_name: string; // matches lucide-react-native icons, coming strictly from Supabase
  description: string;
  created_at?: string;
};

export type Business = {
  id: string;
  service_id: string;
  name: string;
  rating: number;
  location: string;
  description: string;
  price_range: string;
  image_url?: string;
};

export type OrderStatus = 'SUBMITTED' | 'CONFIRMED' | 'WAITING_FOR_PAYMENT' | 'PAID' | 'CASH_PENDING' | 'CANCELLED' | 'DONE';

export interface Order {
  id: string;
  businessId: string;
  customerId: string;
  date: string;
  time: string;
  status: OrderStatus;
  serviceId: string;
  payment_method?: 'CARD' | 'CASH';
  notes?: string;
};

export interface LocationData {
  id: string;
  wilaya_name: string;
  daira_name: string;
}
