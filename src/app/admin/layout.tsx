"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        const loginMode = typeof window !== 'undefined' ? sessionStorage.getItem("citynest_login_mode") : "user";
        if (error || !profile || profile.role !== "admin" || loginMode !== "admin") {
          router.push("/");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error("Error checking admin status:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090b]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen w-full bg-[#09090b]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-zinc-950">
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
