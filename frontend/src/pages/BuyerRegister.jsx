import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  ShoppingBag, 
  ShieldCheck, 
  Phone, 
  Lock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  User,
  Zap,
  Volume2,
  Compass,
  Eye,
  EyeOff
} from "lucide-react";

const TAMIL_DISTRICTS = [
  "பாளையங்கோட்டை, திருநெல்வேலி",
  "ஆலங்குளம், தென்காசி",
  "மேலூர், மதுரை",
  "கோவில்பட்டி, தூத்துக்குடி",
  "பொள்ளாச்சி, கோயம்புத்தூர்",
  "சேலம் டவுன்",
  "கும்பகோணம், தஞ்சாவூர்"
];

const DEMO_BUYERS = [
  { name: "பிரியா சங்கர்", address: "12/4 தெற்கு ரத வீதி", preferences: "தினசரி புதிய காய்கறிகள், சின்ன வெங்காயம், தக்காளி" },
  { name: "கவிதா ரமேஷ்", address: "45 பாரதி நகர், 2வது தெரு", preferences: "நாட்டு காய்கறிகள், முருங்கைக்கீரை, வெண்டை" },
  { name: "ரா. ஆனந்தன்", address: "78 அண்ணா நகர் மெயின் ரோடு", preferences: "வாழை, தேங்காய், கிழங்கு வகைகள்" }
];

