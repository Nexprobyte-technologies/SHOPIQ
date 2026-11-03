"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [owner, setOwner] = useState({ name: "", email: "" });
  const [store, setStore] = useState({ name: "", category: "" });
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (step < 3) { setStep(step + 1); return; }
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...owner, storeName: store.name, storeCategory: store.category, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not create your account.");
      localStorage.setItem("shopiq_token", data.accessToken);
      router.replace("/dashboard");
    } catch (err) { setError(err instanceof TypeError ? "Can't reach the SHOPIQ API. Start the backend server and make sure PostgreSQL is running." : err instanceof Error ? err.message : "Could not create your account."); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" /><div className="auth-glow auth-glow-two" />
      <header className="auth-header"><Link href="/" className="brand"><span className="brand-mark"><StorefrontRoundedIcon /></span><span>SHOP<span>IQ</span></span></Link><Link href="/" className="auth-back">Back to home <ArrowForwardRoundedIcon /></Link></header>
      <section className="auth-layout auth-layout-register">
        <div className="auth-story"><span className="auth-eyebrow"><i /> BUILT FOR STORE OWNERS</span><h1>Your store,<br />ready for <em>more.</em></h1><p>Create your owner account in three quick steps, then bring your business into one clear view.</p><div className="auth-story-note"><span className="auth-note-icon"><StorefrontRoundedIcon /></span><span><b>One account for your store</b><small>Manage orders, inventory and insights together.</small></span><span className="auth-note-dot" /></div><div className="auth-decoration auth-decoration-a" /><div className="auth-decoration auth-decoration-b" /></div>
        <div className="auth-card">
          <div className="auth-card-heading"><span className="auth-mobile-mark"><StorefrontRoundedIcon /></span><Typography className="auth-kicker">STORE OWNER REGISTRATION · STEP {step} OF 3</Typography><Typography component="h2">{complete ? "You're all set" : step === 1 ? "Your owner details" : step === 2 ? "Tell us about your store" : "Secure your account"}</Typography><Typography className="auth-subtitle">{complete ? "Your SHOPIQ owner account has been created." : step === 1 ? "This account will have store owner access." : step === 2 ? "Add the basics so we can set up your workspace." : "Choose a password to finish registration."}</Typography></div>
          <div className="auth-progress" aria-label={`Step ${step} of 3`}><span className={step >= 1 ? "active" : ""} /><span className={step >= 2 ? "active" : ""} /><span className={step >= 3 ? "active" : ""} /></div>
          {error && <Alert severity="error" className="auth-alert">{error}</Alert>}
          {complete ? <Alert severity="success" className="auth-alert">Registration complete. You can now sign in with your email and password.</Alert> : <form className="auth-form" onSubmit={submit}>
            {step === 1 && <><TextField label="Owner name" autoComplete="name" required fullWidth value={owner.name} onChange={e => setOwner({ ...owner, name: e.target.value })} placeholder="Alex Morgan" /><TextField label="Email address" type="email" autoComplete="email" required fullWidth value={owner.email} onChange={e => setOwner({ ...owner, email: e.target.value })} placeholder="you@yourstore.com" /></>}
            {step === 2 && <><TextField label="Store name" autoComplete="organization" required fullWidth value={store.name} onChange={e => setStore({ ...store, name: e.target.value })} placeholder="Your store" /><TextField label="Store category" required fullWidth value={store.category} onChange={e => setStore({ ...store, category: e.target.value })} placeholder="For example, clothing or groceries" /></>}
            {step === 3 && <><div className="register-summary"><b>{store.name}</b><span>{owner.name} · {owner.email}</span><small>{store.category}</small></div><TextField label="Create a password" type={showPassword ? "text" : "password"} autoComplete="new-password" required fullWidth inputProps={{ minLength: 8 }} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" helperText="Use at least 8 characters." InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> }} /></>}
            <div className="auth-step-actions">{step > 1 && <Button type="button" className="auth-step-back" onClick={() => setStep(step - 1)}><ArrowBackRoundedIcon /> Back</Button>}<Button type="submit" variant="contained" fullWidth className="auth-submit" disabled={busy}>{busy ? "Creating account…" : step === 3 ? "Create owner account" : "Continue"} <ArrowForwardRoundedIcon /></Button></div>
          </form>}
          <div className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></div>
        </div>
      </section>
      <footer className="auth-footer"><span>© 2026 SHOPIQ</span><span>MADE FOR THE WAY YOU GROW</span><Link href="/">shopiq.com</Link></footer>
    </main>
  );
}
