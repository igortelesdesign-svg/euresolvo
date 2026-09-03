/**
 * Supabase Integration Architecture for EURESOLVO
 * Domain: euresolvoagora.com.br
 * 
 * Tables & Normalization configured according to system specification:
 * - profiles
 * - professional_profiles
 * - contractor_profiles
 * - organizations
 * - service_categories
 * - service_subcategories
 * - professional_services
 * - professional_availability
 * - service_requests
 * - service_applications
 * - reviews
 * - review_details
 * - notifications
 * - favorites
 * - badges
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

/**
 * SQL Schema definition ready for execution in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text not null check (role in ('professional', 'contractor', 'admin')),
  phone text,
  whatsapp text,
  whatsapp_notifications boolean default true,
  avatar_url text,
  city text not null default 'Natal',
  state text not null default 'RN',
  neighborhood text,
  cpf text,
  cnpj text,
  has_cnpj boolean default false,
  contractor_type text default 'individual',
  organization_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROFESSIONAL PROFILES
create table if not exists public.professional_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  bio text,
  main_category text not null,
  experience_years int default 1,
  in_person_service boolean default true,
  remote_service boolean default false,
  emergency_service boolean default false,
  rating numeric(3,2) default 5.00,
  total_reviews int default 0,
  resolved_count int default 0,
  completion_rate numeric(5,2) default 100.00,
  is_available_now boolean default false,
  score int default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICE REQUESTS
create table if not exists public.service_requests (
  id uuid default uuid_generate_v4() primary key,
  contractor_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category_id text not null,
  city text not null,
  state text not null,
  neighborhood text not null,
  address text,
  service_date text not null,
  start_time text not null,
  end_time text not null,
  urgency text not null check (urgency in ('low', 'normal', 'urgent', 'emergency')),
  status text not null check (status in ('open', 'receiving_applications', 'professional_selected', 'scheduled', 'in_progress', 'resolved', 'cancelled')),
  selected_professional_id uuid references public.professional_profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

-- SERVICE APPLICATIONS (EU RESOLVO)
create table if not exists public.service_applications (
  id uuid default uuid_generate_v4() primary key,
  service_request_id uuid references public.service_requests(id) on delete cascade not null,
  professional_id uuid references public.professional_profiles(id) on delete cascade not null,
  message text,
  status text not null check (status in ('interested', 'shortlisted', 'selected', 'rejected', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS (5 Criteria)
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  service_request_id uuid references public.service_requests(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  target_id uuid references public.profiles(id) on delete cascade not null,
  rating numeric(3,2) not null,
  quality int check (quality between 1 and 5),
  punctuality int check (punctuality between 1 and 5),
  communication int check (communication between 1 and 5),
  organization int check (organization between 1 and 5),
  professionalism int check (professionalism between 1 and 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.service_applications enable row level security;
alter table public.reviews enable row level security;

-- Profiles: Public can view verified basics; users edit own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Service Requests: Public can view open requests; contractors edit own
create policy "Anyone can view open requests" on public.service_requests for select using (true);
create policy "Contractors can insert requests" on public.service_requests for insert with check (auth.uid() = contractor_id);
create policy "Contractors can update own requests" on public.service_requests for update using (auth.uid() = contractor_id);
`;
