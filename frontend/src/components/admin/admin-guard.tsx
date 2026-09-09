"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser, getRoleHome, type SessionUser } from "@/lib/api";

const sectionStatus: Record<string, number> = {
  "/admin/super": 2,
  "/admin/billing": 3,
  "/admin/stock": 4,
};

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useState<SessionUser | null>(() => getStoredUser());

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      router.replace("/admin/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    const segment = pathname.split("/")[2] || "";
    const allowedStatus = sectionStatus[`/admin/${segment}`];
    const status = user.status ?? (user.role === "dev_admin" ? 1 : 0);
    // Dev admin (1) can access everything; others only their own section
    if (allowedStatus && status !== 1 && status !== allowedStatus) {
      router.replace(getRoleHome(user.role));
    }
  }, [user, pathname, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}