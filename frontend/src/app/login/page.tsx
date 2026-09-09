"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Eye, EyeOff, Sparkles, TrendingUp, Package, Mic, ShieldCheck } from "lucide-react";
import { api, getRoleHome } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(username, password);
      localStorage.setItem("token", res.access);
      localStorage.setItem("user", JSON.stringify(res.user));
      const home = getRoleHome(res.user.role);
      if (home.startsWith("http")) window.location.href = home;
      else router.push(home);
    } catch {
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left branding panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-[linear-gradient(135deg,#5711f6_0%,#9614eb_50%,#ff1ade_100%)] p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold">SHOPIQ</p>
            <p className="text-xs text-white/70">AI Business OS for Shops</p>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Your shop software doesn&apos;t just record your business.
          </h1>
          <p className="mt-2 text-lg font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            It tells you what to do next.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: TrendingUp, title: "AI Sales Insights", desc: "Know why sales are down before it hurts" },
              { icon: Package, title: "Auto Re-Order", desc: "One-click WhatsApp orders to suppliers" },
              { icon: Mic, title: "Voice Billing", desc: "Just speak — we create the bill" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-xs text-white/75">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/60">© 2026 SHOPIQ. Empowering small businesses.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-danger">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-dark">SHOPIQ</p>
              <p className="text-xs text-gray-400">AI Business OS for Shops</p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-purple to-danger">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Welcome back</h2>
          </div>
          <p className="mb-6 text-sm text-gray-500">Sign in to your business dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger">{error}</div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Demo accounts:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">admin / admin123</span>
              <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">superadmin / superadmin@123</span>
              <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">billadmin / billadmin@123</span>
              <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">stackadmin / stackadmin@123</span>
            </div>
            <Link href="/admin/login" className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-primary hover:underline">
              <ShieldCheck className="h-3.5 w-3.5" /> Open role-based admin panel →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
