"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, CreditCard, Repeat, Sparkles, CheckCircle2 } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

const customers = [
  { id: "CU-001", name: "Ramesh Kumar", phone: "+91 98765 43210", visits: 42, total: 45230, credit: 0, frequency: 28, lastVisit: "2026-09-09", predicts: true },
  { id: "CU-002", name: "Sundar Raj", phone: "+91 97654 32109", visits: 18, total: 22345, credit: 1850, frequency: 12, lastVisit: "2026-09-08", predicts: true },
  { id: "CU-003", name: "Priya Sharma", phone: "+91 96543 21098", visits: 35, total: 38900, credit: 0, frequency: 7, lastVisit: "2026-09-09", predicts: false },
  { id: "CU-004", name: "Mohammed Ali", phone: "+91 95432 10987", visits: 27, total: 31200, credit: 0, frequency: 21, lastVisit: "2026-09-07", predicts: true },
  { id: "CU-005", name: "Lakshmi N", phone: "+91 94321 09876", visits: 52, total: 58900, credit: 3450, frequency: 5, lastVisit: "2026-09-08", predicts: false },
  { id: "CU-006", name: "Karthik V", phone: "+91 93210 98765", visits: 12, total: 14800, credit: 0, frequency: 30, lastVisit: "2026-09-06", predicts: true },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Customers</h1>
          <p className="text-sm text-gray-500">Track purchase patterns and predict return visits.</p>
        </div>
        <Button size="sm"><Users className="h-3.5 w-3.5" /> Add Customer</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-dark">1,528</p><p className="text-xs text-gray-500">Total Customers</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-success">1,104</p><p className="text-xs text-gray-500">Repeat Customers</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-warning">{formatINR(5300)}</p><p className="text-xs text-gray-500">Outstanding Credit</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">26</p><p className="text-xs text-gray-500">Due for refill</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-danger">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <CardTitle>AI Return Predictions</CardTitle>
          </div>
          <Badge variant="success">Auto WhatsApp enabled</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-color text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4 font-semibold">Customer</th>
                  <th className="pb-3 pr-4 font-semibold">Orders</th>
                  <th className="pb-3 pr-4 font-semibold">Total Spend</th>
                  <th className="pb-3 pr-4 font-semibold">Credit</th>
                  <th className="pb-3 pr-4 font-semibold">Frequency</th>
                  <th className="pb-3 pr-4 font-semibold">Confidence</th>
                  <th className="pb-3 font-semibold text-right">Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {customers.filter((c) => c.predicts).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-dark">{c.name}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400"><Phone className="h-3 w-3" /> {c.phone}</p>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{c.visits}</td>
                    <td className="py-3 pr-4 font-medium text-dark">{formatINR(c.total)}</td>
                    <td className="py-3 pr-4">
                      {c.credit > 0 ? (
                        <span className="flex items-center gap-1 font-medium text-danger"><CreditCard className="h-3 w-3" /> {formatINR(c.credit)}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1 text-gray-500"><Repeat className="h-3 w-3" /> every {c.frequency}d</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-success" style={{ width: "92%" }} />
                        </div>
                        <span className="text-xs font-medium text-success">92%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Refill due {formatDate("2026-09-11")}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Customers</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-color text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4 font-semibold">Customer</th>
                  <th className="pb-3 pr-4 font-semibold">Phone</th>
                  <th className="pb-3 pr-4 font-semibold">Visits</th>
                  <th className="pb-3 pr-4 font-semibold">Total Spend</th>
                  <th className="pb-3 pr-4 font-semibold">Credit</th>
                  <th className="pb-3 pr-4 font-semibold">Last Visit</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary">
                          {c.name[0]}
                        </div>
                        <p className="font-medium text-dark">{c.name}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{c.phone}</td>
                    <td className="py-3 pr-4 text-gray-500">{c.visits}</td>
                    <td className="py-3 pr-4 font-medium text-dark">{formatINR(c.total)}</td>
                    <td className="py-3 pr-4">{c.credit > 0 ? <span className="font-medium text-danger">{formatINR(c.credit)}</span> : <span className="text-gray-400">—</span>}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(c.lastVisit)}</td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Send WhatsApp</Button>
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
