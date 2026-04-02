# Bahja (بهجة) - Appointment Booking & Provider Platform

Bahja is a comprehensive, dual-role (Customer and Admin) mobile application built with React Native (Expo) and NativeWind (Tailwind CSS) on the front-end, seamlessly integrated with a powerful Supabase (PostgreSQL) backend. This architecture provides robust location-cascading logic for consumers while delivering fully dynamic command-center CRUD capabilities for business administrators.

---

## 🏗️ Architecture Overview
*   **Framework:** React Native / Expo Router (via specific Custom React Navigation Stacks).
*   **Styling:** NativeWind v4 (TailwindCSS) focusing strictly on modern RTL (Right-To-Left) UX metrics.
*   **Backend:** Supabase (PostgreSQL, Auth, and Storage Buckets).
*   **State Control:** React Context (`AppContext`) combined directly with Supabase Realtime subscriptions.

---

## 🔐 1. Environment Configuration

You must connect the application to your Supabase instance before running it.

1. Create a file named `.env` in the root directory.
2. Add your distinct Supabase URL and Anon Key. Expo strictly requires the prefix `EXPO_PUBLIC_`.
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key...
```
*(Note: Because we mapped `src/lib/supabase.ts` directly, please make sure those constants import these `.env` variables or are manually pasted into `src/lib/supabase.ts` for quick prototype validation).*

---

## 🗄️ 2. Supabase Initialization Guide

### Step 2.1: Schema Creation
Execute the generated `scripts/01_seed_locations.sql` directly inside your **Supabase SQL Editor**. This script will scaffold the `locations` table and securely inject all 548 unique Wilaya/Daira combinations sourced from the official Algerian geodata. 

You must then create the subsequent tables linking to this:
- **`profiles`**: `id` uuid (FK to auth.users), `role` text, `name` text.
- **`services`**: `id` uuid, `name` text.
- **`providers`**: `id` uuid, `name` text, `daira_id` uuid (FK to locations.id), `user_id` uuid (FK to profiles.id), `image_url` text.
- **`orders`**: `id` uuid, `customer_id` uuid, `provider_id` uuid, `status` text, `payment_method` text.

### Step 2.2: Storage Buckets (Media)
1. Navigate to **Storage** inside your Supabase project.
2. Create a new Bucket named exactly: `provider-images`.
3. Switch the visibility to **"Public"** (This allows our `<Image />` tags to render securely without signed token expirations).

### Step 2.3: Row Level Security (RLS) Policies
Enable RLS on all tables and create the following standard policies:
- **Profiles:** `FOR SELECT/UPDATE USING (auth.uid() = id)`
- **Providers / Services / Locations:** `FOR SELECT USING (true)` (Public read access)
- **Providers (Insert/Update/Delete):** `USING (auth.uid() = user_id)` (Admins strictly control their own data).
- **Orders:** `FOR SELECT/INSERT USING (auth.uid() = customer_id OR auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id))`

---

## 🚀 3. Run Instructions

1. **Install dependencies:**
   Ensure you have Node installed, then run:
   ```bash
   npm install
   ```

2. **Start the Expo Server:**
   ```bash
   npx expo start
   ```

3. **Android Build / Tests:**
   For local development testing via physical device: Press `a` inside the server terminal. 
   The `app.json` has been strictly formatted (`com.bahja.app`) and is fully ready to be compiled to an `.apk` via EAS Build!

---

## 📖 Business Operations Flow
Please consult the included **`OPERATIONS_GUIDE.md`** file detailing precisely how the complex `Edhahabia` checkout logic synchronizes with the `Cash` payment verification network between the Administrative UI and the Customer context.
