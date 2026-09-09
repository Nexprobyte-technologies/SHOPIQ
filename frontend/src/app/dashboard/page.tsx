"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Boxes,
  Clock,
  BadgePercent,
  CircleDollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";

const stats = [
  {
    label: "Today's Sales",
    value: "₹18,450",
    change: "+12.5%",
    up: true,
    icon: IndianRupee,
    iconBg: "bg-primary-50 text-primary",
    sub: "vs yesterday",
  },
  {
    label: "Transactions",
    value: "142",
    change: "+8.2%",
    up: true,
    icon: ShoppingCart,
    iconBg: "bg-success-50 text-success",
    sub: "vs yesterday",
  },
  {
    label: "Low Stock Items",
    value: "23",
    change: "-5 this week",
    up: false,
    icon: Package,
    iconBg: "bg-warning-50 text-warning",
    sub: "needs reorder",
  },
  {
    label: "Active Customers",
    value: "1,528",
    change: "+3.1%",
    up: true,
    icon: Users,
    iconBg: "bg-purple-50 text-purple",
    sub: "this month",
  },
];

const aiInsights = [
  {
    type: "Sales Drop",
    color: "text-danger bg-danger-50",
    icon: TrendingUp,
    title: "Sales down 18% today",
    message: "Evening sales dropped 22% compared to last week. Consider extending evening hours or launching a celebration offer.",
    time: "2 min ago",
    priority: "High",
  },
  {
    type: "Stock Alert",
    color: "text-warning bg-warning-50",
    icon: AlertTriangle,
    title: "Aavin Milk stock-out expected tomorrow",
    message: "Current: 8 units | Avg daily sale: 6 | Expected stock-out: Tomorrow",
    time: "15 min ago",
    priority: "Critical",
  },
  {
    type: "Dead Stock",
    color: "text-purple bg-purple-50",
    icon: Boxes,
    title: "17 products haven't moved in 60 days",
    message: "Consider a Buy 1 Get 1 or bundle these with bestsellers to recover ₹12,450 locked capital.",
    time: "1 hr ago",
    priority: "Medium",
  },
  {
    type: "Refill Reminder",
    color: "text-success bg-success-50",
    icon: BadgePercent,
    title: "Ramesh may be due for refill",
    message: "He buys Sunlight Soap every 28 days. Last purchase was 27 days ago. Send a WhatsApp reminder?",
    time: "2 hrs ago",
    priority: "High",
  },
];

const rapidReorder = [
  { name: "Aavin Milk", current: 8, avg: 6, days: 1, supplier: "Dairy Supplier Co.", units: 50, iconBg: "bg-primary-50 text-primary" },
  { name: "Parle G Biscuit", current: 15, avg: 10, days: 2, supplier: "United Distributors", units: 80, iconBg: "bg-success-50 text-success" },
  { name: "Surf Excel 1kg", current: 5, avg: 4, days: 1, supplier: "HUL Distributor", units: 30, iconBg: "bg-warning-50 text-warning" },
];

const topProducts = [
  { name: "Aavin Milk 500ml", qty: 68, revenue: 1700, growth: 4 },
  { name: "Parle G Glucose", qty: 52, revenue: 1040, growth: 2 },
  { name: "Tata Salt 1kg", qty: 41, revenue: 1148, growth: -3 },
  { name: "Surf Excel 1kg", qty: 33, revenue: 1815, growth: 5 },
  { name: "Colgate 150g", qty: 29, revenue: 1160, growth: 1 },
];

const healthFactors = [
  { label: "Sales Growth", value: 86, color: "bg-success" },
  { label: "Profit Margin", value: 24, color: "bg-warning" },
  { label: "Stock Turnover", value: 71, color: "bg-primary" },
  { label: "Customer Retention", value: 82, color: "bg-purple" },
  { label: "Dead Stock Risk", value: 35, color: "bg-danger" },
  { label: "Outstanding Credit", value: 58, color: "bg-info" },
];

const hourlySales = [25, 62, 38, 78, 92, 45, 68, 110, 85, 54, 32, 40];

