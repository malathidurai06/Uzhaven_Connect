import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  Lock, 
  ArrowRight, 
  Percent, 
  CheckCircle2, 
  Zap, 
  TrendingDown 
} from "lucide-react";

export default function BulkBuyerLogin() {
  const navigate = useNavigate();
  const { setUser, loginAsDemo, showToast, lang } = useApp();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    phone: "9876543230",
    password: "demo123",
    role: "secondary_buyer",
    village: "Vannarpettai, Tirunelveli",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "register") {
        await api.post("/auth/register", { ...form, role: "secondary_buyer" });
        showToast("மொத்த வாங்குபவர் பதிவு வெற்றிகரமாக முடிந்தது!", "success");
      }
      const res = await api.post("/auth/login", { phone: form.phone, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`வணக்கம் ${res.data.user.name}! மொத்த கொள்முதல் தளத்திற்கு வரவேற்கிறோம்.`, "success");
      navigate("/ai/crop-rescue");
    } catch (err) {
      setError(err.response?.data?.error || "தவறான எண் அல்லது கடவுச்சொல். கீழே உள்ள 1-Click பொத்தானை பயன்படுத்தவும்.");
    }
    setLoading(false);
  };

  const handleQuickDemoBulk = () => {
    loginAsDemo({
      role: "secondary_buyer",
      name: "Hotel Royal Residency & Mess",
      phone: "9876543230",
      village: "Vannarpettai, Tirunelveli",
    });
    navigate("/ai/crop-rescue");
  };

  return (
    <div style={{ maxWidth: "560px", margin: "24px auto" }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#fef3c7", color: "#92400e", borderColor: "#f59e0b" }}>
          <Building2 size={14} color="#92400e" /> 🏨 மொத்த வியாபாரி தளம் · Commercial & Hotel B2B Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "மொத்த வியாபாரி உள்நுழைவு" : "Bulk Buyer B2B Login"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          {lang === "ta"
            ? "ஹோட்டல்கள், மெஸ்கள் மற்றும் உணவு பதப்படுத்தும் நிறுவனங்களுக்கான 35%-50% தள்ளுபடி உபரி விளைபொருட்கள் தளம்."
            : "Discounted bulk clearance hub for restaurants, hotels, messes, and processing units."}
        </p>
      </div>

      {/* 1-Click Instant Demo Bulk Buyer Button */}
      <div 
        className="card" 
        style={{ 
          marginBottom: "20px", 
          padding: "20px", 
          background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
          color: "#ffffff",
          boxShadow: "0 8px 20px rgba(180, 83, 9, 0.25)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#fef08a", fontWeight: "800", textTransform: "uppercase" }}>
              ⚡ 1-Click Fast Bulk Buyer Login
            </div>
            <strong style={{ fontSize: "1.1rem" }}>🏨 Hotel Royal Residency & Mess</strong>
            <div style={{ fontSize: "0.8rem", color: "#fef3c7" }}>📍 Vannarpettai, Tirunelveli · Commercial ID: #B2B-3091</div>
          </div>

          <button
            onClick={handleQuickDemoBulk}
            className="btn btn-accent"
            style={{ padding: "10px 18px", fontSize: "0.88rem", whiteSpace: "nowrap" }}
          >
            <span>உடனடி உள்நுழைவு</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Commercial Benefits Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>35%-50% தள்ளுபடி</strong>
          <div style={{ color: "#d97706" }}>Surplus Clearance</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>மொத்த கொள்முதல்</strong>
          <div style={{ color: "#0f5132" }}>Wholesale Volume</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>GST இன்வாய்ஸ்</strong>
          <div style={{ color: "#2563eb" }}>B2B Tax Invoices</div>
        </div>
      </div>

      {/* Bulk Buyer Form */}
      <div className="card" style={{ padding: "32px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#083320", marginBottom: "16px" }}>
          {mode === "login" ? "🏨 மொத்த வியாபாரி கணக்கு உள்நுழைவு" : "📝 புதிய வணிக பதிவு (B2B Register)"}
        </h3>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>ஹோட்டல் / நிறுவனத்தின் பெயர் (Business / Hotel Name)</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="எ.கா: ராயல் ரெசிடென்சி & மெஸ்"
                required
              />

              <label>வணிக முகவரி (Business Address)</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: வண்ணாரப்பேட்டை, திருநெல்வேலி"
                required
              />
            </>
          )}

          <label>தொலைபேசி எண் (Mobile / Contact Number)</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543230"
            required
          />

          <label>கடவுச்சொல் (Password)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.85rem", marginTop: "12px" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "20px", padding: "14px", fontSize: "1.02rem", background: "#b45309" }}
          >
            {loading ? "சரிபார்க்கப்படுகிறது..." : mode === "login" ? "பயிர் மீட்பு தளத்தில் நுழைக (Enter Rescue Hub)" : "பதிவு செய்ய (Register)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
          புதிய வணிக வாடிக்கையாளரா?{" "}
          <Link
            to="/register/bulk-buyer"
            style={{ color: "#b45309", fontWeight: "800", textDecoration: "underline" }}
          >
            இங்கே பிரத்தியேக வணிக பதிவு செய்யவும் (Register as B2B Buyer)
          </Link>
        </div>
      </div>

      {/* Cross links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem" }}>
        <Link to="/login/farmer" style={{ color: "#0f5132", fontWeight: "700" }}>
          🧑‍🌾 உழவர் தளம் (Farmer Portal) →
        </Link>
        <Link to="/login/buyer" style={{ color: "#1e40af", fontWeight: "700" }}>
          🛒 நுகர்வோர் தளம் (Buyer Portal) →
        </Link>
      </div>

    </div>
  );
}
