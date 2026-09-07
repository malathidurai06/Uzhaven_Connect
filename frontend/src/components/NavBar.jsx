import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { DEMO_ACCOUNTS } from "../utils/agriData";
import { 
  Sprout, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Mic, 
  ShieldAlert, 
  PlusCircle, 
  ClipboardList, 
  Globe, 
  User, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  UserPlus
} from "lucide-react";

export default function NavBar() {
  const { lang, toggleLang, t, user, loginAsDemo, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDemoSwitch = (acc) => {
    loginAsDemo(acc);
    if (acc.role === "farmer") {
      navigate("/farmer/dashboard");
    } else if (acc.role === "admin") {
      navigate("/admin/dashboard");
    } else if (acc.role === "secondary_buyer") {
      navigate("/ai/crop-rescue");
    } else {
      navigate("/buyer/dashboard");
    }
  };

  return (
    <header>
      {/* 1-Click Demo User Switcher Bar */}
      <div className="demo-banner">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#fbbf24", fontWeight: "700" }}>⚡ Quick Demo Switcher:</span>
          <span>Switch roles with 1-click:</span>
        </div>
        <div className="demo-chips">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.phone}
              className={`demo-chip ${user?.role === acc.role ? "active-chip" : ""}`}
              onClick={() => handleDemoSwitch(acc)}
              title={`Switch to ${acc.name}`}
            >
              {acc.label}
            </button>
          ))}
          {user && (
            <button className="demo-chip" onClick={logout} style={{ background: "rgba(239, 68, 68, 0.3)", color: "#fca5a5" }}>
              <LogOut size={12} style={{ marginRight: 2 }} /> Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="brand">
          <div className="brand-icon-wrap">
            <Sprout size={24} color="#083320" />
          </div>
          <div className="brand-title">
            <span>{t("brand_title")}</span>
            <span className="brand-sub">{t("brand_sub")}</span>
          </div>
        </Link>

        <div className="nav-links">
          {/* Role-Specific Priority Hub */}
          {user?.role === "farmer" && (
            <Link 
              to="/farmer/dashboard" 
              className={`nav-link ${location.pathname === "/farmer/dashboard" ? "active" : ""}`}
              style={{ color: "#0f5132", fontWeight: "800" }}
            >
              <LayoutDashboard size={18} />
              <span>{lang === "ta" ? "🧑‍🌾 உழவர் தளம்" : "🧑‍🌾 Farmer Hub"}</span>
            </Link>
          )}

          {user?.role === "buyer" && (
            <Link 
              to="/buyer/dashboard" 
              className={`nav-link ${location.pathname === "/buyer/dashboard" ? "active" : ""}`}
              style={{ color: "#1e40af", fontWeight: "800" }}
            >
              <LayoutDashboard size={18} />
              <span>{lang === "ta" ? "🛒 நுகர்வோர் தளம்" : "🛒 Buyer Hub"}</span>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link 
              to="/admin/dashboard" 
              className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
              style={{ color: "#0f172a", fontWeight: "800", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}
            >
              <LayoutDashboard size={18} />
              <span>🛡️ Admin Console</span>
            </Link>
          )}

          <Link 
            to="/marketplace" 
            className={`nav-link ${location.pathname === "/marketplace" ? "active" : ""}`}
          >
            <ShoppingBag size={18} />
            <span>{t("nav_marketplace")}</span>
          </Link>

          {/* AI Tools Dropdown */}
          <div className="nav-dropdown">
            <div className="nav-dropdown-trigger">
              <Sparkles size={18} color="#fbbf24" />
              <span>{t("nav_ai_tools")}</span>
              <ChevronDown size={14} />
            </div>
            <div className="nav-dropdown-menu">
              <Link to="/ai/voice-assistant" className="nav-dropdown-item">
                <div className="nav-dropdown-icon">🎙️</div>
                <div>
                  <div>{t("nav_voice_assistant")}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Tamil WebSpeech & Instant NLP</div>
                </div>
              </Link>
              <Link to="/ai/price-insights" className="nav-dropdown-item">
                <div className="nav-dropdown-icon">💰</div>
                <div>
                  <div>{t("nav_price_insights")}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>RandomForest ML Pricing</div>
                </div>
              </Link>
              <Link to="/ai/demand-forecast" className="nav-dropdown-item">
                <div className="nav-dropdown-icon">📈</div>
                <div>
                  <div>{t("nav_demand_forecast")}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>7-Day Gradient Boost Forecast</div>
                </div>
              </Link>
              <Link to="/rescue-alerts" className="nav-dropdown-item">
                <div className="nav-dropdown-icon">🍃</div>
                <div>
                  <div>{t("nav_crop_rescue")}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Zero Food Waste Clearance</div>
                </div>
              </Link>
            </div>
          </div>

          <Link 
            to="/list-crop" 
            className={`nav-link ${location.pathname === "/list-crop" ? "active" : ""}`}
          >
            <PlusCircle size={18} />
            <span>{t("nav_list_crop")}</span>
          </Link>

          <Link 
            to="/my-orders" 
            className={`nav-link ${location.pathname === "/my-orders" ? "active" : ""}`}
          >
            <ClipboardList size={18} />
            <span>{t("nav_my_orders")}</span>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Language Switcher */}
          <button className="lang-btn" onClick={toggleLang} title="Toggle English / தமிழ்">
            <Globe size={15} />
            <span>{lang === "en" ? "தமிழ் (TA)" : "English (EN)"}</span>
          </button>

          {/* User Status / Login & Register */}
          {user ? (
            <div 
              className="user-pill" 
              onClick={() => {
                if (user.role === "farmer") navigate("/farmer/dashboard");
                else navigate("/marketplace");
              }}
              style={{ cursor: "pointer" }}
              title={`Logged in as ${user.name} (${user.role}) - Click for dashboard`}
            >
              <div className="avatar">
                {user.role === "farmer" ? "🧑‍🌾" : user.role === "buyer" ? "🛒" : "🏨"}
              </div>
              <span>{user.name.split(" ")[0]}</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link 
                to="/register" 
                className="cta-register-btn" 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
                  color: "#ffffff", 
                  padding: "7px 14px", 
                  borderRadius: "8px", 
                  fontWeight: "700", 
                  textDecoration: "none", 
                  fontSize: "0.84rem", 
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)" 
                }}
              >
                <UserPlus size={14} />
                <span>{lang === "ta" ? "✨ புதிய பதிவு" : "✨ Register"}</span>
              </Link>
              <Link to="/login" className="cta-login-btn">
                {t("nav_login")}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