export default function DashboardPage() {
  const maxHourly = Math.max(...hourlySales);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Good Morning, Marilyn 👋</h1>
          <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening at your shop today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Last 7 days</Button>
          <Button size="sm">New Bill</Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", s.iconBg)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  s.up ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
                )}>
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-dark">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left: Sales chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">Last 30 days vs previous period</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-primary" /> This period
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-gray-200" /> Previous
              </span>
              <Badge variant="success">+12.5% ↑</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-1.5">
              {[42, 55, 48, 62, 38, 70, 58, 65, 80, 52, 74, 60].map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div
                      className="w-full rounded-t bg-primary/90 transition-all hover:bg-primary"
                      style={{ height: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-border-color pt-3">
              <div>
                <p className="text-xs text-gray-400">Total Revenue</p>
                <p className="text-lg font-bold text-dark">₹4,82,300</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Avg / day</p>
                <p className="text-lg font-bold text-dark">₹16,077</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Health Score */}
        <Card>
          <CardHeader>
            <CardTitle>Business Health</CardTitle>
            <Badge variant="success">Improved +2</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center pb-4">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(243 244 246)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke="rgb(16 185 129)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(82/100)*339.29} 339.29`}
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-dark">82</p>
                  <p className="text-xs text-gray-400">/ 100</p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm font-medium text-success">
                <TrendingUp className="h-4 w-4" /> Good health
              </p>
            </div>

            <div className="space-y-3">
              {healthFactors.map((f) => (
                <div key={f.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-gray-600">{f.label}</span>
                    <span className="font-medium text-gray-900">{f.value}%</span>
                  </div>
                  <Progress value={f.value} indicatorClassName={f.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-danger">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <CardTitle>AI Insights</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {aiInsights.map((insight) => (
              <div
                key={insight.title}
                className="rounded-xl border border-border-color p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", insight.color)}>
                    <insight.icon className="h-4 w-4" />
                  </div>
                  <Badge variant={insight.priority === "Critical" ? "danger" : insight.priority === "High" ? "warning" : "info"}>
                    {insight.priority}
                  </Badge>
                </div>
                <p className="mt-3 text-sm font-semibold text-dark">{insight.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{insight.message}</p>
                <p className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock className="h-3 w-3" /> {insight.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Reorder */}
        <Card>
          <CardHeader>
            <CardTitle>Rapid Re-Order</CardTitle>
            <Badge variant="danger">3 critical</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {rapidReorder.map((p) => (
              <div key={p.name} className="rounded-lg border border-border-color p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", p.iconBg)}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark">{p.name}</p>
                      <p className="text-xs text-gray-400">Supplier: {p.supplier}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-gray-500">
                    Stock: <span className="font-semibold text-danger">{p.current}</span>
                  </span>
                  <span className="text-gray-500">Avg/day: {p.avg}</span>
                  <span className="text-gray-500">
                    Stock-out: <span className="font-semibold text-warning">{p.days}d</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Order <span className="text-primary">{p.units} units?</span>
                  </span>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs">Skip</Button>
                    <Button size="sm" className="h-7 px-2.5 text-xs">
                      <CircleDollarSign className="h-3 w-3" /> WhatsApp Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">View all</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                  {p.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-dark">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.qty} units sold · {formatINR(p.revenue)}</p>
                </div>
                <span className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  p.growth >= 0 ? "text-success" : "text-danger"
                )}>
                  {p.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {p.growth}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Peak hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <Badge variant="primary">Peak at 6 PM</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-1.5">
              {hourlySales.map((v, i) => (
                <div key={i} className="group relative flex flex-1 flex-col items-center justify-end">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      i === 7 ? "bg-danger" : v < 40 ? "bg-gray-200" : "bg-primary/70"
                    )}
                    style={{ height: `${(v / maxHourly) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2 border-t border-border-color pt-3">
              <div className="flex items-center justify-between rounded-lg bg-primary-50 p-2.5">
                <span className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Peak hour detected
                </span>
                <span className="text-xs font-bold text-dark">6 PM – 7 PM</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">
                Sales are highest at 6 PM. Ensure enough cash in counter and staff during this window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
