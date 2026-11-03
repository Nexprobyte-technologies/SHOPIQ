"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Clock3, CreditCard, Filter, LayoutDashboard, LogOut, Menu, Package, Pencil, Plus, Search, Settings, ShieldCheck, ShoppingBag, Store, Trash2, Users, Wallet, LifeBuoy } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
type StoreRow = { id: string; name: string; category: string; createdAt: string; owner: { name: string; email: string } };
type Overview = { ownerCount: number; storeCount: number; storesAddedLast7Days: number; storeGrowth: { day: string; count: number }[]; recentStores: StoreRow[] };
type PageResult<T> = { results: T[]; total: number; page: number; pageSize: number; totalPages: number };
type AdminCustomer = { id: string; customerId: string; name: string; email: string; phone: string; createdAt: string; paidTotal: string; paidPaymentCount: number; lastPaidAt: string | null };
type AdminPayment = { id: string; customerId: string; customerName: string; customerEmail: string; amount: string; currency: string; status: string; paymentMethod: string; reference: string; createdAt: string };
type AdminUser = { id: string; name: string; email: string; role: string; createdAt: string; store: { id: string; name: string; category: string } | null };
type AdminTab = "Overview" | "Stores" | "Store owners" | "Users" | "Products" | "Orders" | "Payments" | "Subscriptions" | "Customers" | "Reports" | "Notifications" | "Support" | "Settings" | "Activity";
const adminNavigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Stores", icon: Store },
  { label: "Store owners", icon: Users },
  { label: "Users", icon: Users },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingBag },
  { label: "Payments", icon: Wallet },
  { label: "Subscriptions", icon: CreditCard },
  { label: "Customers", icon: Users },
  { label: "Reports", icon: Activity },
  { label: "Notifications", icon: Bell },
  { label: "Support", icon: LifeBuoy },
  { label: "Settings", icon: Settings },
  { label: "Activity", icon: Clock3 },
] as const;
const adminDescriptions: Record<AdminTab, string> = {
  Overview: "Track store growth, owner activity, and platform health.",
  Stores: "Browse and search registered store workspaces.",
  "Store owners": "Browse the owners connected to registered stores.",
  Users: "Manage all store owner accounts on the platform.",
  Products: "Manage product catalogs across SHOPIQ stores.",
  Orders: "Review and monitor orders across the platform.",
  Payments: "Track payments and payout activity.",
  Subscriptions: "Manage platform subscription plans and status.",
  Customers: "View customer accounts across the platform.",
  Reports: "Review platform performance and operational reports.",
  Notifications: "Review important platform alerts.",
  Support: "Manage support requests from stores and owners.",
  Settings: "Configure platform preferences and administration.",
  Activity: "Review recent platform and administrator activity.",
};
type AdminNotificationIcon = "store" | "order" | "payout" | "user" | "security";
type AdminNotification = { id: string; icon: AdminNotificationIcon; title: string; message: string; time: string; unread: boolean };
const initialNotifications: AdminNotification[] = [
  { id: "n1", icon: "store", title: "New store registered", message: "TechNest Store joined SHOPIQ and completed onboarding.", time: "2 min ago", unread: true },
  { id: "n2", icon: "order", title: "New order received", message: "Order #1042 · Bentwood Chair — $89 from GreenCart Co.", time: "18 min ago", unread: true },
  { id: "n3", icon: "payout", title: "Payout processed", message: "$5,400 payout sent to Coastal Mart owner account.", time: "1 hr ago", unread: true },
  { id: "n4", icon: "user", title: "New store owner", message: "Owner account created for Sunrise Foods.", time: "3 hrs ago", unread: false },
  { id: "n5", icon: "security", title: "Security alert", message: "New sign-in to the super admin console from Chrome on Windows.", time: "5 hrs ago", unread: false },
];

