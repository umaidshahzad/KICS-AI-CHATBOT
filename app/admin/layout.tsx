"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { AdminHeader } from "../../components/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      // If a regular user tries to access admin, kick them to dashboard
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || (session?.user as any)?.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center bg-surface text-primary">
        <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex">
      <AdminSidebar />
      <main className="flex-1 flex flex-col md:ml-64 h-full relative">
        <AdminHeader />
        {/* Main Content Area - padded for mobile header */}
        <div className="flex-1 overflow-y-auto pt-16 md:pt-16 bg-background">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
