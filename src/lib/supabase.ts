import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://bmphcafjnihiacinmvak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcGhjYWZqbmloaWFjaW5tdmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzU3NzQsImV4cCI6MjA5MDcxMTc3NH0.6Ncz1pd3krsz9hY59RgDZWIeLbw5kZwUaukja1jX1Ag';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
