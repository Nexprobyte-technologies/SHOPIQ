"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Search, Plus, Download, Printer, Eye, Trash2 } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

const invoices = [
  { id: "INV-2026-00891", customer: "Ramesh Kumar", date: "2026-09-09T09:30:00", items: 6, total: 1245, paid: 1245, status: "paid", mode: "UPI" },
  { id: "INV-2026-00890", customer: "Sundar Raj", date: "2026-09-09T09:15:00", items: 3, total: 680, paid: 0, status: "credit", mode: "Credit" },
  { id: "INV-2026-00889", customer: "Priya Sharma", date: "2026-09-09T08:55:00", items: 2, total: 340, paid: 340, status: "paid", mode: "Cash" },
  { id: "INV-2026-00888", customer: "Walk-in Customer", date: "2026-09-09T08:40:00", items: 4, total: 920, paid: 920, status: "paid", mode: "Card" },
  { id: "INV-2026-00887", customer: "Mohammed Ali", date: "2026-09-09T08:22:00", items: 8, total: 1875, paid: 1875, status: "paid", mode: "UPI" },
  { id: "INV-2026-00886", customer: "Lakshmi N", date: "2026-09-08T18:30:00", items: 3, total: 455, paid: 200, status: "partial", mode: "Cash" },
  { id: "INV-2026-00885", customer: "Karthik V", date: "2026-09-08T18:12:00", items: 5, total: 1120, paid: 1120, status: "paid", mode: "UPI" },
  { id: "INV-2026-00884", customer: "Divya B", date: "2026-09-08T17:58:00", items: 2, total: 260, paid: 0, status: "unpaid", mode: "Cash" },
];

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "purple"> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
  credit: "purple",
};

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || inv.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Billing</h1>
          <p className="text-sm text-gray-500">Create and manage invoices for your shop.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5" /> New Bill</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by invoice or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full sm:w-40">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
            <option value="credit">Credit</option>
          </Select>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-color text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4 font-semibold">Invoice</th>
                  <th className="pb-3 pr-4 font-semibold">Customer</th>
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Items</th>
                  <th className="pb-3 pr-4 font-semibold">Total</th>
                  <th className="pb-3 pr-4 font-semibold">Paid</th>
                  <th className="pb-3 pr-4 font-semibold">Mode</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/60">
                    <td className="py-3 pr-4 font-medium text-primary">{inv.id}</td>
                    <td className="py-3 pr-4 font-medium text-dark">{inv.customer}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(inv.date)}</td>
                    <td className="py-3 pr-4 text-gray-500">{inv.items}</td>
                    <td className="py-3 pr-4 font-semibold text-dark">{formatINR(inv.total)}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatINR(inv.paid)}</td>
                    <td className="py-3 pr-4"><Badge variant="outline">{inv.mode}</Badge></td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant[inv.status]} className="capitalize">{inv.status}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-primary-50 hover:text-primary" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-primary-50 hover:text-primary" title="Print">
                          <Printer className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-danger-50 hover:text-danger" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
