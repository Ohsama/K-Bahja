import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetchAndFilter() {
  const { data, error } = await supabase
      .from('providers')
      .select('*, profiles(name, email), services(name)')
      .order('created_at', { ascending: false });

  if (error) {
     console.error("Supabase Error:", error);
     return;
  }
  
  if (data) {
       console.log("Raw Data returned from DB count:", data.length);
       const activeTab = 'PENDING';
       const filtered = data.filter(p => {
          const s = p.status || (p.is_approved ? 'APPROVED' : 'PENDING');
          console.log(`Provider [${p.name}] status evaluated to: ${s}`);
          return s === activeTab;
       });
       console.log(`Filtered Count for ${activeTab}:`, filtered.length);
       
       if (filtered.length > 0) {
          console.log("Simulating renderItem...");
          filtered.forEach(item => {
             console.log(`- Rendering card for: ${item.name}`);
             console.log(`  Profiles name: ${item.profiles?.name}`);
             console.log(`  Services name: ${item.services?.name}`);
             console.log(`  Commission editor handles provider id: ${item.id}`);
          });
       } else {
          console.log("Filter resulted in empty list!");
       }
  }
}

testFetchAndFilter();
