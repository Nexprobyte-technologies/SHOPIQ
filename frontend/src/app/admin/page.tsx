"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, Store, Users } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
type StoreRow = { id: string; name: string; category: string; createdAt: string; owner: { name: string; email: string } };
type Overview = { ownerCount: number; storeCount: number; storesAddedLast7Days: number; storeGrowth: { day: string; count: number }[]; recentStores: StoreRow[] };
type AdminTab = "Overview" | "Stores" | "Store owners";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [tab, setTab] = useState<AdminTab>("Overview");
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("shopiq_admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.role !== "SUPER_ADMIN") { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); return; }
    } catch { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); return; }
    fetch(`${API_URL}/auth/admin/overview`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to load admin overview."); return data as Overview; })
      .then(data => setOverview(data))
      .catch(err => { sessionStorage.removeItem("shopiq_admin_token"); setError(err instanceof Error ? err.message : "Unable to load admin overview."); router.replace("/admin/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  const stores = overview?.recentStores ?? [];
  const filteredStores = useMemo(() => stores.filter(store => `${store.name} ${store.category} ${store.owner.name} ${store.owner.email}`.toLowerCase().includes(search.toLowerCase())), [stores, search]);
  const logout = () => { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); };

  if (loading || !overview) return <main className="admin-loading"><span className="admin-loader" />{error || "Verifying super admin access…"}</main>;

  const metrics = [
    { label: "Total stores", value: overview.storeCount, note: "Registered on SHOPIQ", icon: Store, trend: "All time", up: true },
    { label: "Store owners", value: overview.ownerCount, note: "Owner accounts", icon: Users, trend: "All time", up: true },
    { label: "New stores", value: overview.storesAddedLast7Days, note: "Added in the last 7 days", icon: ArrowUpRight, trend: "This week", up: true },
    { label: "Platform status", value: "Healthy", note: "API and database", icon: Activity, trend: "Operational", up: true },
  ];

  return <main className="admin-shell">
    <aside className={`admin-sidebar ${mobileNavOpen ? "open" : ""}`}>
      <a className="admin-logo" href="/admin"><span className="admin-logo-mark"><Store /></span><span>SHOP<span>IQ</span><small>PLATFORM ADMIN</small></span></a>
      <div className="admin-side-label">WORKSPACE</div>
      <nav className="admin-side-nav" aria-label="Admin navigation">
        {(["Overview", "Stores", "Store owners"] as AdminTab[]).map((item, index) => { const Icon = [LayoutDashboard, Store, Users][index]; return <button key={item} className={tab === item ? "active" : ""} onClick={() => { setTab(item); setMobileNavOpen(false); document.getElementById(item === "Overview" ? "admin-overview" : "admin-directory")?.scrollIntoView({ behavior: "smooth" }); }}><Icon size={17} /><span>{item}</span>{item === "Stores" && <b>{overview.storeCount}</b>}</button>; })}
      </nav>
      <div className="admin-sidebar-bottom"><div className="admin-security-card"><ShieldCheck size={18} /><b>Secure workspace</b><span>Admin access is protected</span></div><button className="admin-logout" onClick={logout}><LogOut size={16} /> Sign out</button><small>SHOPIQ ADMIN · 1.0</small></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle admin menu"><Menu size={20} /></button><div className="admin-breadcrumb">Admin <span>/</span> <b>{tab}</b></div><div className="admin-top-actions"><div className="admin-live-pill"><i /> All systems operational</div><button className="admin-icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="admin-profile"><span>SA</span><div><b>Super Admin</b><small>Platform owner</small></div></div></div></header>
      <div className="admin-content" id="admin-overview">
        <div className="admin-page-heading"><div><span className="admin-overline">PLATFORM CONTROL CENTER</span><h1>{tab === "Overview" ? "Good morning, Admin" : tab}</h1><p>Monitor your stores and platform activity from one place.</p></div><div className="admin-date-chip">Last 7 days <ArrowDownRight size={15} /></div></div>
        <div className="admin-metric-grid">{metrics.map(({ label, value, note, icon: Icon, trend, up }) => <article className="admin-metric-card" key={label}><div className="admin-metric-top"><span>{label}</span><i><Icon size={18} /></i></div><div className="admin-metric-value">{value}</div><div className="admin-metric-bottom"><span>{note}</span><b className={up ? "positive" : ""}>{up && <ArrowUpRight size={13} />}{trend}</b></div></article>)}</div>
        <div className="admin-dashboard-grid">
          <section className="admin-panel admin-growth-panel"><div className="admin-panel-heading"><div><h2>Store growth</h2><p>New stores registered over the past week</p></div><span className="admin-panel-tag">LAST 7 DAYS</span></div><div className="admin-chart-wrap">{overview.storeGrowth.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={overview.storeGrowth} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="storeGrowthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#287451" stopOpacity={0.2} /><stop offset="95%" stopColor="#287451" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf1ed" strokeDasharray="4 4" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#87938b", fontSize: 11 }} dy={9} /><Tooltip contentStyle={{ border: "1px solid #e7ece7", borderRadius: 10, fontSize: 12 }} /><Area type="monotone" dataKey="count" name="New stores" stroke="#287451" strokeWidth={2.5} fill="url(#storeGrowthFill)" /></AreaChart></ResponsiveContainer> : null}</div><div className="admin-chart-legend"><i /> New store registrations</div></section>
          <section className="admin-panel admin-activity-panel"><div className="admin-panel-heading"><div><h2>Platform snapshot</h2><p>Current account totals</p></div><Activity size={18} color="#287451" /></div><div className="admin-snapshot"><div><span>Store owners</span><b>{overview.ownerCount}</b><small>Authorized store accounts</small></div><div><span>Stores</span><b>{overview.storeCount}</b><small>Active store workspaces</small></div><div className="admin-health-row"><i /> API connected <b>Online</b></div></div></section>
        </div>
        <section className="admin-panel admin-directory" id="admin-directory"><div className="admin-panel-heading admin-directory-heading"><div><h2>{tab === "Store owners" ? "Recent store owners" : "Recent stores"}</h2><p>{tab === "Store owners" ? "Owner accounts connected to registered stores" : "Latest stores registered on the platform"}</p></div><label className="admin-table-search"><Search size={15} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search stores or owners" /></label></div>
          <div className="admin-table-scroll"><table><thead><tr>{tab === "Store owners" ? <><th>OWNER</th><th>EMAIL</th><th>STORE</th><th>JOINED</th></> : <><th>STORE</th><th>CATEGORY</th><th>OWNER</th><th>REGISTERED</th><th>STATUS</th></>}</tr></thead><tbody>{filteredStores.length ? filteredStores.map(store => <tr key={store.id}>{tab === "Store owners" ? <><td><div className="admin-owner-cell"><span>{store.owner.name.slice(0, 1).toUpperCase()}</span><b>{store.owner.name}</b></div></td><td>{store.owner.email}</td><td>{store.name}</td><td>{new Date(store.createdAt).toLocaleDateString()}</td></> : <><td><div className="admin-store-cell"><span><Store size={16} /></span><b>{store.name}</b></div></td><td><span className="admin-category-tag">{store.category}</span></td><td><div className="admin-owner-name">{store.owner.name}<small>{store.owner.email}</small></div></td><td>{new Date(store.createdAt).toLocaleDateString()}</td><td><span className="admin-status"><i /> Registered</span></td></>}</tr>) : <tr><td colSpan={5} className="admin-empty">No matching stores yet.</td></tr>}</tbody></table></div><div className="admin-table-footer"><span>Showing {filteredStores.length} of {overview.recentStores.length} latest records</span><button onClick={() => setTab("Stores")}>View store directory <ArrowRight size={14} /></button></div>
        </section>
        <footer className="admin-footer"><span>© 2026 SHOPIQ Platform</span><span>SUPER ADMIN CONSOLE</span></footer>
      </div>
    </section>
  </main>;
}
