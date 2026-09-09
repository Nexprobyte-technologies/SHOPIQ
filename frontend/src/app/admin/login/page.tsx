"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { api, getRoleHome } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const demoAccounts = [
  { user: "admin", pass: "admin123", role: "Dev Admin", status: 1 },
  { user: "superadmin", pass: "superadmin@123", role: "Super Admin", status: 2 },
  { user: "billadmin", pass: "billadmin@123", role: "Billing Admin", status: 3 },
  { user: "stackadmin", pass: "stackadmin@123", role: "Stock Admin", status: 4 },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      setError("Invalid credentials or no admin access. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#5711f6_0%,#9614eb_50%,#ff1ade_100%)] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-dark">SHOPIQ Admin</p>
            <p className="text-xs text-gray-400">Role-based control panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter admin username" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          {error && <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger">{error}</div>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Admin"}
          </Button>
        </form>

        <div className="mt-6">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Store className="h-3.5 w-3.5" /> Role demo accounts (click to fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.user}
                onClick={() => fill(acc.user, acc.pass)}
                className="rounded-lg border border-border-color bg-gray-50 p-2.5 text-left transition-colors hover:border-primary hover:bg-primary-50"
              >
                <p className="text-xs font-semibold text-gray-700">{acc.role}</p>
                <p className="text-[11px] text-gray-400">{acc.user}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
