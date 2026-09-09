"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  Receipt,
  Boxes,
  CalendarCheck,
  FileText,
  Truck,
  Shield,
  LogOut,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStoredUser, getRoleHome, DJANGO_ADMIN_URL, ADMIN_USERS_URL, type SessionUser } from "@/lib/api";
import { useState } from "react";

const roleMeta: Record<string, { title: string; subtitle: string }> = {
  1: { title: "Dev Admin", subtitle: "Full System Access" },
  2: { title: "Super Admin", subtitle: "Business Overview" },
  3: { title: "Billing Admin", subtitle: "Daily Billing" },
  4: { title: "Stock Admin", subtitle: "Stack & Delivery" },
};

interface NavItem {
  href: string;
  label: string;
  icon: typeof Store;
  badge?: string;
  external?: boolean;
}

function navFor(status: number): { section: string; items: NavItem[] }[] {
  const wrap = (items: NavItem[], base: string) =>
    items.map((i) => ({ ...i, href: i.href.startsWith("/") ? i.href : `/${base}/${i.href}` }));

  if (status === 3) {
    // Billing Admin - only billing
    return [
      {
        section: "Billing",
        items: wrap(
          [
            { href: "page", label: "Billing Dashboard", icon: LayoutDashboard },
            { href: "page#enter", label: "Enter Daily Bill", icon: Receipt },
          ],
          "admin/billing"
        ),
      },
    ];
  }

  if (status === 4) {
    // Stock Admin - stack + delivery
    return [
      {
        section: "Stock",
        items: wrap(
          [
            { href: "page", label: "Stack Dashboard", icon: LayoutDashboard },
            { href: "page#receive", label: "Stack Received", icon: Boxes },
            { href: "deliveries", label: "Pack & Delivery", icon: Truck },
          ],
          "admin/stock"
        ),
      },
    ];
  }

  if (status === 2) {
    // Super Admin
    return [
      {
        section: "Overview",
        items: [
          { href: "/admin/super", label: "Dashboard", icon: LayoutDashboard },
          { href: "/admin/super/stores", label: "Stores", icon: Store },
          { href: "/admin/super/billing", label: "Billing & Payments", icon: Receipt },
        ],
      },
      {
        section: "Operations",
        items: [
          { href: "/admin/super/stack", label: "Stack (Minose/Increase)", icon: Boxes },
          { href: "/admin/super/attendance", label: "Employee Attendance", icon: CalendarCheck },
          { href: "/admin/super/reports", label: "Stack Report", icon: FileText },
        ],
      },
    ];
  }

  // Dev Admin - Django admin + access-check all panels
  return [
    {
      section: "Dev Admin (Django)",
      items: [
        { href: DJANGO_ADMIN_URL, label: "Django Admin Panel", icon: Shield, external: true },
        { href: ADMIN_USERS_URL, label: "Manage Users", icon: Users, badge: "12-digit", external: true },
      ],
    },
    {
      section: "Access Check",
      items: [
        { href: "/admin/super", label: "Super Admin Panel", icon: Shield },
        { href: "/admin/billing", label: "Billing Admin Panel", icon: Receipt },
        { href: "/admin/stock", label: "Stack Admin Panel", icon: Boxes },
        { href: "/admin/stock/deliveries", label: "Delivery Tracking", icon: Truck },
      ],
    },
  ];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useState<SessionUser | null>(() => getStoredUser());

  if (!user) return null;
  const status = user.status ?? (user.role === "dev_admin" ? 1 : 0);
  const meta = roleMeta[String(status)] || { title: "Admin", subtitle: "SHOPIQ" };
  const nav = navFor(status);
  const myPanel = getRoleHome(user.role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[linear-gradient(180deg,#5711f6_0%,#7a1bf0_100%)] text-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight">SHOPIQ Admin</p>
          <p className="text-[11px] leading-tight text-white/70">{meta.title}</p>
        </div>
      </div>

      <div className="border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.username}</p>
            <p className="truncate text-[11px] text-white/70">{meta.subtitle}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href.split("#")[0];
                const className = cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-white text-primary shadow-sm" : "text-white/85 hover:bg-white/10"
                );
                const iconCls = cn(
                  "h-[18px] w-[18px]",
                  active ? "text-primary" : "text-white/60 group-hover:text-white"
                );
                const badge = item.badge && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{item.badge}</span>
                );
                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={className}
                    >
                      <item.icon className={iconCls} />
                      <span className="flex-1">{item.label}</span>
                      {badge}
                    </a>
                  );
                }
                return (
                  <Link key={item.href} href={item.href} className={className}>
                    <item.icon className={iconCls} />
                    <span className="flex-1">{item.label}</span>
                    {badge}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        {myPanel.startsWith("http") ? (
          <a
            href={myPanel}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
          >
            <KeyRound className="h-[18px] w-[18px] text-white/60" />
            Django Admin
          </a>
        ) : (
          <Link
            href={myPanel}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
          >
            <KeyRound className="h-[18px] w-[18px] text-white/60" />
            My Panel
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-danger/80"
        >
          <LogOut className="h-[18px] w-[18px] text-white/60" />
          Logout
        </button>
      </div>
    </aside>
  );
}
