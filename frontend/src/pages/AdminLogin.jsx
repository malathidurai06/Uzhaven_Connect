import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  ShieldCheck, 
  Terminal, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  Cpu,
  Database,
  Eye,
  KeyRound
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setUser, showToast, lang } = useApp();

  const [phone, setPhone] = useState("9999999999");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { phone, password });
      if (res.data.user.role !== "admin") {
        setError("Access denied: User is not an authorized Administrator.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast("Welcome to Developer Admin Console!", "success");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid Admin credentials");
    }
    setLoading(false);
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/demo-login", { role: "admin", phone: "9999999999" });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast("Logged in as Platform Developer Admin!", "success");
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Demo admin login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "520px", margin: "30px auto" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
        <span className="page-badge" style={{ background: "#f1f5f9", color: "#0f172a", borderColor: "#64748b" }}>
          <Terminal size={14} color="#0f172a" /> Platform Developer & Admin Portal
        </span>
        <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "6px" }}>
          Admin Developer Console
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          Single dashboard to view and manage all registered farmers, buyers, listed products, and platform orders.
        </p>
      </div>

      {/* Login Card */}
      <div className="card" style={{ padding: "34px", border: "2px solid #334155", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)" }}>
        
        {/* Quick Demo Button */}
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "16px", borderRadius: "12px", marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Cpu size={18} color="#0f172a" />
            <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>Developer 1-Click Access</strong>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 12px" }}>
            Instant root access to view all database records, farmers, buyers, products, and transactions.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDemoAdmin}
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "0.92rem", justifyContent: "center", background: "#0f172a", borderColor: "#0f172a" }}
          >
            <KeyRound size={16} />
            <span>⚡ 1-Click Login as Developer Admin</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "18px 0", color: "#94a3b8", fontSize: "0.82rem" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ padding: "0 10px", textTransform: "uppercase", fontWeight: "700" }}>Or Admin Credentials</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>Admin Username / Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9999999999"
            required
          />

          <label>Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.85rem", marginTop: "10px", background: "#fee2e2", padding: "10px", borderRadius: "8px" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-outline"
            style={{ width: "100%", marginTop: "18px", padding: "14px", fontSize: "1rem", fontWeight: "800", justifyContent: "center", borderColor: "#0f172a", color: "#0f172a" }}
          >
            {loading ? "Authenticating..." : "Login to Command Center"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#64748b" }}>
          Not an admin? Go to{" "}
          <Link to="/login" style={{ color: "#0f5132", fontWeight: "700", textDecoration: "underline" }}>
            Main Portal Gateway
          </Link>
        </div>
      </div>

    </div>
  );
}
