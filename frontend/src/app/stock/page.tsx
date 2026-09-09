"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Boxes, Package, AlertTriangle, Truck, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const reorders = [
  { id: "RO-102", product: "Aavin Milk 500ml", current: 8, avg: 6, days: 1, qty: 50, supplier: "Dairy Supplier Co.", phone: "+91 98765 43210", status: "pending", time: "2 min ago" },
  { id: "RO-101", product: "Surf Excel 1kg", current: 5, avg: 4, days: 1, qty: 30, supplier: "HUL Distributor", phone: "+91 97654 32109", status: "approved", time: "25 min ago" },
  { id: "RO-100", product: "Old Gold Flour 1kg", current: 18, avg: 9, days: 2, qty: 60, supplier: "Aashirvaad Dist.", phone: "+91 96543 21098", status: "sent", time: "1 hr ago" },
  { id: "RO-099", product: "Colgate 150g", current: 0, avg: 5, days: 0, qty: 40, supplier: "Colgate-Palmolive", phone: "+91 95432 10987", status: "delivered", time: "3 hrs ago" },
  { id: "RO-098", product: "Amul Butter 100g", current: 45, avg: 12, days: 4, qty: 30, supplier: "Amul Dist.", phone: "+91 94321 09876", status: "cancelled", time: "Yesterday" },
];

const statusConfig: Record<string, { label: string; variant: "warning" | "info" | "primary" | "success" | "gray" }> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "info" },
  sent: { label: "Order Sent", variant: "primary" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "gray" },
};

export default function StockPage() {
  const pendingCount = reorders.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Stock & Auto Re-Order</h1>
          <p className="text-sm text-gray-500">AI identifies stock-outs and creates one-click supplier orders.</p>
        </div>
        <Badge variant="danger" className="text-sm px-3 py-1">{pendingCount} pending reorders</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger"><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <p className="text-xl font-bold text-dark">3</p>
            <p className="text-xs text-gray-500">Stock-out in 2 days</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning"><Package className="h-5 w-5" /></div>
          <div>
            <p className="text-xl font-bold text-dark">17</p>
            <p className="text-xs text-gray-500">Dead stock items</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success"><Truck className="h-5 w-5" /></div>
          <div>
            <p className="text-xl font-bold text-dark">8</p>
            <p className="text-xs text-gray-500">Orders sent today</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Boxes className="h-5 w-5" /></div>
          <div>
            <p className="text-xl font-bold text-dark">₹2,84,500</p>
            <p className="text-xs text-gray-500">Stock value</p>
          </div>
        </CardContent></Card>
      </div>

      {/* Reorder list */}
      <Card>
        <CardHeader>
          <CardTitle>Reorder Suggestions</CardTitle>
          <p className="text-xs text-gray-400">Based on average daily sales and current stock</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-color text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4 font-semibold">Product</th>
                  <th className="pb-3 pr-4 font-semibold">Current</th>
                  <th className="pb-3 pr-4 font-semibold">Avg/Day</th>
                  <th className="pb-3 pr-4 font-semibold">Stock-out</th>
                  <th className="pb-3 pr-4 font-semibold">Suggest Qty</th>
                  <th className="pb-3 pr-4 font-semibold">Supplier</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {reorders.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-dark">{r.product}</p>
                      <p className="text-xs text-gray-400">{r.id} · {r.time}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn("font-bold", r.current === 0 ? "text-danger" : r.current <= 10 ? "text-warning" : "text-dark")}>
                        {r.current}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{r.avg}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={r.days <= 1 ? "danger" : "warning"}>in {r.days}d</Badge>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-primary">{r.qty} units</td>
                    <td className="py-3 pr-4 text-gray-500">{r.supplier}</td>
                    <td className="py-3 pr-4"><Badge variant={statusConfig[r.status].variant}>{statusConfig[r.status].label}</Badge></td>
                    <td className="py-3 text-right">
                      {r.status === "pending" && (
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs"><XCircle className="h-3 w-3" /> Skip</Button>
                          <Button size="sm" className="h-7 text-xs"><CheckCircle2 className="h-3 w-3" /> Approve</Button>
                        </div>
                      )}
                      {r.status === "approved" && (
                        <Button size="sm" className="h-7 text-xs"><Truck className="h-3 w-3" /> Send WhatsApp Order</Button>
                      )}
                      {(r.status === "sent" || r.status === "delivered") && (
                        <span className="text-xs text-gray-400">{r.status === "sent" ? "Awaiting delivery" : `Delivered ${formatDate("2026-09-09")}`}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
