"use client";

import { useEffect, useState } from "react";
import { Boxes, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
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
  confirm_status_display?: string;
  created_at: string;
}

const typeTone: Record<string, string> = {
  received: "success",
  increase: "primary",
  decrease: "danger",
  adjustment: "warning",
  return: "purple",
};

export default function SuperStackPage() {
  const [entries, setEntries] = useState<StackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    product: "",
    stack_type: "received",
    quantity: "10",
    unit_cost: "0",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .listStacks<{ results?: StackEntry[] }>(filter ? `?stack_type=${filter}` : "")
      .then((d) => setEntries(d.results ?? (Array.isArray(d) ? d : [])))
      .catch(() => {});
  };

  useEffect(() => {
    api
      .listStacks<{ results?: StackEntry[] }>(filter ? `?stack_type=${filter}` : "")
      .then((d) => setEntries(d.results ?? (Array.isArray(d) ? d : [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const todayTotal = entries
    .filter((e) => e.stack_type === "increase" || e.stack_type === "received")
    .reduce((sum, e) => sum + parseFloat(e.total_value || "0"), 0);
  const decreaseTotal = entries
    .filter((e) => e.stack_type === "decrease")
    .reduce((sum, e) => sum + Number(e.quantity || 0), 0);

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product) return;
    setSaving(true);
    try {
      await api.createStack({
        product: form.product,
        stack_type: form.stack_type,
        quantity: parseInt(form.quantity),
        unit_cost: parseFloat(form.unit_cost),
        notes: form.notes,
      });
      setForm({ product: "", stack_type: "received", quantity: "10", unit_cost: "0", notes: "" });
      load();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Stack Data"
        description="Stack received, increase & decrease records"
        actions={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-44">
            <option value="">All types</option>
            <option value="received">Stack Received</option>
            <option value="increase">Stack Increase</option>
            <option value="decrease">Stack Decrease</option>
            <option value="adjustment">Adjustment</option>
            <option value="return">Return</option>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="In / Received Value" value={`₹${todayTotal.toLocaleString("en-IN")}`} icon={Boxes} tone="success" />
        <StatCard label="Decrease Qty" value={String(decreaseTotal)} icon={Boxes} tone="danger" />
        <StatCard label="Total Entries" value={String(entries.length)} icon={Boxes} tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stack Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : entries.length === 0 ? (
              <p className="text-sm text-gray-400">No stack records yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-color text-xs uppercase tracking-wide text-gray-400">
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Value</th>
                      <th className="pb-2">Status</th>
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
                        <td className="py-3">₹{parseFloat(e.total_value || "0").toLocaleString("en-IN")}</td>
                        <td className="py-3">
                          <Badge variant={e.confirm_status === "confirmed" ? "success" : e.confirm_status === "cancelled" ? "danger" : "warning"}>
                            {e.confirm_status_display || e.confirm_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Stack Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addEntry} className="space-y-3">
              <Input placeholder="Product UUID *" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required />
              <Select value={form.stack_type} onChange={(e) => setForm({ ...form, stack_type: e.target.value })}>
                <option value="received">Stack Received</option>
                <option value="increase">Stack Increase</option>
                <option value="decrease">Stack Decrease</option>
                <option value="adjustment">Adjustment</option>
                <option value="return">Return</option>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                <Input type="number" step="0.01" placeholder="Unit cost" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: e.target.value })} />
              </div>
              <Textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <Button type="submit" className="w-full" disabled={saving}>
                <Plus className="h-4 w-4" /> {saving ? "Adding..." : "Add Stack Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
