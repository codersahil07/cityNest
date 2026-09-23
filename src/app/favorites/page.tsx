"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id, listing_id, listings(*, categories(name))")
          .eq("user_id", session.user.id);
          
        if (error) throw error;
        
        if (data) {
          // Flatten the structure for easier rendering
          const formattedFavorites = data.map(fav => ({
            favoriteId: fav.id,
            ...fav.listings
          }));
          setFavorites(formattedFavorites);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthAndFetch();
  }, [router]);

  const removeFavorite = async (e: React.MouseEvent, favoriteId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to the listing
    
    try {
      await supabase.from("favorites").delete().eq("id", favoriteId);
      setFavorites(prev => prev.filter(f => f.favoriteId !== favoriteId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
        <div className="h-10 w-48 bg-zinc-900 rounded mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-zinc-900 border border-[#27272a] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-500">
            <Star className="w-6 h-6 fill-yellow-500" />
          </div>
          Your Favorites
        </h1>
        <p className="text-zinc-400">Places and businesses you've saved for later.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="p-6 bg-zinc-900 rounded-full mb-6">
            <Star className="w-12 h-12 text-zinc-700" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No favorites yet</h2>
          <p className="text-zinc-500 max-w-md mb-8">You haven't saved any places to your favorites. Explore the city and click the heart icon on places you love.</p>
          <Link href="/explore" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-smooth">
            Explore Places
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(listing => (
            <Link href={`/listing/${listing.slug}`} key={listing.favoriteId}>
              <div className="rounded-2xl bg-zinc-900/50 border border-[#27272a] overflow-hidden hover:border-zinc-700 transition-smooth group h-full flex flex-col relative">
                <div className="w-full h-40 relative">
                  <SafeImage 
                    src={listing.image_url} 
                    category={listing.categories?.name} 
                    listingName={listing.name}
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" 
                  />
                  <button 
                    onClick={(e) => removeFavorite(e, listing.favoriteId)}
                    className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md p-2 rounded-full text-zinc-300 hover:text-red-500 hover:bg-black/80 flex items-center justify-center border border-white/10 transition-smooth"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs font-medium text-blue-500 mb-1 uppercase tracking-wider">{listing.categories?.name}</div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-smooth">{listing.name}</h3>
                  <div className="flex items-center text-xs text-zinc-500 mt-auto pt-2 border-t border-[#27272a]">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
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
