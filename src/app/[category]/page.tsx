"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

export default function CategoryPage() {
  const { currentCity } = useLocation();
  const params = useParams();
  const categorySlug = params.category as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!currentCity || !categorySlug) return;
      setIsLoading(true);
      setCategoryData(null);
      setListings([]);

      try {
        const { data: cat } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", categorySlug)
          .single();
          
        if (cat) {
          if (isMounted) setCategoryData(cat);
          
          let query = supabase
            .from("listings")
            .select("*, categories(name)")
            .eq("city_id", currentCity.id)
            .eq("category_id", cat.id);
            
          if (searchQuery) {
            query = query.ilike("name", `%${searchQuery}%`);
          }

          const { data } = await query;
          if (isMounted && data) setListings(data);
        } else {
          if (isMounted) setCategoryData(null);
        }
      } catch (error) {
        if (isMounted) console.error("Error fetching category data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [currentCity, categorySlug, searchQuery]);

  const cityName = currentCity?.name || "your city";

  if (!isLoading && !categoryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
        <p className="text-zinc-400 max-w-md mb-8">We couldn't find the category you are looking for.</p>
        <Link href="/explore" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-smooth">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-[#27272a] h-64 group flex items-end">
        {categoryData && (
          <SafeImage 
            category={categoryData.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0"></div>
        
        <div className="relative z-10 p-8 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {categoryData?.name || "Loading..."}
          </h1>
          <p className="text-zinc-300">Discover the best {categoryData?.name?.toLowerCase() || 'places'} in {cityName}</p>
        </div>
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
            placeholder={`Search ${categoryData?.name?.toLowerCase() || 'listings'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition-smooth">
          <Filter className="w-4 h-4" />
          Filters
        </button>
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
          <p className="text-zinc-500 text-lg">No {categoryData?.name?.toLowerCase()} found matching your criteria in {cityName}.</p>
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
                  <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-smooth">{listing.name}</h3>
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
