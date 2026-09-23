"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2, Edit, ExternalLink, Star, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

interface Listing {
  id: string;
  name: string;
  slug: string;
  status: string;
  is_featured: boolean;
  is_trending: boolean;
  image_url: string;
  city: { name: string };
  category: { name: string };
}

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select(`
        id, name, slug, status, is_featured, is_trending, image_url,
        city:cities(name),
        category:categories(name)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setListings(data as any);
    }
    setLoading(false);
  }

  async function toggleBoolean(id: string, field: "is_featured" | "is_trending", currentValue: boolean) {
    const { error } = await supabase
      .from("listings")
      .update({ [field]: !currentValue })
      .eq("id", id);
      
    if (!error) {
      setListings(listings.map(l => l.id === id ? { ...l, [field]: !currentValue } : l));
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status: newStatus })
      .eq("id", id);
      
    if (!error) {
      setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  }

  async function deleteListing(id: string) {
    // Attempt to delete image from storage if it's from our bucket
    const listing = listings.find(l => l.id === id);
    if (listing?.image_url?.includes("business-images")) {
      const urlParts = listing.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from("business-images").remove([`uploads/${fileName}`]);
    }

    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (!error) {
      setListings(listings.filter(l => l.id !== id));
      setDeleteConfirm(null);
      alert("Listing deleted successfully.");
    } else {
      alert("Error deleting listing: " + error.message);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Listings</h1>
          <p className="text-zinc-400">View, edit, and manage all business listings.</p>
        </div>
        <Link 
          href="/list-business"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-smooth"
        >
          Add New Listing
        </Link>
      </div>

      <div className="bg-zinc-900 border border-[#27272a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Business</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location/Category</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Badges</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-zinc-800/50 transition-smooth group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <SafeImage src={listing.image_url} alt={listing.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                      <div>
                        <p className="text-sm font-medium text-white">{listing.name}</p>
                        <p className="text-xs text-zinc-500">{listing.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-zinc-300">{listing.city?.name}</p>
                    <p className="text-xs text-zinc-500">{listing.category?.name}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      listing.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      listing.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => toggleBoolean(listing.id, "is_featured", listing.is_featured)}
                      className={`p-1.5 rounded-md transition-smooth ${listing.is_featured ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                      title="Featured"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleBoolean(listing.id, "is_trending", listing.is_trending)}
                      className={`p-1.5 rounded-md transition-smooth ${listing.is_trending ? 'bg-orange-500/20 text-orange-500' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                      title="Trending"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {listing.status !== 'approved' && (
                        <button onClick={() => updateStatus(listing.id, 'approved')} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-smooth" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {listing.status !== 'rejected' && (
                        <button onClick={() => updateStatus(listing.id, 'rejected')} className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded-md transition-smooth" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <Link href={`/listing/${listing.slug}`} target="_blank" className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-md transition-smooth" title="View Public">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteConfirm(listing.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-smooth" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {listings.length === 0 && (
            <div className="p-8 text-center text-zinc-500">No listings found.</div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-[#27272a] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Delete Listing?</h3>
            <p className="text-zinc-400 mb-6 text-sm">Are you sure you want to delete this listing? This action cannot be undone and will permanently remove the record and any uploaded images.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-zinc-300 hover:text-white transition-smooth">Cancel</button>
              <button onClick={() => deleteListing(deleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-smooth">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
