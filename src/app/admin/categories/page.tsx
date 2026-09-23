"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
    setLoading(false);
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert("Cannot delete category. It might be in use.");
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Categories</h1>
      </div>
      <div className="bg-zinc-900 border border-[#27272a] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] bg-zinc-950/50">
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Category Name</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Slug</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-800/50">
                <td className="p-4 text-sm font-medium text-white">{cat.name}</td>
                <td className="p-4 text-sm text-zinc-400">{cat.slug}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
