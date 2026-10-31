"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AppBar, Box, Button, Card, CardContent, Chip, Container, Divider,
  IconButton, Stack, Toolbar, Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

const features = [
  { icon: <Inventory2OutlinedIcon />, title: "Inventory that stays in sync", body: "Know what’s in stock, what’s running low, and what’s moving fast. Keep every channel up to date." },
  { icon: <PaymentsOutlinedIcon />, title: "Payments without the busywork", body: "Bring orders, invoices, and payments together. Get paid sooner with less follow-up." },
  { icon: <QueryStatsRoundedIcon />, title: "Insights made for action", body: "See your sales at a glance and spot the products and channels driving your next big move." },
];

const questions = [
  ["What is SHOPIQ?", "SHOPIQ brings the everyday tools behind your business into one clear workspace: orders, products, payments, and performance."],
  ["Can I manage products and inventory?", "Yes. Keep your product catalog organized, monitor stock levels, and see what needs attention across your store."],
  ["Is SHOPIQ right for a growing business?", "SHOPIQ is designed to help growing teams spend less time on repetitive operations and more time serving customers."],
];

const setupSteps = [
  { number: "01", icon: <StorefrontRoundedIcon />, title: "Set up your store", body: "Bring your store essentials into one simple workspace, ready for your team." },
  { number: "02", icon: <Inventory2OutlinedIcon />, title: "Add products & stock", body: "Organize your products and get a clearer view of what is on every shelf." },
  { number: "03", icon: <QueryStatsRoundedIcon />, title: "Track sales as you grow", body: "Follow orders and sales insights, then decide what your store needs next." },
];

const navCards = [
  { title: "Platform", eyebrow: "YOUR WORKSPACE", description: "Everything your store needs, in one clear view.", links: [{ label: "Store overview", href: "#platform" }, { label: "Inventory & products", href: "#features" }, { label: "Orders & payments", href: "#features" }] },
  { title: "Solutions", eyebrow: "MADE FOR STORES", description: "Simple tools for the daily rhythm of your business.", links: [{ label: "Supermarket operations", href: "#features" }, { label: "Stock management", href: "#features" }, { label: "Billing & checkout", href: "#features" }] },
  { title: "Resources", eyebrow: "HERE TO HELP", description: "Find a good place to start and answers along the way.", links: [{ label: "Getting started", href: "#resources" }, { label: "Frequently asked questions", href: "#resources" }, { label: "Talk to our team", href: "#get-started" }] },
];

