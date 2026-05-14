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

async function testAdminUpdate() {
  console.log("Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'client@root.com',
    password: '123456789'
  });

  if (authError) {
    console.error("Login failed:", authError);
    return;
  }

  console.log("Logged in. Admin UID:", authData.user.id);
  
  console.log("Fetching pending providers...");
  const { data: providers, error: fetchError } = await supabase
    .from('providers')
    .select('*')
    .eq('status', 'PENDING');

  if (fetchError || !providers || providers.length === 0) {
    console.log("No pending providers found or fetch error.");
    if (fetchError) console.error(fetchError);
    return;
  }
  
  const provider = providers[0];
  console.log(`Found provider: ${provider.name} (ID: ${provider.id})`);
  console.log("Attempting to approve...");

  const { error: updateError } = await supabase
    .from('providers')
    .update({ status: 'APPROVED', is_approved: true })
    .eq('id', provider.id);

  if (updateError) {
    console.error("UPDATE ERROR CAUGHT:");
    console.error(updateError);
  } else {
    console.log("UPDATE SUCCESSFUL! React Native has a client-side glitch if this worked.");
    
    // Check if it actually updated
    const { data: checkData } = await supabase.from('providers').select('status, is_approved').eq('id', provider.id).single();
    console.log("Verification from DB:", checkData);
  }
}

testAdminUpdate();
