"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Bell, MapPin, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      setIsLoading(false);
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen animate-pulse">
        <div className="h-10 w-48 bg-zinc-900 rounded mb-8"></div>
        <div className="space-y-6">
          <div className="h-32 bg-zinc-900 rounded-3xl"></div>
          <div className="h-32 bg-zinc-900 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-xl text-zinc-300">
            <Settings className="w-6 h-6" />
          </div>
          Settings
        </h1>
        <p className="text-zinc-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-zinc-900 border border-[#27272a] rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <Shield className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Account Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">Change Password</p>
                <p className="text-sm text-zinc-400">Update your account password</p>
              </div>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-smooth">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="bg-zinc-900 border border-[#27272a] rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <MapPin className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">Location Preferences</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">Auto-detect Location</p>
                <p className="text-sm text-zinc-400">Allow CityNest to automatically detect your city</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-900 border border-[#27272a] rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <Bell className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-zinc-400">Receive updates about new places in your city</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
