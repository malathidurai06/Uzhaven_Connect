import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  Lock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Percent,
  Briefcase,
  Zap,
  Volume2,
  Compass,
  Eye,
  EyeOff
} from "lucide-react";

const TAMIL_DISTRICTS = [
  "வண்ணாரப்பேட்டை, திருநெல்வேலி",
  "ஆலங்குளம், தென்காசி",
  "மேலூர், மதுரை",
  "கோவில்பட்டி, தூத்துக்குடி",
  "காந்திபுரம், கோயம்புத்தூர்",
  "சேலம் ஜங்ஷன்",
  "தஞ்சாவூர் டவுன்"
];

const DEMO_BULK_BUYERS = [
  { name: "ஹோட்டல் ராயல் ரெசிடென்சி", contact: "திரு. ராஜேந்திரன் (மேலாளர்)", volume: "150 kg/day" },
  { name: "ஸ்ரீ மீனாட்சி உணவகம் & மெஸ்", contact: "திரு. கந்தசாமி (உரிமையாளர்)", volume: "250 kg/day" },
  { name: "கிரீன் பிரெஷ் சூப்பர்மார்க்கெட்", contact: "திருமதி. சுமித்ரா (கொள்முதல்)", volume: "500 kg/day" }
];

export default function BulkBuyerRegister() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [form, setForm] = useState({
    name: "",
    contact_person: "திரு. ராஜேந்திரன் (மேலாளர்)",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "வண்ணாரப்பேட்டை, திருநெல்வேலி",
    gstin: "33AABCR1234F1Z5",
    daily_volume: "150 kg/day",
    role: "secondary_buyer",
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
    const randomBulk = DEMO_BULK_BUYERS[Math.floor(Math.random() * DEMO_BULK_BUYERS.length)];
    const pass = "pass" + randomSuffix.toString().slice(0, 3);

    setForm({
      name: randomBulk.name,
      contact_person: randomBulk.contact,
      phone: randomPhone,
      password: pass,
      confirmPassword: pass,
      village: randomDistrict,
      gstin: `33AABCR${randomSuffix}Z5`,
      daily_volume: randomBulk.volume,
      role: "secondary_buyer"
    });
    setError(null);
    showToast(lang === "ta" ? "⚡ மாதிரி வணிக விபரங்கள் தானாக நிரப்பப்பட்டன!" : "⚡ Demo B2B details auto-filled!", "info");
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
          setForm((prev) => ({ ...prev, village: "வண்ணாரப்பேட்டை, திருநெல்வேலி" }));
          showToast(lang === "ta" ? "திருநெல்வேலி இருப்பிடமாக அமைக்கப்பட்டது." : "Default town set to Tirunelveli.", "info");
        }
      );
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
        role: "secondary_buyer",
        village: `${form.village} · தொடர்பு: ${form.contact_person} · GST: ${form.gstin} · தேவை: ${form.daily_volume}`,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`🏨 வாழ்த்துகள் ${res.data.user.name}! மொத்த கொள்முதல் கணக்கு தொடங்கப்பட்டது.`, "success");
      navigate("/ai/crop-rescue");
    } catch (err) {
      setError(err.response?.data?.error || "பதிவு தோல்வியடைந்தது. கைபேசி எண் ஏற்கனவே உள்ளதா என சரிபார்க்கவும்.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "660px", margin: "24px auto 50px", padding: "0 16px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#fef3c7", color: "#92400e", borderColor: "#f59e0b", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Building2 size={14} color="#92400e" /> 🏨 மொத்த வியாபாரி பதிவு · Commercial B2B Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "வணிக & மொத்த கொள்முதல் கணக்கு" : "Commercial B2B Registration"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto", fontSize: "0.92rem" }}>
          {lang === "ta"
            ? "ஹோட்டல்கள், மெஸ்கள் மற்றும் உணவு நிறுவனங்களுக்கான 35%-50% தள்ளுபடி உபரி விளைபொருட்கள் தளம்."
            : "Direct access to surplus harvest clearance at up to 50% discount for commercial kitchens."}
        </p>
      </div>

      {/* Registration Card */}
      <div className="card" style={{ padding: "32px", border: "2px solid #f59e0b", boxShadow: "0 10px 30px rgba(245, 158, 11, 0.14)", background: "#ffffff" }}>
        
        {/* Quick Assistant Helpers */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#92400e" }}>
            🏨 வணிக B2B படிவம் (B2B Form)
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleAutoFill}
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "#f59e0b", color: "#92400e", background: "#fef3c7" }}
            >
              <Zap size={14} /> ⚡ மாதிரி நிரப்பல் (Auto-Fill)
            </button>
          </div>
        </div>

        {/* Benefits Banner */}
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "12px 16px", borderRadius: "10px", marginBottom: "22px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.6rem" }}>🏢</div>
          <div style={{ fontSize: "0.82rem", color: "#92400e" }}>
            <strong>வணிக வாடிக்கையாளர்களுக்கான நன்மைகள்:</strong>
            <div>✓ 35%-50% உபரி தள்ளுபடி சலுகை · B2B GST வரி இன்வாய்ஸ் · நேரடி சப்ளை</div>
          </div>
        </div>

        {error && (
          <p style={{ color: "#b91c1c", fontSize: "0.86rem", marginBottom: "16px", background: "#fee2e2", padding: "10px 14px", borderRadius: "8px" }}>
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
            <Building2 size={14} color="#d97706" />
            1. நிறுவனம் / ஹோட்டல் பெயர் (Business Name) *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="எ.கா: ஹோட்டல் ராயல் ரெசிடென்சி"
            required
            style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Phone size={14} color="#d97706" />
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
                  <MapPin size={14} color="#d97706" />
                  3. அமைவிடம் / மாவட்டம் *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  style={{ background: "none", border: "none", color: "#d97706", fontSize: "0.76rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                >
                  <Compass size={12} /> 📍 GPS
                </button>
              </div>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: வண்ணாரப்பேட்டை, திருநெல்வேலி"
                required
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Briefcase size={14} color="#d97706" />
                4. தொடர்பு அதிகாரி & ஜிஎஸ்டி (Contact & GST)
              </label>
              <input
                type="text"
                name="contact_person"
                value={form.contact_person}
                onChange={handleChange}
                placeholder="எ.கா: திரு. ராஜேந்திரன் (மேலாளர்)"
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", marginBottom: "6px", color: "#1e293b" }}>
                <Percent size={14} color="#d97706" />
                5. தினசரி தேவை (kg/day)
              </label>
              <input
                type="text"
                name="daily_volume"
                value={form.daily_volume}
                onChange={handleChange}
                placeholder="எ.கா: 150 kg/day"
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "22px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.86rem", color: "#1e293b", margin: 0 }}>
                  <Lock size={14} color="#d97706" />
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
                <Lock size={14} color="#d97706" />
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
            className="btn btn-accent"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "1.05rem",
              fontWeight: "800",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
              borderRadius: "10px",
              color: "#ffffff"
            }}
          >
            {loading ? "பதிவு செய்யப்படுகிறது..." : "✓ வணிக B2B கணக்கு தொடங்குக"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/login" style={{ color: "#d97706", fontWeight: "800", textDecoration: "underline" }}>
            உள்நுழைவு பக்கம் செல்ல (Login)
          </Link>
        </div>
      </div>

      {/* Switch Portal Links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "0.88rem" }}>
        <Link to="/register/farmer" style={{ color: "#0f5132", fontWeight: "700", textDecoration: "none" }}>
          🧑‍🌾 உழவர் பதிவு (Farmer Register) →
        </Link>
        <Link to="/register/buyer" style={{ color: "#1e40af", fontWeight: "700", textDecoration: "none" }}>
          🛒 நுகர்வோர் பதிவு (Buyer Register) →
        </Link>
      </div>

    </div>
  );
}
