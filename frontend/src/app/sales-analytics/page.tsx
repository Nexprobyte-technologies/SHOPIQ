"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jan", sales: 210000, sold: 3200 },
  { month: "Feb", sales: 248000, sold: 3650 },
  { month: "Mar", sales: 225000, sold: 3400 },
  { month: "Apr", sales: 290000, sold: 4100 },
  { month: "May", sales: 310000, sold: 4450 },
  { month: "Jun", sales: 285000, sold: 4200 },
  { month: "Jul", sales: 332000, sold: 4700 },
  { month: "Aug", sales: 315000, sold: 4550 },
  { month: "Sep", sales: 348000, sold: 4900 },
];

const paymentSplit = [
  { label: "UPI", value: 46, color: "bg-primary", amount: 160200 },
  { label: "Cash", value: 34, color: "bg-success", amount: 118300 },
  { label: "Card", value: 12, color: "bg-warning", amount: 41760 },
  { label: "Credit", value: 8, color: "bg-danger", amount: 27840 },
];

const categoryPerformance = [
  { name: "Dairy", revenue: 84500, growth: 12, share: 24 },
  { name: "Grocery", revenue: 76200, growth: 8, share: 22 },
  { name: "Biscuits & Snacks", revenue: 51200, growth: 15, share: 15 },
  { name: "Personal Care", revenue: 43800, growth: -3, share: 13 },
  { name: "Detergents", revenue: 39100, growth: 5, share: 11 },
  { name: "Beverages", revenue: 28400, growth: -2, share: 8 },
];

export default function SalesAnalyticsPage() {
  const [range, setRange] = useState("monthly");
  const maxSales = Math.max(...monthlyData.map((d) => d.sales));
  const totalSales = monthlyData.reduce((s, d) => s + d.sales, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Sales Analytics</h1>
          <p className="text-sm text-gray-500">Deep insights into your revenue and performance.</p>
        </div>
        <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-40">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-dark">{formatINR(totalSales)}</p>
          <p className="text-xs font-medium text-success">+12.5% YoY</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-gray-500">Total Items Sold</p>
          <p className="text-xl font-bold text-dark">36,150</p>
          <p className="text-xs font-medium text-success">+9.8% YoY</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-gray-500">Avg Transaction</p>
          <p className="text-xl font-bold text-dark">{formatINR(430)}</p>
          <p className="text-xs font-medium text-success">+2.1%</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-gray-500">Gross Profit</p>
          <p className="text-xl font-bold text-success">{formatINR(87600)}</p>
          <p className="text-xs font-medium text-success">+14.3% YoY</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <Badge variant="success">+12.5% ↑</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-3">
              {monthlyData.map((d) => (
                <div key={d.month} className="group flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-100">{formatINR(d.sales)}</span>
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-primary/80 transition-all group-hover:bg-primary"
                      style={{ height: `${(d.sales / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-border-color pt-2">
              {monthlyData.map((d) => (
                <span key={d.month} className="flex-1 text-center text-xs text-gray-400">{d.month}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment split */}
        <Card>
          <CardHeader><CardTitle>Payment Split</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-1">
              {paymentSplit.map((p) => (
                <div key={p.label} className={cn("h-2.5 flex-1 rounded-full", p.color)} />
              ))}
            </div>
            <div className="space-y-3">
              {paymentSplit.map((p) => (
                <div key={p.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">{p.label}</span>
                    <span className="font-medium text-dark">{p.value}% · {formatINR(p.amount)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={cn("h-full rounded-full", p.color)} style={{ width: `${p.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category performance */}
      <Card>
        <CardHeader><CardTitle>Category Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categoryPerformance.map((c) => (
              <div key={c.name} className="rounded-xl border border-border-color p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-dark">{c.name}</p>
                  <span className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    c.growth >= 0 ? "text-success" : "text-danger"
                  )}>
                    {c.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {c.growth}%
                  </span>
                </div>
                <p className="mt-2 text-lg font-bold text-dark">{formatINR(c.revenue)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.share * 2.5}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{c.share}% of sales</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
