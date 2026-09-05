import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Phone, 
  Lock, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  User 
} from "lucide-react";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const { setUser, loginAsDemo, showToast, lang } = useApp();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    phone: "9876543220",
    password: "demo123",
    role: "buyer",
    village: "Tirunelveli Town",
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
        await api.post("/auth/register", { ...form, role: "buyer" });
        showToast("நுகர்வோர் பதிவு வெற்றிகரமாக முடிந்தது! (Buyer Registered)", "success");
      }
      const res = await api.post("/auth/login", { phone: form.phone, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`வணக்கம் ${res.data.user.name}! சந்தைக்கு வரவேற்கிறோம்.`, "success");
      navigate("/marketplace");
    } catch (err) {
      setError(err.response?.data?.error || "தவறான எண் அல்லது கடவுச்சொல். கீழே உள்ள 1-Click பொத்தானை பயன்படுத்தவும்.");
    }
    setLoading(false);
  };

  const handleQuickDemoBuyer = () => {
    loginAsDemo({
      role: "buyer",
      name: "Priya S. (பிரியா)",
      phone: "9876543220",
      village: "Tirunelveli Town",
    });
    navigate("/marketplace");
  };

  return (
    <div style={{ maxWidth: "560px", margin: "24px auto" }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#3b82f6" }}>
          <ShoppingBag size={14} color="#1d4ed8" /> 🛒 நுகர்வோர் தளம் · Consumer & Buyer Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "நுகர்வோர் உள்நுழைவு" : "Consumer Login"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          {lang === "ta"
            ? "அருகிலுள்ள தோட்டங்களிலிருந்து அறுவடை செய்யப்பட்ட புதிய காய்கறிகளை நேரடியாக வாங்குங்கள்."
            : "Buy fresh farm harvests directly from verified local farmers within 15 km radius."}
        </p>
      </div>

      {/* 1-Click Instant Demo Buyer Button */}
      <div 
        className="card" 
        style={{ 
          marginBottom: "20px", 
          padding: "20px", 
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
          color: "#ffffff",
          boxShadow: "0 8px 20px rgba(30, 58, 138, 0.25)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#fbbf24", fontWeight: "800", textTransform: "uppercase" }}>
              ⚡ 1-Click Fast Consumer Login
            </div>
            <strong style={{ fontSize: "1.1rem" }}>🛒 Priya S. (பிரியா - Household Buyer)</strong>
            <div style={{ fontSize: "0.8rem", color: "#93c5fd" }}>📍 Tirunelveli Town · Consumer ID: #TN-9821</div>
          </div>

          <button
            onClick={handleQuickDemoBuyer}
            className="btn btn-accent"
            style={{ padding: "10px 18px", fontSize: "0.88rem", whiteSpace: "nowrap" }}
          >
            <span>உடனடி உள்நுழைவு</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Consumer Benefits Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>தோட்டத்து புத்துணர்ச்சி</strong>
          <div style={{ color: "#16a34a" }}>Harvested Today</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>15 கி.மீ டெலிவரி</strong>
          <div style={{ color: "#0f5132" }}>Hyperlocal Reach</div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "10px", textAlign: "center", fontSize: "0.78rem" }}>
          <strong>UPI / COD</strong>
          <div style={{ color: "#2563eb" }}>Safe Escrow</div>
        </div>
      </div>

      {/* Consumer Credentials Form */}
      <div className="card" style={{ padding: "32px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#083320", marginBottom: "16px" }}>
          {mode === "login" ? "🛒 நுகர்வோர் கணக்கு உள்நுழைவு" : "📝 புதிய நுகர்வோர் பதிவு"}
        </h3>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>முழு பெயர் (Full Name)</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="எ.கா: பிரியா எஸ்."
                required
              />

              <label>பகுதி / முகவரி (Locality / Town)</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: திருநெல்வேலி நகரம்"
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
            placeholder="9876543220"
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
            style={{ width: "100%", marginTop: "20px", padding: "14px", fontSize: "1.02rem", background: "#1e40af" }}
          >
            {loading ? "சரிபார்க்கப்படுகிறது..." : mode === "login" ? "சந்தையில் நுழைக (Enter Marketplace)" : "பதிவு செய்ய (Register)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
          புதிய வாங்குபவரா?{" "}
          <Link
            to="/register/buyer"
            style={{ color: "#1e40af", fontWeight: "800", textDecoration: "underline" }}
          >
            இங்கே பிரத்தியேக நுகர்வோர் பதிவு செய்யவும் (Register as Buyer)
          </Link>
        </div>
      </div>

      {/* Cross links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem" }}>
        <Link to="/login/farmer" style={{ color: "#0f5132", fontWeight: "700" }}>
          🧑‍🌾 உழவர் தளம் (Farmer Portal) →
        </Link>
        <Link to="/login/bulk-buyer" style={{ color: "#d97706", fontWeight: "700" }}>
          🏨 மொத்த வியாபாரி (Bulk Hotel) →
        </Link>
      </div>

    </div>
  );
}
