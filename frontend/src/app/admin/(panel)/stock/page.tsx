"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { api, getStoredUser, type SessionUser } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StackEntry {
  id: string;
  product: string;
  product_name?: string;
  supplier_name?: string;
  stack_type: string;
  stack_type_display?: string;
  quantity: number;
  unit_cost: string;
  total_value: string;
  confirm_status: string;
  created_at: string;
}

const typeTone: Record<string, string> = {
  received: "success",
  increase: "primary",
  decrease: "danger",
  adjustment: "warning",
  return: "purple",
};

export default function StockAdminPage() {
  const [user] = useState<SessionUser | null>(() => getStoredUser());
  const [entries, setEntries] = useState<StackEntry[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    api
      .listStacks<{ results?: StackEntry[] }>(filter ? `?confirm_status=${filter}` : "")
      .then((d) => setEntries(d.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const confirm = async (id: string, status: string) => {
    setConfirming(id);
    try {
      await api.confirmStack(id, { confirm_status: status });
      const d = await api.listStacks<{ results?: StackEntry[] }>(filter ? `?confirm_status=${filter}` : "");
      setEntries(d.results ?? []);
    } catch {
      // ignore
    } finally {
      setConfirming(null);
    }
  };

  const pendingCount = entries.filter((e) => e.confirm_status === "pending").length;
  const confirmedCount = entries.filter((e) => e.confirm_status === "confirmed").length;

  return (
    <div>
      <PageHeader
        title={`Stock Admin, ${user?.first_name || user?.username || ""}`}
        description="Stack received data — confirm, pack and delivery · Status 4"
        actions={
          <Link href="/admin/stock/deliveries">
            <Button variant="success"><Truck className="h-4 w-4" /> Pack & Delivery</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Confirmation" value={String(pendingCount)} icon={Boxes} tone="warning" />
        <StatCard label="Confirmed" value={String(confirmedCount)} icon={CheckCircle2} tone="success" />
        <StatCard label="Showing" value={filter === "pending" ? "Pending" : filter === "confirmed" ? "Confirmed" : "All"} icon={Boxes} tone="primary" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stack Received — Confirm</CardTitle>
          <div className="flex gap-2">
            {["pending", "confirmed", ""].map((f) => (
              <Button key={f || "all"} size="sm" variant={filter === f ? "primary" : "outline"} onClick={() => setFilter(f)}>
                {f === "" ? "All" : f[0].toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-400">No stack entries in this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-color text-xs uppercase tracking-wide text-gray-400">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Supplier</th>
                    <th className="pb-2">Value</th>
                    <th className="pb-2">Confirm</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b border-border-color last:border-0">
                      <td className="py-3 font-medium text-dark">{e.product_name || e.product}</td>
                      <td className="py-3">
                        <Badge variant={(typeTone[e.stack_type] || "gray") as "success" | "primary" | "danger" | "warning" | "purple" | "gray"}>
                          {e.stack_type_display || e.stack_type}
                        </Badge>
                      </td>
                      <td className="py-3">{e.quantity}</td>
                      <td className="py-3">{e.supplier_name || "-"}</td>
                      <td className="py-3">₹{parseFloat(e.total_value || "0").toLocaleString("en-IN")}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={e.confirm_status === "confirmed" ? "success" : "primary"}
                            disabled={e.confirm_status === "confirmed" || confirming === e.id}
                            onClick={() => confirm(e.id, "confirmed")}
                          >
                            {confirming === e.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {e.confirm_status === "confirmed" ? "Confirmed" : "Confirm"}
                          </Button>
                          {e.confirm_status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => confirm(e.id, "cancelled")}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
