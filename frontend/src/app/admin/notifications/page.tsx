"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, Bell, CheckCheck, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, ShoppingBag, Store, Users, Wallet } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
type AdminNotificationIcon = "store" | "order" | "payout" | "user" | "security";
type AdminNotification = { id: string; icon: AdminNotificationIcon; title: string; message: string; time: string; unread: boolean };
const initialNotifications: AdminNotification[] = [
  { id: "n1", icon: "store", title: "New store registered", message: "TechNest Store joined SHOPIQ and completed onboarding.", time: "2 min ago", unread: true },
  { id: "n2", icon: "order", title: "New order received", message: "Order #1042 · Bentwood Chair — $89 from GreenCart Co.", time: "18 min ago", unread: true },
  { id: "n3", icon: "payout", title: "Payout processed", message: "$5,400 payout sent to Coastal Mart owner account.", time: "1 hr ago", unread: true },
  { id: "n4", icon: "user", title: "New store owner", message: "Owner account created for Sunrise Foods.", time: "3 hrs ago", unread: false },
  { id: "n5", icon: "security", title: "Security alert", message: "New sign-in to the super admin console from Chrome on Windows.", time: "5 hrs ago", unread: false },
];

function notificationIcon(icon: AdminNotificationIcon, size = 15) {
  const Icon = icon === "order" ? ShoppingBag : icon === "payout" ? Wallet : icon === "user" ? Users : icon === "security" ? ShieldCheck : Store;
  return <Icon size={size} />;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("shopiq_admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.role !== "SUPER_ADMIN") { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); return; }
    } catch { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); return; }
  }, [router]);

  const markAllRead = () => setNotifications(list => list.map(n => ({ ...n, unread: false })));
  const markRead = (id: string) => setNotifications(list => list.map(n => n.id === id ? { ...n, unread: false } : n));
  const unreadCount = notifications.filter(n => n.unread).length;
  const logout = () => { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); };

  const visibleNotifications = notifications.filter(n => `${n.title} ${n.message}`.toLowerCase().includes(search.toLowerCase()));

  return <main className="admin-shell">
    <aside className={`admin-sidebar ${mobileNavOpen ? "open" : ""}`}>
      <a className="admin-logo" href="/admin"><span className="admin-logo-mark"><Store /></span><span>SHOP<span>IQ</span><small>PLATFORM ADMIN</small></span></a>
      <div className="admin-side-label">WORKSPACE</div>
      <nav className="admin-side-nav" aria-label="Admin navigation">
        <button onClick={() => { router.push("/admin"); setMobileNavOpen(false); }}><LayoutDashboard size={17} /><span>Overview</span></button>
        <button className="active" onClick={() => setMobileNavOpen(false)}><Bell size={17} /><span>Notifications</span>{unreadCount ? <b>{unreadCount}</b> : null}</button>
        <button onClick={() => { router.push("/admin"); setMobileNavOpen(false); }}><Store size={17} /><span>Store owners</span></button>
      </nav>
      <div className="admin-sidebar-bottom"><div className="admin-security-card"><ShieldCheck size={18} /><b>Secure workspace</b><span>Admin access is protected</span></div><button className="admin-logout" onClick={logout}><LogOut size={16} /> Sign out</button><small>SHOPIQ ADMIN · 1.0</small></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle admin menu"><Menu size={20} /></button><div className="admin-breadcrumb">Admin <span>/</span> <b>Notifications</b></div><div className="admin-top-actions"><div className="admin-live-pill"><i /> All systems operational</div><div className="admin-profile"><span>SA</span><div><b>Super Admin</b><small>Platform owner</small></div></div></div></header>
      <div className="admin-content">
        <div className="admin-page-heading"><div><span className="admin-overline">PLATFORM CONTROL CENTER</span><h1>Notifications</h1><p>Latest platform alerts, orders, payouts and security updates.</p></div><div className="admin-date-chip">Last 7 days <ArrowDownRight size={15} /></div></div>
        <section className="admin-panel">
          <div className="admin-directory-heading">
            <div>
              <h2>Notifications</h2>
              <p>{unreadCount} unread · Latest platform alerts and activity</p>
            </div>
            <div className="admin-directory-actions">
              <label className="admin-table-search"><Search size={15} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search notifications" /></label>
              <button className="admin-mark-all" onClick={markAllRead}><CheckCheck size={13} /> Mark all read</button>
            </div>
          </div>
          <div className="admin-notifications-list">
            {visibleNotifications.length ? visibleNotifications.map(n => (<button key={n.id} type="button" className={`admin-notification-item ${n.unread ? "unread" : ""}`} onClick={() => markRead(n.id)}><span className="admin-notification-icon">{notificationIcon(n.icon)}</span><span className="admin-notification-text"><b>{n.title}</b><p>{n.message}</p></span><span className="admin-notification-time">{n.time}</span></button>)) : <div className="admin-empty">No notifications found.</div>}
          </div>
        </section>
        <footer className="admin-footer"><span>© 2026 SHOPIQ Platform</span><span>SUPER ADMIN CONSOLE</span></footer>
      </div>
    </section>
  </main>;
}
