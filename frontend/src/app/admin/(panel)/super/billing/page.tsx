"use client";

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  invoice_number: string;
  customer?: string;
  total_amount: string;
  paid_amount: string;
  payment_status: string;
  payment_mode?: string;
  created_at?: string;
}

const payTone: Record<string, string> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
  credit: "info",
};

export default function SuperBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listInvoices()
      .then((d) => {
        const r = (d as { results?: Invoice[] }).results ?? (Array.isArray(d) ? d : []);
        setInvoices(r);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalBilled = invoices.reduce((s, i) => s + parseFloat(i.total_amount || "0"), 0);
  const totalCollected = invoices.reduce((s, i) => s + parseFloat(i.paid_amount || "0"), 0);
  const outstanding = invoices.filter((i) => i.payment_status === "credit" || i.payment_status === "unpaid").length;

  return (
    <div>
      <PageHeader title="Billing & Payments" description="All daily bills and payment details" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Billed" value={`₹${totalBilled.toLocaleString("en-IN")}`} icon={Receipt} tone="primary" />
        <StatCard label="Total Collected" value={`₹${totalCollected.toLocaleString("en-IN")}`} icon={Receipt} tone="success" />
        <StatCard label="Credit / Unpaid Bills" value={String(outstanding)} icon={Receipt} tone="danger" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-gray-400">No invoices yet. Billing admin will add daily bills.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-color text-xs uppercase tracking-wide text-gray-400">
                    <th className="pb-2">Invoice #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Paid</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 15).map((inv) => (
                    <tr key={inv.id} className="border-b border-border-color last:border-0">
                      <td className="py-3 font-medium text-dark">{inv.invoice_number || inv.id.slice(0, 8)}</td>
                      <td className="py-3">{inv.customer || "-"}</td>
                      <td className="py-3">₹{parseFloat(inv.total_amount || "0").toLocaleString("en-IN")}</td>
                      <td className="py-3">₹{parseFloat(inv.paid_amount || "0").toLocaleString("en-IN")}</td>
                      <td className="py-3">
                        <Badge variant={(payTone[inv.payment_status] || "gray") as "success" | "warning" | "danger" | "info" | "gray"}>
                          {inv.payment_status}
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
    </div>
  );
}
