import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  Sprout, 
  ShoppingBag, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Phone,
  Lock,
  User,
  Zap,
  Volume2,
  Eye,
  EyeOff,
  Compass
} from "lucide-react";

const TAMIL_DISTRICTS = [
  "ஆலங்குளம், தென்காசி",
  "பாளையங்கோட்டை, திருநெல்வேலி",
  "மேலூர், மதுரை",
  "கோவில்பட்டி, தூத்துக்குடி",
  "பொள்ளாச்சி, கோயம்புத்தூர்",
  "மேட்டூர், சேலம்",
  "கும்பகோணம், தஞ்சாவூர்"
];

const DEMO_FARMER_NAMES = [
  "மு. முத்து முருகன்",
  "க. சுப்பையா தேவர்",
  "பொன். வேலுச்சாமி",
  "ரா. செல்வக்குமார்",
  "ஆ. சுப்பிரமணியன்"
];

const DEMO_BUYER_NAMES = [
  "பிரியா சங்கர்",
  "கவிதா ரமேஷ்",
  "ரா. ஆனந்தன்",
  "மீனா கணேசன்",
  "தினேஷ் குமார்"
];

const DEMO_BULK_NAMES = [
  "ஹோட்டல் ராயல் ரெசிடென்சி",
  "ஸ்ரீ மீனாட்சி மெஸ்",
  "கிரீன் பிரெஷ் சூப்பர்மார்க்கெட்",
  "காவேரி கேட்டரிங் சர்வீஸ்"
];

