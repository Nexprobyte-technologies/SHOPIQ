"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Search, Plus, MoreVertical, Edit, Trash2, Package } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const products = [
  { id: "P-1001", name: "Aavin Milk 500ml", sku: "AAV-500", category: "Dairy", supplier: "Dairy Supplier Co.", cost: 24, price: 28, stock: 8, min: 10, unit: "pcs", margin: 16.7, status: "low_stock" },
  { id: "P-1002", name: "Parle G Glucose", sku: "PRL-G-100", category: "Biscuits", supplier: "United Distributors", cost: 8, price: 10, stock: 250, min: 40, unit: "pcs", margin: 25, status: "in_stock" },
  { id: "P-1003", name: "Tata Salt 1kg", sku: "TAT-S-1", category: "Grocery", supplier: "Tata Consumer", cost: 22, price: 28, stock: 120, min: 30, unit: "pkt", margin: 27.3, status: "in_stock" },
  { id: "P-1004", name: "Surf Excel 1kg", sku: "SUR-1K", category: "Detergent", supplier: "HUL Distributor", cost: 125, price: 155, stock: 5, min: 8, unit: "pkt", margin: 24, status: "low_stock" },
  { id: "P-1005", name: "Colgate 150g", sku: "CLG-150", category: "Personal Care", supplier: "Colgate-Palmolive", cost: 62, price: 78, stock: 0, min: 12, unit: "pcs", margin: 25.8, status: "out_of_stock" },
  { id: "P-1006", name: "Amul Butter 100g", sku: "AML-B-100", category: "Dairy", supplier: "Amul Dist.", cost: 48, price: 58, stock: 45, min: 15, unit: "pcs", margin: 20.8, status: "in_stock" },
  { id: "P-1007", name: "Old Gold Flour 1kg", sku: "OGF-1K", category: "Grocery", supplier: "Aashirvaad", cost: 38, price: 45, stock: 18, min: 20, unit: "pkt", margin: 18.4, status: "low_stock" },
  { id: "P-1008", name: "Kissan Jam 500g", sku: "KSJ-500", category: "Spreads", supplier: "Kissan Foods", cost: 88, price: 110, stock: 30, min: 8, unit: "jar", margin: 25, status: "in_stock" },
];

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  in_stock: { label: "In Stock", variant: "success" },
  low_stock: { label: "Low Stock", variant: "warning" },
  out_of_stock: { label: "Out of Stock", variant: "danger" },
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || p.status === status;
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark">Products</h1>
          <p className="text-sm text-gray-500">Manage your inventory catalog.</p>
        </div>
        <Button size="sm"><Plus className="h-3.5 w-3.5" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-dark">{products.length}</p>
          <p className="text-xs text-gray-500">Total Products</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-warning">3</p>
          <p className="text-xs text-gray-500">Low Stock</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-danger">1</p>
          <p className="text-xs text-gray-500">Out of Stock</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-2xl font-bold text-primary">{formatINR(totalValue)}</p>
          <p className="text-xs text-gray-500">Inventory Value</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full sm:w-40">
            <option value="all">All Categories</option>
            <option value="Dairy">Dairy</option>
            <option value="Biscuits">Biscuits</option>
            <option value="Grocery">Grocery</option>
            <option value="Detergent">Detergent</option>
            <option value="Personal Care">Personal Care</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full sm:w-40">
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </Select>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-color text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4 font-semibold">Product</th>
                  <th className="pb-3 pr-4 font-semibold">Category</th>
                  <th className="pb-3 pr-4 font-semibold">Cost</th>
                  <th className="pb-3 pr-4 font-semibold">Price</th>
                  <th className="pb-3 pr-4 font-semibold">Stock</th>
                  <th className="pb-3 pr-4 font-semibold">Margin</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-dark">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{p.category}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatINR(p.cost)}</td>
                    <td className="py-3 pr-4 font-medium text-dark">{formatINR(p.price)}</td>
                    <td className="py-3 pr-4">
                      <span className={cn("font-medium", p.stock === 0 ? "text-danger" : p.stock <= p.min ? "text-warning" : "text-dark")}>
                        {p.stock}{" "}
                      </span>
                      <span className="text-xs text-gray-400">/ {p.min} min</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{p.margin}%</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusConfig[p.status].variant}>{statusConfig[p.status].label}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-primary-50 hover:text-primary"><Edit className="h-4 w-4" /></button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-danger-50 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><MoreVertical className="h-4 w-4" /></button>
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
