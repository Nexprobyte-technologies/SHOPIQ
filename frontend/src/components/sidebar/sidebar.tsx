"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  LineChart,
  Sparkles,
  Megaphone,
  Settings,
  Store,
  Mic,
  TrendingDown,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { section: "Main", items: [
    { href: "/dashboard", label: "AI Dashboard", icon: LayoutDashboard },
    { href: "/billing", label: "Billing", icon: ShoppingCart },
    { href: "/products", label: "Products", icon: Package },
    { href: "/stock", label: "Stock & Reorder", icon: Boxes },
    { href: "/customers", label: "Customers", icon: Users },
  ]},
  { section: "AI Insights", items: [
    { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
    { href: "/voice-billing", label: "Voice Billing", icon: Mic },
    { href: "/sales-analytics", label: "Sales Analytics", icon: LineChart },
    { href: "/health-score", label: "Health Score", icon: HeartPulse },
  ]},
  { section: "Automations", items: [
    { href: "/automations", label: "Auto Re-Order", icon: Megaphone },
    { href: "/why-sales-down", label: "Why Sales Down?", icon: TrendingDown },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border-color bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border-color px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-danger">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-dark">SHOPIQ</p>
          <p className="text-[11px] leading-tight text-gray-400">AI Business OS for Shops</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {mainNav.map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "text-gray-600 hover:bg-primary-50 hover:text-primary"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", active ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border-color p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary"
        >
          <Settings className="h-[18px] w-[18px] text-gray-400" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
