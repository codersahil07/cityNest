"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export default function AdminCities() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    setLoading(true);
    const { data } = await supabase.from("cities").select("*").order("name");
    if (data) setCities(data);
    setLoading(false);
  }

  async function deleteCity(id: string) {
    if (!confirm("Are you sure you want to delete this city?")) return;
    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (!error) {
      setCities(cities.filter(c => c.id !== id));
    } else {
      alert("Cannot delete city. It might be in use by listings.");
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Cities</h1>
      <div className="bg-zinc-900 border border-[#27272a] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] bg-zinc-950/50">
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">City</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">State</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {cities.map((city) => (
              <tr key={city.id} className="hover:bg-zinc-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <SafeImage src={city.image_url} alt={city.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                    <div>
                      <p className="text-sm font-medium text-white">{city.name}</p>
                      <p className="text-xs text-zinc-500">{city.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-zinc-400">{city.state}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteCity(city.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md">
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
