"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUserEmail(session.user.email || "");

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (data) setProfile(data);
        if (error && error.code !== 'PGRST116') throw error; // ignore not found
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen animate-pulse">
        <div className="h-40 bg-zinc-900 rounded-3xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-16 bg-zinc-900 rounded-xl"></div>
          <div className="h-16 bg-zinc-900 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Your Profile</h1>
        <Link href="/settings" className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-smooth">
          <SettingsIcon className="w-5 h-5" />
        </Link>
      </div>

      <div className="bg-zinc-900 border border-[#27272a] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0"></div>
        
        <div className="relative z-10 w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center shadow-xl">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-zinc-500" />
          )}
        </div>
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-1">
            {profile?.full_name || "CityNest User"}
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-zinc-400 text-sm">
            <span className="flex items-center justify-center md:justify-start gap-1">
              <Mail className="w-4 h-4" /> {userEmail}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full w-fit mx-auto md:mx-0">
              <Shield className="w-3 h-3" /> {profile?.role || "user"}
            </span>
          </div>
        </div>
        
        <div className="relative z-10">
          <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-smooth">
            Edit Profile
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-[#27272a] rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Account Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <span className="text-zinc-400">Member Since</span>
              <span className="text-white font-medium">September 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Account Status</span>
              <span className="text-green-500 font-medium flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
