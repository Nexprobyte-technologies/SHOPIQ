"use client";

import Link from "next/link";
import { Search, Bell, Moon, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getStoredUser, type SessionUser } from "@/lib/api";

const roleLabels: Record<string, string> = {
  dev_admin: "Dev Admin",
  super_admin: "Super Admin",
  billing_admin: "Billing Admin",
  stock_admin: "Stock Admin",
  shop_owner: "Shop Owner",
  shop_staff: "Shop Staff",
};

export function Topbar() {
  const [user] = useState<SessionUser | null>(() => getStoredUser());

  const isAdmin = user && ["dev_admin", "super_admin", "billing_admin", "stock_admin"].includes(user.role);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border-color bg-white/90 px-6 backdrop-blur">
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search products, customers, invoices..."
          className="h-9.5 w-72 rounded-lg border border-border-color bg-gray-50 pl-9 pr-14 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border-color bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isAdmin && (
          <Link href="/admin">
            <Button variant="secondary" size="sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Panel
            </Button>
          </Link>
        )}

        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <Download className="h-3.5 w-3.5" />
          Export Report
        </Button>

        <button className="topbar-btn relative flex h-9 w-9 items-center justify-center rounded-full border border-border-color text-gray-500 transition-colors hover:bg-light hover:text-primary">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>

        <button className="topbar-btn flex h-9 w-9 items-center justify-center rounded-full border border-border-color text-gray-500 transition-colors hover:bg-light hover:text-primary">
          <Moon className="h-[18px] w-[18px]" />
        </button>

        <div className="ml-2 flex items-center gap-3 border-l border-border-color pl-4">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-dark">
              {user?.first_name || user?.username || "Guest"}
            </p>
            <p className="text-[11px] text-gray-400">
              {user ? roleLabels[user.role] || user.role : "Not signed in"}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple text-sm font-semibold text-white">
            {(user?.username || "?").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}