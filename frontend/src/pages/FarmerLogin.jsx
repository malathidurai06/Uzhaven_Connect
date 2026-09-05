import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  Sprout, 
  ShieldCheck, 
  Phone, 
  Lock, 
  ArrowRight, 
  Mic, 
  CheckCircle2, 
  Zap, 
  User 
} from "lucide-react";

export default function FarmerLogin() {
  const navigate = useNavigate();
  const { setUser, loginAsDemo, showToast, lang } = useApp();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    phone: "9876543210",
    password: "demo123",
    role: "farmer",
    village: "Alangulam, Tirunelveli",
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
        await api.post("/auth/register", { ...form, role: "farmer" });
        showToast("விவசாயி பதிவு வெற்றிகரமாக முடிந்தது! (Farmer Registered)", "success");
      }
      const res = await api.post("/auth/login", { phone: form.phone, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`வணக்கம் ${res.data.user.name}! உழவர் தளத்திற்கு வரவேற்கிறோம்.`, "success");
      navigate("/farmer/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "தவறான எண் அல்லது கடவுச்சொல். கீழே உள்ள 1-Click பொத்தானை பயன்படுத்தவும்.");
    }
    setLoading(false);
  };

  const handleQuickDemoFarmer = () => {
    loginAsDemo({
      role: "farmer",
      name: "Murugan K. (முத்து முருகன்)",
      phone: "9876543210",
      village: "Alangulam, Tirunelveli",
    });
    navigate("/farmer/dashboard");
  };

  return (
    <div style={{ maxWidth: "560px", margin: "24px auto" }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132", borderColor: "#10b981" }}>
          <Sprout size={14} color="#0f5132" /> 🧑‍🌾 பிரத்தியேக உழவர் தளம் · Farmer Exclusive Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "உழவர் உள்நுழைவு" : "Farmer Portal Login"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          {lang === "ta"
            ? "உங்கள் அறுவடை விளைபொருட்களை இடைத்தரகர்கள் இன்றி நியாயமான விலையில் விற்கவும்."
            : "Sell farm produce directly to local buyers with 0% brokerage and instant payments."}
        </p>
      </div>

      {/* 1-Click Instant Demo Farmer Button */}
      <div 
        className="card" 
        style={{ 
          marginBottom: "20px", 
          padding: "20px", 
          background: "linear-gradient(135deg, #083320 0%, #0f5132 100%)",
          color: "#ffffff",
          boxShadow: "0 8px 20px rgba(15, 81, 50, 0.25)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#fbbf24", fontWeight: "800", textTransform: "uppercase" }}>
              ⚡ 1-Click Fast Farmer Login
            </div>
            <strong style={{ fontSize: "1.1rem" }}>🧑‍🌾 Murugan K. (முத்து முருகன்)</strong>
            <div style={{ fontSize: "0.8rem", color: "#d1fae5" }}>📍 Alangulam, Tirunelveli · Farmer ID: #TN-7294</div>
          </div>

          <button
            onClick={handleQuickDemoFarmer}
            className="btn btn-accent"
            style={{ padding: "10px 18px", fontSize: "0.88rem", whiteSpace: "nowrap" }}
          >
            <span>உடனடி உள்நுழைவு</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Farmer Benefits Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>0% தரகு கட்டணம்</strong>
          <div style={{ color: "#16a34a" }}>Zero Commission</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>நேரடி UPI பணம்</strong>
          <div style={{ color: "#0f5132" }}>Direct Bank Payout</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>குரல் வழி பதிவு</strong>
          <div style={{ color: "#d97706" }}>Tamil Voice NLP</div>
        </div>
      </div>

      {/* Farmer Credentials Form */}
      <div className="card" style={{ padding: "32px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#083320", marginBottom: "16px" }}>
          {mode === "login" ? "🧑‍🌾 உழவர் கணக்கு உள்நுழைவு" : "📝 புதிய உழவர் பதிவு"}
        </h3>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>உழவர் முழு பெயர் (Farmer Name)</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="எ.கா: மு. முருகன்"
                required
              />

              <label>கிராமம் / மாவட்டம் (Village / District)</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: ஆலங்குளம், திருநெல்வேலி"
                required
              />
            </>
          )}

          <label>தொலைபேசி எண் (Mobile Number)</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543210"
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
            style={{ width: "100%", marginTop: "20px", padding: "14px", fontSize: "1.02rem" }}
          >
            {loading ? "சரிபார்க்கப்படுகிறது..." : mode === "login" ? "உழவர் தளத்தில் நுழைக (Enter Farmer Hub)" : "பதிவு செய்ய (Register)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
          புதிய விவசாயியா?{" "}
          <Link
            to="/register/farmer"
            style={{ color: "#0f5132", fontWeight: "800", textDecoration: "underline" }}
          >
            இங்கே பிரத்தியேக உழவர் பதிவு செய்யவும் (Register as Farmer)
          </Link>
        </div>
      </div>

      {/* Cross links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem" }}>
        <Link to="/login/buyer" style={{ color: "#0f5132", fontWeight: "700" }}>
          🛒 நுகர்வோர் உள்நுழைவு (Buyer Portal) →
        </Link>
        <Link to="/login/bulk-buyer" style={{ color: "#d97706", fontWeight: "700" }}>
          🏨 மொத்த வியாபாரி (Bulk Buyer) →
        </Link>
      </div>

    </div>
  );
}
