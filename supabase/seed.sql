-- ==========================================
-- CityNest Database Seed Data (Patna)
-- ==========================================

-- Insert City: Patna
INSERT INTO public.cities (id, name, slug, state, latitude, longitude, image_url)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Patna', 
  'patna', 
  'Bihar', 
  25.5941, 
  85.1376,
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop'
) ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Insert Categories
INSERT INTO public.categories (id, name, slug, icon, color, bg_color)
VALUES 
  ('22222222-1111-1111-1111-111111111111', 'Temples', 'temples', 'Star', 'text-orange-500', 'bg-orange-500/10'),
  ('22222222-2222-1111-1111-111111111111', 'Schools', 'schools', 'Building2', 'text-blue-500', 'bg-blue-500/10'),
  ('22222222-3333-1111-1111-111111111111', 'Shops', 'shops', 'ShoppingBag', 'text-green-500', 'bg-green-500/10'),
  ('22222222-4444-1111-1111-111111111111', 'Gyms', 'gyms', 'Dumbbell', 'text-purple-500', 'bg-purple-500/10'),
  ('22222222-5555-1111-1111-111111111111', 'Famous Places', 'famous-places', 'Compass', 'text-red-500', 'bg-red-500/10')
ON CONFLICT (name) DO NOTHING;

-- Insert Listings (Patna)
-- Temples
INSERT INTO public.listings (city_id, category_id, name, slug, description, address, latitude, longitude, rating, is_featured, is_trending, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'Mahavir Mandir, Patna', 'mahavir-mandir-patna', 'One of the holiest Hindu temples dedicated to Lord Hanuman, located near Patna Junction.', 'Near Patna Junction, Patna, Bihar', 25.6046, 85.1378, 4.8, true, true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Mahavir_Mandir_Patna.jpg/800px-Mahavir_Mandir_Patna.jpg'),
  ('11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'ISKCON Temple, Patna', 'iskcon-temple-patna', 'A beautiful spiritual center dedicated to Lord Krishna and Radharani.', 'Buddha Marg, Patna, Bihar', 25.6105, 85.1325, 4.9, true, false, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Iskcon_Temple_Patna.jpg/800px-Iskcon_Temple_Patna.jpg'),
  ('11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', 'Takht Sri Patna Sahib', 'takht-sri-patna-sahib', 'Birthplace of Guru Gobind Singh Ji, the tenth Guru of the Sikhs.', 'Patna City, Patna, Bihar', 25.5937, 85.2285, 4.9, true, true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Takht_Sri_Patna_Sahib.jpg/800px-Takht_Sri_Patna_Sahib.jpg')
ON CONFLICT (city_id, slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Famous Places
INSERT INTO public.listings (city_id, category_id, name, slug, description, address, rating, is_featured, is_trending, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '22222222-5555-1111-1111-111111111111', 'Golghar', 'golghar', 'A historic granary built by Captain John Garstin, offering a panoramic view of the city and the Ganges.', 'Ashok Rajpath, Patna, Bihar', 4.5, true, true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Golghar%2C_Patna.jpg/800px-Golghar%2C_Patna.jpg'),
  ('11111111-1111-1111-1111-111111111111', '22222222-5555-1111-1111-111111111111', 'Bihar Museum', 'bihar-museum', 'A modern museum showcasing the history and culture of Bihar.', 'Bailey Road, Patna, Bihar', 4.7, true, true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bihar_Museum_Patna.jpg/800px-Bihar_Museum_Patna.jpg'),
  ('11111111-1111-1111-1111-111111111111', '22222222-5555-1111-1111-111111111111', 'Gandhi Ghat', 'gandhi-ghat', 'A prominent ghat on the banks of the Ganges, known for the weekend Ganga Aarti.', 'NIT Campus, Patna, Bihar', 4.6, false, true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gandhi_Ghat_Patna.jpg/800px-Gandhi_Ghat_Patna.jpg')
ON CONFLICT (city_id, slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Schools
INSERT INTO public.listings (city_id, category_id, name, slug, description, address, rating, is_featured, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'St. Michaels High School', 'st-michaels-high-school', 'A premier co-educational Catholic high school in Patna.', 'Digha Ghat, Patna, Bihar', 4.8, true, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'Notre Dame Academy', 'notre-dame-academy', 'A well-known girls school offering excellent education.', 'Patliputra Kurji Road, Patna', 4.7, true, 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1000&auto=format&fit=crop'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-1111-1111-111111111111', 'Delhi Public School, Patna', 'dps-patna', 'Part of the DPS society, known for its rigorous academic curriculum.', 'Priydarshi Nagar, Patna, Bihar', 4.6, false, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (city_id, slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Gyms
INSERT INTO public.listings (city_id, category_id, name, slug, description, address, rating, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '22222222-4444-1111-1111-111111111111', 'Gold''s Gym Patna', 'golds-gym-patna', 'State of the art fitness equipment and certified trainers.', 'Boring Road, Patna, Bihar', 4.5, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'),
  ('11111111-1111-1111-1111-111111111111', '22222222-4444-1111-1111-111111111111', 'Anytime Fitness', 'anytime-fitness-patna', '24/7 fitness center with modern amenities.', 'Frazer Road, Patna, Bihar', 4.6, 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop'),
  ('11111111-1111-1111-1111-111111111111', '22222222-4444-1111-1111-111111111111', 'Talwalkars Gym', 'talwalkars-gym-patna', 'One of the oldest fitness chains providing comprehensive workouts.', 'Kankarbagh, Patna, Bihar', 4.4, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (city_id, slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Shops
INSERT INTO public.listings (city_id, category_id, name, slug, description, address, rating, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '22222222-3333-1111-1111-111111111111', 'Patna Central Mall', 'patna-central-mall', 'A popular shopping mall featuring various brands and a food court.', 'Frazer Road, Patna, Bihar', 4.3, 'https://images.unsplash.com/photo-1519567281013-c3f15234c833?q=80&w=1000&auto=format&fit=crop'),
  ('11111111-1111-1111-1111-111111111111', '22222222-3333-1111-1111-111111111111', 'P&M Mall', 'pm-mall', 'The first mall of Patna, containing multiplexes, food courts, and retail stores.', 'Patliputra Industrial Area, Patna', 4.5, 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1000&auto=format&fit=crop'),
  ('11111111-1111-1111-1111-111111111111', '22222222-3333-1111-1111-111111111111', 'Hathwa Market', 'hathwa-market', 'A famous market known for traditional clothing and women''s apparel.', 'Bari Path, Patna, Bihar', 4.2, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (city_id, slug) DO UPDATE SET image_url = EXCLUDED.image_url;
