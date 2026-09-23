"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

export default function ExplorePage() {
  const { currentCity } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!currentCity) return;
      setIsLoading(true);

      try {
        const { data: cats } = await supabase.from("categories").select("*").order("name");
        if (isMounted && cats) setCategories(cats);

        let query = supabase
          .from("listings")
          .select("*, categories(name)")
          .eq("city_id", currentCity.id);
          
        if (selectedCategory) {
          query = query.eq("category_id", selectedCategory);
        }
        
        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }

        const { data } = await query;
        if (isMounted && data) setListings(data);
      } catch (error) {
        if (isMounted) console.error("Error fetching explore data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [currentCity, selectedCategory, searchQuery]);

  const cityName = currentCity?.name || "your city";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Explore {cityName}</h1>
        <p className="text-zinc-400">Find the best places, businesses, and experiences around you.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-xl bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-smooth"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition-smooth">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-smooth ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-smooth ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-zinc-900 border border-[#27272a] animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-500 text-lg">No listings found matching your criteria in {cityName}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => (
            <Link href={`/listing/${listing.slug}`} key={listing.id}>
              <div className="rounded-2xl bg-zinc-900/50 border border-[#27272a] overflow-hidden hover:border-zinc-700 transition-smooth group h-full flex flex-col">
                <div className="w-full h-40 relative">
                  <SafeImage 
                    src={listing.image_url} 
                    category={listing.categories?.name} 
                    listingName={listing.name}
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {listing.rating}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs font-medium text-blue-500 mb-1">{listing.categories?.name}</div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-1">{listing.name}</h3>
                  <div className="flex items-center text-xs text-zinc-500 mt-auto pt-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
