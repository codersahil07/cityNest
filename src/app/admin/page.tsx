"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Building2, 
  Users, 
  Map, 
  Tags, 
  Star,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  totalListings: number;
  approvedListings: number;
  pendingListings: number;
  totalUsers: number;
  totalCategories: number;
  totalCities: number;
  totalFavorites: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    approvedListings: 0,
    pendingListings: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalCities: 0,
    totalFavorites: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: listingsCount },
          { count: approvedCount },
          { count: pendingCount },
          { count: usersCount },
          { count: categoriesCount },
          { count: citiesCount },
          { count: favoritesCount },
        ] = await Promise.all([
          supabase.from("listings").select("*", { count: "exact", head: true }),
          supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "approved"),
          supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("cities").select("*", { count: "exact", head: true }),
          supabase.from("favorites").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          totalListings: listingsCount || 0,
          approvedListings: approvedCount || 0,
          pendingListings: pendingCount || 0,
          totalUsers: usersCount || 0,
          totalCategories: categoriesCount || 0,
          totalCities: citiesCount || 0,
          totalFavorites: favoritesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Listings", value: stats.totalListings, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Approved Listings", value: stats.approvedListings, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Submissions", value: stats.pendingListings, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Categories", value: stats.totalCategories, icon: Tags, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Total Cities", value: stats.totalCities, icon: Map, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Total Favorites", value: stats.totalFavorites, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-1">Welcome to the CityNest Premium Admin Portal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-[#27272a] rounded-2xl p-6 flex items-center gap-4 transition-smooth hover:border-zinc-700">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-[#27272a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/listings" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-blue-500/50 group transition-smooth">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-300 group-hover:text-white transition-smooth">Manage Listings</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-smooth" />
              </div>
            </Link>
            <Link href="/admin/categories" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-blue-500/50 group transition-smooth">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-300 group-hover:text-white transition-smooth">Manage Categories</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-smooth" />
              </div>
            </Link>
            <Link href="/admin/cities" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-blue-500/50 group transition-smooth">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-300 group-hover:text-white transition-smooth">Manage Cities</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-smooth" />
              </div>
            </Link>
            <Link href="/admin/users" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-blue-500/50 group transition-smooth">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-300 group-hover:text-white transition-smooth">Manage Users</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-smooth" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