export default function BuyerRegister() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "பாளையங்கோட்டை, திருநெல்வேலி",
    address: "12/4 தெற்கு ரத வீதி, திருநெல்வேலி",
    preferences: "தினசரி புதிய காய்கறிகள், தக்காளி, வெங்காயம்",
    role: "buyer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 1-Click Fast Fill for quick evaluation & testing
  const handleAutoFill = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const randomPhone = `98421${randomSuffix}`;
    const randomDistrict = TAMIL_DISTRICTS[Math.floor(Math.random() * TAMIL_DISTRICTS.length)];
    const randomBuyer = DEMO_BUYERS[Math.floor(Math.random() * DEMO_BUYERS.length)];
    const pass = "pass" + randomSuffix.toString().slice(0, 3);

    setForm({
      name: randomBuyer.name,
      phone: randomPhone,
      password: pass,
      confirmPassword: pass,
      village: randomDistrict,
      address: randomBuyer.address,
      preferences: randomBuyer.preferences,
      role: "buyer"
    });
    setError(null);
    showToast(lang === "ta" ? "⚡ மாதிரி நுகர்வோர் விபரங்கள் தானாக நிரப்பப்பட்டன!" : "⚡ Demo buyer details auto-filled!", "info");
  };

  // Auto-Detect Location using GPS
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      showToast(lang === "ta" ? "📍 இருப்பிடம் கண்டறியப்படுகிறது..." : "📍 Detecting GPS location...", "info");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setForm((prev) => ({
            ...prev,
            village: `திருநெல்வேலி (GPS: ${lat}, ${lng})`
          }));
          showToast(lang === "ta" ? "✓ இருப்பிடம் வெற்றிகரமாக இணைக்கப்பட்டது!" : "✓ GPS location detected!", "success");
        },
        () => {
          setForm((prev) => ({ ...prev, village: "பாளையங்கோட்டை, திருநெல்வேலி" }));
          showToast(lang === "ta" ? "திருநெல்வேலி இருப்பிடமாக அமைக்கப்பட்டது." : "Default town set to Tirunelveli.", "info");
        }
      );
    }
  };

  // Audio Voice Guide
  const handleVoiceGuide = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "வணக்கம். நுகர்வோர் கணக்கு தொடங்கி உங்கள் பகுதியில் உள்ள விவசாயிகளிடமிருந்து நேரடியாக காலையில் அறுவடை செய்யப்பட்ட புதிய காய்கறிகளை நியாய விலையில் வாங்கலாம்."
      );
      utterance.lang = "ta-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast(lang === "ta" ? "🎙️ நுகர்வோர் குரல் உதவி இயங்குகிறது..." : "🎙️ Playing Buyer Voice Guide...", "info");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("கடவுச்சொற்கள் பொருந்தவில்லை (Passwords do not match)");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: "buyer",
        village: `${form.village} · முகவரி: ${form.address} · (${form.preferences})`,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`🛒 வாழ்த்துகள் ${res.data.user.name}! நுகர்வோர் கணக்கு தொடங்கப்பட்டது.`, "success");
      navigate("/marketplace");
    } catch (err) {
      setError(err.response?.data?.error || "பதிவு தோல்வியடைந்தது. கைபேசி எண் ஏற்கனவே உள்ளதா என சரிபார்க்கவும்.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "660px", margin: "24px auto 50px", padding: "0 16px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#3b82f6", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <ShoppingBag size={14} color="#1d4ed8" /> 🛒 நுகர்வோர் பதிவு · Consumer Exclusive Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "புதிய நுகர்வோர் கணக்கு தொடங்குக" : "Consumer Registration"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto", fontSize: "0.92rem" }}>
          {lang === "ta"
            ? "விவசாயிகளிடமிருந்து நேரடியாக இன்று அறுவடை செய்யப்பட்ட புதிய காய்கறிகளை வாங்க இப்போதே இணையுங்கள்."
            : "Buy fresh farm produce directly from verified nearby farmers within 15 km with doorstep delivery."}
        </p>
      </div>

      {/* Registration Card */}
      <div className="card" style={{ padding: "32px", border: "2px solid #3b82f6", boxShadow: "0 10px 30px rgba(59, 130, 246, 0.14)", background: "#ffffff" }}>
        
        {/* Quick Assistant Helpers */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e40af" }}>
            🛒 எளிய நுகர்வோர் படிவம் (Easy 1-Min Form)
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleVoiceGuide}
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "#3b82f6", color: "#1d4ed8", background: "#eff6ff" }}
            >
              <Volume2 size={14} /> குரல் உதவி (Voice)
            </button>
            <button
              type="button"
              onClick={handleAutoFill}
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "#2563eb", color: "#1e40af", background: "#dbeafe" }}
            >
              <Zap size={14} /> ⚡ மாதிரி நிரப்பல் (Auto-Fill)
            </button>
          </div>
        </div>

        {/* Benefits Banner */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 16px", borderRadius: "10px", marginBottom: "22px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.6rem" }}>🥦</div>
          <div style={{ fontSize: "0.82rem", color: "#1e3a8a" }}>
            <strong>நுகர்வோருக்கான பிரத்தியேக நன்மைகள்:</strong>
            <div>✓ இன்று காலையில் அறுவடை செய்தவை · 15 கி.மீ நேரடி டெலிவரி · COD & UPI</div>
          </div>
        </div>

        {error && (
          <p style={{ color: "#b91c1c", fontSize: "0.86rem", marginBottom: "16px", background: "#fee2e2", padding: "10px 14px", borderRadius: "8px" }}>
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
            <User size={14} color="#2563eb" />
            1. நுகர்வோர் முழு பெயர் (Full Name) *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="எ.கா: பிரியா சங்கர்"
            required
            style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Phone size={14} color="#2563eb" />
                2. கைபேசி எண் (Mobile Number) *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="எ.கா: 9842145678"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", color: "#1e293b", margin: 0 }}>
                  <MapPin size={14} color="#2563eb" />
                  3. பகுதி / நகரம் *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.76rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                >
                  <Compass size={12} /> 📍 GPS
                </button>
              </div>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: பாளையங்கோட்டை, திருநெல்வேலி"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          {/* Quick Town Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>நகரம்:</span>
            {TAMIL_DISTRICTS.slice(0, 5).map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setForm({ ...form, village: dist })}
                style={{
                  fontSize: "0.72rem",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: form.village === dist ? "#dbeafe" : "#f8fafc",
                  color: form.village === dist ? "#1e40af" : "#475569",
                  cursor: "pointer"
                }}
              >
                {dist.split(",")[0]}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
              <MapPin size={14} color="#2563eb" />
              4. வீட்டு முகவரி & தெரு (Door Delivery Address)
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="எ.கா: 12/4 தெற்கு ரத வீதி, திருநெல்வேலி"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "22px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", color: "#1e293b", margin: 0 }}>
                  <Lock size={14} color="#2563eb" />
                  5. கடவுச்சொல் (Password) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.74rem" }}
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showPassword ? "மறை" : "காட்டு"}</span>
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="கடவுச்சொல்"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Lock size={14} color="#2563eb" />
                6. உறுதி செய்க (Confirm) *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="மீண்டும் உள்ளிடுக"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "1.05rem",
              fontWeight: "800",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              borderRadius: "10px"
            }}
          >
            {loading ? "பதிவு செய்யப்படுகிறது..." : "✓ நுகர்வோராக பதிவு செய்து காய்கறிகள் வாங்க"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/login" style={{ color: "#1e40af", fontWeight: "800", textDecoration: "underline" }}>
            உள்நுழைவு பக்கம் செல்ல (Login)
          </Link>
        </div>
      </div>

      {/* Switch Portal Links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "0.88rem" }}>
        <Link to="/register/farmer" style={{ color: "#0f5132", fontWeight: "700", textDecoration: "none" }}>
          🧑‍🌾 உழவர் பதிவு (Farmer Register) →
        </Link>
        <Link to="/register/bulk-buyer" style={{ color: "#d97706", fontWeight: "700", textDecoration: "none" }}>
          🏨 மொத்த வியாபாரி பதிவு (Bulk Register) →
        </Link>
      </div>

    </div>
  );
}
