"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Boxes, LogOut, ShoppingBag, Store, UserRound } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
type Owner = { name: string; email: string; role: string; store: { name: string; category: string; createdAt: string } };

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("shopiq_token") ?? sessionStorage.getItem("shopiq_token");
    if (!token) { router.replace("/login"); return; }
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Please sign in again.");
        setOwner(data);
      })
      .catch(err => setError(err instanceof TypeError ? "Can't reach the SHOPIQ API. Start the backend server and make sure PostgreSQL is running." : err instanceof Error ? err.message : "Unable to load your store."));
  }, [router]);

  function logout() { localStorage.removeItem("shopiq_token"); sessionStorage.removeItem("shopiq_token"); router.replace("/login"); }

  if (!owner) return <main className="owner-dashboard-loading">{error || <><i /> Loading your store workspace…</>}</main>;
  return <main className="owner-dashboard">
    <aside className="owner-sidebar"><a href="/" className="owner-brand"><span><Store size={19} /></span>SHOP<span>IQ</span></a><div className="owner-side-kicker">YOUR WORKSPACE</div><div className="owner-nav-active"><Activity size={17} /> Overview</div><div className="owner-side-kicker owner-tools-label">STORE TOOLS</div><div className="owner-nav-item"><Boxes size={17} /> Products & inventory</div><div className="owner-nav-item"><ShoppingBag size={17} /> Orders</div><div className="owner-sidebar-bottom"><div className="owner-account"><span><UserRound size={17} /></span><div><b>{owner.name}</b><small>Store owner</small></div></div><button onClick={logout}><LogOut size={16} /> Sign out</button></div></aside>
    <section className="owner-main"><header className="owner-topbar"><span>Store workspace <b>/ Overview</b></span><span className="owner-account-chip">{owner.store.name}</span></header><div className="owner-content"><div className="owner-heading"><div><span>YOUR STORE WORKSPACE</span><h1>Welcome, {owner.name.split(" ")[0]}</h1><p>Your store account is ready. Here’s your starting point.</p></div><span className="owner-store-badge"><Store size={16} /> {owner.store.category}</span></div><section className="owner-welcome-card"><div className="owner-welcome-icon"><Store size={23} /></div><span>STORE OWNER ACCOUNT</span><h2>{owner.store.name}</h2><p>Your workspace is set up. Add products and start managing your store from one clear view.</p><div><b>Owner</b><span>{owner.name} · {owner.email}</span></div><div><b>Created</b><span>{new Date(owner.store.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div></section><div className="owner-quick-grid"><article><span><Boxes size={18} /></span><div><b>Products & inventory</b><small>Keep your store catalogue organized.</small></div><ArrowRight size={16} /></article><article><span><ShoppingBag size={18} /></span><div><b>Orders</b><small>View and manage customer orders.</small></div><ArrowRight size={16} /></article></div><footer className="owner-footer">SHOPIQ · STORE OWNER WORKSPACE</footer></div></section>
  </main>;
}
