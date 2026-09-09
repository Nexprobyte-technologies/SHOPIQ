"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingDown, AlertTriangle, Boxes, BadgePercent, Users, Clock, Check, ChevronRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const insights = [
  { type: "sales_drop", title: "Sales down 18% today", message: "Evening sales dropped 22% compared to last week. Footfall decreased 12%.", priority: "high", time: "2026-09-09T09:00:00", read: false, icon: TrendingDown, color: "text-danger bg-danger-50", action: "View Analysis" },
  { type: "stock", title: "3 products may stock-out tomorrow", message: "Aavin Milk, Surf Excel, Colgate show stock-out risk within 2 days.", priority: "critical", time: "2026-09-09T08:30:00", read: false, icon: AlertTriangle, color: "text-warning bg-warning-50", action: "Create Reorders" },
  { type: "dead_stock", title: "17 dead stock items detected", message: "₹12,450 locked in products not sold for 60+ days. Run a combo offer?", priority: "medium", time: "2026-09-09T07:45:00", read: false, icon: Boxes, color: "text-purple bg-purple-50", action: "View Products" },
  { type: "customer", title: "6 regular customers due for refill", message: "Ramesh, Sundar and 4 others are predicted to return within 3 days.", priority: "high", time: "2026-09-09T07:00:00", read: false, icon: Users, color: "text-success bg-success-50", action: "Send WhatsApp" },
  { type: "promotion", title: "Run a ₹50 combo offer this weekend", message: "Forecast shows 12% weekend growth potential if you bundle slow movers.", priority: "medium", time: "2026-09-08T18:00:00", read: true, icon: BadgePercent, color: "text-primary bg-primary-50", action: "Create Offer" },
];

const priorityVariant: Record<string, "danger" | "warning" | "info" | "success"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "success",
};

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark">AI Insights</h1>
            <Badge variant="primary"><Sparkles className="h-3 w-3" /> AI</Badge>
          </div>
          <p className="text-sm text-gray-500">Your software tells you what to do next — automatically.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Unread ({insights.filter(i => !i.read).length})</Button>
          <Button variant="outline" size="sm">Actioned</Button>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <Card key={insight.title} className={cn("transition-shadow hover:shadow-md", !insight.read && "border-l-4 border-l-primary")}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl", insight.color)}>
                <insight.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-dark">{insight.title}</p>
                  <Badge variant={priorityVariant[insight.priority]} className="capitalize">{insight.priority}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{insight.message}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3 w-3" /> {formatRelativeTime(insight.time)}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                {!insight.read && (
                  <Button variant="outline" size="sm" className="h-8 text-xs"><Check className="h-3 w-3" /> Mark Read</Button>
                )}
                <Button size="sm" className="h-8 text-xs">
                  {insight.action} <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
