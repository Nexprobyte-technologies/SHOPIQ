"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, ShoppingCart, Trash2, Check } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function VoiceBillingPage() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [items] = useState<{ name: string; qty: number; price: number }[]>([
    { name: "Lux Soap 125g", qty: 2, price: 38 },
    { name: "Shampoo 180ml", qty: 1, price: 95 },
  ]);

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const toggleListen = () => {
    if (listening) {
      setListening(false);
      setProcessing(true);
      setTimeout(() => {
        setTranscript("Ramesh-ku two soap, one shampoo bill podu");
        setProcessing(false);
      }, 1200);
    } else {
      setListening(true);
      setTranscript("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-dark">Voice Billing</h1>
            <Badge variant="success" className="gap-1">Tamil + English</Badge>
          </div>
          <p className="text-sm text-gray-500">Just speak and we&apos;ll create the bill. No typing needed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Voice input */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Voice Command</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className={cn(
              "relative flex h-32 w-32 items-center justify-center rounded-full transition-all",
              listening ? "bg-danger-50" : "bg-primary-50"
            )}>
              {listening && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-danger/20" />
                  <span className="absolute -inset-4 animate-pulse rounded-full border-2 border-danger/30" style={{ animationDelay: "0.5s" }} />
                </>
              )}
              <Button
                variant={listening ? "danger" : "primary"}
                size="icon"
                className="h-20 w-20 rounded-full"
                onClick={toggleListen}
              >
                {listening ? (
                  <Square className="h-7 w-7" />
                ) : processing ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  <Mic className="h-7 w-7" />
                )}
              </Button>
            </div>

            <p className="mt-6 text-sm font-medium text-gray-600">
              {listening ? "Listening... speak now" : processing ? "Processing your voice..." : "Tap the mic and say your command"}
            </p>

            {listening && (
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="h-4 w-1 rounded-full bg-danger animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}

            {transcript && (
              <div className="mt-5 w-full max-w-lg rounded-lg border border-border-color bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase text-gray-400">Heard</p>
                <p className="mt-1 italic text-gray-700">“{transcript}”</p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="success"><Check className="h-3 w-3" /> Products identified</Badge>
                  <Badge variant="info">Bill ready for review</Badge>
                </div>
              </div>
            )}

            <p className="mt-5 text-xs text-gray-400">
              Example: “Ramesh-ku two soap, one shampoo bill podu” · “2 eggs and 1 milk packet”
            </p>
          </CardContent>
        </Card>

        {/* Bill preview */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Preview</CardTitle>
            <Badge variant="primary">Draft</Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary">R</div>
              <div>
                <p className="text-sm font-medium text-dark">Ramesh Kumar</p>
                <p className="text-xs text-gray-400">+91 98765 43210</p>
              </div>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-border-color p-2.5">
                  <div>
                    <p className="text-sm font-medium text-dark">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.qty} × {formatINR(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-dark">{formatINR(item.qty * item.price)}</span>
                    <button className="text-gray-400 hover:text-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-border-color pt-3">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatINR(total)}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Tax (5%)</span><span>{formatINR(total * 0.05)}</span></div>
              <div className="flex justify-between text-lg font-bold text-dark"><span>Total</span><span>{formatINR(total * 1.05)}</span></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">Cash</Button>
              <Button size="sm">UPI</Button>
            </div>
            <Button className="mt-2 w-full" disabled={!transcript}><ShoppingCart className="h-4 w-4" /> Complete Bill</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
