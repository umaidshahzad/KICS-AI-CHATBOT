"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useSelector((state: RootState) => state.ui.theme);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center bg-background text-primary">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`bg-background text-on-background font-body-md h-screen overflow-hidden flex ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-sidebar-width h-full relative">
        <Header />
        {/* Main Content Area - padded for mobile header */}
        <div className="flex-1 overflow-y-auto pt-16 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
