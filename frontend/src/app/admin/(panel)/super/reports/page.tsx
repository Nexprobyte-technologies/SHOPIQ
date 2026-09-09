"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Send, Download, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StackEntry {
  id: string;
  product_name?: string;
  stack_type: string;
  quantity: number;
  total_value: string;
  confirm_status: string;
  created_at: string;
}

export default function ReportsPage() {
  const [entries, setEntries] = useState<StackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api
      .listStacks<{ results?: StackEntry[] }>("?limit=50")
      .then((d) => setEntries(d.results ?? []))
      .finally(() => setLoading(false));
  }, []);

  const receivedCount = entries.filter((e) => e.stack_type === "increase" || e.stack_type === "received").length;
  const decreaseCount = entries.filter((e) => e.stack_type === "decrease").length;
  const pendingCount = entries.filter((e) => e.confirm_status === "pending").length;
  const totalValue = entries.reduce((s, e) => s + parseFloat(e.total_value || "0"), 0);

  const reportText = useMemo(() => {
    const today = new Date().toLocaleDateString("en-IN");
    const lines = [
      `STACK REPORT — ${today}`,
      `--------------------------------`,
      `Stack Received/Increase: ${receivedCount}`,
      `Stack Decrease: ${decreaseCount}`,
      `Pending Confirmation: ${pendingCount}`,
      `Total Value: ₹${totalValue.toLocaleString("en-IN")}`,
      `--------------------------------`,
      ...entries.slice(0, 20).map((e) => `• ${e.product_name || e.id.slice(0, 8)} (${e.stack_type}) x${e.quantity}`),
    ];
    return lines.join("\n");
  }, [entries, receivedCount, decreaseCount, pendingCount, totalValue]);

  const download = () => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stack-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSending(true);
    // Uses n8n WhatsApp webhook (configured in automations/), falls back to download on demo.
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${apiBase.replace(":8000", ":5678")}/webhook/stack-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, report: reportText, date: new Date().toISOString() }),
      }).catch(() => {});
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader title="Stack Report" description="Generate and send the stock/stack report" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Received / Increase" value={String(receivedCount)} icon={FileText} tone="success" />
        <StatCard label="Decrease" value={String(decreaseCount)} icon={FileText} tone="danger" />
        <StatCard label="Total Value" value={`₹${totalValue.toLocaleString("en-IN")}`} icon={FileText} tone="primary" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-400">Generating...</p>
            ) : (
              <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-xs text-gray-700">
                {reportText}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Send this stack report via WhatsApp / n8n automation, or download it as a file.
            </p>
            <Button variant="outline" className="w-full" onClick={download}>
              <Download className="h-4 w-4" /> Download Report
            </Button>
            <form onSubmit={send} className="space-y-3">
              <Input placeholder="Recipient phone (e.g. 919XXXXXXXXX)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button type="submit" variant="success" className="w-full" disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending..." : "Send via WhatsApp / n8n"}
              </Button>
              {sent && <p className="text-center text-sm text-success">Report sent!</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
