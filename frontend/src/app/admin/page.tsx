"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getRoleHome } from "@/lib/api";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || !localStorage.getItem("token")) {
      router.replace("/admin/login");
    } else {
      const home = getRoleHome(user.role);
      if (home.startsWith("http")) window.location.href = home;
      else router.replace(home);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-400">Redirecting...</p>
    </div>
  );
}
