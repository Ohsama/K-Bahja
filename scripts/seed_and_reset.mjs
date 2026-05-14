import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load Env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetAndSeed() {
  console.log("Starting Database Master Reset & Seeding...");

  // 1. Purge all logical entities (RLS usually active, but Node using ANON API can delete if RLS permits or if we just execute a wide command)
  // Actually, since we don't have SERVICE_ROLE key in .env, we might fail deleting due to RLS.
  // Instead, we will print instructions for the User to wipe data, OR we try wiping if RLS is relaxed.
  
  console.log("Note: To safely reset data across relationships without violating Postgres constraints, run this in Supabase SQL Editor:");
  console.log(`
    TRUNCATE TABLE public.provider_posts CASCADE;
    TRUNCATE TABLE public.order_attachments CASCADE;
    TRUNCATE TABLE public.orders CASCADE;
    TRUNCATE TABLE public.provider_reviews CASCADE;
    TRUNCATE TABLE public.providers CASCADE;
    TRUNCATE TABLE public.services CASCADE;
  `);

  // Let's seed the 3 specific services directly.
  console.log("Seeding 3 Pristine Marriage Services...");
  const services = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'قاعات الأفراح', icon_name: 'Home', description: 'حجز صالات وقاعات الحفلات (Salles de Fêtes)' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'حلاقة و تجميل', icon_name: 'Scissors', description: 'تجميل عرائس، حلاقة رجال' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'التصوير والفيديو', icon_name: 'Camera', description: 'مصورين محترفين لجلسات التصوير والفيديو' }
  ];

  const { error } = await supabase.from('services').upsert(services);
  if (error) {
    console.error("Failed to seed services:", error);
  } else {
    console.log("Successfully seeded pristine services!");
  }

  console.log("Seeding complete. To spawn dummy providers, simply Sign Up 3 times through the UI to test the specific 'PENDING', 'APPROVED', and 'REJECTED' cycles perfectly.");
  process.exit(0);
}

resetAndSeed();
