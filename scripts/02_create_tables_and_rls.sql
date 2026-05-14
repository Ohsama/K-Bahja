-- ==========================================
-- BAHJA: CORE SCHEMA & RELATIONS
-- ==========================================

-- 1. PROFILES TABLE
-- Links directly to Supabase Auth.
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (new.id, 'customer', split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. SERVICES TABLE (Categories)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
-- Everyone can view services
CREATE POLICY "Public read access for services" 
ON public.services FOR SELECT USING (true);


-- 3. PROVIDERS TABLE (Businesses/Workers)
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  daira_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  rating NUMERIC(3,1) DEFAULT 5.0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
-- Everyone can view providers
CREATE POLICY "Public read access for providers" 
ON public.providers FOR SELECT USING (true);
-- Admins/owners can manage their own providers
CREATE POLICY "Admins manage their own providers" 
ON public.providers FOR ALL 
USING (auth.uid() = user_id);


-- 4. ORDERS TABLE (Appointments)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'AWAITING_PAYMENT', 'CASH_PENDING', 'PAID', 'CANCELLED')),
  payment_method TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Customer can see and manage their own orders. Provider can see and manage orders placed on them.
CREATE POLICY "Customers and providers manage related orders" 
ON public.orders FOR ALL 
USING (
  auth.uid() = customer_id 
  OR 
  auth.uid() IN (SELECT user_id FROM public.providers WHERE id = provider_id)
);

-- ==========================================
-- LOCATIONS PUBLIC RLS (If not already set)
-- ==========================================
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for locations" 
ON public.locations FOR SELECT USING (true);
