import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Sprout, 
  ShoppingBag, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export default function RegisterGateway() {
  const { lang } = useApp();

  return (
    <div style={{ maxWidth: "1000px", margin: "24px auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <span className="page-badge">
          <ShieldCheck size={14} color="#10b981" /> Separate Role Registration · தனிப்பயன் பதிவு
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "புதிய கணக்கு பதிவு செய்க" : "Choose Your Account Type"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto", maxWidth: "640px" }}>
          {lang === "ta"
            ? "உழவர்கள், நுகர்வோர் மற்றும் மொத்த வாங்குபவர்களுக்கான பிரத்தியேக பதிவு படிவங்கள்."
            : "Select your role below to open the dedicated registration form tailored for your needs."}
        </p>
      </div>

      {/* 3 Dedicated Role Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "36px" }}>
        
        {/* Farmer Registration Card */}
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
              {lang === "ta" ? "உழவர் புதிய பதிவு" : "Farmer Registration"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", marginBottom: "20px" }}>
              {lang === "ta"
                ? "விவசாய நிலம், முக்கிய பயிர்கள் மற்றும் வங்கி UPI இணைத்து உடனடியாக விற்க தொடங்குங்கள்."
                : "Register your farm land and crops to start selling directly to consumers with zero middlemen."}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", fontSize: "0.84rem", color: "#0f5132", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" /> 0% தரகு கட்டணம் (Zero Commission)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" /> 24 மணி நேர நேரடி வங்கி பணம்
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" /> தமிழ் குரல் வழி பயிர் விற்பனை AI
              </li>
            </ul>
          </div>

          <Link 
            to="/register/farmer" 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "14px", justifyContent: "center" }}
          >
            <span>{lang === "ta" ? "உழவராக பதிவு செய்ய" : "Register as Farmer"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Consumer Buyer Registration Card */}
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
              {lang === "ta" ? "நுகர்வோர் புதிய பதிவு" : "Buyer Registration"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", marginBottom: "20px" }}>
              {lang === "ta"
                ? "தோட்டத்து புதிய காய்கறிகளை 15 கி.மீ சுற்றளவில் விவசாயியிடம் நேரடியாக வாங்க."
                : "Create a consumer account for farm-fresh vegetables delivered to your home."}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", fontSize: "0.84rem", color: "#1e40af", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#3b82f6" /> இன்று காலையில் அறுவடை செய்தவை
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#3b82f6" /> 15 கி.மீ அதிவேக உள்ளூர் டெலிவரி
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#3b82f6" /> COD மற்றும் பாதுகாப்பான UPI Escrow
              </li>
            </ul>
          </div>

          <Link 
            to="/register/buyer" 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "14px", justifyContent: "center", background: "#1e40af" }}
          >
            <span>{lang === "ta" ? "நுகர்வோராக பதிவு செய்ய" : "Register as Consumer"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Commercial Bulk Buyer Registration Card */}
        <div 
          className="card" 
          style={{ 
            padding: "30px 24px", 
            border: "2px solid #f59e0b", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #ffffff 0%, #fffbeb 100%)",
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.12)"
          }}
        >
          <div>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "16px" }}>
              🏨
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#78350f", marginBottom: "8px" }}>
              {lang === "ta" ? "மொத்த வியாபாரி பதிவு" : "Commercial B2B"}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: "1.5", marginBottom: "20px" }}>
              {lang === "ta"
                ? "ஹோட்டல்கள், மெஸ்கள் மற்றும் உணவு நிறுவனங்களுக்கான 35%-50% தள்ளுபடி உபரி விளைபொருட்கள்."
                : "Register your restaurant, hotel, or food processing kitchen for bulk wholesale deals."}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", fontSize: "0.84rem", color: "#92400e", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#f59e0b" /> 35%-50% உபரி தள்ளுபடி சலுகை
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#f59e0b" /> மொத்த கொள்முதல் (Bulk Orders)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#f59e0b" /> B2B GST வரி இன்வாய்ஸ்
              </li>
            </ul>
          </div>

          <Link 
            to="/register/bulk-buyer" 
            className="btn btn-accent" 
            style={{ width: "100%", padding: "14px", justifyContent: "center" }}
          >
            <span>{lang === "ta" ? "வணிக பதிவு செய்ய" : "Register as B2B Buyer"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

    </div>
  );
}
