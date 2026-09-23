"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Home, Compass, MapPin, Building2, ShoppingBag, 
  Dumbbell, Star, PlusSquare, Settings, User, LogOut, Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: MapPin, label: "Famous Places", href: "/famous-places" },
  { icon: Building2, label: "Schools", href: "/schools" },
  { icon: ShoppingBag, label: "Shops", href: "/shops" },
  { icon: Dumbbell, label: "Gyms", href: "/gyms" },
];

const secondaryNavItems = [
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: PlusSquare, label: "List Your Business", href: "/list-business" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            const loginMode = typeof window !== 'undefined' ? sessionStorage.getItem("citynest_login_mode") : "user";
            if (data?.role === 'admin' && loginMode === 'admin') setIsAdmin(true);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            const loginMode = typeof window !== 'undefined' ? sessionStorage.getItem("citynest_login_mode") : "user";
            setIsAdmin(data?.role === 'admin' && loginMode === 'admin');
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("citynest_login_mode");
    router.push("/");
  };

  return (
    <aside className={cn("flex flex-col w-64 h-screen bg-[#09090b] border-r border-[#27272a] px-4 py-6 hidden md:flex", className)}>
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <MapPin className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">CityNest</span>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-8">
        <div>
          <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Discover</p>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-zinc-800 hover:text-white",
                  pathname === item.href ? "bg-blue-500/10 text-blue-500" : "text-zinc-400"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Personal</p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-zinc-800 hover:text-white",
                  pathname === item.href ? "bg-blue-500/10 text-blue-500" : "text-zinc-400"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-[#27272a]">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-zinc-800 hover:text-white",
                pathname === item.href ? "bg-blue-500/10 text-blue-500" : "text-zinc-400"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-zinc-800 hover:text-blue-300",
                pathname.startsWith("/admin") ? "bg-blue-500/10 text-blue-500" : "text-blue-400"
              )}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-zinc-400 transition-smooth hover:bg-zinc-800 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