function DashboardPreview() {
  return (
    <Box className="dashboard-wrap" aria-label="SHOPIQ sales dashboard preview">
      <div className="dash-orbit orbit-one" /><div className="dash-orbit orbit-two" />
      <Card className="dashboard-card" elevation={0}>
        <Box className="dash-top">
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box className="dash-logo"><StorefrontRoundedIcon fontSize="small" /></Box>
            <Box><Typography fontWeight={800} fontSize={13}>Good morning, Alex</Typography><Typography color="text.secondary" fontSize={10}>Here’s your store at a glance</Typography></Box>
          </Stack>
          <Chip label="This month" size="small" className="period-chip" />
        </Box>
        <Box className="dash-stats">
          <div className="stat-box"><Typography className="stat-label">Total sales</Typography><Typography className="stat-value">$24,680</Typography><Typography className="stat-up"><TrendingUpRoundedIcon /> 12.8% this month</Typography></div>
          <div className="stat-box"><Typography className="stat-label">Orders</Typography><Typography className="stat-value">1,284</Typography><Typography className="stat-up"><TrendingUpRoundedIcon /> 8.2% this month</Typography></div>
        </Box>
        <Box className="chart-area">
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={800} fontSize={12}>Revenue overview</Typography><Typography color="text.secondary" fontSize={10}>Your store is on a roll</Typography></Box><Typography fontWeight={800} fontSize={12}>$8,420</Typography></Stack>
          <div className="chart-bars" aria-hidden="true">{[32, 48, 39, 60, 47, 71, 56, 82, 64, 93, 73, 100].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div>
          <Stack direction="row" justifyContent="space-between" className="chart-labels"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></Stack>
        </Box>
        <Box className="dash-bottom"><Stack direction="row" spacing={1} alignItems="center"><Box className="product-thumb">✿</Box><Box><Typography fontWeight={700} fontSize={10}>Linen vase · Sand</Typography><Typography color="text.secondary" fontSize={9}>New order #1048</Typography></Box></Stack><Chip label="Paid" size="small" className="paid-chip"/><Typography fontWeight={800} fontSize={11}>$48.00</Typography></Box>
      </Card>
      <Card className="float-card float-orders" elevation={0}><Box className="float-icon"><ShoppingBagOutlinedIcon fontSize="small" /></Box><Box><Typography color="text.secondary" fontSize={10}>Orders today</Typography><Typography fontWeight={800} fontSize={15}>+128 <span className="float-green">↗ 18%</span></Typography></Box></Card>
      <Card className="float-card float-stock" elevation={0}><Box className="stock-check"><CheckCircleRoundedIcon fontSize="small" /></Box><Box><Typography fontWeight={800} fontSize={10}>Looking good!</Typography><Typography color="text.secondary" fontSize={9}>Your stock is up to date</Typography></Box></Card>
    </Box>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const stepPathRef = useRef<HTMLDivElement | null>(null);
  const [stepPathVisible, setStepPathVisible] = useState(false);
  useEffect(() => {
    const element = stepPathRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setStepPathVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStepPathVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <main>
      <section className="hero" id="home">
        <AppBar position="sticky" elevation={0} className="nav-bar"><Container maxWidth="lg" className="nav-container"><Toolbar disableGutters className="nav-toolbar">
          <a className="brand" href="#home" aria-label="SHOPIQ home"><span className="brand-mark"><StorefrontRoundedIcon /></span><span>SHOP<span>IQ</span></span></a>
          <Stack direction="row" spacing={1.5} className="nav-actions"><Button className="login-btn" component={Link} href="/login">Log in</Button><Button variant="contained" className="nav-cta" component={Link} href="/register">Get started <ArrowForwardRoundedIcon fontSize="small" /></Button><IconButton className={`card-nav-toggle ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}</IconButton></Stack>
        </Toolbar>
        <div className={`nav-card-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
          {navCards.map((card, index) => <section className="nav-panel-card" key={card.title} style={{ "--nav-index": index } as React.CSSProperties}>
            <div className="nav-panel-top"><span>{card.eyebrow}</span><b>0{index + 1}</b></div><h2>{card.title}</h2><p>{card.description}</p>
            <div className="nav-panel-links">{card.links.map(link => <a key={link.label} href={link.href} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>{link.label}<ArrowForwardRoundedIcon /></a>)}</div>
          </section>)}
        </div></Container></AppBar>
        <Container maxWidth="lg"><div className="hero-grid">
        <Box className="hero-copy"><Chip icon={<AutoAwesomeRoundedIcon />} label="A little more flow. A lot more growth." className="eyebrow" />
          <Typography component="h1" className="hero-title">Your business,<br />in its <span>best shape.</span></Typography>
          <Typography className="hero-body">The all-in-one workspace to run your store, keep customers happy, and make your next big idea happen.</Typography>
          <Stack direction="row" spacing={1.5} className="hero-buttons"><Button variant="contained" className="primary-cta" href="#get-started">Start for free <ArrowForwardRoundedIcon /></Button><Button className="demo-cta" href="#platform">See how it works <span className="play-icon">▶</span></Button></Stack>
          <Stack direction="row" className="hero-proof" spacing={1.2} alignItems="center"><Box className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></Box><Box><Typography className="proof-stars">★★★★★</Typography><Typography color="text.secondary" fontSize={12}>Made for people who make things happen</Typography></Box></Stack>
        </Box>
        <DashboardPreview />
        </div></Container><div className="hero-swoop" /></section>

      <section className="trusted"><Container maxWidth="lg"><Typography className="trusted-label">A better day at work, for teams everywhere</Typography><Stack className="logo-row" direction="row" justifyContent="space-between" alignItems="center"><span className="logo-word logo-north">northstar</span><span className="logo-word logo-good">goodkind<span>®</span></span><span className="logo-word logo-studio">STUDIO <i>FORM</i></span><span className="logo-word logo-wild">wildflower<span> & co.</span></span><span className="logo-word logo-morrow">morrow<span>market</span></span></Stack></Container></section>

      <section className="feature-section section-pad" id="platform"><Container maxWidth="lg"><Box className="section-heading"><Chip label="THE SHOPIQ WAY" className="section-chip"/><Typography component="h2">Less juggling.<br /><span>More business.</span></Typography><Typography className="section-intro">All the moving parts of your store, finally moving together. Get a clearer picture and a little more room to grow.</Typography></Box>
        <div className="feature-grid" id="features">{features.map((feature, i) => <Card className={`feature-card feature-${i + 1}`} elevation={0} key={feature.title}><CardContent><Box className="feature-icon">{feature.icon}</Box><Typography component="h3">{feature.title}</Typography><Typography color="text.secondary">{feature.body}</Typography><a href="#get-started">Explore feature <ArrowForwardRoundedIcon /></a></CardContent></Card>)}</div>
        <div className="feature-banner"><Box><Chip label="YOUR WHOLE STORE, IN ONE PLACE" className="section-chip"/><Typography component="h2">A little less admin.<br /><span>A lot more “that worked.”</span></Typography><Typography>See what’s happening across orders, products, payments, and customers without jumping between tabs.</Typography><Button className="text-link" href="#get-started">Take a closer look <ArrowForwardRoundedIcon /></Button></Box><Box className="mini-dashboard"><div className="mini-head"><span>Shop overview</span><span className="mini-dot">● Live</span></div><div className="mini-total">$12,480 <span>+14.6%</span></div><div className="mini-caption">Total revenue this week</div><div className="mini-chart">{[36, 50, 43, 73, 54, 88, 64, 100, 72, 90].map((v, i) => <span key={i} style={{ height: `${v}%` }} />)}</div><div className="mini-order"><span className="mini-product">✳</span><span><b>Everyday tote bag</b><small>Order #2048 · 2 min ago</small></span><b>$42.00</b></div><div className="mini-stock"><BoltRoundedIcon /> All systems in sync <span>✓</span></div></Box></div>
      </Container></section>

      <section className="step-path-section section-pad" id="how-it-works"><Container maxWidth="lg"><Box className="step-path-heading"><Chip label="A SIMPLE WAY TO GET STARTED" className="section-chip"/><Typography component="h2">From first shelf to<br/><span>smoother sales.</span></Typography><Typography>Three clear steps to bring your supermarket’s daily work into one place.</Typography></Box><div ref={stepPathRef} className={`step-path ${stepPathVisible ? "is-visible" : ""}`}><div className="step-path-track" aria-hidden="true"/>{setupSteps.map((step, index)=><Card className="step-path-card" elevation={0} key={step.number} style={{"--step-index":index} as React.CSSProperties}><div className="step-path-node"><span>{step.number}</span></div><CardContent><div className="step-path-icon">{step.icon}</div><Typography className="step-path-kicker">STEP {step.number}</Typography><Typography component="h3">{step.title}</Typography><Typography className="step-path-copy">{step.body}</Typography><div className="step-path-status"><CheckCircleRoundedIcon /> Ready when you are</div></CardContent></Card>)}</div></Container></section>

      <section className="growth-section section-pad"><Container maxWidth="lg"><div className="growth-grid"><Box className="growth-art"><div className="growth-circle"><span className="growth-sun">✳</span><Typography>GROW<br />YOUR<br />OWN WAY.</Typography></div><div className="growth-note">Good things take<br />good systems <span>↗</span></div><div className="growth-spark">✦</div></Box><Box className="growth-copy"><Chip label="ROOM TO GROW" className="section-chip"/><Typography component="h2">Built around the<br /><span>way you work.</span></Typography><Typography className="growth-body">Your business is one of a kind. SHOPIQ gives you the useful tools and clear view to make it your own, at every stage.</Typography><Stack className="growth-points"><Stack direction="row"><CheckCircleRoundedIcon /><Box><b>Start simple</b><Typography>Get the essentials in order without a complicated setup.</Typography></Box></Stack><Stack direction="row"><CheckCircleRoundedIcon /><Box><b>Find your rhythm</b><Typography>Connect your daily work and make busy days feel lighter.</Typography></Box></Stack><Stack direction="row"><CheckCircleRoundedIcon /><Box><b>Keep growing</b><Typography>Make confident decisions as your business finds its next gear.</Typography></Box></Stack></Stack><Button className="text-link" href="#get-started">Meet your new workspace <ArrowForwardRoundedIcon /></Button></Box></div></Container></section>

      <section className="pricing-section section-pad" id="pricing"><Container maxWidth="lg"><Box className="pricing-heading"><Chip label="SIMPLE BY DESIGN" className="section-chip"/><Typography component="h2">Good tools. <span>Clear pricing.</span></Typography><Typography>Everything you need to get moving, with room to grow when you’re ready.</Typography></Box><div className="pricing-grid"><Card className="price-card" elevation={0}><CardContent><Chip label="JUST GETTING STARTED" className="plan-tag"/><Typography component="h3">Starter</Typography><Typography className="plan-copy">The essentials to open your doors and get in the groove.</Typography><Typography className="price">$0 <span>/ forever</span></Typography><Button variant="outlined" className="plan-button">Start for free <ArrowForwardRoundedIcon /></Button><Divider /><Typography className="includes-label">A good place to start</Typography>{["One store workspace", "Product and order basics", "Simple sales overview"].map(x => <div className="plan-feature" key={x}><CheckCircleRoundedIcon />{x}</div>)}</CardContent></Card><Card className="price-card featured-price" elevation={0}><div className="popular-ribbon">THE CROWD FAVORITE ✦</div><CardContent><Chip label="READY FOR WHAT’S NEXT" className="plan-tag warm-tag"/><Typography component="h3">Growth</Typography><Typography className="plan-copy">More of the good stuff, for your next chapter.</Typography><Typography className="price">$24 <span>/ month</span></Typography><Button variant="contained" className="plan-button filled-plan">Try Growth free <ArrowForwardRoundedIcon /></Button><Divider /><Typography className="includes-label">Everything in Starter, plus</Typography>{["Multiple sales channels", "Smart inventory tracking", "In-depth business insights"].map(x => <div className="plan-feature" key={x}><CheckCircleRoundedIcon />{x}</div>)}</CardContent></Card><Card className="price-card" elevation={0}><CardContent><Chip label="MADE FOR BIG PLANS" className="plan-tag"/><Typography component="h3">Scale</Typography><Typography className="plan-copy">Flexible tools and support as your team takes off.</Typography><Typography className="price custom-price">Let’s talk</Typography><Button variant="outlined" className="plan-button">Talk to our team <ArrowForwardRoundedIcon /></Button><Divider /><Typography className="includes-label">Built around your business</Typography>{["Everything in Growth", "Team and role management", "Personalized onboarding"].map(x => <div className="plan-feature" key={x}><CheckCircleRoundedIcon />{x}</div>)}</CardContent></Card></div></Container></section>

      <section className="quote-section"><Container maxWidth="md"><div className="quote-mark">“</div><Typography component="blockquote">I finally have a clear picture of my business, and I’ve got more time to make it even better.</Typography><Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5}><div className="quote-avatar">S</div><Box><Typography fontWeight={800} fontSize={13}>Sam Rivera</Typography><Typography color="text.secondary" fontSize={12}>Founder, Goodkind Studio</Typography></Box></Stack></Container></section>

      <section className="faq-section section-pad" id="resources"><Container maxWidth="md"><Box className="faq-heading"><Chip label="GOOD QUESTIONS" className="section-chip"/><Typography component="h2">Curious? <span>We’ve got you.</span></Typography></Box><div className="faq-list">{questions.map(([question, answer], i) => <div className={`faq-item ${openFaq === i ? "faq-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{question}</span><ExpandMoreRoundedIcon /></button>{openFaq === i && <Typography>{answer}</Typography>}</div>)}</div></Container></section>

      <section className="final-cta" id="get-started"><Container maxWidth="lg"><div className="cta-inner"><Box className="cta-decoration">✳</Box><Chip label="YOUR NEXT CHAPTER STARTS HERE" className="cta-chip"/><Typography component="h2">You’ve got a business<br />to make <span>better.</span></Typography><Typography>Let SHOPIQ handle the busy bits. You bring the big ideas.</Typography><Button variant="contained" className="cta-button">Get started for free <ArrowForwardRoundedIcon /></Button><small>Free to start · No card needed · Ready when you are</small></div></Container></section>

      <Box component="footer" className="footer" id="footer">
        <Container maxWidth="lg">
          <div className="footer-grid">
            <div className="footer-about">
              <a className="brand footer-brand" href="#home" aria-label="SHOPIQ home"><span className="brand-mark"><StorefrontRoundedIcon /></span><span>SHOP<span>IQ</span></span></a>
              <Typography>Everything your supermarket needs to keep shelves moving and customers coming back.</Typography>
              <div className="footer-socials" aria-label="Store tools"><span>INVENTORY</span><span>ORDERS</span><span>INSIGHTS</span></div>
            </div>
            <div className="footer-column"><Typography component="h3">SHOPIQ</Typography><a href="#platform">Platform overview</a><a href="#features">Store management</a><a href="#features">Inventory & products</a><a href="#pricing">Plans & pricing</a></div>
            <div className="footer-column"><Typography component="h3">FOR YOUR STORE</Typography><a href="#features">Orders & checkout</a><a href="#features">Payments & billing</a><a href="#platform">Sales insights</a><a href="#resources">Getting started</a></div>
            <div className="footer-column footer-contact"><Typography component="h3">HERE TO HELP</Typography><Typography>Questions about setting up your store? Find a simple way to get started with SHOPIQ.</Typography><a className="footer-contact-link" href="#get-started">Get started with SHOPIQ <ArrowForwardRoundedIcon /></a><span>Support for your setup and day-to-day store questions.</span></div>
          </div>
          <Divider className="footer-divider" />
          <Stack className="footer-bottom" direction="row" justifyContent="space-between" alignItems="center"><Typography>© 2026 SHOPIQ. Built for better grocery business.</Typography><Stack direction="row" spacing={3}><a href="#resources">Privacy</a><a href="#resources">Terms</a><a href="#home">Back to top ↑</a></Stack></Stack>
        </Container>
      </Box>
    </main>
  );
}
