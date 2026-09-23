-- ==========================================
-- CityNest Database Schema
-- ==========================================

-- 1. PROFILES / USERS
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Trigger to handle updated_at
create or replace function handle_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure handle_updated_at();

-- 2. CITIES
create table public.cities (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  state text,
  country text default 'India',
  latitude numeric,
  longitude numeric,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cities enable row level security;
create policy "Cities are viewable by everyone." on public.cities for select using (true);
create policy "Only admins can modify cities." on public.cities for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. CATEGORIES
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  icon text,
  color text,
  bg_color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Only admins can modify categories." on public.categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. LISTINGS
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  city_id uuid references public.cities(id) on delete restrict not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  name text not null,
  slug text not null,
  description text,
  address text,
  latitude numeric,
  longitude numeric,
  image_url text,
  gallery_urls text[],
  rating numeric default 0.0,
  review_count integer default 0,
  contact_phone text,
  contact_email text,
  website_url text,
  opening_hours jsonb,
  is_featured boolean default false,
  is_trending boolean default false,
  status text default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(city_id, slug)
);

create trigger on_listings_updated
  before update on public.listings
  for each row execute procedure handle_updated_at();

alter table public.listings enable row level security;
create policy "Approved listings viewable by everyone." on public.listings for select using (status = 'approved');
create policy "Users can insert listings." on public.listings for insert with check (auth.uid() = created_by);
create policy "Users can update own listings." on public.listings for update using (auth.uid() = created_by);
create policy "Admins can manage all listings." on public.listings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 5. FAVORITES
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, listing_id)
);

alter table public.favorites enable row level security;
create policy "Users can view their own favorites." on public.favorites for select using (auth.uid() = user_id);
create policy "Users can insert their own favorites." on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete their own favorites." on public.favorites for delete using (auth.uid() = user_id);

-- Indexes for performance
create index idx_listings_city on public.listings(city_id);
create index idx_listings_category on public.listings(category_id);
create index idx_favorites_user on public.favorites(user_id);
