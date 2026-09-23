"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Mail, Lock, Shield, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let loginEmail = email.trim();
      if (loginEmail.toLowerCase() === "admin") {
        loginEmail = "admin@citynest.com";
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: loginEmail, 
        password 
      });
      
      if (authError) throw authError;
      
      // Fetch user role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      const role = profile.role || 'user';
      
      if (mode === "user") {
        sessionStorage.setItem("citynest_login_mode", "user");
        router.push("/explore");
      } else {
        if (role !== "admin") {
          await supabase.auth.signOut();
          throw new Error("Admin access is required. Please use an admin account.");
        }
        sessionStorage.setItem("citynest_login_mode", "admin");
        router.push("/admin");
      }
      
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-[#27272a] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
            <MapPin className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-zinc-400 mt-2 text-center text-sm">
            Sign in to access your saved places and profile.
          </p>
        </div>

        <div className="flex p-1 bg-zinc-950 rounded-xl mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => { setMode("user"); setError(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-smooth",
              mode === "user" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <User className="w-4 h-4" />
            User Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("admin"); setError(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-smooth",
              mode === "admin" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Shield className="w-4 h-4" />
            Admin Login
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Username / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-smooth"
                placeholder="admin or you@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-smooth"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={cn(
              "w-full py-3.5 text-white rounded-xl font-semibold transition-smooth mt-6 disabled:opacity-50",
              mode === "admin" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-500"
            )}
          >
            {loading ? 'Processing...' : (mode === 'admin' ? 'Login to Admin Portal' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-smooth">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
