import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Sprout, 
  ShoppingBag, 
  Building2, 
  Terminal, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  LogOut,
  Cpu
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { user, logout, lang } = useApp();

  if (user) {
    return (
      <div style={{ maxWidth: "540px", margin: "40px auto" }}>
        <div className="card" style={{ textAlign: "center", padding: "40px 32px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>
            {user.role === "farmer" ? "🧑‍🌾" : user.role === "admin" ? "🛡️" : user.role === "buyer" ? "🛒" : "🏨"}
          </div>
          <h2 style={{ fontSize: "1.7rem", fontWeight: "800", color: "#083320" }}>
            Logged in as {user.name}
          </h2>
          <p style={{ color: "#64748b", margin: "6px 0 24px" }}>
            Role: <strong style={{ color: "#0f5132" }}>{user.role?.toUpperCase()}</strong> · {user.village || "Tirunelveli HQ"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {user.role === "farmer" ? (
              <button className="btn btn-primary" onClick={() => navigate("/farmer/dashboard")}>
                🧑‍🌾 Open Farmer Dashboard
              </button>
            ) : user.role === "admin" ? (
              <button className="btn btn-primary" onClick={() => navigate("/admin/dashboard")} style={{ background: "#0f172a" }}>
                🛡️ Open Admin Developer Console
              </button>
            ) : user.role === "secondary_buyer" ? (
              <button className="btn btn-primary" onClick={() => navigate("/ai/crop-rescue")}>
                🏨 Open Bulk Crop Rescue Hub
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate("/buyer/dashboard")}>
                🛒 Open Buyer Dashboard
              </button>
            )}

            <button className="btn btn-outline" onClick={logout} style={{ color: "#b91c1c" }}>
              <LogOut size={16} /> Logout from Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1180px", margin: "24px auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <span className="page-badge">
          <ShieldCheck size={14} color="#10b981" /> Role-Based Access Control · தனிப்பயன் உள்நுழைவு
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "உழவன் கனெக்ட் உள்நுழைவு தளம்" : "Select Your Portal to Login"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto 16px", maxWidth: "680px" }}>
          {lang === "ta"
            ? "உழவர்கள், நுகர்வோர் மற்றும் நிர்வாகிகளுக்கான பிரத்தியேக பாதுகாப்பு உள்நுழைவு பக்கங்கள்."
            : "Choose between dedicated portals tailored for Farmers, Consumer Buyers, and Platform Developer Admins."}
        </p>

        {/* Highlighted New Account Registration Banner */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)", border: "1.5px solid #10b981", padding: "10px 22px", borderRadius: "30px", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.15)" }}>
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          <span style={{ fontSize: "0.9rem", color: "#065f46", fontWeight: "600" }}>
            {lang === "ta" ? "புதிய உழவர் அல்லது நுகர்வோரா?" : "New Farmer or Buyer?"}
          </span>
          <Link 
            to="/register" 
            style={{ 
              background: "#10b981", 
              color: "#ffffff", 
              fontWeight: "700", 
              fontSize: "0.82rem", 
              padding: "5px 14px", 
              borderRadius: "20px", 
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>{lang === "ta" ? "1-வினாடி எளிதான பதிவு" : "Easy 1-Min Register"}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 3 Primary Role Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "36px" }}>
        
        {/* 1. Farmer Portal Card */}
        <div 
          className="card" 
          style={{ 
            padding: "30px 24px", 
            border: "2px solid #10b981", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.12)"
          }}
        >
          <div>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "16px" }}>
              🧑‍🌾
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#083320", marginBottom: "8px" }}>
              {lang === "ta" ? "1. உழவர் தளம் (Farmer)" : "1. Farmer Portal"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", marginBottom: "20px" }}>
              {lang === "ta"
                ? "விளைபொருட்களை விற்க, நேரடி UPI பணம் பெற மற்றும் தமிழ் குரல் AI பயன்படுத்த."
                : "List harvest produce, track revenue, manage orders, and use Tamil voice AI."}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", fontSize: "0.84rem", color: "#0f5132", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" /> 0% தரகு கட்டணம் (Zero Middlemen)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" /> நேரடி வங்கி UPI பணம்
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" /> பிரத்தியேக உழவர் டாஷ்போர்டு
              </li>
            </ul>
          </div>

          <Link 
            to="/login/farmer" 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "14px", justifyContent: "center" }}
          >
            <span>{lang === "ta" ? "உழவர் உள்நுழைவு" : "Login as Farmer"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 2. Consumer Buyer Portal Card */}
        <div 
          className="card" 
          style={{ 
            padding: "30px 24px", 
            border: "2px solid #3b82f6", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.12)"
          }}
        >
          <div>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "16px" }}>
              🛒
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#1e3a8a", marginBottom: "8px" }}>
              {lang === "ta" ? "2. நுகர்வோர் தளம் (Buyer)" : "2. Buyer Portal"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", marginBottom: "20px" }}>
              {lang === "ta"
                ? "தோட்டத்து புதிய காய்கறிகளை 15 கி.மீ சுற்றளவில் விவசாயியிடம் நேரடியாக வாங்க."
                : "Buy farm-fresh vegetables directly from verified nearby farmers within 15 km."}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", fontSize: "0.84rem", color: "#1e40af", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#3b82f6" /> இன்று காலையில் அறுவடை செய்தவை
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#3b82f6" /> 15 கி.மீ நேரடி வீட்டு டெலிவரி
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#3b82f6" /> நுகர்வோர் ஆர்டர் டிராக்கிங்
              </li>
            </ul>
          </div>

          <Link 
            to="/login/buyer" 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "14px", justifyContent: "center", background: "#1e40af" }}
          >
            <span>{lang === "ta" ? "நுகர்வோர் உள்நுழைவு" : "Login as Buyer"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3. Admin Developer Console Card */}
        <div 
          className="card" 
          style={{ 
            padding: "30px 24px", 
            border: "2px solid #0f172a", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)"
          }}
        >
          <div>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", marginBottom: "16px" }}>
              <Terminal size={28} color="#38bdf8" />
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              {lang === "ta" ? "3. நிர்வாகி & டெவலப்பர்" : "3. Admin / Developer"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", marginBottom: "20px" }}>
              {lang === "ta"
                ? "அனைத்து விவசாயிகள், நுகர்வோர், தயாரிப்புகள் மற்றும் ஆர்டர்களை ஒரே கட்டுப்பாட்டு அறையில் பார்க்க."
                : "Master developer dashboard to inspect all registered farmers, buyers, listed products, and orders."}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", fontSize: "0.84rem", color: "#334155", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#0f172a" /> View All Farmers & Buyers Directory
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#0f172a" /> Cross-Platform Products & Orders
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#0f172a" /> AI Engines & Microservice Health
              </li>
            </ul>
          </div>

          <Link 
            to="/login/admin" 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "14px", justifyContent: "center", background: "#0f172a", borderColor: "#0f172a" }}
          >
            <span>{lang === "ta" ? "நிர்வாகி உள்நுழைவு" : "Login as Admin"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* Bulk Commercial Sub-Banner */}
      <div style={{ textAlign: "center", padding: "18px", background: "#fffbeb", borderRadius: "12px", border: "1px solid #fef3c7" }}>
        <span style={{ fontSize: "0.9rem", color: "#92400e" }}>
          Looking for Wholesale / Restaurant Bulk Deals?{" "}
          <Link to="/login/bulk-buyer" style={{ fontWeight: "800", color: "#b45309", textDecoration: "underline" }}>
            Commercial B2B Buyer Login →
          </Link>
        </span>
      </div>

    </div>
  );
}
