"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2 } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select(`*, listing:listings(name), user:profiles(full_name)`)
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  }

  async function deleteReview(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Reviews</h1>
      <div className="bg-zinc-900 border border-[#27272a] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] bg-zinc-950/50">
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Review</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Listing / User</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-zinc-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <span key={i} className={`text-sm ${i < rev.rating ? 'text-yellow-500' : 'text-zinc-600'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 line-clamp-2">{rev.content}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-white">{rev.listing?.name}</p>
                  <p className="text-xs text-zinc-500">{rev.user?.full_name || "Unknown User"}</p>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteReview(rev.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && <div className="p-8 text-center text-zinc-500">No reviews found.</div>}
      </div>
    </div>
  );
}
