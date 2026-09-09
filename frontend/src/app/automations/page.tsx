"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Workflow, Bell, Mail, MessageCircle, ToggleLeft, ToggleRight } from "lucide-react";

const automations = [
  { name: "Auto Re-Order WhatsApp", desc: "When stock hits low level, auto-create order and send WhatsApp to supplier.", trigger: "Stock below min level", action: "WhatsApp to supplier", status: true },
  { name: "Customer Refill Reminder", desc: "When a customer is due for refill, send a personalized WhatsApp marketing message.", trigger: "Predicted return date", action: "WhatsApp marketing", status: true },
  { name: "Dead Stock Alert", desc: "Notify when products haven't sold for 60+ days. Suggest promo actions.", trigger: "60 days no sale", action: "Push notification", status: true },
  { name: "Daily Sales Summary", desc: "Send owner a daily business summary on WhatsApp at 8 PM.", trigger: "Every day 8 PM", action: "WhatsApp summary", status: false },
  { name: "Low Credit Payment Reminder", desc: "Remind customers with outstanding credit to pay via WhatsApp.", trigger: "Credit overdue 15 days", action: "WhatsApp reminder", status: false },
  { name: "Peak Hour Staff Alert", desc: "Alert staff 30 min before peak sales hours to prepare counters.", trigger: "Peak hour prediction", action: "Push notification", status: false },
];

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Automations</h1>
          <p className="text-sm text-gray-500">Powered by n8n — let AI work while you sleep.</p>
        </div>
        <Button size="sm"><Workflow className="h-3.5 w-3.5" /> Create Workflow</Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary-50 p-4">
        <Zap className="h-5 w-5 text-primary" />
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-primary">2 automations active.</span> New: Auto WhatsApp orders sent to suppliers saved you ~20 min/day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {automations.map((a) => (
          <Card key={a.name} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{a.name}</p>
                    <Badge variant={a.status ? "success" : "gray"}>{a.status ? "Active" : "Inactive"}</Badge>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-primary">
                  {a.status ? <ToggleRight className="h-6 w-6 text-success" /> : <ToggleLeft className="h-6 w-6" />}
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">{a.desc}</p>
              <div className="mt-4 space-y-2 border-t border-border-color pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-gray-400"><Bell className="h-3 w-3" /> Trigger</span>
                  <span className="font-medium text-gray-600">{a.trigger}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-gray-400"><Mail className="h-3 w-3" /> Action</span>
                  <span className="font-medium text-gray-600">{a.action}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
