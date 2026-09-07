import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Sprout, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Mic, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Zap, 
  MapPin, 
  HeartHandshake,
  Award,
  Clock
} from "lucide-react";

export default function Home() {
  const { t, lang } = useApp();
  const [calcQty, setCalcQty] = useState(100);
  const [calcCrop, setCalcCrop] = useState("tomato");

  // Sample prices for calculator
  const CROP_RATES = {
    tomato: { mandi: 18, direct: 26, name: lang === "ta" ? "தக்காளி (Tomato)" : "Tomato" },
    brinjal: { mandi: 22, direct: 32, name: lang === "ta" ? "கத்தரிக்காய் (Brinjal)" : "Brinjal" },
    onion: { mandi: 30, direct: 42, name: lang === "ta" ? "வெங்காயம் (Onion)" : "Onion" },
    carrot: { mandi: 26, direct: 38, name: lang === "ta" ? "கேரட் (Carrot)" : "Carrot" },
  };

  const currentRate = CROP_RATES[calcCrop] || CROP_RATES.tomato;
  const mandiTotal = calcQty * currentRate.mandi;
  const directTotal = calcQty * currentRate.direct;
  const extraIncome = directTotal - mandiTotal;
  const profitPct = Math.round((extraIncome / mandiTotal) * 100);

  const FEATURES = [
    {
      icon: <MapPin size={24} color="#0f5132" />,
      title: lang === "ta" ? "ஹைப்பர்லோகல் சந்தை" : "Hyperlocal Marketplace",
      desc: lang === "ta" 
        ? "அருகிலுள்ள விவசாயிகள் மற்றும் நுகர்வோரை நேரடி GPS மூலம் இணைக்கிறது." 
        : "Direct GPS distance connection between nearby farmers and buyers for peak freshness.",
      to: "/marketplace",
      tag: "15km Radius",
      color: "#e8f5e9"
    },
    {
      icon: <Sparkles size={24} color="#f59e0b" />,
      title: lang === "ta" ? "AI விலை பரிந்துரை" : "AI Smart Price Insights",
      desc: lang === "ta"
        ? "ரேண்டம் ஃபாரஸ்ட் AI மூலம் சந்தை நிலவரத்தை கணித்து நியாயமான விலை."
        : "RandomForest ML model analyzes seasonal trends & demand to recommend fair prices.",
      to: "/ai/price-insights",
      tag: "RandomForest ML",
      color: "#fef3c7"
    },
    {
      icon: <TrendingUp size={24} color="#0f5132" />,
      title: lang === "ta" ? "7-நாள் தேவை கணிப்பு" : "7-Day Demand Forecast",
      desc: lang === "ta"
        ? "அடுத்த வாரத்திற்கான காய்கறி தேவையை முன்கூட்டியே அறியலாம்."
        : "Gradient Boosting ML predicts next week's crop demand so farmers plant smartly.",
      to: "/ai/demand-forecast",
      tag: "Gradient Boost",
      color: "#e8f5e9"
    },
    {
      icon: <ShieldAlert size={24} color="#ef4444" />,
      title: lang === "ta" ? "பயிர் மீட்பு திட்டம்" : "Crop Rescue Network",
      desc: lang === "ta"
        ? "விற்பனையாகாத விளைபொருட்களை தள்ளுபடி விலையில் மொத்த வாங்குபவர்களுக்கு அளித்து உணவு வீணாவதை தடுக்கிறது."
        : "Unsold produce is auto-discounted for bulk buyers (hotels, NGOs), achieving zero food waste.",
      to: "/rescue-alerts",
      tag: "Zero Waste",
      color: "#fee2e2"
    },
    {
      icon: <Mic size={24} color="#f59e0b" />,
      title: lang === "ta" ? "தமிழ் குரல் AI" : "Tamil Voice Assistant",
      desc: lang === "ta"
        ? "எழுத்தறிவு இல்லாத விவசாயிகளும் குரல் வழியாகவே பயிர்களை விற்கலாம்."
        : "Farmers can speak in pure Tamil to list crops, check prices, and track orders effortlessly.",
      to: "/ai/voice-assistant",
      tag: "NLP + Speech",
      color: "#fef3c7"
    },
    {
      icon: <Award size={24} color="#0f5132" />,
      title: lang === "ta" ? "புத்துணர்ச்சி தரம்" : "Freshness & Quality Grading",
      desc: lang === "ta"
        ? "அறுவடை நேரத்தின் அடிப்படையில் தர முத்திரை வழங்கப்படுகிறது."
        : "Real-time harvest timestamp algorithm tags produce Grade A+ Fresh (<24h).",
      to: "/marketplace",
      tag: "Grade A+ Tag",
      color: "#e8f5e9"
    },
  ];

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <section className="hero-wrapper">
        <div className="hero-mesh-bg" />
        <div className="hero-container">
          <div className="hero-content">
            <div className="page-badge" style={{ background: "rgba(255,255,255,0.15)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.4)" }}>
              <Zap size={14} /> {t("hero_badge")}
            </div>
            <h1>
              {lang === "ta" ? (
                <>விவசாயியிடமிருந்து <span>நேரடியாக வீடு வரை</span> நியாயமான விலை.</>
              ) : (
                <>From Farm to Home, <span>Fair Price for Everyone.</span></>
              )}
            </h1>
            <p className="hero-tagline">{t("hero_tagline")}</p>
            <p className="hero-desc">{t("hero_desc")}</p>

            <div className="hero-actions">
              <Link to="/list-crop" className="btn-hero-primary">
                <Sprout size={20} />
                <span>{t("btn_list_crop")}</span>
              </Link>
              <Link to="/marketplace" className="btn-hero-secondary">
                <ShoppingBag size={20} />
                <span>{t("btn_browse_marketplace")}</span>
              </Link>
              <Link to="/ai/voice-assistant" className="btn-hero-secondary" style={{ borderColor: "#fbbf24", color: "#fef08a" }}>
                <Mic size={20} />
                <span>{t("btn_try_voice")}</span>
              </Link>
            </div>
          </div>

          {/* Floating Hero Visual Ticker */}
          <div className="hero-visual">
            <div className="hero-card-preview">
              <div className="hero-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.2rem" }}>🌾</span>
                  <strong style={{ fontSize: "1rem" }}>Tirunelveli Live Mandi</strong>
                </div>
                <div className="pulse-badge">
                  <div className="pulse-dot" /> Live Market Feed
                </div>
              </div>

              <div className="hero-card-item">
                <div className="crop-info">
                  <span className="crop-icon">🍅</span>
                  <div>
                    <div className="crop-title">{lang === "ta" ? "நாட்டு தக்காளி" : "Farm Fresh Tomatoes"}</div>
                    <div className="crop-sub">Murugan K. · 2.4 km away</div>
                  </div>
                </div>
                <div className="crop-price">
                  ₹26/kg
                  <span className="mandi-tag">Mandi: ₹18 (Save ₹8)</span>
                </div>
              </div>

              <div className="hero-card-item">
                <div className="crop-info">
                  <span className="crop-icon">🍆</span>
                  <div>
                    <div className="crop-title">{lang === "ta" ? "கத்தரிக்காய்" : "Fresh Purple Brinjal"}</div>
                    <div className="crop-sub">Selvam P. · 4.1 km away</div>
                  </div>
                </div>
                <div className="crop-price">
                  ₹32/kg
                  <span className="mandi-tag">Mandi: ₹22 (Save ₹10)</span>
                </div>
              </div>

              <div className="hero-card-item">
                <div className="crop-info">
                  <span className="crop-icon">🧅</span>
                  <div>
                    <div className="crop-title">{lang === "ta" ? "சின்ன வெங்காயம்" : "Shallots / Small Onion"}</div>
                    <div className="crop-sub">Arumugam N. · 6.8 km away</div>
                  </div>
                </div>
                <div className="crop-price">
                  ₹42/kg
                  <span className="mandi-tag">Mandi: ₹30 (Save ₹12)</span>
                </div>
              </div>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Link to="/marketplace" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "0.85rem", fontWeight: "700" }}>
                  Browse 8+ Live Nearby Listings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS STRIP ---------- */}
      <div className="stats-strip">
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon"><DollarSign size={24} /></div>
            <div>
              <div className="stat-num">0%</div>
              <div className="stat-label">{t("stat_zero_comm")}</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon"><TrendingUp size={24} /></div>
            <div>
              <div className="stat-num">+28%</div>
              <div className="stat-label">{t("stat_extra_income")}</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon"><Mic size={24} /></div>
            <div>
              <div className="stat-num">தமிழ்</div>
              <div className="stat-label">{t("stat_voice_ready")}</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon"><Clock size={24} /></div>
            <div>
              <div className="stat-num">24 Hrs</div>
              <div className="stat-label">{t("stat_payout")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- UNIQUE FEATURE SPOTLIGHT: TAMIL VOICE ASSISTANT ---------- */}
      <section style={{ background: "linear-gradient(180deg, #f1f8ed 0%, #f6f8f5 100%)", padding: "64px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div className="voice-assistant-panel">
            <div>
              <span className="page-badge" style={{ background: "#fef3c7", color: "#d97706", borderColor: "#fde68a" }}>
                ⭐ Headline Differentiator
              </span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#083320", margin: "10px 0 16px" }}>
                {lang === "ta" ? "தமிழ் குரல் வழி AI உதவியாளர்" : "Tamil Voice-Based AI Assistant"}
              </h2>
              <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "24px" }}>
                {lang === "ta" 
                  ? "எழுத்தறிவு இல்லாத அல்லது தட்டச்சு செய்ய முடியாத விவசாயிகளும் தமிழில் பேசி எளிதாக தங்கள் விளைபொருட்களை பட்டியலிடலாம், விலை நிலவரத்தை அறியலாம்."
                  : "Designed for rural Tamil Nadu farmers — no typing or English knowledge required. Simply speak naturally in Tamil to list crops, check real-time market prices, or track order status."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                <div style={{ background: "#ffffff", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: "1.3rem" }}>🎙️</span>
                  <div>
                    <strong style={{ color: "#0f5132" }}>"நாளைக்கு 50 கிலோ தக்காளி விற்க வேண்டும்"</strong>
                    <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Auto-fills Listing: Crop = Tomato, Quantity = 50 kg</div>
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: "1.3rem" }}>💰</span>
                  <div>
                    <strong style={{ color: "#0f5132" }}>"இன்றைய தக்காளி விலை என்ன?"</strong>
                    <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Instant AI price prediction from Random Forest model</div>
                  </div>
                </div>
              </div>

              <Link to="/ai/voice-assistant" className="btn btn-accent" style={{ padding: "14px 28px", fontSize: "1rem" }}>
                <Mic size={18} />
                <span>{lang === "ta" ? "குரல் உதவியாளரை முயற்சிக்கவும்" : "Open Live Voice Assistant"}</span>
              </Link>
            </div>

            {/* Visual Animated Orb */}
            <div className="voice-orb-container">
              <span style={{ fontSize: "0.85rem", color: "#a7f3d0", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                Live Speech Recognition
              </span>
              <div className="voice-orb-interactive" title="Click to test voice assistant">
                🎙️
              </div>
              <div className="voice-soundwave">
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
              </div>
              <p style={{ fontSize: "0.88rem", color: "#d1fae5", marginTop: "12px" }}>
                Supports Web Speech API + Tamil NLP intent extraction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- INTERACTIVE PROFIT / ROI CALCULATOR ---------- */}
      <section style={{ padding: "64px 24px", background: "#ffffff" }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="page-badge">💰 Direct Profit Calculator</span>
            <h2 className="page-title">{lang === "ta" ? "உங்கள் நேரடி லாபத்தை கணக்கிடுங்கள்" : "Calculate Your Direct Farmer Profit"}</h2>
            <p className="page-subtitle" style={{ margin: "0 auto" }}>
              See how much more you earn on Ullavan Connect by eliminating middleman commission and mandi deductions.
            </p>
          </div>

          <div className="card" style={{ maxWidth: "800px", margin: "0 auto", padding: "36px", background: "linear-gradient(180deg, #ffffff 0%, #f9fbf8 100%)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div>
                <label>Select Crop</label>
                <select value={calcCrop} onChange={(e) => setCalcCrop(e.target.value)}>
                  <option value="tomato">🍅 Tomato / தக்காளி</option>
                  <option value="brinjal">🍆 Brinjal / கத்தரிக்காய்</option>
                  <option value="onion">🧅 Onion / வெங்காயம்</option>
                  <option value="carrot">🥕 Carrot / கேரட்</option>
                </select>
              </div>

              <div>
                <label>Harvest Quantity: <strong>{calcQty} kg</strong></label>
                <input 
                  type="range" 
                  min="20" 
                  max="1000" 
                  step="10" 
                  value={calcQty} 
                  onChange={(e) => setCalcQty(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="mandi-compare-grid">
              <div className="compare-box mandi">
                <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "700" }}>Traditional Mandi</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#475569", margin: "8px 0" }}>
                  ₹{mandiTotal.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  @ ₹{currentRate.mandi}/kg (after 30% broker cut)
                </div>
              </div>

              <div className="compare-box ullavan">
                <div style={{ fontSize: "0.85rem", color: "#0f5132", fontWeight: "700" }}>🌾 Uzhavan Connect Direct</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f5132", margin: "8px 0" }}>
                  ₹{directTotal.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: "700" }}>
                  +₹{extraIncome.toLocaleString()} Extra Profit (+{profitPct}%)
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <Link to="/list-crop" className="btn btn-primary" style={{ padding: "12px 30px" }}>
                <span>Start Listing at ₹{currentRate.direct}/kg Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS (4-STEP FLOW) ---------- */}
      <section style={{ padding: "64px 24px", background: "#f6f8f5", borderTop: "1px solid #e2e8f0" }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <span className="page-badge">🔄 Workflow</span>
            <h2 className="page-title">{lang === "ta" ? "எவ்வாறு செயல்படுகிறது?" : "How Uzhavan Connect Works"}</h2>
            <p className="page-subtitle" style={{ margin: "0 auto" }}>
              A fully integrated smart agriculture ecosystem designed for zero friction.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#e8f5e9", color: "#0f5132", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.3rem", fontWeight: "800" }}>
                1
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>List Produce</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Farmer enters harvest quantity via easy form or speaks naturally in Tamil.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.3rem", fontWeight: "800" }}>
                2
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>AI Fair Pricing</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Random Forest ML model predicts the optimal, competitive fair price instantly.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#e8f5e9", color: "#0f5132", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.3rem", fontWeight: "800" }}>
                3
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>Hyperlocal Connect</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Nearby buyers (15km radius) discover fresh produce graded by harvest freshness.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.3rem", fontWeight: "800" }}>
                4
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>Instant Payout</h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Buyer pays via UPI / Card / COD. Farmer receives direct payout in 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SMART FEATURES GRID ---------- */}
      <section style={{ padding: "64px 24px", background: "#ffffff" }}>
        <div className="page-container" style={{ padding: 0 }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <span className="page-badge">✨ Core Modules</span>
            <h2 className="page-title">{lang === "ta" ? "ஸ்மார்ட் அம்சங்கள்" : "Complete Blueprint Modules"}</h2>
            <p className="page-subtitle" style={{ margin: "0 auto" }}>
              Every feature implemented and connected as one cohesive intelligent system.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {FEATURES.map((f) => (
              <Link to={f.to} key={f.title} className="card" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: f.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {f.icon}
                  </div>
                  <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "0.74rem", fontWeight: "700", padding: "3px 10px", borderRadius: "999px" }}>
                    {f.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#083320", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5", marginBottom: "16px" }}>{f.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0f5132", fontWeight: "700", fontSize: "0.85rem" }}>
                  <span>Explore Feature</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA FOOTER BAND ---------- */}
      <div style={{ background: "linear-gradient(135deg, #083320 0%, #0f5132 100%)", color: "#ffffff", padding: "64px 24px", textAlign: "center" }}>
        <div className="page-container" style={{ padding: 0 }}>
          <h2 style={{ fontSize: "2.4rem", fontWeight: "800", marginBottom: "12px" }}>
            {lang === "ta" ? "விளைபொருளுக்கு நியாயமான விலை பெற தயாரா?" : "Ready to Get a Fair Price for Your Harvest?"}
          </h2>
          <p style={{ color: "#d1fae5", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 28px" }}>
            List your crop in under 60 seconds — with one tap or even by speaking in Tamil.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-hero-primary" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 4px 14px rgba(16,185,129,0.4)" }}>
              <span>✨ {lang === "ta" ? "இலவச பதிவு (Register Free)" : "Register Free"}</span>
            </Link>
            <Link to="/list-crop" className="btn-hero-secondary">
              <Sprout size={18} />
              <span>{lang === "ta" ? "பயிர் விற்க (List Crop)" : "List Crop Now"}</span>
            </Link>
            <Link to="/marketplace" className="btn-hero-secondary">
              <ShoppingBag size={18} />
              <span>{lang === "ta" ? "காய்கறி வாங்க (Browse Market)" : "Browse Marketplace"}</span>
            </Link>
          </div>
        </div>
      </div>

      <footer style={{ background: "#051f13", color: "#94a3b8", textAlign: "center", padding: "30px 24px", fontSize: "0.88rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#ffffff", fontWeight: "700" }}>
          <span>🌾 Uzhavan Connect (உழவன் கனெக்ட்)</span>
        </div>
        <p>AI-Powered Hyperlocal Smart Agricultural Marketplace · Tirunelveli, Tamil Nadu</p>
      </footer>
    </div>
  );
}
