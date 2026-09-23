"use client";

import { useEffect, useState } from "react";
import { MapPin, Compass, Building2, ShoppingBag, Dumbbell, Star, ChevronRight } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

const iconMap: Record<string, any> = {
  Star,
  Building2,
  ShoppingBag,
  Dumbbell,
  Compass,
};

export default function Home() {
  const { currentCity } = useLocation();
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingListings, setTrendingListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentCity) return;
      setIsLoading(true);

      try {
        const { data: cats } = await supabase.from("categories").select("*").order("created_at");
        if (cats) setCategories(cats);

        const { data: listings } = await supabase
          .from("listings")
          .select("*, categories(name)")
          .eq("city_id", currentCity.id)
          .eq("is_trending", true)
          .limit(6);

        if (listings) setTrendingListings(listings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentCity]);

  const cityName = currentCity?.name || "your city";
  const cityImage = currentCity?.name?.toLowerCase() === "patna" 
    ? "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop" 
    : undefined;

  return (
    <div className="p-4 md:p-8 pb-20 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-[#27272a] shadow-2xl h-[400px] group">
        <SafeImage 
          src={cityImage} 
          category="city"
          listingName="patna"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-0"></div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col h-full justify-end max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-6 w-fit backdrop-blur-md border border-blue-500/20">
            <MapPin className="w-4 h-4" />
            Discover {cityName}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Explore {cityName}
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed">
            Discover the best places, businesses, schools, temples and experiences around you in a premium way.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-smooth shadow-lg shadow-blue-500/20 text-center">
              Start Exploring
            </Link>
            <Link href="/list-business" className="px-8 py-4 rounded-xl bg-black/50 backdrop-blur-md hover:bg-zinc-800 text-white font-medium transition-smooth border border-zinc-700 text-center">
              List a Business
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Categories in {cityName}</h2>
          <Link href="/explore" className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center transition-smooth">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-48 rounded-2xl bg-zinc-900 border border-[#27272a] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Star;
              return (
                <Link href={`/${cat.slug}`} key={cat.id}>
                  <div className="relative h-48 rounded-2xl bg-zinc-900 border border-[#27272a] hover:border-blue-500/50 transition-smooth cursor-pointer group overflow-hidden flex flex-col justify-end">
                    <SafeImage category={cat.name} className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    
                    <div className="relative z-20 p-4 text-center w-full flex flex-col items-center">
                      <div className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 mb-2 transition-transform group-hover:-translate-y-1`}>
                        <IconComp className={`w-5 h-5 ${cat.color}`} />
                      </div>
                      <h3 className="font-semibold text-white">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      
      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Trending in {cityName}</h2>
          <Link href="/explore?sort=trending" className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center transition-smooth">
            See More <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-zinc-900/50 border border-[#27272a] p-4 flex flex-col">
                <div className="w-full h-40 bg-zinc-800 rounded-xl mb-4 animate-pulse"></div>
                <div className="w-3/4 h-5 bg-zinc-800 rounded mb-2 animate-pulse"></div>
                <div className="w-1/2 h-4 bg-zinc-800 rounded mt-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingListings.length === 0 ? (
              <div className="col-span-3 p-12 rounded-2xl border border-dashed border-[#27272a] flex flex-col items-center justify-center text-center">
                <Compass className="w-12 h-12 text-zinc-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No trending places found</h3>
                <p className="text-zinc-400 max-w-sm">We couldn't find any trending listings in {cityName} right now. Try exploring other categories.</p>
              </div>
            ) : (
              trendingListings.map((listing) => (
                <Link href={`/listing/${listing.slug}`} key={listing.id}>
                  <div className="rounded-2xl bg-zinc-900/50 border border-[#27272a] overflow-hidden hover:border-zinc-700 transition-smooth group h-full flex flex-col">
                    <div className="w-full h-48 relative overflow-hidden">
                      <SafeImage 
                        src={listing.image_url} 
                        category={listing.categories?.name} 
                        listingName={listing.name}
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10 opacity-60" />
                      <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {listing.rating}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs font-medium text-blue-500 mb-2 tracking-wide uppercase">{listing.categories?.name}</div>
                      <h3 className="font-semibold text-xl text-white mb-2 group-hover:text-blue-400 transition-smooth line-clamp-1">{listing.name}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">{listing.description}</p>
                      <div className="flex items-center text-xs text-zinc-500 mt-auto pt-4 border-t border-[#27272a]">
                        <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{listing.address}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
