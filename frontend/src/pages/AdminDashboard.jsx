import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS } from "../utils/agriData";
import { 
  Terminal, 
  Users, 
  ShoppingBag, 
  Package, 
  Receipt, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  DollarSign, 
  Scale, 
  Store,
  ExternalLink,
  Cpu,
  Database,
  ArrowUpDown,
  Search,
  Filter
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, showToast } = useApp();

  const [activeTab, setActiveTab] = useState("farmers");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [aiStatus, setAiStatus] = useState("Checking...");

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/overview");
      setData(res.data);
    } catch (err) {
      showToast("Failed to load admin data. Ensure you have admin privileges.", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    // If not admin, redirect or alert
    if (user && user.role !== "admin") {
      showToast("Access restricted to platform administrators.", "error");
      navigate("/login/admin");
      return;
    }
    fetchOverview();

    // Check FastAPI AI Microservice health
    fetch("http://localhost:8000/")
      .then((r) => r.json())
      .then((d) => setAiStatus(d.status || "Online"))
      .catch(() => setAiStatus("Offline / Starting"));
  }, [user, navigate]);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}" (ID: ${id})?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast(`User ${name} removed from database.`, "success");
      fetchOverview();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete user", "error");
    }
  };

  const handleDeleteListing = async (id, cropName) => {
    if (!window.confirm(`Are you sure you want to remove listing #${id} (${cropName})?`)) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      showToast(`Listing #${id} deleted.`, "success");
      fetchOverview();
    } catch (err) {
      showToast("Failed to delete listing", "error");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { order_status: newStatus });
      showToast(`Order #${orderId} status updated to "${newStatus}"`, "success");
      fetchOverview();
    } catch (err) {
      showToast("Failed to update order status", "error");
    }
  };

  if (loading && !data) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div className="pulse-dot" style={{ width: "24px", height: "24px", margin: "0 auto 16px" }} />
        <p style={{ color: "#64748b", fontWeight: "700" }}>Loading Developer Command Center...</p>
      </div>
    );
  }

  const summary = data?.summary || {
    total_farmers: 3,
    total_buyers: 2,
    total_listings: 10,
    active_listings: 8,
    total_orders: 3,
    total_revenue_inr: 1250,
    total_kg_sold: 65,
  };

  const farmers = data?.farmers || [];
  const buyers = data?.buyers || [];
  const products = data?.products || [];
  const orders = data?.orders || [];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "60px" }}>
      
      {/* Admin Top Header Banner */}
      <div 
        className="card" 
        style={{ 
          padding: "28px 32px", 
          marginBottom: "28px", 
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
          color: "#ffffff",
          border: "none",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span style={{ background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Terminal size={14} color="#38bdf8" /> Platform Admin & Developer View
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "10px 0 4px", color: "#ffffff" }}>
              Uzhavan Connect Command Center
            </h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: "0.9rem" }}>
              Live real-time inspection of all registered farmers, buyers, listed products, transactions, and AI engines.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              className="btn btn-outline" 
              onClick={fetchOverview}
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "#ffffff", padding: "10px 16px" }}
            >
              <RefreshCw size={16} />
              <span>Refresh Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Developer KPI Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        
        <div className="card" style={{ padding: "18px", borderLeft: "4px solid #10b981", background: "#ffffff" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
            Registered Farmers
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f5132", margin: "4px 0" }}>
            {summary.total_farmers}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "700" }}>
            🧑‍🌾 Verified Producers
          </div>
        </div>

        <div className="card" style={{ padding: "18px", borderLeft: "4px solid #3b82f6", background: "#ffffff" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
            Registered Buyers
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1e40af", margin: "4px 0" }}>
            {summary.total_buyers}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "700" }}>
            🛒 Consumer & B2B
          </div>
        </div>

        <div className="card" style={{ padding: "18px", borderLeft: "4px solid #f59e0b", background: "#ffffff" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
            Products Listed
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#b45309", margin: "4px 0" }}>
            {summary.total_listings}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            {summary.active_listings} currently active
          </div>
        </div>

        <div className="card" style={{ padding: "18px", borderLeft: "4px solid #8b5cf6", background: "#ffffff" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
            Total Orders Placed
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#6b21a8", margin: "4px 0" }}>
            {summary.total_orders}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6b21a8", fontWeight: "700" }}>
            {summary.total_kg_sold} kg produce traded
          </div>
        </div>

        <div className="card" style={{ padding: "18px", borderLeft: "4px solid #0f172a", background: "#ffffff" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
            Platform Revenue GMV
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>
            ₹{summary.total_revenue_inr}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: "700" }}>
            ✓ 0% Middleman Deduction
          </div>
        </div>

      </div>

      {/* Interactive Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "24px", overflowX: "auto" }}>
        
        <button
          onClick={() => setActiveTab("farmers")}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            background: activeTab === "farmers" ? "#0f5132" : "#f1f5f9",
            color: activeTab === "farmers" ? "#ffffff" : "#475569",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🧑‍🌾 Registered Farmers ({farmers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("buyers")}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            background: activeTab === "buyers" ? "#1e40af" : "#f1f5f9",
            color: activeTab === "buyers" ? "#ffffff" : "#475569",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🛒 Registered Buyers ({buyers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            background: activeTab === "products" ? "#b45309" : "#f1f5f9",
            color: activeTab === "products" ? "#ffffff" : "#475569",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🥦 Products Listed ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            background: activeTab === "orders" ? "#6b21a8" : "#f1f5f9",
            color: activeTab === "orders" ? "#ffffff" : "#475569",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>📦 Orders Placed ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            background: activeTab === "system" ? "#0f172a" : "#f1f5f9",
            color: activeTab === "system" ? "#ffffff" : "#475569",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>⚙️ System & AI Health</span>
        </button>

      </div>

      {/* =========================================================================
          TAB 1: FARMERS DIRECTORY
          ========================================================================= */}
      {activeTab === "farmers" && (
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f5132", margin: 0 }}>
              🧑‍🌾 All Registered Farmers (Database View)
            </h2>
            <Link to="/register/farmer" className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "6px 12px" }}>
              + Add New Farmer
            </Link>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 10px" }}>ID</th>
                <th style={{ padding: "12px 10px" }}>Farmer Name</th>
                <th style={{ padding: "12px 10px" }}>Mobile Number</th>
                <th style={{ padding: "12px 10px" }}>Farm Village / Location</th>
                <th style={{ padding: "12px 10px" }}>Total Listings</th>
                <th style={{ padding: "12px 10px" }}>Produce Volume (kg)</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 10px", fontWeight: "700", color: "#64748b" }}>#{f.id}</td>
                  <td style={{ padding: "12px 10px", fontWeight: "800", color: "#083320" }}>{f.name}</td>
                  <td style={{ padding: "12px 10px", fontFamily: "monospace" }}>{f.phone}</td>
                  <td style={{ padding: "12px 10px", color: "#475569" }}>{f.village || "Tamil Nadu Hub"}</td>
                  <td style={{ padding: "12px 10px", fontWeight: "700" }}>{f.total_listings} crops</td>
                  <td style={{ padding: "12px 10px", color: "#16a34a", fontWeight: "800" }}>{f.total_produce_kg} kg</td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    <button
                      onClick={() => handleDeleteUser(f.id, f.name)}
                      style={{ background: "#fee2e2", border: "none", color: "#b91c1c", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          TAB 2: BUYERS DIRECTORY
          ========================================================================= */}
      {activeTab === "buyers" && (
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e40af", margin: 0 }}>
              🛒 All Registered Buyers & B2B Commercial Clients
            </h2>
            <Link to="/register/buyer" className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "6px 12px" }}>
              + Add New Buyer
            </Link>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 10px" }}>ID</th>
                <th style={{ padding: "12px 10px" }}>Buyer / Business Name</th>
                <th style={{ padding: "12px 10px" }}>Mobile Number</th>
                <th style={{ padding: "12px 10px" }}>Role Type</th>
                <th style={{ padding: "12px 10px" }}>Delivery Area</th>
                <th style={{ padding: "12px 10px" }}>Orders Placed</th>
                <th style={{ padding: "12px 10px" }}>Total Spend</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 10px", fontWeight: "700", color: "#64748b" }}>#{b.id}</td>
                  <td style={{ padding: "12px 10px", fontWeight: "800", color: "#1e3a8a" }}>{b.name}</td>
                  <td style={{ padding: "12px 10px", fontFamily: "monospace" }}>{b.phone}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", fontWeight: "800", background: b.role === "secondary_buyer" ? "#fef3c7" : "#eff6ff", color: b.role === "secondary_buyer" ? "#92400e" : "#1d4ed8" }}>
                      {b.role === "secondary_buyer" ? "🏨 B2B Wholesale" : "🛒 Consumer Buyer"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", color: "#475569" }}>{b.village || "Tirunelveli Town"}</td>
                  <td style={{ padding: "12px 10px", fontWeight: "700" }}>{b.total_orders} orders</td>
                  <td style={{ padding: "12px 10px", color: "#0f5132", fontWeight: "800" }}>₹{b.total_spend}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    <button
                      onClick={() => handleDeleteUser(b.id, b.name)}
                      style={{ background: "#fee2e2", border: "none", color: "#b91c1c", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PRODUCTS (LISTINGS) INVENTORY
          ========================================================================= */}
      {activeTab === "products" && (
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#b45309", margin: 0 }}>
              🥦 All Listed Products (Cross-Farmer Inventory)
            </h2>
            <Link to="/list-crop" className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "6px 12px" }}>
              + List New Crop
            </Link>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 10px" }}>Crop Item</th>
                <th style={{ padding: "12px 10px" }}>Farmer Owner</th>
                <th style={{ padding: "12px 10px" }}>Available Qty</th>
                <th style={{ padding: "12px 10px" }}>Price / kg</th>
                <th style={{ padding: "12px 10px" }}>AI Fair Range</th>
                <th style={{ padding: "12px 10px" }}>Status</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cropKey = (p.crop_name || "tomato").toLowerCase();
                const img = CROP_IMAGES[cropKey] || CROP_IMAGES.default;

                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img 
                          src={img} 
                          alt={p.crop_name} 
                          style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} 
                          onError={(e) => { e.currentTarget.src = CROP_IMAGES.default; }}
                        />
                        <div>
                          <strong style={{ textTransform: "capitalize", fontSize: "0.95rem" }}>
                            {CROP_ICONS[cropKey] || "🌱"} {p.crop_name}
                          </strong>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>#{p.id} · {p.freshness_tag}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <strong>{p.farmer_name}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.farmer_village}</div>
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: "800" }}>{p.quantity_kg} kg</td>
                    <td style={{ padding: "12px 10px", color: "#0f5132", fontWeight: "800" }}>₹{p.price_per_kg}/kg</td>
                    <td style={{ padding: "12px 10px", fontSize: "0.8rem", color: "#16a34a" }}>
                      ₹{p.ai_suggested_price_min} - ₹{p.ai_suggested_price_max}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ fontSize: "0.72rem", padding: "3px 8px", borderRadius: "8px", fontWeight: "800", background: p.status === "active" ? "#d1fae5" : "#f1f5f9", color: p.status === "active" ? "#065f46" : "#64748b" }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteListing(p.id, p.crop_name)}
                        style={{ background: "#fee2e2", border: "none", color: "#b91c1c", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ORDERS & TRANSACTIONS
          ========================================================================= */}
      {activeTab === "orders" && (
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#6b21a8", margin: 0 }}>
              📦 All Orders & Transaction Records
            </h2>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 10px" }}>Order ID</th>
                <th style={{ padding: "12px 10px" }}>Buyer</th>
                <th style={{ padding: "12px 10px" }}>Farmer Producer</th>
                <th style={{ padding: "12px 10px" }}>Crop Item</th>
                <th style={{ padding: "12px 10px" }}>Quantity</th>
                <th style={{ padding: "12px 10px" }}>Total Amount</th>
                <th style={{ padding: "12px 10px" }}>Payment</th>
                <th style={{ padding: "12px 10px" }}>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 10px", fontWeight: "800", color: "#0f172a" }}>#{o.id}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <strong>{o.buyer_name}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{o.buyer_village}</div>
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <strong>{o.farmer_name}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{o.farmer_village}</div>
                  </td>
                  <td style={{ padding: "12px 10px", textTransform: "capitalize", fontWeight: "700" }}>
                    {o.crop_name}
                  </td>
                  <td style={{ padding: "12px 10px" }}>{o.quantity_kg} kg</td>
                  <td style={{ padding: "12px 10px", fontWeight: "800", color: "#0f5132" }}>
                    ₹{o.total_price}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "10px", fontWeight: "800", background: o.payment_status === "paid" ? "#d1fae5" : "#fef3c7", color: o.payment_status === "paid" ? "#065f46" : "#92400e" }}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <select
                      value={o.order_status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      style={{ fontSize: "0.8rem", padding: "4px 8px", margin: 0, fontWeight: "700", borderRadius: "6px" }}
                    >
                      <option value="placed">placed</option>
                      <option value="confirmed">confirmed</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SYSTEM & AI ENGINE HEALTH
          ========================================================================= */}
      {activeTab === "system" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Cpu size={20} color="#3b82f6" /> FastAPI AI Microservice
            </h3>
            
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Port & Address:</span>
                <strong style={{ fontFamily: "monospace" }}>http://localhost:8000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Status:</span>
                <strong style={{ color: "#16a34a" }}>✓ {aiStatus}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Price Prediction Model:</span>
                <strong>RandomForestRegressor (v1-trained)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Demand Forecast Engine:</span>
                <strong>7-Day Lag Model (Active)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Tamil Voice NLP Dictionary:</span>
                <strong>25+ Native Agricultural Produce Synonyms</strong>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Database size={20} color="#10b981" /> Database & Node Server
            </h3>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Main Server Port:</span>
                <strong style={{ fontFamily: "monospace" }}>http://localhost:5000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Database Engine:</span>
                <strong>SQLite (Production PostgreSQL compatible)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Single-Link Architecture:</span>
                <strong style={{ color: "#16a34a" }}>✓ Unified SPA & API Serving</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Automated Crop Rescue Daemon:</span>
                <strong>Hourly Scan (Active)</strong>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
