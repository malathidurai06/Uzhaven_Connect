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
  Briefcase 
} from "lucide-react";

export default function BulkBuyerRegister() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [form, setForm] = useState({
    name: "",
    contact_person: "Mr. Rajendran (Manager)",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "Vannarpettai, Tirunelveli",
    gstin: "33AABCR1234F1Z5",
    daily_volume: "150 kg/day",
    role: "secondary_buyer",
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
        role: "secondary_buyer",
        village: `${form.village} · Contact: ${form.contact_person} · GST: ${form.gstin} · Volume: ${form.daily_volume}`,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`வாழ்த்துகள் ${res.data.user.name}! மொத்த கொள்முதல் கணக்கு தொடங்கப்பட்டது.`, "success");
      navigate("/ai/crop-rescue");
    } catch (err) {
      setError(err.response?.data?.error || "பதிவு தோல்வியடைந்தது. தயவுசெய்து விவரங்களை சரிபார்க்கவும்.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "24px auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#fef3c7", color: "#92400e", borderColor: "#f59e0b" }}>
          <Building2 size={14} color="#92400e" /> 🏨 மொத்த வியாபாரி பதிவு · Commercial B2B Registration
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "வணிக & மொத்த கொள்முதல் கணக்கு" : "Commercial B2B Registration"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          {lang === "ta"
            ? "ஹோட்டல்கள், மெஸ்கள் மற்றும் உணவு நிறுவனங்களுக்கான 35%-50% தள்ளுபடி உபரி விளைபொருட்கள் தளம்."
            : "Direct access to surplus harvest clearance at up to 50% discount for commercial kitchens."}
        </p>
      </div>

      {/* Registration Card */}
      <div className="card" style={{ padding: "34px", border: "2px solid #f59e0b", boxShadow: "0 8px 24px rgba(245, 158, 11, 0.14)" }}>
        
        {/* Form Benefits */}
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "14px 18px", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.8rem" }}>🏢</div>
          <div style={{ fontSize: "0.84rem", color: "#92400e" }}>
            <strong>வணிக வாடிக்கையாளர்களுக்கான நன்மைகள்:</strong>
            <div>✓ 35%-50% உபரி தள்ளுபடி சலுகை · B2B GST வரி இன்வாய்ஸ் · நேரடி சப்ளை</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          <label>1. நிறுவனம் / ஹோட்டல் பெயர் (Business / Hotel Name) *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="எ.கா: ராயல் ரெசிடென்சி & மெஸ்"
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>2. தொடர்பாளர் பெயர் (Contact Person)</label>
              <input
                type="text"
                name="contact_person"
                value={form.contact_person}
                onChange={handleChange}
                placeholder="எ.கா: திரு. ராஜேந்திரன் (மேலாளர்)"
              />
            </div>

            <div>
              <label>3. வணிக தொலைபேசி எண் (Mobile / WhatsApp) *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="எ.கா: 9876543230"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>4. வணிக முகவரி (Commercial Area) *</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: வண்ணாரப்பேட்டை, திருநெல்வேலி"
                required
              />
            </div>

            <div>
              <label>5. தினசரி தேவை அளவு (Daily Volume kg)</label>
              <input
                type="text"
                name="daily_volume"
                value={form.daily_volume}
                onChange={handleChange}
                placeholder="எ.கா: 150 kg/day"
              />
            </div>
          </div>

          <label>6. GSTIN / வணிக பதிவு எண் (GST / Business Reg No. - Optional)</label>
          <input
            type="text"
            name="gstin"
            value={form.gstin}
            onChange={handleChange}
            placeholder="எ.கா: 33AABCR1234F1Z5"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>7. கடவுச்சொல் (Password) *</label>
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
              <label>8. உறுதிப்படுத்தவும் (Confirm Password) *</label>
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
            style={{ width: "100%", marginTop: "24px", padding: "16px", fontSize: "1.08rem", fontWeight: "800", justifyContent: "center", background: "#b45309" }}
          >
            {loading ? "பதிவு செய்யப்படுகிறது..." : "✓ வணிக கணக்கை தொடங்குக (Create B2B Account)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "0.88rem", color: "#64748b" }}>
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/login/bulk-buyer" style={{ color: "#b45309", fontWeight: "800", textDecoration: "underline" }}>
            மொத்த வியாபாரி உள்நுழைவு பக்கம் செல்ல (Login here)
          </Link>
        </div>
      </div>

      {/* Switch Portal Links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem" }}>
        <Link to="/register/farmer" style={{ color: "#0f5132", fontWeight: "700" }}>
          🧑‍🌾 உழவர் பதிவு (Farmer Register) →
        </Link>
        <Link to="/register/buyer" style={{ color: "#1e40af", fontWeight: "700" }}>
          🛒 நுகர்வோர் பதிவு (Buyer Register) →
        </Link>
      </div>

    </div>
  );
}
