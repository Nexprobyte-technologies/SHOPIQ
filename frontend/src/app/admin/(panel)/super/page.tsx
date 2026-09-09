"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Receipt, Boxes, CalendarCheck, FileText, TrendingUp } from "lucide-react";
import { api, getStoredUser, type SessionUser } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent } from "@/components/ui/card";

export default function SuperDashboardPage() {
  const [user] = useState<SessionUser | null>(() => getStoredUser());
  const [stats, setStats] = useState({
    invoices: 0,
    stacks: 0,
    attendances: 0,
  });

  useEffect(() => {
    api.listInvoices().then((d) => setStats((s) => ({ ...s, invoices: d.count ?? 0 }))).catch(() => {});
    api.listStacks("?limit=1").then((d) => setStats((s) => ({ ...s, stacks: d.count ?? 0 }))).catch(() => {});
    api.listAttendances("?limit=1").then((d) => setStats((s) => ({ ...s, attendances: d.count ?? 0 }))).catch(() => {});
  }, []);

  const modules = [
    { href: "/admin/super/stores", label: "Store Data", desc: "All shop & store records", icon: Store },
    { href: "/admin/super/billing", label: "Billing & Payments", desc: "Daily bills + payment details", icon: Receipt, tone: "success" },
    { href: "/admin/super/stack", label: "Stack Data", desc: "Stack minose / stack increase", icon: Boxes, tone: "warning" },
    { href: "/admin/super/attendance", label: "Employee Attendance", desc: "Save & track attendance", icon: CalendarCheck, tone: "info" },
    { href: "/admin/super/reports", label: "Stack Report", desc: "Generate & send stack reports", icon: FileText, tone: "purple" },
  ];

  return (
    <div>
      <PageHeader
        title={`Super Admin, ${user?.first_name || user?.username || ""}`}
        description="Business overview across stores · Status 2"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Stores" value="1" icon={Store} tone="primary" sub="Sri Vinayaka Stores" />
        <StatCard label="Bills" value={String(stats.invoices)} icon={Receipt} tone="success" />
        <StatCard label="Stack Entries" value={String(stats.stacks)} icon={Boxes} tone="warning" />
        <StatCard label="Attendance Logs" value={String(stats.attendances)} icon={CalendarCheck} tone="info" />
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
        <TrendingUp className="h-4 w-4 text-primary" />
        Manage every part of the store below
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="transition-all hover:border-primary hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-5">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                  m.tone === "success" ? "bg-success-50 text-success"
                  : m.tone === "warning" ? "bg-warning-50 text-warning"
                  : m.tone === "info" ? "bg-info-50 text-info"
                  : m.tone === "purple" ? "bg-purple-50 text-purple"
                  : "bg-primary-50 text-primary"
                }`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-dark">{m.label}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{m.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
