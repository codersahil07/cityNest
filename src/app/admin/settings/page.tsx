"use client";
import { Settings } from "lucide-react";
export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
      <div className="bg-zinc-900 border border-[#27272a] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-64">
        <Settings className="w-12 h-12 text-zinc-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Settings Configuration</h2>
        <p className="text-zinc-400 max-w-sm">Global platform settings, API keys, and maintenance modes can be configured here in future updates.</p>
      </div>
    </div>
  );
}
