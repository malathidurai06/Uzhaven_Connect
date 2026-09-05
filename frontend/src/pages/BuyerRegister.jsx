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
  User 
} from "lucide-react";

export default function BuyerRegister() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "Tirunelveli Town",
    address: "12/4 South Car Street, Tirunelveli",
    preferences: "Daily Fresh Vegetables, Shallots, Tomatoes",
    role: "buyer",
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
        role: "buyer",
        village: `${form.village} · Address: ${form.address}`,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`வாழ்த்துகள் ${res.data.user.name}! நுகர்வோர் கணக்கு தொடங்கப்பட்டது.`, "success");
      navigate("/marketplace");
    } catch (err) {
      setError(err.response?.data?.error || "பதிவு தோல்வியடைந்தது. தயவுசெய்து விவரங்களை சரிபார்க்கவும்.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "620px", margin: "24px auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#3b82f6" }}>
          <ShoppingBag size={14} color="#1d4ed8" /> 🛒 நுகர்வோர் பதிவு · Consumer & Buyer Registration
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          {lang === "ta" ? "புதிய நுகர்வோர் கணக்கு தொடங்குக" : "Consumer Registration"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          {lang === "ta"
            ? "விவசாயிகளிடமிருந்து நேரடியாக இன்று அறுவடை செய்யப்பட்ட புதிய காய்கறிகளை வாங்க இப்போதே இணையுங்கள்."
            : "Buy fresh farm produce directly from verified nearby farmers within 15 km with doorstep delivery."}
        </p>
      </div>

      {/* Registration Card */}
      <div className="card" style={{ padding: "34px", border: "2px solid #3b82f6", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.14)" }}>
        
        {/* Form Benefits */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "14px 18px", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.8rem" }}>🥦</div>
          <div style={{ fontSize: "0.84rem", color: "#1e3a8a" }}>
            <strong>நுகர்வோருக்கான பிரத்தியேக நன்மைகள்:</strong>
            <div>✓ இன்று காலையில் அறுவடை செய்யப்பட்டவை · 15 கி.மீ நேரடி டெலிவரி · COD & UPI</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          <label>1. நுகர்வோர் முழு பெயர் (Consumer Full Name) *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="எ.கா: பிரியா எஸ்."
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
                placeholder="எ.கா: 9876543220"
                required
              />
            </div>

            <div>
              <label>3. பகுதி / நகரம் (Locality / Town) *</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="எ.கா: திருநெல்வேலி நகரம்"
                required
              />
            </div>
          </div>

          <label>4. டெலிவரி முகவரி (Delivery Street Address)</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="எ.கா: 12/4 தெற்கு ரத வீதி, திருநெல்வேலி"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>5. கடவுச்சொல் (Password) *</label>
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
              <label>6. உறுதிப்படுத்தவும் (Confirm Password) *</label>
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
            style={{ width: "100%", marginTop: "24px", padding: "16px", fontSize: "1.08rem", fontWeight: "800", justifyContent: "center", background: "#1e40af" }}
          >
            {loading ? "பதிவு செய்யப்படுகிறது..." : "✓ நுகர்வோர் கணக்கை தொடங்குக (Create Buyer Account)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "0.88rem", color: "#64748b" }}>
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/login/buyer" style={{ color: "#1e40af", fontWeight: "800", textDecoration: "underline" }}>
            நுகர்வோர் உள்நுழைவு பக்கம் செல்ல (Login here)
          </Link>
        </div>
      </div>

      {/* Switch Portal Links */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem" }}>
        <Link to="/register/farmer" style={{ color: "#0f5132", fontWeight: "700" }}>
          🧑‍🌾 உழவர் பதிவு (Farmer Register) →
        </Link>
        <Link to="/register/bulk-buyer" style={{ color: "#d97706", fontWeight: "700" }}>
          🏨 மொத்த வியாபாரி பதிவு (Bulk Register) →
        </Link>
      </div>

    </div>
  );
}
