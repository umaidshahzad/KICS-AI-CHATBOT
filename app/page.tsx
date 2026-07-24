"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role;
      if (role === "superadmin") {
        router.push("/superadmin");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard/chat");
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-surface text-primary">
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
        <p className="font-bold">Redirecting...</p>
      </div>
    </div>
  );
}
