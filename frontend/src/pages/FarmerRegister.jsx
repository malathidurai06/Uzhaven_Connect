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
  Check
} from "lucide-react";

export default function FarmerRegister() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "Alangulam, Tirunelveli",
    main_crops: "Tomato, Brinjal, Onion",
    farm_acres: "3",
    role: "farmer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        village: `${form.village} · Crops: ${form.main_crops} (${form.farm_acres} Acres)`,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`வாழ்த்துகள் ${res.data.user.name}! உழவர் கணக்கு தொடங்கப்பட்டது.`, "success");
      navigate("/farmer/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "பதிவு தோல்வியடைந்தது. தயவுசெய்து விவரங்களை சரிபார்க்கவும்.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "620px", margin: "24px auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132", borderColor: "#10b981" }}>
          <Sprout size={14} color="#0f5132" /> 🧑‍🌾 பிரத்தியேக உழவர் பதிவு · Farmer Exclusive Registration
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "புதிய உழவர் கணக்கு தொடங்குக" : "Farmer Registration"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          {lang === "ta"
            ? "விளைபொருட்களுக்கு 100% நியாயமான விலை பெறவும், இடைத்தரகர்கள் இன்றி நேரடியாக விற்கவும் இப்போதே இணையுங்கள்."
            : "Join the direct farm marketplace to list harvests, get AI fair prices, and receive direct 24h bank payouts."}
        </p>
      </div>

      {/* Registration Card */}
      <div className="card" style={{ padding: "34px", border: "2px solid #10b981", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.14)" }}>
        
        {/* Form Benefits */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px 18px", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.8rem" }}>🌾</div>
          <div style={{ fontSize: "0.84rem", color: "#0f5132" }}>
            <strong>விவசாயிகளுக்கான பிரத்தியேக பலன்கள்:</strong>
            <div>✓ 0% தரகு கட்டணம் · நேரடி UPI பணம் · தமிழ் குரல் வழி பதிவு</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          <label>1. உழவர் முழு பெயர் (Farmer Full Name) *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="எ.கா: மு. முத்து முருகன்"
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>2. கைபேசி எண் (Mobile Number) *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="எ.கா: 9876543210"
                required
              />
            </div>

            <div>
              <label>3. கிராமம் / தாலுகா (Village / District) *</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: ஆலங்குளம், தென்காசி"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
            <div>
              <label>4. முக்கிய விளைபொருட்கள் (Primary Crops)</label>
              <input
                type="text"
                name="main_crops"
                value={form.main_crops}
                onChange={handleChange}
                placeholder="எ.கா: தக்காளி, கத்தரிக்காய், வெங்காயம்"
              />
            </div>

            <div>
              <label>5. நிலப்பரப்பு (Acres)</label>
              <input
                type="text"
                name="farm_acres"
                value={form.farm_acres}
                onChange={handleChange}
                placeholder="எ.கா: 3 ஏக்கர்"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>6. கடவுச்சொல் (Password) *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label>7. உறுதிப்படுத்தவும் (Confirm Password) *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.85rem", marginTop: "12px", background: "#fee2e2", padding: "10px", borderRadius: "8px" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "24px", padding: "16px", fontSize: "1.08rem", fontWeight: "800", justifyContent: "center" }}
          >
            {loading ? "பதிவு செய்யப்படுகிறது..." : "✓ உழவர் கணக்கை தொடங்குக (Create Farmer Account)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "0.88rem", color: "#64748b" }}>
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/login/farmer" style={{ color: "#0f5132", fontWeight: "800", textDecoration: "underline" }}>
            உழவர் உள்நுழைவு பக்கம் செல்ல (Login here)
          </Link>
        </div>
      </div>

      {/* Switch Portal Links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem" }}>
        <Link to="/register/buyer" style={{ color: "#1e40af", fontWeight: "700" }}>
          🛒 நுகர்வோர் பதிவு (Buyer Register) →
        </Link>
        <Link to="/register/bulk-buyer" style={{ color: "#d97706", fontWeight: "700" }}>
          🏨 மொத்த வியாபாரி பதிவு (Bulk Register) →
        </Link>
      </div>

    </div>
  );
}