async function adminRequest<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The admin request failed.");
  return data as T;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [tab, setTab] = useState<AdminTab>("Overview");
  const [search, setSearch] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [tableData, setTableData] = useState<PageResult<AdminCustomer | AdminPayment | AdminUser | StoreRow>>({ results: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [tableRefresh, setTableRefresh] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ id: "", dateFrom: "", dateTo: "", status: "" });
  const [filterDraft, setFilterDraft] = useState({ id: "", dateFrom: "", dateTo: "", status: "" });
  const [customerEditor, setCustomerEditor] = useState<AdminCustomer | null>(null);
  const [paymentEditor, setPaymentEditor] = useState<AdminPayment | null>(null);
  const [userEditor, setUserEditor] = useState<AdminUser | null>(null);
  const [customerOptions, setCustomerOptions] = useState<AdminCustomer[]>([]);
  const [deleteBusy, setDeleteBusy] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [selected, setSelected] = useState<StoreRow | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("shopiq_admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.role !== "SUPER_ADMIN") { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); return; }
    } catch { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); return; }
    setAdminToken(token);
    fetch(`${API_URL}/auth/admin/overview`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to load admin overview."); return data as Overview; })
      .then(data => setOverview(data))
      .catch(err => { sessionStorage.removeItem("shopiq_admin_token"); setError(err instanceof Error ? err.message : "Unable to load admin overview."); router.replace("/admin/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!adminToken || !["Overview", "Stores", "Store owners", "Customers", "Payments", "Users"].includes(tab)) return;
    let active = true;
    const params = new URLSearchParams({ page: String(tablePage), pageSize: "10", search, ...filters });
    const path = tab === "Customers" ? "/auth/admin/customers" : tab === "Payments" ? "/auth/admin/payments" : tab === "Stores" || tab === "Overview" ? "/auth/admin/stores" : "/auth/admin/users";
    setTableLoading(true);
    setTableError("");
    adminRequest<PageResult<AdminCustomer | AdminPayment | AdminUser | StoreRow>>(adminToken, `${path}?${params}`)
      .then(data => { if (active) setTableData(data); })
      .catch(err => { if (active) setTableError(err instanceof Error ? err.message : "Unable to load records."); })
      .finally(() => { if (active) setTableLoading(false); });
    if (tab === "Payments") {
      const customerParams = new URLSearchParams({ page: "1", pageSize: "100" });
      adminRequest<PageResult<AdminCustomer>>(adminToken, `/auth/admin/customers?${customerParams}`)
        .then(data => { if (active) setCustomerOptions(data.results); })
        .catch(() => { if (active) setCustomerOptions([]); });
    }
    return () => { active = false; };
  }, [adminToken, tab, tablePage, search, filters, tableRefresh]);

  const tableStores = tableData.results as StoreRow[];
  const logout = () => { sessionStorage.removeItem("shopiq_admin_token"); router.replace("/admin/login"); };
  const markNotificationRead = (id: string) => setNotifications(list => list.map(n => n.id === id ? { ...n, unread: false } : n));
  const markAllNotificationsRead = () => setNotifications(list => list.map(n => ({ ...n, unread: false })));
  const saveRecord = async (event: FormEvent<HTMLFormElement>, collection: "customers" | "payments" | "users", id: string) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    setTableError("");
    try {
      await adminRequest(adminToken, `/auth/admin/${collection}${id ? `/${encodeURIComponent(id)}` : ""}`, { method: id ? "PATCH" : "POST", body: JSON.stringify(payload) });
      setCustomerEditor(null); setPaymentEditor(null); setUserEditor(null); setTableRefresh(value => value + 1);
    } catch (err) { setTableError(err instanceof Error ? err.message : "Unable to save this record."); }
  };
  const deleteRecord = async (collection: "customers" | "payments" | "users", id: string, label: string) => {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    setDeleteBusy(id); setTableError("");
    try {
      await adminRequest(adminToken, `/auth/admin/${collection}/${encodeURIComponent(id)}`, { method: "DELETE" });
      setTableRefresh(value => value + 1);
    } catch (err) { setTableError(err instanceof Error ? err.message : "Unable to delete this record."); }
    finally { setDeleteBusy(""); }
  };

  if (loading || !overview) return <main className="admin-loading"><span className="admin-loader" />{error || "Verifying super admin access…"}</main>;

  const metrics = [
    { label: "Total stores", value: overview.storeCount, note: "Registered on SHOPIQ", icon: Store, trend: "All time", up: true },
    { label: "Store owners", value: overview.ownerCount, note: "Owner accounts", icon: Users, trend: "All time", up: true },
    { label: "New stores", value: overview.storesAddedLast7Days, note: "Added in the last 7 days", icon: ArrowUpRight, trend: "This week", up: true },
    { label: "Platform status", value: "Healthy", note: "API and database", icon: Activity, trend: "Operational", up: true },
  ];
  const advancedFilterControl = <div className="admin-filter-wrap"><button className={`admin-filter-trigger ${Object.values(filters).some(Boolean) ? "has-filters" : ""}`} type="button" onClick={() => { setFilterDraft(filters); setFilterOpen(open => !open); }} aria-expanded={filterOpen}><Filter size={14} /> Advanced filters{Object.values(filters).filter(Boolean).length > 0 && <b>{Object.values(filters).filter(Boolean).length}</b>}</button>{filterOpen && <div className="admin-filter-popover"><div className="admin-filter-title"><b>Filter records</b><button type="button" aria-label="Close filters" onClick={() => setFilterOpen(false)}>×</button></div><label>Record ID<input value={filterDraft.id} onChange={event => setFilterDraft(value => ({ ...value, id: event.target.value }))} placeholder="Enter ID" /></label><div className="admin-filter-dates"><label>From<input type="date" value={filterDraft.dateFrom} onChange={event => setFilterDraft(value => ({ ...value, dateFrom: event.target.value }))} /></label><label>To<input type="date" value={filterDraft.dateTo} onChange={event => setFilterDraft(value => ({ ...value, dateTo: event.target.value }))} /></label></div>{tab !== "Users" && tab !== "Store owners" && <label>{tab === "Stores" || tab === "Overview" ? "Category" : "Status"}<input value={filterDraft.status} onChange={event => setFilterDraft(value => ({ ...value, status: event.target.value }))} placeholder={tab === "Customers" ? "PAID or UNPAID" : tab === "Payments" ? "PAID, PENDING, FAILED…" : "Category"} /></label>}<div className="admin-filter-actions"><button type="button" onClick={() => { const empty = { id: "", dateFrom: "", dateTo: "", status: "" }; setFilterDraft(empty); setFilters(empty); setTablePage(1); }}>Reset</button><button type="button" onClick={() => { setFilters(filterDraft); setTablePage(1); setFilterOpen(false); }}>Apply filters</button></div></div>}</div>;

  return <main className="admin-shell">
    <aside className={`admin-sidebar ${mobileNavOpen ? "open" : ""}`}>
      <a className="admin-logo" href="/admin"><span className="admin-logo-mark"><Store /></span><span>SHOP<span>IQ</span><small>PLATFORM ADMIN</small></span></a>
      <div className="admin-side-label">WORKSPACE</div>
      <nav className="admin-side-nav" aria-label="Admin navigation">
        {adminNavigation.map(({ label, icon: Icon }) => <button type="button" key={label} className={tab === label ? "active" : ""} aria-current={tab === label ? "page" : undefined} onClick={() => { setTab(label); setMobileNavOpen(false); setSearch(""); setTablePage(1); setFilterOpen(false); setFilters({ id: "", dateFrom: "", dateTo: "", status: "" }); setFilterDraft({ id: "", dateFrom: "", dateTo: "", status: "" }); setSelected(null); }}><Icon size={17} /><span>{label}</span>{label === "Stores" && <b>{overview.storeCount}</b>}{label === "Notifications" && notifications.some(item => item.unread) && <b>{notifications.filter(item => item.unread).length}</b>}</button>)}
      </nav>
      <div className="admin-sidebar-bottom"><div className="admin-security-card"><ShieldCheck size={18} /><b>Secure workspace</b><span>Admin access is protected</span></div><button className="admin-logout" onClick={logout}><LogOut size={16} /> Sign out</button><small>SHOPIQ ADMIN · 1.0</small></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle admin menu"><Menu size={20} /></button><div className="admin-breadcrumb" style={{ color: "#14291e" }}>Admin <span style={{ color: "#52675a" }}>/</span> <b style={{ color: "#14291e" }}>{tab}</b></div><div className="admin-top-actions"><div className="admin-live-pill" style={{ color: "#203b2b" }}><i /> All systems operational</div><button className={`admin-icon-button ${notificationsOpen ? "active" : ""}`} onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications" aria-expanded={notificationsOpen}><Bell size={18} /><i /></button>{notificationsOpen ? (<div className="admin-notifications"><div className="admin-notifications-head"><b className="admin-notifications-title"><Bell size={15} /> Notifications</b><span className="admin-notifications-count">{notifications.filter(n => n.unread).length} unread</span></div><div className="admin-notifications-list">{notifications.slice(0, 5).map(n => { const Icon = n.icon === "order" ? ShoppingBag : n.icon === "payout" ? Wallet : n.icon === "user" ? Users : n.icon === "security" ? ShieldCheck : Store; return (<button key={n.id} type="button" className={`admin-notification-item ${n.unread ? "unread" : ""}`} onClick={() => markNotificationRead(n.id)}><span className="admin-notification-icon"><Icon size={15} /></span><span className="admin-notification-text"><b>{n.title}</b><p>{n.message}</p></span><span className="admin-notification-time">{n.time}</span></button>); })}</div><button type="button" className="admin-see-all" onClick={() => { setNotificationsOpen(false); router.push("/admin/notifications"); }}>See All Notifications <ArrowRight size={13} /></button></div>) : null}<div className="admin-profile"><span>SA</span><div><b style={{ color: "#14291e" }}>Super Admin</b><small style={{ color: "#425a48" }}>Platform owner</small></div></div></div></header>
      <div className="admin-content" id="admin-overview">
        <div className="admin-page-heading"><div><span className="admin-overline" style={{ color: "#245f3f" }}>PLATFORM CONTROL CENTER</span><h1 style={{ color: "#10251a" }}>{tab === "Overview" ? "Analytics" : tab}</h1><p style={{ color: "#344b3a", opacity: 1 }}>{adminDescriptions[tab]}</p></div>{tab === "Overview" && <div className="admin-date-chip">Last 7 days <ArrowDownRight size={15} /></div>}</div>
        {tab === "Overview" ? <>
        <div className="admin-metric-grid">{metrics.map(({ label, value, note, icon: Icon, trend, up }) => <article className="admin-metric-card" key={label}><div className="admin-metric-top"><span>{label}</span><i><Icon size={18} /></i></div><div className="admin-metric-value">{value}</div><div className="admin-metric-bottom"><span>{note}</span><b className={up ? "positive" : ""}>{up && <ArrowUpRight size={13} />}{trend}</b></div></article>)}</div>
        <div className="admin-dashboard-grid">
          <section className="admin-panel admin-growth-panel"><div className="admin-panel-heading"><div><h2>Store growth</h2><p>New stores registered over the past week</p></div><span className="admin-panel-tag">LAST 7 DAYS</span></div><div className="admin-chart-wrap">{overview.storeGrowth.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={overview.storeGrowth} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="storeGrowthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3fae6a" stopOpacity={0.2} /><stop offset="95%" stopColor="#3fae6a" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(255,255,255,0.09)" strokeDasharray="4 4" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9db8a6", fontSize: 11 }} dy={9} /><Tooltip contentStyle={{ border: "1px solid #ffffff26", borderRadius: 10, fontSize: 12, background: "#0a4a34", color: "#f1faf2" }} /><Area type="monotone" dataKey="count" name="New stores" stroke="#3fae6a" strokeWidth={2.5} fill="url(#storeGrowthFill)" /></AreaChart></ResponsiveContainer> : null}</div><div className="admin-chart-legend"><i /> New store registrations</div></section>
          <section className="admin-panel admin-activity-panel"><div className="admin-panel-heading"><div><h2>Platform snapshot</h2><p>Current account totals</p></div><Activity size={18} color="#287451" /></div><div className="admin-snapshot"><div><span>Store owners</span><b>{overview.ownerCount}</b><small>Authorized store accounts</small></div><div><span>Stores</span><b>{overview.storeCount}</b><small>Active store workspaces</small></div><div className="admin-health-row"><i /> API connected <b>Online</b></div></div></section>
        </div>
        <section className="admin-panel admin-revenue-panel"><div className="admin-panel-heading"><div><h2>Revenue this month</h2><p>Storefront sales across registered stores</p></div><span className="admin-panel-tag">THIS MONTH</span></div><div className="admin-revenue-figure"><span className="admin-revenue-value">$48,200</span><span className="admin-revenue-trend">+12.4% <small>vs last month</small></span></div><div className="admin-revenue-note">Gross merchandise value across all registered stores this month.</div></section>
        </> : null}
    {(tab === "Overview" || tab === "Stores") && <section className="admin-panel admin-directory" id="admin-directory"><div className="admin-panel-heading admin-directory-heading"><div><h2>{tab === "Overview" ? "Recent stores" : "Store directory"}</h2><p>Registered store workspaces and their owners</p></div><div className="admin-table-tools"><label className="admin-table-search"><Search size={15} /><input value={search} onChange={event => { setSearch(event.target.value); setTablePage(1); }} placeholder="Search stores or owners" /></label>{advancedFilterControl}</div></div>{tableError && <p className="admin-crud-error">{tableError}</p>}
          {tableLoading ? <div className="admin-crud-loading">Loading stores…</div> : <div className="admin-table-scroll"><table><thead><tr><th>STORE ID</th><th>STORE</th><th>CATEGORY</th><th>OWNER</th><th>REGISTERED</th><th>STATUS</th></tr></thead><tbody>{tableStores.length ? tableStores.map(store => <tr key={store.id} style={{ cursor: "pointer" }} onClick={() => setSelected(store)}><td><code className="admin-record-id">{store.id}</code></td><td><div className="admin-store-cell"><span><Store size={16} /></span><b>{store.name}</b></div></td><td><span className="admin-category-tag">{store.category}</span></td><td><div className="admin-owner-name">{store.owner.name}<small>{store.owner.email}</small></div></td><td>{new Date(store.createdAt).toLocaleDateString()}</td><td><span className="admin-status"><i /> Registered</span></td></tr>) : <tr><td colSpan={6} className="admin-empty">No matching stores yet.</td></tr>}</tbody></table></div>}<div className="admin-crud-pagination"><span>Showing {tableData.total ? (tablePage - 1) * 10 + 1 : 0}–{Math.min(tablePage * 10, tableData.total)} of {tableData.total}</span><div><button type="button" disabled={tablePage <= 1 || tableLoading} onClick={() => setTablePage(page => Math.max(1, page - 1))}><ArrowLeft size={14} /> Previous</button><b>Page {tableData.page} of {Math.max(1, tableData.totalPages)}</b><button type="button" disabled={tablePage >= tableData.totalPages || tableLoading} onClick={() => setTablePage(page => page + 1)}>Next <ArrowRight size={14} /></button></div></div>
        </section>}
        {tab === "Customers" && <section className="admin-panel admin-crud-panel"><div className="admin-panel-heading admin-crud-heading"><div><h2>Customers</h2><p>Customer IDs, contact details, and paid totals.</p></div><button className="admin-add-button" type="button" onClick={() => setCustomerEditor({ id: "", customerId: "", name: "", email: "", phone: "", createdAt: "", paidTotal: "0.00", paidPaymentCount: 0, lastPaidAt: null })}><Plus size={15} /> Add customer</button></div><div className="admin-table-tools"><label className="admin-table-search"><Search size={15} /><input value={search} onChange={event => { setSearch(event.target.value); setTablePage(1); }} placeholder="Search ID, name, email, phone" /></label>{advancedFilterControl}</div>{tableError && <p className="admin-crud-error">{tableError}</p>}{tableLoading ? <div className="admin-crud-loading">Loading customers…</div> : <div className="admin-table-scroll"><table><thead><tr><th>CUSTOMER ID</th><th>CUSTOMER</th><th>PHONE</th><th>PAID TOTAL</th><th>LAST PAYMENT</th><th>ACTIONS</th></tr></thead><tbody>{(tableData.results as AdminCustomer[]).length ? (tableData.results as AdminCustomer[]).map(customer => <tr key={customer.id}><td><code className="admin-record-id">{customer.customerId}</code></td><td><div className="admin-owner-name">{customer.name}<small>{customer.email}</small></div></td><td>{customer.phone || "—"}</td><td>₹{Number(customer.paidTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}<small className="admin-row-subtext">{customer.paidPaymentCount} paid</small></td><td>{customer.lastPaidAt ? new Date(customer.lastPaidAt).toLocaleDateString() : "—"}</td><td><div className="admin-row-actions"><button type="button" aria-label={`Edit ${customer.name}`} onClick={() => setCustomerEditor(customer)}><Pencil size={14} /></button><button type="button" aria-label={`Delete ${customer.name}`} disabled={deleteBusy === customer.id} onClick={() => deleteRecord("customers", customer.id, customer.name)}><Trash2 size={14} /></button></div></td></tr>) : <tr><td colSpan={6} className="admin-empty">No customers found. Add a customer to begin.</td></tr>}</tbody></table></div>}<div className="admin-crud-pagination"><span>Showing {tableData.total ? (tablePage - 1) * 10 + 1 : 0}–{Math.min(tablePage * 10, tableData.total)} of {tableData.total}</span><div><button type="button" disabled={tablePage <= 1 || tableLoading} onClick={() => setTablePage(page => Math.max(1, page - 1))}><ArrowLeft size={14} /> Previous</button><b>Page {tableData.page} of {Math.max(1, tableData.totalPages)}</b><button type="button" disabled={tablePage >= tableData.totalPages || tableLoading} onClick={() => setTablePage(page => page + 1)}>Next <ArrowRight size={14} /></button></div></div></section>}
        {tab === "Payments" && <section className="admin-panel admin-crud-panel"><div className="admin-panel-heading admin-crud-heading"><div><h2>Payments</h2><p>Paid customers, payment status, references, and amounts.</p></div><button className="admin-add-button" type="button" onClick={() => setPaymentEditor({ id: "", customerId: "", customerName: "", customerEmail: "", amount: "", currency: "INR", status: "PAID", paymentMethod: "OTHER", reference: "", createdAt: "" })}><Plus size={15} /> Add payment</button></div><div className="admin-table-tools"><label className="admin-table-search"><Search size={15} /><input value={search} onChange={event => { setSearch(event.target.value); setTablePage(1); }} placeholder="Search payment, customer, reference" /></label>{advancedFilterControl}</div>{tableError && <p className="admin-crud-error">{tableError}</p>}{tableLoading ? <div className="admin-crud-loading">Loading payments…</div> : <div className="admin-table-scroll"><table><thead><tr><th>PAYMENT ID</th><th>CUSTOMER ID / NAME</th><th>EMAIL</th><th>AMOUNT</th><th>STATUS</th><th>METHOD / REFERENCE</th><th>ACTIONS</th></tr></thead><tbody>{(tableData.results as AdminPayment[]).length ? (tableData.results as AdminPayment[]).map(payment => <tr key={payment.id}><td><code className="admin-record-id">{payment.id}</code></td><td><code className="admin-record-id">{payment.customerId}</code><div className="admin-row-subtext">{payment.customerName}</div></td><td>{payment.customerEmail}</td><td>{payment.currency} {Number(payment.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td><td><span className={`admin-payment-status status-${String(payment.status ?? "unknown").toLowerCase()}`}>{payment.status ?? "Unknown"}</span></td><td>{payment.paymentMethod}<small className="admin-row-subtext">{payment.reference || "No reference"}</small></td><td><div className="admin-row-actions"><button type="button" aria-label={`Edit payment ${payment.id}`} onClick={() => setPaymentEditor(payment)}><Pencil size={14} /></button><button type="button" aria-label={`Delete payment ${payment.id}`} disabled={deleteBusy === payment.id} onClick={() => deleteRecord("payments", payment.id, `payment ${payment.id}`)}><Trash2 size={14} /></button></div></td></tr>) : <tr><td colSpan={7} className="admin-empty">No payments found.</td></tr>}</tbody></table></div>}<div className="admin-crud-pagination"><span>Showing {tableData.total ? (tablePage - 1) * 10 + 1 : 0}–{Math.min(tablePage * 10, tableData.total)} of {tableData.total}</span><div><button type="button" disabled={tablePage <= 1 || tableLoading} onClick={() => setTablePage(page => Math.max(1, page - 1))}><ArrowLeft size={14} /> Previous</button><b>Page {tableData.page} of {Math.max(1, tableData.totalPages)}</b><button type="button" disabled={tablePage >= tableData.totalPages || tableLoading} onClick={() => setTablePage(page => page + 1)}>Next <ArrowRight size={14} /></button></div></div></section>}
        {(tab === "Users" || tab === "Store owners") && <section className="admin-panel admin-crud-panel"><div className="admin-panel-heading admin-crud-heading"><div><h2>{tab === "Store owners" ? "Store owners" : "All users"}</h2><p>Store owner accounts, their store, and account IDs.</p></div><button className="admin-add-button" type="button" onClick={() => setUserEditor({ id: "", name: "", email: "", role: "STORE_OWNER", createdAt: "", store: null })}><Plus size={15} /> Add user</button></div><div className="admin-table-tools"><label className="admin-table-search"><Search size={15} /><input value={search} onChange={event => { setSearch(event.target.value); setTablePage(1); }} placeholder="Search user ID, name, email, store" /></label>{advancedFilterControl}</div>{tableError && <p className="admin-crud-error">{tableError}</p>}{tableLoading ? <div className="admin-crud-loading">Loading users…</div> : <div className="admin-table-scroll"><table><thead><tr><th>USER ID</th><th>USER</th><th>STORE</th><th>ROLE</th><th>JOINED</th><th>ACTIONS</th></tr></thead><tbody>{(tableData.results as AdminUser[]).length ? (tableData.results as AdminUser[]).map(user => <tr key={user.id}><td><code className="admin-record-id">{user.id}</code></td><td><div className="admin-owner-name">{user.name}<small>{user.email}</small></div></td><td>{user.store?.name ?? "No store"}</td><td><span className="admin-category-tag">{user.role}</span></td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td><div className="admin-row-actions"><button type="button" aria-label={`Edit ${user.name}`} onClick={() => setUserEditor(user)}><Pencil size={14} /></button><button type="button" aria-label={`Delete ${user.name}`} disabled={deleteBusy === user.id} onClick={() => deleteRecord("users", user.id, `user ${user.name}`)}><Trash2 size={14} /></button></div></td></tr>) : <tr><td colSpan={6} className="admin-empty">No users found.</td></tr>}</tbody></table></div>}<div className="admin-crud-pagination"><span>Showing {tableData.total ? (tablePage - 1) * 10 + 1 : 0}–{Math.min(tablePage * 10, tableData.total)} of {tableData.total}</span><div><button type="button" disabled={tablePage <= 1 || tableLoading} onClick={() => setTablePage(page => Math.max(1, page - 1))}><ArrowLeft size={14} /> Previous</button><b>Page {tableData.page} of {Math.max(1, tableData.totalPages)}</b><button type="button" disabled={tablePage >= tableData.totalPages || tableLoading} onClick={() => setTablePage(page => page + 1)}>Next <ArrowRight size={14} /></button></div></div></section>}
        {tab === "Notifications" ? <section className="admin-panel admin-notification-page"><div className="admin-panel-heading"><div><h2>Platform notifications</h2><p>{notifications.filter(item => item.unread).length} unread alerts</p></div><button className="admin-mark-all" type="button" onClick={markAllNotificationsRead}>Mark all read</button></div><div className="admin-notification-page-list">{notifications.map(item => { const Icon = item.icon === "order" ? ShoppingBag : item.icon === "payout" ? Wallet : item.icon === "user" ? Users : item.icon === "security" ? ShieldCheck : Store; return <button key={item.id} type="button" className={`admin-notification-item ${item.unread ? "unread" : ""}`} onClick={() => markNotificationRead(item.id)}><span className="admin-notification-icon"><Icon size={16} /></span><span className="admin-notification-text"><b>{item.title}</b><p>{item.message}</p></span><span className="admin-notification-time">{item.time}</span></button>; })}</div></section> : null}
        {tab !== "Overview" && tab !== "Stores" && tab !== "Store owners" && tab !== "Users" && tab !== "Notifications" && tab !== "Customers" && tab !== "Payments" && <section className="admin-panel admin-module-page"><div className="admin-module-icon">{(() => { const Icon = adminNavigation.find(item => item.label === tab)?.icon ?? Activity; return <Icon size={21} />; })()}</div><h2>{tab} workspace</h2><p>{adminDescriptions[tab]}</p><div className="admin-module-empty"><b>No {tab.toLowerCase()} data yet</b><span>This section is ready. Connect the {tab.toLowerCase()} service to display live platform records here.</span></div></section>}
        {customerEditor && <div className="admin-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCustomerEditor(null); }}><section className="admin-record-dialog" role="dialog" aria-modal="true" aria-labelledby="customer-dialog-title"><div className="admin-dialog-heading"><div><h2 id="customer-dialog-title">{customerEditor.id ? "Edit customer" : "Add customer"}</h2><p>Customer ID is generated automatically.</p></div><button type="button" onClick={() => setCustomerEditor(null)} aria-label="Close">×</button></div><form onSubmit={event => saveRecord(event, "customers", customerEditor.id)}><label>Full name<input name="name" required minLength={2} defaultValue={customerEditor.name} /></label><label>Email address<input name="email" type="email" required defaultValue={customerEditor.email} /></label><label>Phone<input name="phone" type="tel" defaultValue={customerEditor.phone} /></label>{tableError && <p className="admin-crud-error">{tableError}</p>}<div className="admin-dialog-actions"><button type="button" className="admin-dialog-cancel" onClick={() => setCustomerEditor(null)}>Cancel</button><button type="submit" className="admin-add-button">{customerEditor.id ? "Save changes" : "Create customer"}</button></div></form></section></div>}
        {paymentEditor && <div className="admin-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setPaymentEditor(null); }}><section className="admin-record-dialog" role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title"><div className="admin-dialog-heading"><div><h2 id="payment-dialog-title">{paymentEditor.id ? "Edit payment" : "Add payment"}</h2><p>Record a customer payment and its status.</p></div><button type="button" onClick={() => setPaymentEditor(null)} aria-label="Close">×</button></div><form onSubmit={event => saveRecord(event, "payments", paymentEditor.id)}><label>Customer<select name="customerId" required defaultValue={paymentEditor.customerId}><option value="" disabled>Select a customer</option>{paymentEditor.customerId && !customerOptions.some(customer => customer.id === paymentEditor.customerId) && <option value={paymentEditor.customerId}>{paymentEditor.customerName} · {paymentEditor.customerId}</option>}{customerOptions.map(customer => <option key={customer.id} value={customer.id}>{customer.name} · {customer.id}</option>)}</select></label><div className="admin-dialog-two-col"><label>Amount<input name="amount" type="number" min="0.01" step="0.01" required defaultValue={paymentEditor.amount} /></label><label>Currency<input name="currency" maxLength={3} required defaultValue={paymentEditor.currency || "INR"} /></label></div><div className="admin-dialog-two-col"><label>Status<select name="status" defaultValue={paymentEditor.status || "PAID"}><option>PAID</option><option>PENDING</option><option>FAILED</option><option>REFUNDED</option></select></label><label>Payment method<input name="paymentMethod" required maxLength={40} defaultValue={paymentEditor.paymentMethod || "OTHER"} /></label></div><label>Payment reference<input name="reference" maxLength={120} defaultValue={paymentEditor.reference} /></label>{tableError && <p className="admin-crud-error">{tableError}</p>}{!customerOptions.length && <p className="admin-crud-error">Create a customer before adding a payment.</p>}<div className="admin-dialog-actions"><button type="button" className="admin-dialog-cancel" onClick={() => setPaymentEditor(null)}>Cancel</button><button type="submit" className="admin-add-button" disabled={!customerOptions.length}>{paymentEditor.id ? "Save changes" : "Create payment"}</button></div></form></section></div>}
        {userEditor && <div className="admin-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setUserEditor(null); }}><section className="admin-record-dialog" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title"><div className="admin-dialog-heading"><div><h2 id="user-dialog-title">{userEditor.id ? "Edit store owner" : "Add user"}</h2><p>{userEditor.id ? <>User ID: <code>{userEditor.id}</code></> : "Create a store owner account and its store workspace."}</p></div><button type="button" onClick={() => setUserEditor(null)} aria-label="Close">×</button></div><form onSubmit={event => saveRecord(event, "users", userEditor.id)}><label>Full name<input name="name" required minLength={2} defaultValue={userEditor.name} /></label><label>Email address<input name="email" type="email" required defaultValue={userEditor.email} /></label>{!userEditor.id && <><label>Temporary password<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label><div className="admin-dialog-two-col"><label>Store name<input name="storeName" required minLength={2} /></label><label>Store category<input name="storeCategory" required minLength={2} /></label></div></>}{tableError && <p className="admin-crud-error">{tableError}</p>}<div className="admin-dialog-actions"><button type="button" className="admin-dialog-cancel" onClick={() => setUserEditor(null)}>Cancel</button><button type="submit" className="admin-add-button">{userEditor.id ? "Save changes" : "Create user"}</button></div></form></section></div>}
        {selected ? (
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 60, background: "rgba(3,39,25,0.66)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}>
            <div style={{ width: "min(520px, 100%)", background: "#0a4a34", border: "1px solid #ffffff1c", borderRadius: 16, padding: 22, color: "#f1faf2", boxShadow: "0 24px 70px #03271959" }} onClick={event => event.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#9fe0ad", fontSize: 9, fontWeight: 800, letterSpacing: 1.4 }}>{tab === "Store owners" ? "STORE OWNER" : "STORE"}</div>
                  <h2 style={{ margin: "6px 0 0", fontSize: 20, fontWeight: 750, letterSpacing: -0.5, color: "#f1faf2" }}>{tab === "Store owners" ? selected.owner.name : selected.name}</h2>
                  <div style={{ marginTop: 8, color: "#b2c9b8", fontSize: 11 }}>{tab === "Store owners" ? `Store: ${selected.name}` : `Owner: ${selected.owner.name}`}</div>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close store details" style={{ border: "1px solid #ffffff24", background: "transparent", color: "#9fe0ad", borderRadius: 8, width: 30, height: 30, display: "grid", placeItems: "center", cursor: "pointer", flex: "none", fontSize: 13 }}>✕</button>
              </div>
              <div style={{ marginTop: 18, borderTop: "1px solid #ffffff16", paddingTop: 14, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #ffffff10", paddingBottom: 9 }}>
                  <span style={{ color: "#b2c9b8", fontSize: 10 }}>CATEGORY</span>
                  <b style={{ color: "#eff8f0", fontSize: 11, textAlign: "right" }}>{selected.category}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #ffffff10", paddingBottom: 9 }}>
                  <span style={{ color: "#b2c9b8", fontSize: 10 }}>OWNER</span>
                  <b style={{ color: "#eff8f0", fontSize: 11, textAlign: "right" }}>{selected.owner.name} · {selected.owner.email}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #ffffff10", paddingBottom: 9 }}>
                  <span style={{ color: "#b2c9b8", fontSize: 10 }}>{tab === "Store owners" ? "STORE" : "REGISTERED"}</span>
                  <b style={{ color: "#eff8f0", fontSize: 11, textAlign: "right" }}>{tab === "Store owners" ? selected.name : new Date(selected.createdAt).toLocaleDateString()}</b>
                </div>
                {tab === "Stores" ? (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #ffffff10", paddingBottom: 9 }}>
                    <span style={{ color: "#b2c9b8", fontSize: 10 }}>STATUS</span>
                    <b style={{ color: "#9fe0ad", fontSize: 11 }}>Registered</b>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        <footer className="admin-footer"><span>© 2026 SHOPIQ Platform</span><span>SUPER ADMIN CONSOLE</span></footer>
      </div>
    </section>
  </main>;
}