export default function RegisterGateway() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [activeRole, setActiveRole] = useState("farmer"); // farmer | buyer | secondary_buyer
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    village: "ஆலங்குளம், தென்காசி",
    extra_info: "தக்காளி, கத்தரிக்காய் (3 ஏக்கர்)"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 1-Click Fast Fill for quick evaluation & testing
  const handleAutoFill = (role = activeRole) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const randomPhone = `98421${randomSuffix}`;
    const randomDistrict = TAMIL_DISTRICTS[Math.floor(Math.random() * TAMIL_DISTRICTS.length)];

    if (role === "farmer") {
      const randomName = DEMO_FARMER_NAMES[Math.floor(Math.random() * DEMO_FARMER_NAMES.length)];
      setForm({
        name: randomName,
        phone: randomPhone,
        password: "pass" + randomSuffix.toString().slice(0, 3),
        village: randomDistrict,
        extra_info: "தக்காளி, வெங்காயம், வெண்டை (3 ஏக்கர்)"
      });
    } else if (role === "buyer") {
      const randomName = DEMO_BUYER_NAMES[Math.floor(Math.random() * DEMO_BUYER_NAMES.length)];
      setForm({
        name: randomName,
        phone: randomPhone,
        password: "pass" + randomSuffix.toString().slice(0, 3),
        village: randomDistrict,
        extra_info: "தினசரி புதிய காய்கறி நுகர்வோர்"
      });
    } else {
      const randomName = DEMO_BULK_NAMES[Math.floor(Math.random() * DEMO_BULK_NAMES.length)];
      setForm({
        name: randomName,
        phone: randomPhone,
        password: "pass" + randomSuffix.toString().slice(0, 3),
        village: randomDistrict,
        extra_info: "ஹோட்டல் & மொத்த கொள்முதல் (150 kg/day)"
      });
    }
    setError(null);
    showToast(lang === "ta" ? "⚡ மாதிரி விபரங்கள் தானாக நிரப்பப்பட்டன!" : "⚡ Demo details auto-filled! Click Register.", "info");
  };

  // Auto-Detect Location using GPS
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      showToast(lang === "ta" ? "📍 இருப்பிடம் கண்டறியப்படுகிறது..." : "📍 Detecting your GPS location...", "info");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setForm((prev) => ({
            ...prev,
            village: `தென்காசி (GPS: ${lat}, ${lng})`
          }));
          showToast(lang === "ta" ? "✓ இருப்பிடம் வெற்றிகரமாக இணைக்கப்பட்டது!" : "✓ GPS location detected!", "success");
        },
        () => {
          setForm((prev) => ({ ...prev, village: "ஆலங்குளம், தென்காசி" }));
          showToast(lang === "ta" ? "தென்காசி இருப்பிடமாக அமைக்கப்பட்டது." : "Set default district to Tenkasi.", "info");
        }
      );
    }
  };

  // Audio Voice Guide
  const handleVoiceGuide = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      let text = "உழவன் கனெக்ட்டிற்கு வரவேற்கிறோம். உழவர் அல்லது நுகர்வோர் பெயரை பதிவிட்டு, கைபேசி எண் மற்றும் கடவுச்சொல் கொடுத்து ஒரு நொடியில் பதிவு செய்து கொள்ளலாம்.";
      if (activeRole === "farmer") {
        text = "வணக்கம் உழவரே. உங்கள் பெயர், ஊர் மற்றும் கைபேசி எண் கொடுத்து உடனடியாக விளைபொருட்களை விற்க தொடங்கலாம். தரகு கட்டணம் ஏதுமில்லை.";
      } else if (activeRole === "buyer") {
        text = "வணக்கம். புதிய நுகர்வோர் கணக்கு தொடங்கி விவசாயிகளிடமிருந்து நேரடியாக சுத்தமான காய்கறிகளை வாங்கலாம்.";
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ta-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast(lang === "ta" ? "🎙️ தமிழ் குரல் வழிகாட்டி இயங்குகிறது..." : "🎙️ Playing Tamil Voice Guide...", "info");
    }
  };

  const handleQuickRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) {
      setError(lang === "ta" ? "பெயர், கைபேசி எண் மற்றும் கடவுச்சொல் தேவை." : "Name, phone, and password are required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: activeRole,
        village: `${form.village} · ${form.extra_info}`
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      const roleTamil = activeRole === "farmer" ? "உழவர்" : activeRole === "buyer" ? "நுகர்வோர்" : "மொத்த வாங்குபவர்";
      showToast(`🎉 வாழ்த்துகள் ${res.data.user.name}! ${roleTamil} கணக்கு வெற்றிகரமாக தொடங்கப்பட்டது!`, "success");

      if (activeRole === "farmer") {
        navigate("/farmer/dashboard");
      } else if (activeRole === "secondary_buyer") {
        navigate("/ai/crop-rescue");
      } else {
        navigate("/marketplace");
      }
    } catch (err) {
      setError(err.response?.data?.error || (lang === "ta" ? "பதிவு தோல்வியடைந்தது. கைபேசி எண் ஏற்கனவே உள்ளதா என சரிபார்க்கவும்." : "Registration failed. Check if phone is already registered."));
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "980px", margin: "20px auto 50px", padding: "0 16px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <span className="page-badge" style={{ background: "#ecfdf5", color: "#065f46", borderColor: "#10b981", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} color="#10b981" /> 
          <span>{lang === "ta" ? "⚡ எளிதான 10 வினாடி பதிவு" : "⚡ Instant 10-Second Registration"}</span>
        </span>
        <h1 className="page-title" style={{ fontSize: "2.2rem", marginTop: "8px" }}>
          {lang === "ta" ? "உழவன் கனெக்ட் — புதிய கணக்கு தொடங்குக" : "Join Uzhavan Connect — Register"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto", maxWidth: "680px", fontSize: "0.96rem" }}>
          {lang === "ta"
            ? "உழவர்கள், வீட்டு நுகர்வோர் மற்றும் ஹோட்டல்களுக்கான மிக எளிய நேரடி சந்தை தளம். ஒரே நிமிடத்தில் தொடங்கலாம்."
            : "Ultra-simple registration for Local Farmers, Direct Household Consumers, and Bulk Commercial Buyers."}
        </p>
      </div>

      {/* 🚀 QUICK REGISTRATION HERO CARD */}
      <div 
        className="card" 
        style={{ 
          padding: "32px", 
          border: "2px solid #10b981", 
          boxShadow: "0 12px 36px rgba(16, 185, 129, 0.16)",
          background: "linear-gradient(180deg, #ffffff 0%, #f7fdf9 100%)",
          marginBottom: "40px"
        }}
      >
        {/* Top Control Bar: Role Tabs + Voice Guide + 1-Click Fast Fill */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", paddingBottom: "18px", borderBottom: "1px solid #e2e8f0" }}>
          
          {/* 3 Role Switcher Tabs */}
          <div style={{ display: "inline-flex", background: "#e2e8f0", padding: "4px", borderRadius: "12px", gap: "4px" }}>
            <button
              type="button"
              onClick={() => { setActiveRole("farmer"); handleAutoFill("farmer"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "700",
                fontSize: "0.88rem",
                cursor: "pointer",
                background: activeRole === "farmer" ? "#10b981" : "transparent",
                color: activeRole === "farmer" ? "#ffffff" : "#334155",
                transition: "all 0.2s ease"
              }}
            >
              <span>🧑‍🌾</span>
              <span>{lang === "ta" ? "உழவர் (Farmer)" : "Farmer"}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveRole("buyer"); handleAutoFill("buyer"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "700",
                fontSize: "0.88rem",
                cursor: "pointer",
                background: activeRole === "buyer" ? "#2563eb" : "transparent",
                color: activeRole === "buyer" ? "#ffffff" : "#334155",
                transition: "all 0.2s ease"
              }}
            >
              <span>🛒</span>
              <span>{lang === "ta" ? "நுகர்வோர் (Buyer)" : "Buyer"}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveRole("secondary_buyer"); handleAutoFill("secondary_buyer"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "700",
                fontSize: "0.88rem",
                cursor: "pointer",
                background: activeRole === "secondary_buyer" ? "#d97706" : "transparent",
                color: activeRole === "secondary_buyer" ? "#ffffff" : "#334155",
                transition: "all 0.2s ease"
              }}
            >
              <span>🏨</span>
              <span>{lang === "ta" ? "மொத்த வியாபாரி (B2B)" : "Bulk Buyer"}</span>
            </button>
          </div>

          {/* Assistant Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={handleVoiceGuide}
              className="btn btn-outline"
              style={{ padding: "8px 14px", fontSize: "0.82rem", borderColor: "#059669", color: "#065f46", background: "#ecfdf5" }}
              title="குரல் வழி விளக்கத்தைக் கேட்க"
            >
              <Volume2 size={15} color="#059669" />
              <span>{lang === "ta" ? "குரல் உதவி" : "Voice Guide"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleAutoFill(activeRole)}
              className="btn btn-outline"
              style={{ padding: "8px 14px", fontSize: "0.82rem", borderColor: "#3b82f6", color: "#1d4ed8", background: "#eff6ff" }}
              title="1-கிளிக் மாதிரி தரவு நிரப்ப"
            >
              <Zap size={15} color="#2563eb" />
              <span>{lang === "ta" ? "⚡ மாதிரி நிரப்பல்" : "⚡ 1-Click Fast Fill"}</span>
            </button>
          </div>
        </div>

        {/* Role Highlight Banner */}
        <div 
          style={{ 
            padding: "12px 18px", 
            borderRadius: "10px", 
            marginBottom: "20px", 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            background: activeRole === "farmer" ? "#ecfdf5" : activeRole === "buyer" ? "#eff6ff" : "#fffbeb",
            border: `1px solid ${activeRole === "farmer" ? "#a7f3d0" : activeRole === "buyer" ? "#bfdbfe" : "#fde68a"}`
          }}
        >
          <div style={{ fontSize: "1.6rem" }}>
            {activeRole === "farmer" ? "🌾" : activeRole === "buyer" ? "🥦" : "🏢"}
          </div>
          <div style={{ fontSize: "0.86rem", color: "#1e293b" }}>
            {activeRole === "farmer" && (
              <span><strong>உழவர் பலன்கள்:</strong> 0% தரகு கட்டணம் · உடனடி 24 மணி நேர நேரடி UPI பணம் · தமிழ் குரல் வழி பயிர் விற்பனை AI</span>
            )}
            {activeRole === "buyer" && (
              <span><strong>நுகர்வோர் பலன்கள்:</strong> இன்று காலையில் அறுவடை செய்யப்பட்ட புதிய காய்கறிகள் · 15 கி.மீ அதிவேக டெலிவரி · COD / UPI</span>
            )}
            {activeRole === "secondary_buyer" && (
              <span><strong>மொத்த வாங்குபவர் பலன்கள்:</strong> 35%-50% உபரி தள்ளுபடி சலுகை · B2B ஜிஎஸ்டி இன்வாய்ஸ் · நேரடி சப்ளை</span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        {/* Quick Registration Form */}
        <form onSubmit={handleQuickRegister}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <User size={14} color="#059669" />
                {activeRole === "farmer" 
                  ? (lang === "ta" ? "1. உழவர் முழு பெயர் *" : "1. Farmer Full Name *")
                  : activeRole === "buyer"
                  ? (lang === "ta" ? "1. நுகர்வோர் முழு பெயர் *" : "1. Buyer Full Name *")
                  : (lang === "ta" ? "1. நிறுவனம் / ஹோட்டல் பெயர் *" : "1. Business Name *")}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={activeRole === "farmer" ? "எ.கா: மு. முத்து முருகன்" : activeRole === "buyer" ? "எ.கா: பிரியா சங்கர்" : "எ.கா: ஹோட்டல் ராயல் ரெசிடென்சி"}
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Phone size={14} color="#059669" />
                {lang === "ta" ? "2. கைபேசி எண் (Mobile) *" : "2. Mobile Number *"}
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
          </div>

          {/* Location & GPS Detection */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", color: "#1e293b", margin: 0 }}>
                <MapPin size={14} color="#059669" />
                {lang === "ta" ? "3. கிராமம் / மாவட்டம் (Village / District) *" : "3. Village / District *"}
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                style={{ background: "none", border: "none", color: "#059669", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <Compass size={13} /> {lang === "ta" ? "📍 எனது இருப்பிடத்தை கண்டறி" : "📍 Auto Detect GPS"}
              </button>
            </div>
            <input
              type="text"
              name="village"
              value={form.village}
              onChange={handleChange}
              placeholder="எ.கா: ஆலங்குளம், தென்காசி"
              required
              style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem", marginBottom: "8px" }}
            />
            {/* Quick District Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{lang === "ta" ? "விரைவு தேர்வு:" : "Quick Select:"}</span>
              {TAMIL_DISTRICTS.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setForm({ ...form, village: dist })}
                  style={{
                    fontSize: "0.74rem",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: form.village === dist ? "#d1fae5" : "#f8fafc",
                    color: form.village === dist ? "#065f46" : "#475569",
                    cursor: "pointer"
                  }}
                >
                  {dist.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Sprout size={14} color="#059669" />
                {activeRole === "farmer" 
                  ? (lang === "ta" ? "4. முக்கிய விளைபொருட்கள் & நில அளவு" : "4. Main Crops & Land Size")
                  : activeRole === "buyer"
                  ? (lang === "ta" ? "4. விருப்பங்கள் / முகவரி" : "4. Delivery Area / Address")
                  : (lang === "ta" ? "4. தினசரி தேவை அளவு (kg/day)" : "4. Daily Demand Volume")}
              </label>
              <input
                type="text"
                name="extra_info"
                value={form.extra_info}
                onChange={handleChange}
                placeholder={activeRole === "farmer" ? "தக்காளி, வெங்காயம் (3 ஏக்கர்)" : activeRole === "buyer" ? "தினசரி காய்கறி, தெற்கு ரத வீதி" : "150 kg/day"}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", color: "#1e293b", margin: 0 }}>
                  <Lock size={14} color="#059669" />
                  {lang === "ta" ? "5. கடவுச்சொல் / பின் *" : "5. Password / PIN *"}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.75rem" }}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? "மறைக்க" : "காட்ட"}</span>
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="எ.கா: 1234 அல்லது pass123"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              fontSize: "1.05rem",
              fontWeight: "800",
              justifyContent: "center",
              background: activeRole === "farmer" 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : activeRole === "buyer"
                ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              borderRadius: "10px"
            }}
          >
            {loading ? (
              <span>{lang === "ta" ? "பதிவாகிறது..." : "Creating Account..."}</span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>
                  {activeRole === "farmer"
                    ? (lang === "ta" ? "🧑‍🌾 உழவராக உடனடியாக பதிவு செய்க" : "🧑‍🌾 Register as Farmer")
                    : activeRole === "buyer"
                    ? (lang === "ta" ? "🛒 நுகர்வோராக உடனடியாக பதிவு செய்க" : "🛒 Register as Buyer")
                    : (lang === "ta" ? "🏨 வணிக வாடிக்கையாளராக பதிவு செய்க" : "🏨 Register as Bulk Buyer")}
                </span>
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Existing Account Link */}
        <div style={{ textAlign: "center", marginTop: "18px", fontSize: "0.88rem", color: "#64748b" }}>
          {lang === "ta" ? "ஏற்கனவே கணக்கு உள்ளதா?" : "Already have an account?"}{" "}
          <Link to="/login" style={{ color: "#059669", fontWeight: "700", textDecoration: "none" }}>
            {lang === "ta" ? "இங்கே உள்நுழையவும்" : "Login here"}
          </Link>
        </div>

      </div>

      {/* 📋 DETAILED ROLE REGISTRATION CARDS */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
          {lang === "ta" ? "முழுமையான தனிப்பயன் படிவங்கள்" : "Detailed Registration Form Options"}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
          {lang === "ta" 
            ? "கூடுதல் விபரங்களுடன் கூடிய முழுமையான பிரத்தியேக படிவங்கள்:" 
            : "Or open individual full dedicated forms for customized onboarding:"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        
        {/* Farmer Full Form Card */}
        <div 
          className="card" 
          style={{ 
            padding: "24px 20px", 
            border: "1.5px solid #10b981", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "#ffffff"
          }}
        >
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🧑‍🌾</div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#083320", marginBottom: "6px" }}>
              {lang === "ta" ? "உழவர் முழு படிவம்" : "Farmer Full Form"}
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: "1.4", marginBottom: "14px" }}>
              {lang === "ta" ? "நில விபரம், வங்கி UPI மற்றும் நேரடி பயிர் மேலாண்மை இணைப்பு." : "Register farm land, bank UPI, and start listing crops."}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: "0.78rem", color: "#0f5132", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>✓ 0% தரகு கட்டணம்</li>
              <li>✓ தமிழ் குரல் வழி AI</li>
            </ul>
          </div>
          <Link to="/register/farmer" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", borderColor: "#10b981", color: "#065f46" }}>
            <span>{lang === "ta" ? "உழவர் படிவம் திறக்க" : "Open Farmer Form"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Consumer Buyer Full Form Card */}
        <div 
          className="card" 
          style={{ 
            padding: "24px 20px", 
            border: "1.5px solid #3b82f6", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "#ffffff"
          }}
        >
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🛒</div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#1e3a8a", marginBottom: "6px" }}>
              {lang === "ta" ? "நுகர்வோர் முழு படிவம்" : "Consumer Full Form"}
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: "1.4", marginBottom: "14px" }}>
              {lang === "ta" ? "15 கி.மீ சுற்றளவில் விவசாயியிடம் நேரடியாக காய்கறிகள் வாங்க." : "Doorstep farm-fresh vegetable delivery with zero commission."}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: "0.78rem", color: "#1e40af", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>✓ நேரடி பண்ணை விலை</li>
              <li>✓ பாதுகாப்பான Escrow & COD</li>
            </ul>
          </div>
          <Link to="/register/buyer" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", borderColor: "#3b82f6", color: "#1d4ed8" }}>
            <span>{lang === "ta" ? "நுகர்வோர் படிவம் திறக்க" : "Open Buyer Form"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bulk Buyer Full Form Card */}
        <div 
          className="card" 
          style={{ 
            padding: "24px 20px", 
            border: "1.5px solid #f59e0b", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "#ffffff"
          }}
        >
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🏨</div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#78350f", marginBottom: "6px" }}>
              {lang === "ta" ? "வணிக B2B படிவம்" : "Commercial B2B Form"}
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: "1.4", marginBottom: "14px" }}>
              {lang === "ta" ? "ஹோட்டல்கள் மற்றும் மெஸ்களுக்கான 50% தள்ளுபடி உபரி விளைபொருட்கள்." : "Surplus harvest rescue clearance at up to 50% discount."}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: "0.78rem", color: "#92400e", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>✓ 35%-50% உபரி தள்ளுபடி</li>
              <li>✓ B2B GST வரி இன்வாய்ஸ்</li>
            </ul>
          </div>
          <Link to="/register/bulk-buyer" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", borderColor: "#f59e0b", color: "#b45309" }}>
            <span>{lang === "ta" ? "B2B படிவம் திறக்க" : "Open B2B Form"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  );
}
