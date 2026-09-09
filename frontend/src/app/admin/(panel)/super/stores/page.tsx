"use client";

import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Shop {
  id: string;
  name: string;
  shop_type?: string;
  city?: string;
  gst_number?: string;
  health_score?: number;
  is_active?: boolean;
}

export default function StoresPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ results?: Shop[] }>("/api/shops/")
      .then((d) => setShops(d.results ?? (Array.isArray(d) ? d : [])))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Store Data" description="All registered stores in the SHOPIQ" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : shops.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-gray-400">No stores registered.</CardContent>
          </Card>
        ) : (
          shops.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{s.name}</CardTitle>
                    <p className="text-xs text-gray-400">{s.shop_type} · {s.city || "N/A"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Health Score</span>
                  <span className="font-semibold text-dark">{Math.round(s.health_score || 0)}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST</span>
                  <span className="text-dark">{s.gst_number || "-"}</span>
                </div>
                <Badge variant={s.is_active ? "success" : "danger"}>
                  {s.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
