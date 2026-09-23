"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Bell, 
  User as UserIcon,
  UserCircle,
  Star,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Shield
} from "lucide-react";
import { useLocationStore } from "@/store/useLocationStore";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function Header() {
  const { currentCity, isLoading } = useLocationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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
      setSession(session);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            const loginMode = typeof window !== 'undefined' ? sessionStorage.getItem("citynest_login_mode") : "user";
            if (data?.role === 'admin' && loginMode === 'admin') {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("citynest_login_mode");
    setIsDropdownOpen(false);
    router.push("/");
  };

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="h-20 bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a] sticky top-0 z-50 flex items-center justify-between px-8">
      {/* Left side: Location */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-800 rounded-full">
          <MapPin className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-zinc-400 font-medium">Current Location</span>
          <span className="text-sm font-semibold text-white cursor-pointer hover:text-blue-400 transition-smooth">
            {isLoading ? "Detecting..." : currentCity?.name || "Select City"}
          </span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-smooth" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-700 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-smooth"
            placeholder="Search temples, schools, shops, gyms..."
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-smooth">
          <Bell className="w-5 h-5" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="p-1 bg-zinc-600 rounded-full">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white">Account</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-[#27272a] shadow-2xl py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              {session ? (
                <>
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-smooth">
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link href="/favorites" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-smooth">
                    <Star className="w-4 h-4" />
                    Favorites
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-zinc-800 transition-smooth border-t border-zinc-800 mt-1 pt-3">
                      <Shield className="w-4 h-4" />
                      Admin Portal
                    </Link>
                  )}
                  <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className={cn("flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-smooth", !isAdmin && "border-t border-zinc-800 mt-1 pt-3")}>
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="h-px bg-[#27272a] my-1"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-red-400 hover:bg-zinc-800 transition-smooth">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-smooth">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-smooth">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
