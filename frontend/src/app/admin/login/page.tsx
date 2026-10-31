"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Admin sign-in failed.");
      sessionStorage.setItem("shopiq_admin_token", data.accessToken);
      router.replace("/admin");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not connect to the server."); }
    finally { setBusy(false); }
  }

  return <main className="admin-login-page"><div className="admin-login-glow" /><Link href="/" className="admin-login-brand"><span><AdminPanelSettingsRoundedIcon /></span>SHOP<span>IQ</span></Link><section className="admin-login-card"><div className="admin-login-icon"><AdminPanelSettingsRoundedIcon /></div><Typography className="admin-login-kicker">RESTRICTED ACCESS</Typography><Typography component="h1">Super admin sign in</Typography><Typography className="admin-login-copy">Use your configured super admin credentials to manage the SHOPIQ platform.</Typography>{error && <Alert severity="error" className="admin-login-alert">{error}</Alert>}<form onSubmit={signIn}><TextField label="Admin email" type="email" autoComplete="username" required fullWidth value={email} onChange={event => setEmail(event.target.value)} /><TextField label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" required fullWidth value={password} onChange={event => setPassword(event.target.value)} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> }} /><Button type="submit" variant="contained" disabled={busy} fullWidth>{busy ? "Checking access…" : "Sign in to admin"}<ArrowForwardRoundedIcon /></Button></form><div className="admin-login-foot"><span className="admin-secure-dot" /> Super admin access only</div></section><footer className="admin-login-footer">SHOPIQ PLATFORM CONTROL</footer></main>;
}
