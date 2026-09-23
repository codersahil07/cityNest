"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  List, 
  Tags, 
  Map, 
  Users, 
  MessageSquare, 
  Inbox, 
  BarChart, 
  Settings, 
  LogOut, 
  Globe 
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: List, label: "Listings", href: "/admin/listings" },
  { icon: Tags, label: "Categories", href: "/admin/categories" },
  { icon: Map, label: "Cities", href: "/admin/cities" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
  { icon: Inbox, label: "Submissions", href: "/admin/submissions" },
  { icon: BarChart, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("citynest_login_mode");
    router.push("/login");
  };

  return (
    <aside className={cn("flex flex-col w-64 h-screen bg-[#09090b] border-r border-[#27272a] px-4 py-6 hidden md:flex shrink-0", className)}>
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Globe className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-white leading-tight">CityNest Admin</span>
          <span className="text-xs text-zinc-500 font-medium">Premium Portal</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-2">
        <div className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth hover:bg-zinc-800 hover:text-white",
                pathname === item.href ? "bg-blue-600 text-white" : "text-zinc-400"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-[#27272a] space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-400 transition-smooth hover:bg-zinc-800 hover:text-white"
        >
          <Globe className="w-4 h-4" />
          Back to Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-400 transition-smooth hover:bg-zinc-800 hover:text-red-400"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
