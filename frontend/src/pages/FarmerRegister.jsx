import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  Sprout, 
  ShieldCheck, 
  Phone, 
  Lock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  User,
  Trees,
  Check,
  Zap,
  Volume2,
  Compass,
  Eye,
  EyeOff
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

const DEMO_FARMERS = [
  { name: "மு. முத்து முருகன்", crops: "தக்காளி, கத்தரிக்காய், வெங்காயம்", acres: "3 ஏக்கர்" },
  { name: "க. சுப்பையா தேவர்", crops: "மரவள்ளிக்கிழங்கு, சேனைக்கிழங்கு", acres: "5 ஏக்கர்" },
  { name: "பொன். வேலுச்சாமி", crops: "வாழை, தேங்காய், முருங்கை", acres: "4 ஏக்கர்" },
  { name: "ரா. செல்வக்குமார்", crops: "பொன்னி நெல், சீரக சம்பா", acres: "6 ஏக்கர்" }
];

export default function FarmerRegister() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "ஆலங்குளம், தென்காசி",
    main_crops: "தக்காளி, கத்தரிக்காய், வெங்காயம்",
    farm_acres: "3",
    role: "farmer",
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
    const randomFarmer = DEMO_FARMERS[Math.floor(Math.random() * DEMO_FARMERS.length)];
    const pass = "pass" + randomSuffix.toString().slice(0, 3);

    setForm({
      name: randomFarmer.name,
      phone: randomPhone,
      password: pass,
      confirmPassword: pass,
      village: randomDistrict,
      main_crops: randomFarmer.crops,
      farm_acres: randomFarmer.acres,
      role: "farmer"
    });
    setError(null);
    showToast(lang === "ta" ? "⚡ மாதிரி உழவர் விபரங்கள் தானாக நிரப்பப்பட்டன!" : "⚡ Demo farmer details auto-filled!", "info");
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
            village: `தென்காசி (GPS: ${lat}, ${lng})`
          }));
          showToast(lang === "ta" ? "✓ இருப்பிடம் வெற்றிகரமாக இணைக்கப்பட்டது!" : "✓ GPS location detected!", "success");
        },
        () => {
          setForm((prev) => ({ ...prev, village: "ஆலங்குளம், தென்காசி" }));
          showToast(lang === "ta" ? "தென்காசி இருப்பிடமாக அமைக்கப்பட்டது." : "Default district set to Tenkasi.", "info");
        }
      );
    }
  };

  // Audio Voice Guide
  const handleVoiceGuide = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "வணக்கம் உழவரே. உழவன் கனெக்ட்டில் உங்கள் பெயர், ஊர் மற்றும் கைபேசி எண் கொடுத்து நேரடியாக விளைபொருட்களை விற்கலாம். இடைத்தரகர்கள் இன்றி நூறு சதவீதம் முழு பணம் உங்கள் வங்கிக்கே வரும்."
      );
      utterance.lang = "ta-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast(lang === "ta" ? "🎙️ உழவர் குரல் உதவி இயங்குகிறது..." : "🎙️ Playing Farmer Voice Guide...", "info");
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
        role: "farmer",
        village: `${form.village} · பயிர்கள்: ${form.main_crops} (${form.farm_acres})`,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`🌾 வாழ்த்துகள் ${res.data.user.name}! உழவர் கணக்கு தொடங்கப்பட்டது.`, "success");
      navigate("/farmer/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "பதிவு தோல்வியடைந்தது. கைபேசி எண் ஏற்கனவே உள்ளதா என சரிபார்க்கவும்.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "660px", margin: "24px auto 50px", padding: "0 16px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132", borderColor: "#10b981", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sprout size={14} color="#0f5132" /> 🧑‍🌾 பிரத்தியேக உழவர் பதிவு · Farmer Exclusive Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "புதிய உழவர் கணக்கு தொடங்குக" : "Farmer Registration"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto", fontSize: "0.92rem" }}>
          {lang === "ta"
            ? "விளைபொருட்களுக்கு 100% நியாயமான விலை பெறவும், இடைத்தரகர்கள் இன்றி நேரடியாக விற்கவும் இப்போதே இணையுங்கள்."
            : "Join the direct farm marketplace to list harvests, get AI fair prices, and receive direct 24h bank payouts."}
        </p>
      </div>

      {/* Registration Card */}
      <div className="card" style={{ padding: "32px", border: "2px solid #10b981", boxShadow: "0 10px 30px rgba(16, 185, 129, 0.14)", background: "#ffffff" }}>
        
        {/* Quick Assistant Helpers */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f5132" }}>
            🧑‍🌾 எளிய உழவர் படிவம் (Easy 1-Min Form)
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleVoiceGuide}
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "#10b981", color: "#0f5132", background: "#f0fdf4" }}
            >
              <Volume2 size={14} /> குரல் உதவி (Voice)
            </button>
            <button
              type="button"
              onClick={handleAutoFill}
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "#3b82f6", color: "#1d4ed8", background: "#eff6ff" }}
            >
              <Zap size={14} /> ⚡ மாதிரி நிரப்பல் (Auto-Fill)
            </button>
          </div>
        </div>

        {/* Benefits Banner */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 16px", borderRadius: "10px", marginBottom: "22px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.6rem" }}>🌾</div>
          <div style={{ fontSize: "0.82rem", color: "#0f5132" }}>
            <strong>விவசாயிகளுக்கான பிரத்தியேக பலன்கள்:</strong>
            <div>✓ 0% தரகு கட்டணம் · நேரடி UPI பணம் · தமிழ் குரல் வழி பதிவு AI</div>
          </div>
        </div>

        {error && (
          <p style={{ color: "#b91c1c", fontSize: "0.86rem", marginBottom: "16px", background: "#fee2e2", padding: "10px 14px", borderRadius: "8px" }}>
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
            <User size={14} color="#059669" />
            1. உழவர் முழு பெயர் (Farmer Full Name) *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="எ.கா: மு. முத்து முருகன்"
            required
            style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Phone size={14} color="#059669" />
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
                  <MapPin size={14} color="#059669" />
                  3. கிராமம் / மாவட்டம் *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  style={{ background: "none", border: "none", color: "#059669", fontSize: "0.76rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                >
                  <Compass size={12} /> 📍 GPS
                </button>
              </div>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: ஆலங்குளம், தென்காசி"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          {/* Quick District Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>மாவட்டம்:</span>
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
                  background: form.village === dist ? "#d1fae5" : "#f8fafc",
                  color: form.village === dist ? "#065f46" : "#475569",
                  cursor: "pointer"
                }}
              >
                {dist.split(",")[0]}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Sprout size={14} color="#059669" />
                4. முக்கிய விளைபொருட்கள் (Crops)
              </label>
              <input
                type="text"
                name="main_crops"
                value={form.main_crops}
                onChange={handleChange}
                placeholder="எ.கா: தக்காளி, கத்தரிக்காய், வெங்காயம்"
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Trees size={14} color="#059669" />
                5. நிலப்பரப்பு (Acres)
              </label>
              <input
                type="text"
                name="farm_acres"
                value={form.farm_acres}
                onChange={handleChange}
                placeholder="எ.கா: 3 ஏக்கர்"
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "22px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", color: "#1e293b", margin: 0 }}>
                  <Lock size={14} color="#059669" />
                  6. கடவுச்சொல் (Password) *
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
                <Lock size={14} color="#059669" />
                7. உறுதி செய்க (Confirm) *
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
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              borderRadius: "10px"
            }}
          >
            {loading ? "பதிவு செய்யப்படுகிறது..." : "✓ உழவராக பதிவு செய்து விற்க தொடங்குக"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/login" style={{ color: "#0f5132", fontWeight: "800", textDecoration: "underline" }}>
            உள்நுழைவு பக்கம் செல்ல (Login)
          </Link>
        </div>
      </div>

      {/* Switch Portal Links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "0.88rem" }}>
        <Link to="/register/buyer" style={{ color: "#1e40af", fontWeight: "700", textDecoration: "none" }}>
          🛒 நுகர்வோர் பதிவு (Buyer Register) →
        </Link>
        <Link to="/register/bulk-buyer" style={{ color: "#d97706", fontWeight: "700", textDecoration: "none" }}>
          🏨 மொத்த வியாபாரி பதிவு (Bulk Register) →
        </Link>
      </div>

    </div>
  );
}
