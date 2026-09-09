"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const factors = [
  { label: "Sales Growth", value: 86, color: "bg-success", weight: "25%", desc: "Strong 12% growth this month vs last. Continue current promotions." },
  { label: "Profit Margin", value: 24, color: "bg-warning", weight: "20%", desc: "Margin dropped 3%. Renegotiate supplier pricing on top 10 items." },
  { label: "Stock Turnover", value: 71, color: "bg-primary", weight: "20%", desc: "Healthy rotation. 17 slow-moving items need attention." },
  { label: "Customer Retention", value: 82, color: "bg-purple", weight: "20%", desc: "72% of customers return within 30 days. Great loyalty." },
  { label: "Dead Stock Risk", value: 35, color: "bg-danger", weight: "10%", desc: "₹12,450 locked in 17 dead items. Run clearance offer." },
  { label: "Outstanding Credit", value: 58, color: "bg-info", weight: "5%", desc: "₹5,300 outstanding. Recover from 2 credit customers." },
];

const recommendations = [
  { title: "Run a combo offer", impact: "+₹18K/month", desc: "Bundle Parle G + Lux Soap with ₹5 discount on ₹100 basket." },
  { title: "Recover outstanding credit", impact: "+₹5.3K cash", desc: "2 customers overdue by 30+ days. Send WhatsApp reminders." },
  { title: "Clear 17 dead stock items", impact: "+₹12.4K cash", desc: "Buy 1 Get 1 on slow movers could unlock locked capital." },
  { title: "Reorder 3 critical items", impact: "-18% lost sales", desc: "Avoid stock-outs on Aavin Milk, Surf Excel, Colgate tomorrow." },
];

export default function HealthScorePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark">Business Health</h1>
            <Badge variant="success" className="gap-1"><TrendingUp className="h-3 w-3" /> +2 this week</Badge>
          </div>
          <p className="text-sm text-gray-500">One screen to understand your entire business.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Score */}
        <Card>
          <CardHeader><CardTitle>Overall Score</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(243 244 246)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="rgb(16 185 129)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(82/100)*339.29} 339.29`}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-bold text-dark">82</p>
                <p className="text-sm text-gray-400">/ 100</p>
              </div>
            </div>
            <Badge variant="success" className="mt-4 text-sm px-3 py-1">Good Health 🎉</Badge>
            <p className="mt-3 text-center text-sm text-gray-500 max-w-xs">
              You&apos;re in the top 20% of shops. Focus on profit margin and dead stock to reach Excellent.
            </p>
          </CardContent>
        </Card>

        {/* Factors */}
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Score Factors</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {factors.map((f) => (
              <div key={f.label} className="rounded-xl border border-border-color p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark">{f.label}</p>
                    <p className="text-xs text-gray-400">Weight: {f.weight} · {f.desc}</p>
                  </div>
                  <span className={cn("text-xl font-bold", f.value >= 70 ? "text-success" : f.value >= 50 ? "text-warning" : "text-danger")}>
                    {f.value}%
                  </span>
                </div>
                <div className="mt-2"><Progress value={f.value} indicatorClassName={f.color} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-danger">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <Badge variant="primary">Estimated impact</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((r) => (
              <div key={r.title} className="rounded-xl border border-border-color p-4 transition-shadow hover:shadow-md">
                <p className="font-semibold text-dark">{r.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{r.desc}</p>
                <span className="mt-3 inline-flex items-center gap-0.5 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success">
                  <ArrowUpRight className="h-3 w-3" /> {r.impact}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
