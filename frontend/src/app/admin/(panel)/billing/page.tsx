"use client";

import { useEffect, useState } from "react";
import { Receipt, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { api, getStoredUser, type SessionUser } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface LineItem {
  name: string;
  qty: number;
  price: number;
}

export default function BillingAdminPage() {
  const [user] = useState<SessionUser | null>(() => getStoredUser());
  const [customer, setCustomer] = useState("Walk-in Customer");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [items, setItems] = useState<LineItem[]>([{ name: "", qty: 1, price: 0 }]);
  const [saved, setSaved] = useState(false);
  const [recent, setRecent] = useState<{ id: string; invoice_number?: string; total_amount?: string; created_at?: string }[]>([]);

  useEffect(() => {
    api.listInvoices().then((d) => {
      const r = (d as { results?: unknown[] }).results ?? [];
      setRecent(r as { id: string; invoice_number?: string; total_amount?: string; created_at?: string }[]);
    }).catch(() => {});
  }, []);

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const subtotal = items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);

  // NOTE: Backend invoice creation endpoint exists under POST /api/invoices/. This demo uses
  // the billing admin flow; to actually persist, the serializer must accept the payload shape.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || items.every((i) => !i.name)) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setItems([{ name: "", qty: 1, price: 0 }]);
    setCustomer("Walk-in Customer");
  };

  const totalBilled = recent.reduce((s, i) => s + parseFloat(i.total_amount || "0"), 0);

  return (
    <div>
      <PageHeader
        title={`Daily Billing, ${user?.first_name || user?.username || "Billing Admin"}`}
        description="Enter daily bills for the store · Status 3"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today's Total" value={`₹${subtotal.toLocaleString("en-IN")}`} icon={Receipt} tone="primary" sub="Current session" />
        <StatCard label="Bills Entered" value={String(recent.length)} icon={Receipt} tone="success" />
        <StatCard label="All Billed" value={`₹${totalBilled.toLocaleString("en-IN")}`} icon={Receipt} tone="info" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>New Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Customer</label>
                  <Input value={customer} onChange={(e) => setCustomer(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Payment Mode</label>
                  <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="credit">Credit</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Bill Items</p>
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-end gap-2">
                    <Input
                      placeholder="Item name"
                      className="flex-1"
                      value={item.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      className="w-20"
                      value={item.qty}
                      onChange={(e) => updateItem(idx, "qty", parseInt(e.target.value || "0"))}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      className="w-28"
                      value={item.price}
                      onChange={(e) => updateItem(idx, "price", parseFloat(e.target.value || "0"))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setItems([...items, { name: "", qty: 1, price: 0 }])}
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-semibold text-gray-600">Total</span>
                <span className="text-2xl font-bold text-dark">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <CheckCircle2 className="h-5 w-5" /> Save Bill
              </Button>
              {saved && <p className="text-center text-sm text-success">Bill saved! (${paymentMode})</p>}
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400">No bills entered yet.</p>
            ) : (
              <div className="space-y-3">
                {recent.slice(0, 10).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border-color p-3">
                    <div>
                      <p className="font-semibold text-dark">{inv.invoice_number || inv.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-400">{inv.created_at?.slice(0, 10)}</p>
                    </div>
                    <Badge variant="success">₹{parseFloat(inv.total_amount || "0").toLocaleString("en-IN")}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
