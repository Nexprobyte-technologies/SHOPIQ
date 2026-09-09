"use client";

import { useEffect, useState } from "react";
import { Truck, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Delivery {
  id: string;
  order_reference: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_city?: string;
  pack_status: string;
  delivery_status: string;
  courier_name?: string;
  tracking_number?: string;
  delivery_agent?: string;
  created_at?: string;
}

const PACK_OPTIONS = ["not_packed", "packed", "ready_for_dispatch", "dispatched"];
const DELIVERY_OPTIONS = ["pending", "in_transit", "out_for_delivery", "delivered", "failed", "returned"];
const DELIVERY_TONE: Record<string, string> = {
  pending: "warning",
  in_transit: "info",
  out_for_delivery: "primary",
  delivered: "success",
  failed: "danger",
  returned: "gray",
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    order_reference: "",
    customer_name: "",
    customer_phone: "",
    delivery_city: "",
    delivery_address: "",
  });

  const load = () => {
    api
      .listDeliveries<{ results?: Delivery[] }>(filter ? `?delivery_status=${filter}` : "")
      .then((d) => setDeliveries(d.results ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api
      .listDeliveries<{ results?: Delivery[] }>(filter ? `?delivery_status=${filter}` : "")
      .then((d) => setDeliveries(d.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const update = async (id: string, body: Partial<Delivery>) => {
    try {
      await api.updateDelivery(id, body);
      load();
    } catch {
      // ignore
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.order_reference) return;
    setSaving(true);
    try {
      await api.createDelivery(form);
      setForm({ order_reference: "", customer_name: "", customer_phone: "", delivery_city: "", delivery_address: "" });
      setShowAdd(false);
      load();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const delivered = deliveries.filter((d) => d.delivery_status === "delivered").length;
  const inTransit = deliveries.filter((d) => d.delivery_status === "in_transit" || d.delivery_status === "out_for_delivery").length;

  return (
    <div>
      <PageHeader
        title="Pack & Delivery Tracking"
        description="Track packing and delivery with dropdown statuses"
        actions={
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4" /> New Order
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Orders" value={String(deliveries.length)} icon={Truck} tone="primary" />
        <StatCard label="Delivered" value={String(delivered)} icon={Truck} tone="success" />
        <StatCard label="In Transit" value={String(inTransit)} icon={Truck} tone="info" />
      </div>

      {showAdd && (
        <Card className="mb-6 mt-2">
          <CardHeader>
            <CardTitle>New Delivery Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={create} className="grid gap-3 sm:grid-cols-4">
              <Input placeholder="Order Reference *" value={form.order_reference} onChange={(e) => setForm({ ...form, order_reference: e.target.value })} required />
              <Input placeholder="Customer Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              <Input placeholder="Customer Phone" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
              <Input placeholder="City" value={form.delivery_city} onChange={(e) => setForm({ ...form, delivery_city: e.target.value })} />
              <div className="sm:col-span-4">
                <Textarea placeholder="Delivery Address" value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} />
              </div>
              <div className="sm:col-span-4">
                <Button type="submit" variant="success" disabled={saving}>
                  {saving ? "Saving..." : "Create Delivery Order"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-48">
            <option value="">All statuses</option>
            {DELIVERY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : deliveries.length === 0 ? (
            <p className="text-sm text-gray-400">No delivery orders yet.</p>
          ) : (
            <div className="space-y-4">
              {deliveries.map((d) => (
                <div key={d.id} className="rounded-xl border border-border-color p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-dark">{d.order_reference}</p>
                      <p className="text-xs text-gray-400">
                        {d.customer_name || "Walk-in"} · {d.customer_phone || "N/A"} · {d.delivery_city || "-"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={(DELIVERY_TONE[d.delivery_status] || "gray") as "success" | "danger" | "warning" | "info" | "primary" | "gray"}>
                        {d.delivery_status.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant={d.pack_status === "dispatched" ? "success" : d.pack_status === "not_packed" ? "warning" : "info"}>
                        {d.pack_status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Pack Status</label>
                      <select
                        value={d.pack_status}
                        onChange={(e) => update(d.id, { pack_status: e.target.value })}
                        className="h-9 w-full rounded-lg border border-border-color bg-white px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        {PACK_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Delivery Status</label>
                      <select
                        value={d.delivery_status}
                        onChange={(e) => update(d.id, { delivery_status: e.target.value })}
                        className="h-9 w-full rounded-lg border border-border-color bg-white px-3 text-sm focus:border-primary focus:outline-none"
                      >
                        {DELIVERY_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Courier</label>
                      <Input
                        defaultValue={d.courier_name || ""}
                        className="mt-1 h-9"
                        placeholder="Courier name"
                        onBlur={(e) => e.target.value !== d.courier_name && update(d.id, { courier_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Tracking / Agent</label>
                      <Input
                        defaultValue={d.tracking_number || d.delivery_agent || ""}
                        className="mt-1 h-9"
                        placeholder="Tracking no. or agent"
                        onBlur={(e) => e.target.value !== (d.tracking_number || d.delivery_agent) && update(d.id, { tracking_number: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
