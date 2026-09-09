"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Package, Clock, Megaphone, ArrowRight, RotateCcw } from "lucide-react";

const rootCauses = [
  { icon: Users, color: "text-danger bg-danger-50", title: "Footfall decreased 12%", desc: "Fewer customers visited this week. Likely due to +2 holidays and local festival.", impact: "High" },
  { icon: Package, color: "text-warning bg-warning-50", title: "3 high-selling products out of stock", desc: "Aavin Milk, Surf Excel, Colgate were unavailable for 2 days, causing ₹4,500 lost sales.", impact: "High" },
  { icon: Clock, color: "text-primary bg-primary-50", title: "Evening sales dropped 22%", desc: "7-9 PM sales fell sharply. Counter setup time increased after 7 PM.", impact: "Medium" },
  { icon: Megaphone, color: "text-purple bg-purple-50", title: "No promotions this week", desc: "Last week you ran 2 combo offers. This week none. Promotions drove ~8% of sales.", impact: "Medium" },
];

export default function WhySalesDownPage() {
  const [question, setQuestion] = useState("Why my sales decreased this week?");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark">Why Sales Down?</h1>
            <Badge variant="primary"><Sparkles className="h-3 w-3" /> AI Analysis</Badge>
          </div>
          <p className="text-sm text-gray-500">Ask anything about your business — get honest, actionable answers.</p>
        </div>
      </div>

      {/* Question input */}
      <Card className="bg-gradient-to-br from-primary via-purple to-danger p-6 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-sm font-medium text-white/90">Ask your AI Business Assistant</p>
          <div className="mt-4 flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about your business..."
              className="h-12 flex-1 rounded-xl border-0 bg-white/95 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <Button onClick={runAnalysis} className="h-12 bg-white text-primary hover:bg-white/90" disabled={analyzing}>
              {analyzing ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>Analyze <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {["Why sales down?", "Which products to reorder?", "Best offer this week?", "Who owes me money?"].map((s) => (
              <button key={s} onClick={() => setQuestion(s)} className="rounded-full bg-white/15 px-3 py-1 text-xs text-white hover:bg-white/25">
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {analyzed && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-danger">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <CardTitle>Root Cause Analysis</CardTitle>
              </div>
              <Badge variant="danger">Sales -18% this week</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {rootCauses.map((c) => (
                  <div key={c.title} className="rounded-xl border border-border-color p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${c.color}`}>
                        <c.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-dark">{c.title}</p>
                          <Badge variant={c.impact === "High" ? "danger" : "warning"}>{c.impact}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{c.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended action */}
          <Card className="border-success/30 bg-success-50/50">
            <CardHeader>
              <CardTitle className="text-success">Recommended Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-dark">
                1. Re-stock these 3 products (Aavin Milk, Surf Excel, Colgate) today
              </p>
              <p className="mt-1 text-sm font-semibold text-dark">
                2. Run a ₹50 combo offer (Parle G + Lux Soap) for the weekend
              </p>
              <p className="mt-1 text-sm font-semibold text-dark">
                3. Extend evening hours to 9:30 PM to recover the 22% evening drop
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="h-8 text-xs">Create Reorders</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs text-success border-success/40 hover:bg-success-50">Create Combo Offer</Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
