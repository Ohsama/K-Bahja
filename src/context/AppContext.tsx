import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Order, OrderStatus } from '../data/mockData';

// We map the Supabase Session User to our internal User structure
export interface SupabaseProfile {
  id: string;
  role: 'admin' | 'customer';
  name: string;
  phone?: string;
}

interface AppContextType {
  currentUser: User | null; // Bridged structure
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  isLoading: boolean;
  selectedDairaId: string;
  setLocationFilter: (dairaId: string, label: string) => void;
  locationLabel: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedDairaId, setSelectedDairaId] = useState<string>('');
  const [locationLabel, setLocationLabel] = useState<string>('كل المدن');

  const setLocationFilter = (dairaId: string, label: string) => {
    setSelectedDairaId(dairaId);
    setLocationLabel(label);
  };

  useEffect(() => {
    // 1. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || '');
          fetchOrders(session.user.id);
        } else {
          setCurrentUser(null);
          setOrders([]);
          setIsLoading(false);
        }
      }
    );

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
        fetchOrders(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      // If no profile exists yet, fallback to a local mock structure for dev
      const role = data?.role || 'customer';
      setCurrentUser({
        id: userId,
        name: data?.name || email.split('@')[0],
        email: email,
        role: role as 'admin' | 'customer'
      });
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async (userId: string) => {
    // Fetch orders if the user is a customer, fetch all if admin
    // RLS handles this safely, but we do a broad select here.
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) {
        // Map postgres snake_case back to camelCase internal format
        const mappedOrders: Order[] = data.map(o => ({
            id: o.id,
            businessId: o.provider_id, // alias
            customerId: o.customer_id,
            date: o.date,
            time: o.time,
            status: o.status,
            serviceId: o.service_id || ''
        }));
        setOrders(mappedOrders);
    }
  };

  const login = async (email: string, password?: string) => {
    // Uses real Supabase auth. For prototyping convenience, if no password passed, attempts a default.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'password123',
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setOrders([]);
    setSelectedDairaId('');
    setLocationLabel('كل المدن');
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'status'>) => {
    // Optimistic UI Update
    const mockId = `tmp_${Date.now()}`;
    const newOrder: Order = { ...orderData, id: mockId, status: 'SUBMITTED' };
    setOrders(prev => [newOrder, ...prev]);

    // Supabase Insert
    const { data, error } = await supabase.from('orders').insert([{
        customer_id: currentUser?.id,
        provider_id: orderData.businessId,
        service_id: orderData.serviceId,
        date: orderData.date,
        time: orderData.time,
        status: 'SUBMITTED',
        payment_method: 'CARD' // Default
    }]).select().single();

    if (!error && data) {
         setOrders(prev => prev.map(o => o.id === mockId ? { ...o, id: data.id } : o));
    } else {
         console.error('Failed to submit order to Supabase:', error);
         // Revert optimistic insert
         setOrders(prev => prev.filter(o => o.id !== mockId));
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    // Supabase Update
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
        console.error('Failed to update status in Supabase:', error);
        // Refresh orders to revert
        if (currentUser) fetchOrders(currentUser.id);
    }
  };

  return (
    <AppContext.Provider value={{ 
        currentUser, login, logout, orders, addOrder, updateOrderStatus, isLoading,
        selectedDairaId, locationLabel, setLocationFilter
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
