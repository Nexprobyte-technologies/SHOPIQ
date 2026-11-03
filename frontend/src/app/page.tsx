"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AppBar, Box, Button, Card, CardContent, Chip, Container, Divider,
  Stack, Toolbar, Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
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

const retailShowcases = [
  { eyebrow: "PRODUCTS & INVENTORY", title: "Know your stock at a glance.", body: "Keep product details, prices, and stock levels together. Spot low inventory early and keep shelves ready for the next order.", icon: <Inventory2OutlinedIcon />, statOne: ["Active products", "248"], statTwo: ["Running low", "12"], rows: [["Coffee beans · 500 g", "8 units", "Restock"], ["Green tea · 100 g", "34 units", "In stock"], ["Paper carry bags", "120 units", "In stock"]] },
  { eyebrow: "ORDERS & FULFILMENT", title: "Every order, moving forward.", body: "See new, packing, and completed orders in one queue. Give your team a clear next step from checkout to handoff.", icon: <ShoppingBagOutlinedIcon />, statOne: ["Today's orders", "84"], statTwo: ["To pack", "12"], rows: [["Order #2048", "2 items · ₹1,280", "Packing"], ["Order #2047", "1 item · ₹640", "Ready"], ["Order #2046", "4 items · ₹2,140", "Complete"]] },
  { eyebrow: "BILLING & PAYMENTS", title: "Invoices and payments in sync.", body: "Create clear invoices, track what is paid, and quickly find what still needs a follow-up across your store.", icon: <PaymentsOutlinedIcon />, statOne: ["Paid this week", "₹84,600"], statTwo: ["Awaiting payment", "8"], rows: [["INV-2041 · Green Basket", "₹3,240", "Paid"], ["INV-2040 · Daily Mart", "₹1,860", "Due"], ["INV-2039 · Fresh Corner", "₹5,120", "Paid"]] },
  { eyebrow: "CUSTOMERS & LOYALTY", title: "Make every visit feel personal.", body: "Keep customer details and purchase history close at hand, so your team can recognize regulars and serve them better.", icon: <StorefrontRoundedIcon />, statOne: ["Returning customers", "68%"], statTwo: ["Active customers", "1,240"], rows: [["Ananya Rao", "Last order · Today", "Returning"], ["Karthik S", "Last order · Yesterday", "Regular"], ["Meera Joseph", "Last order · Monday", "New"]] },
  { eyebrow: "REPORTS & INSIGHTS", title: "See what is working. Decide what is next.", body: "Bring sales, best-selling products, and store activity into a clear view that helps you make confident day-to-day decisions.", icon: <QueryStatsRoundedIcon />, statOne: ["Revenue this month", "₹4,82,000"], statTwo: ["Top category", "Fresh foods"], rows: [["North store", "₹1,84,200", "+12.8%"], ["Market street", "₹1,42,800", "+8.4%"], ["Central store", "₹96,400", "+5.2%"]] },
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
          <Stack direction="row" spacing={1.5} className="nav-actions"><Button className="login-btn" component={Link} href="/login">Log in</Button><Button variant="contained" className="nav-cta" component={Link} href="/register">Get started <ArrowForwardRoundedIcon fontSize="small" /></Button></Stack>
        </Toolbar></Container></AppBar>
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

      <section className="product-showcase-section section-pad"><Container maxWidth="lg"><Box className="product-showcase-heading"><Chip label="A CLEARER VIEW OF YOUR STORE" className="section-chip"/><Typography component="h2">Tools that keep<br/><span>business moving.</span></Typography><Typography>From the first product to the latest sale, keep the details that matter close at hand.</Typography></Box><div className="product-showcase-list">{retailShowcases.map((item, index) => <article className="product-showcase" key={item.eyebrow}><div className="product-showcase-copy"><Chip label={item.eyebrow} className="section-chip"/><Typography component="h2">{item.title}</Typography><Typography className="product-showcase-description">{item.body}</Typography><Button className="text-link" href="#get-started">Explore feature <ArrowForwardRoundedIcon /></Button></div><div className="product-showcase-visual"><Card className="product-preview-card" elevation={0}><div className="product-preview-top"><div className="product-preview-brand"><span>{item.icon}</span><b>SHOPIQ</b><small>{item.eyebrow}</small></div><span className="product-preview-live"><i/> LIVE</span></div><div className="product-preview-stats"><div><small>{item.statOne[0]}</small><b>{item.statOne[1]}</b></div><div><small>{item.statTwo[0]}</small><b>{item.statTwo[1]}</b></div></div><div className="product-preview-rows">{item.rows.map((row, rowIndex) => <div className="product-preview-row" key={rowIndex}><span className="product-row-mark">{String(rowIndex + 1).padStart(2, "0")}</span><b>{row[0]}</b><small>{row[1]}</small><em>{row[2]}</em></div>)}</div><div className="product-preview-footer"><CheckCircleRoundedIcon/> Updated just now <span>View details <ArrowForwardRoundedIcon/></span></div></Card><div className={`product-preview-orbit product-preview-orbit-${index + 1}`}/></div></article>)}</div></Container></section>

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
