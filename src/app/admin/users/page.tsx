"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Users</h1>
      <div className="bg-zinc-900 border border-[#27272a] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272a] bg-zinc-950/50">
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">User</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Role</th>
              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-800/50">
                <td className="p-4">
                  <p className="text-sm font-medium text-white">{user.full_name || "Unknown"}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-zinc-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
