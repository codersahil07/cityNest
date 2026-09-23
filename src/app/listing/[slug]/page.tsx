"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SafeImage } from "@/components/ui/SafeImage";
import { MapPin, Star, Phone, Globe, Clock, Heart, Share2 } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchListing() {
      if (!slug) return;
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*, categories(name)")
          .eq("slug", slug)
          .single();

        if (isMounted) {
          if (data) setListing(data);
          if (error) console.error(error);
        }
      } catch (err) {
        if (isMounted) console.error("Error fetching listing:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    
    fetchListing();
    
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading || (listing && listing.slug !== slug)) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-96 bg-zinc-900 rounded-3xl w-full" />
        <div className="h-12 bg-zinc-900 rounded-lg w-1/2" />
        <div className="h-4 bg-zinc-900 rounded w-1/3" />
        <div className="h-40 bg-zinc-900 rounded-lg w-full mt-8" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="p-4 rounded-full bg-zinc-900 text-zinc-600 mb-6">
          <MapPin className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Listing Not Found</h1>
        <p className="text-zinc-400 max-w-md">The place or business you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Image Gallery Area */}
      <div className="relative h-96 md:h-[500px] w-full rounded-3xl overflow-hidden mb-8 shadow-2xl border border-[#27272a] group">
        <SafeImage 
          src={listing.image_url} 
          category={listing.categories?.name}
          listingName={listing.name}
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-white transition-smooth border border-white/10">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-white transition-smooth border border-white/10 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                {listing.categories?.name}
              </span>
              <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-sm font-semibold">
                <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                {listing.rating}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{listing.name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-zinc-500" />
                {listing.address}
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">About this place</h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {listing.description || "No description provided for this listing."}
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-[#27272a] shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6">Contact & Info</h3>
            
            <div className="space-y-5">
              {listing.contact_phone && (
                <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-smooth cursor-pointer group">
                  <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-smooth">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{listing.contact_phone}</span>
                </div>
              )}
              
              {listing.website_url && (
                <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-smooth cursor-pointer group">
                  <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-smooth">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Visit Website</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-zinc-300 group">
                <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-green-500/20 group-hover:text-green-500 transition-smooth">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white">Opening Hours</span>
                  <span className="text-sm text-zinc-500">Contact for details</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#27272a]">
              <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-smooth shadow-lg shadow-blue-500/20">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
