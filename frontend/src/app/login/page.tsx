"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Alert, Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: { accounts: { id: {
      initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
      renderButton: (element: HTMLElement, options: Record<string, string>) => void;
    } } };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  async function handleGoogleCredential(credential: string) {
    setError(""); setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google sign-in failed.");
      (keepSignedIn ? localStorage : sessionStorage).setItem("shopiq_token", data.accessToken);
      router.replace("/dashboard");
    } catch (err) { setError(err instanceof TypeError ? "Can't reach the SHOPIQ API. Start the backend server and make sure PostgreSQL is running." : err instanceof Error ? err.message : "Google sign-in failed."); }
    finally { setBusy(false); }
  }

  function initializeGoogleButton() {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current || !window.google) return;
    googleButtonRef.current.replaceChildren();
    window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: ({ credential }) => { void handleGoogleCredential(credential); } });
    window.google.accounts.id.renderButton(googleButtonRef.current, { type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "rectangular", width: "360" });
  }

  useEffect(() => { initializeGoogleButton(); }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to sign in.");
      (keepSignedIn ? localStorage : sessionStorage).setItem("shopiq_token", data.accessToken);
      router.replace("/dashboard");
    } catch (err) { setError(err instanceof TypeError ? "Can't reach the SHOPIQ API. Start the backend server and make sure PostgreSQL is running." : err instanceof Error ? err.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      {GOOGLE_CLIENT_ID && <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogleButton} />}
      <div className="auth-glow auth-glow-one" /><div className="auth-glow auth-glow-two" />
      <header className="auth-header"><Link href="/" className="brand"><span className="brand-mark"><StorefrontRoundedIcon /></span><span>SHOP<span>IQ</span></span></Link><Link href="/" className="auth-back">Back to home <ArrowForwardRoundedIcon /></Link></header>
      <section className="auth-layout">
        <div className="auth-story"><span className="auth-eyebrow"><i /> YOUR BUSINESS, IN ITS BEST SHAPE</span><h1>Good to see<br />you <em>again.</em></h1><p>Your store is just a sign-in away. Pick up where you left off and keep good things moving.</p><div className="auth-story-note"><span className="auth-note-icon"><StorefrontRoundedIcon /></span><span><b>One clear view of your business</b><small>Orders, inventory and insights, all together.</small></span><span className="auth-note-dot" /></div><div className="auth-decoration auth-decoration-a" /><div className="auth-decoration auth-decoration-b" /></div>
        <div className="auth-card"><div className="auth-card-heading"><span className="auth-mobile-mark"><StorefrontRoundedIcon /></span><Typography className="auth-kicker">WELCOME BACK</Typography><Typography component="h2">Sign in to your account</Typography><Typography className="auth-subtitle">Enter your details to access your workspace.</Typography></div>
          {error && <Alert severity="error" className="auth-alert">{error}</Alert>}
          <div className="auth-login-method"><span className="auth-login-method-active">Email login</span></div>
          <form className="auth-form" onSubmit={signIn}>
            <TextField label="Email address" type="email" autoComplete="email" required fullWidth placeholder="you@yourstore.com" value={email} onChange={e => setEmail(e.target.value)} />
            <div className="auth-field-top"><label htmlFor="login-password">Password</label><span>Use your account password</span></div>
            <TextField id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required fullWidth placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> }} />
            <FormControlLabel className="auth-remember" control={<Checkbox size="small" checked={keepSignedIn} onChange={e => setKeepSignedIn(e.target.checked)} />} label="Keep me signed in" />
            <Button type="submit" variant="contained" fullWidth className="auth-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in with email"} <ArrowForwardRoundedIcon /></Button>
          </form><div className="auth-switch">New to SHOPIQ? <Link href="/register">Create an account</Link></div>
          <div className="auth-or"><span />or<span /></div>
          {GOOGLE_CLIENT_ID ? <div className="google-signin-wrap"><div ref={googleButtonRef} /></div> : <Alert severity="info" className="google-config-note">Google sign-in needs a Google OAuth client ID. Configure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to enable it.</Alert>}
        </div>
      </section>
      <footer className="auth-footer"><span>© 2026 SHOPIQ</span><span>MADE FOR THE WAY YOU GROW</span><Link href="/">shopiq.com</Link></footer>
    </main>
  );
}
