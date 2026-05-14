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

async function testFetch() {
  console.log("Fetching providers natively...");
  const { data, error } = await supabase
    .from('providers')
    .select('*, profiles(*), services(*)');

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Providers found:", data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

testFetch();
