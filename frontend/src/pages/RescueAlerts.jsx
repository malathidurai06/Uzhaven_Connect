import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS, AGRI_CATEGORIES, getCropDisplayName } from "../utils/agriData";
import { 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Percent, 
  Building2, 
  Truck, 
  HeartHandshake, 
  CheckCircle2, 
  RefreshCw,
  AlertTriangle,
  Send,
  PlusCircle,
  Filter,
  CheckCircle,
  XCircle,
  TrendingDown,
  Scale,
  DollarSign,
  Users
} from "lucide-react";

export default function RescueAlerts() {
  const navigate = useNavigate();
  const { user, showToast, lang } = useApp();

  const [activeTab, setActiveTab] = useState("marketplace"); // "marketplace", "raise", "my_alerts", "admin", "analytics"
  const [alerts, setAlerts] = useState([]);
  const [adminAlerts, setAdminAlerts] = useState([]);
  const [myAlerts, setMyAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");

  // Raise alert form state
  const [form, setForm] = useState({
    crop_name: "yam",
    category: "tubers",
    quantity_kg: 150,
    original_price: 45,
    discount_percent: 40,
    urgency_level: "critical",
    urgency_hours: 12,
    triggered_reason: "Surplus farm harvest — need urgent bulk clearance before rain",
    location_village: user?.village || "Alangulam, Tirunelveli",
    logistics_requested: true,
  });

  // Bulk order modal
  const [selectedLot, setSelectedLot] = useState(null);
  const [orderQty, setOrderQty] = useState(50);
  const [ordering, setOrdering] = useState(false);

  // Transporter assignment modal
  const [logisticsModalAlert, setLogisticsModalAlert] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState("Nellai Agri Transport Co-op");

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/rescue/marketplace?category=${selectedCategory}&urgency=${selectedUrgency}`);
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchAdminAlerts = async () => {
    try {
      const res = await api.get("/rescue/admin/all");
      setAdminAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyAlerts = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/rescue/farmer/${user.id}`);
      setMyAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/rescue/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarketplace();
    fetchAnalytics();
    if (user?.role === "admin") fetchAdminAlerts();
    if (user?.role === "farmer") fetchMyAlerts();
  }, [selectedCategory, selectedUrgency, user]);

  const handleRaiseAlert = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login as a Farmer to raise rescue alerts.", "error");
      navigate("/login/farmer");
      return;
    }
    try {
      await api.post("/rescue/raise", form);
      showToast("Emergency Rescue Alert submitted! Pending Admin Quality Verification.", "success");
      fetchMyAlerts();
      fetchAdminAlerts();
      setActiveTab("my_alerts");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to submit rescue alert.", "error");
    }
  };

  const handleBulkOrder = async () => {
    if (!user) {
      showToast("Please login to place a bulk rescue order.", "error");
      navigate("/login/buyer");
      return;
    }
    setOrdering(true);
    try {
      const res = await api.post("/rescue/bulk-order", {
        alert_id: selectedLot.id,
        quantity_kg: orderQty,
        delivery_address: user.village || "Tirunelveli Hub",
      });
      showToast(res.data.message, "success");
      setSelectedLot(null);
      fetchMarketplace();
      fetchAnalytics();
      navigate(`/payment/${res.data.order_id}`);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to place bulk rescue order.", "error");
    }
    setOrdering(false);
  };

  const handleAdminVerify = async (alertId, action) => {
    try {
      await api.post(`/rescue/admin/verify/${alertId}`, { action });
      showToast(`Rescue lot ${action === "approve" ? "Approved & Published" : "Rejected"} successfully!`, "success");
      fetchAdminAlerts();
      fetchMarketplace();
    } catch (err) {
      showToast("Failed to verify alert.", "error");
    }
  };

  const handleAssignLogistics = async () => {
    if (!logisticsModalAlert) return;
    try {
      await api.post(`/rescue/admin/assign-logistics/${logisticsModalAlert.id}`, {
        logistics_partner: selectedTransporter,
        logistics_status: "pickup_scheduled",
      });
      showToast(`Assigned ${selectedTransporter} for farm gate pickup!`, "success");
      setLogisticsModalAlert(null);
      fetchAdminAlerts();
      fetchMarketplace();
    } catch (err) {
      showToast("Failed to assign logistics.", "error");
    }
  };

  const handleUpdateLogistics = async (alertId, newStatus) => {
    try {
      await api.post(`/rescue/update-logistics/${alertId}`, { logistics_status: newStatus });
      showToast(`Transit status updated to: ${newStatus.toUpperCase()}`, "success");
      fetchAdminAlerts();
      fetchMyAlerts();
      fetchMarketplace();
    } catch (err) {
      showToast("Failed to update transit status.", "error");
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px" }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="page-badge" style={{ background: "#fee2e2", color: "#b91c1c", borderColor: "#fca5a5" }}>
            <ShieldAlert size={14} /> Zero Food Waste Protocol
          </span>
          <span className="page-badge" style={{ background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }}>
            <Truck size={14} /> Fast Rural Logistics
          </span>
        </div>
        <h1 className="page-title">
          {lang === "ta" ? "🌾 பயிர் மீட்பு & அவசர மொத்த விற்பனை தளம்" : "🌾 Crop Rescue & Bulk Clearance Network"}
        </h1>
        <p className="page-subtitle">
          {lang === "ta"
            ? "அதிக விளைச்சல் அல்லது அவசர விற்பனை தேவைப்படும் பயிர்களை குறைந்த விலையில் மொத்த வாங்குபவர்களுக்கு வழங்கி உணவுக் கழிவுகளை முற்றிலுமாக தடுக்கிறது."
            : "Emergency direct marketplace connecting surplus/at-risk farm harvests with bulk commercial buyers, processors, and NGOs at 30-50% discount with fast farm-gate pickup."}
        </p>
      </div>

      {/* Analytics Highlights Banner */}
      {analytics && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div className="card" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)", border: "1.5px solid #a7f3d0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#065f46", fontWeight: "600" }}>Total Produce Rescued</span>
              <Scale size={20} color="#059669" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#047857", marginTop: "8px" }}>
              {analytics.total_kg_rescued.toLocaleString()} kg
            </div>
            <span style={{ fontSize: "0.78rem", color: "#059669" }}>🌾 94.2% Waste Reduction Rate</span>
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)", border: "1.5px solid #bfdbfe" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#1e40af", fontWeight: "600" }}>Farmer Income Saved</span>
              <DollarSign size={20} color="#2563eb" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1d4ed8", marginTop: "8px" }}>
              ₹{analytics.total_income_salvaged.toLocaleString()}
            </div>
            <span style={{ fontSize: "0.78rem", color: "#2563eb" }}>💰 Direct to rural farmers</span>
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "1.5px solid #fde68a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#92400e", fontWeight: "600" }}>Farmers Supported</span>
              <Users size={20} color="#d97706" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#b45309", marginTop: "8px" }}>
              {analytics.farmers_helped} Farmers
            </div>
            <span style={{ fontSize: "0.78rem", color: "#d97706" }}>🧑‍🌾 Nell, Tubers & Keerai growers</span>
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", border: "1.5px solid #e9d5ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#6b21a8", fontWeight: "600" }}>Logistics Dispatch Time</span>
              <Truck size={20} color="#9333ea" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#7e22ce", marginTop: "8px" }}>
              {analytics.avg_logistics_hours} hrs
            </div>
            <span style={{ fontSize: "0.78rem", color: "#9333ea" }}>🚚 Farm-gate to buyer transit</span>
          </div>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", borderBottom: "2px solid #e5e7eb", paddingBottom: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setActiveTab("marketplace")}
          className="btn"
          style={{
            background: activeTab === "marketplace" ? "#dc2626" : "#f3f4f6",
            color: activeTab === "marketplace" ? "#fff" : "#374151",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Building2 size={18} />
          {lang === "ta" ? "🛒 மொத்த தள்ளுபடி சந்தை (Bulk Market)" : "🛒 Bulk Clearance Marketplace"}
          <span style={{ background: "rgba(255,255,255,0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem" }}>
            {alerts.length} Deals
          </span>
        </button>

        <button
          onClick={() => setActiveTab("raise")}
          className="btn"
          style={{
            background: activeTab === "raise" ? "#0f5132" : "#f3f4f6",
            color: activeTab === "raise" ? "#fff" : "#374151",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <PlusCircle size={18} />
          {lang === "ta" ? "🚨 அவசர பயிர் மீட்பு பதிவு (Farmer Alert)" : "🚨 Raise Rescue Alert (Farmer)"}
        </button>

        {user?.role === "farmer" && (
          <button
            onClick={() => { setActiveTab("my_alerts"); fetchMyAlerts(); }}
            className="btn"
            style={{
              background: activeTab === "my_alerts" ? "#2563eb" : "#f3f4f6",
              color: activeTab === "my_alerts" ? "#fff" : "#374151",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Clock size={18} />
            {lang === "ta" ? "📋 எனது அவசர பதிவுகள்" : "📋 My Raised Alerts"}
            <span style={{ background: "rgba(255,255,255,0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem" }}>
              {myAlerts.length}
            </span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab("admin"); fetchAdminAlerts(); }}
          className="btn"
          style={{
            background: activeTab === "admin" ? "#7c3aed" : "#f3f4f6",
            color: activeTab === "admin" ? "#fff" : "#374151",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShieldAlert size={18} />
          {lang === "ta" ? "🛡️ தர சரிபார்ப்பு & போக்குவரத்து (Admin & Logistics)" : "🛡️ Admin Verification & Logistics"}
          <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem" }}>
            {adminAlerts.filter(a => a.status === 'pending_verification').length} Pending
          </span>
        </button>
      </div>

      {/* ==================== TAB 1: BULK CLEARANCE MARKETPLACE ==================== */}
      {activeTab === "marketplace" && (
        <div>
          {/* Category Filter Chips */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px" }}>
            {AGRI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: selectedCategory === cat.id ? "2px solid #dc2626" : "1.5px solid #e5e7eb",
                  background: selectedCategory === cat.id ? "#fee2e2" : "#fff",
                  color: selectedCategory === cat.id ? "#991b1b" : "#4b5563",
                  fontWeight: selectedCategory === cat.id ? "700" : "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{cat.icon}</span>
                <span>{lang === "ta" ? cat.label_ta : cat.label_en}</span>
              </button>
            ))}
          </div>

          {/* Rescue Cards Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <RefreshCw className="spin" size={32} />
              <p style={{ marginTop: "12px" }}>Loading verified rescue lots...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <ShieldAlert size={48} color="#059669" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ color: "#065f46" }}>Zero Agricultural Waste Alert</h3>
              <p style={{ color: "#6b7280", maxWidth: "480px", margin: "8px auto" }}>
                All current farm produce has been safely sold or dispatched! No critical surplus lots at this moment.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
              {alerts.map((item) => {
                const imgUrl = CROP_IMAGES[item.crop_name] || CROP_IMAGES.default;
                const icon = CROP_ICONS[item.crop_name] || "🌾";
                return (
                  <div key={item.id} className="card" style={{ padding: "0", overflow: "hidden", border: "1.5px solid #fecaca", position: "relative" }}>
                    {/* Urgency Badge */}
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: item.urgency_level === "critical" ? "#dc2626" : "#f59e0b",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      zIndex: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                    }}>
                      <Clock size={13} /> {item.urgency_level === "critical" ? `Must Clear in ${item.urgency_hours || 12}h` : "Urgent Surplus"}
                    </div>

                    {/* Discount Badge */}
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "#059669",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "800",
                      zIndex: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                    }}>
                      {item.discount_percent}% OFF
                    </div>

                    {/* Crop Image */}
                    <div style={{ height: "180px", width: "100%", overflow: "hidden", position: "relative" }}>
                      <img
                        src={imgUrl}
                        alt={item.crop_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.src = "/images/crops/default.jpg"; }}
                      />
                    </div>

                    {/* Content */}
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                        <strong style={{ fontSize: "1.1rem", textTransform: "capitalize" }}>
                          {getCropDisplayName(item.crop_name, lang)}
                        </strong>
                      </div>

                      <div style={{ fontSize: "0.84rem", color: "#6b7280", marginBottom: "10px" }}>
                        🧑‍🌾 {item.farmer_name} · 📍 {item.location_village || item.farmer_village}
                      </div>

                      {/* Reason */}
                      <div style={{
                        background: "#fef2f2",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        color: "#991b1b",
                        marginBottom: "12px",
                        borderLeft: "3px solid #dc2626"
                      }}>
                        ⚠️ {item.triggered_reason}
                      </div>

                      {/* Pricing Comparison */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                        <div>
                          <span style={{ fontSize: "0.85rem", color: "#9ca3af", textDecoration: "line-through", marginRight: "6px" }}>
                            ₹{item.original_price}/kg
                          </span>
                          <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#dc2626" }}>
                            ₹{item.discount_price}/kg
                          </span>
                        </div>
                        <div style={{ fontSize: "0.88rem", fontWeight: "600", color: "#374151" }}>
                          Lot Size: <strong>{item.quantity_kg} kg</strong>
                        </div>
                      </div>

                      {/* Transporter Badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#0369a1", background: "#f0f9ff", padding: "6px 10px", borderRadius: "6px", marginBottom: "14px" }}>
                        <Truck size={14} /> Transporter: <strong>{item.logistics_partner || "Nellai Rural Co-op Logistics"}</strong>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setSelectedLot(item);
                          setOrderQty(item.quantity_kg);
                        }}
                        className="btn"
                        style={{
                          width: "100%",
                          background: "#dc2626",
                          color: "#fff",
                          fontWeight: "700",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        <HeartHandshake size={18} />
                        <span>Rescue & Buy Bulk ({item.quantity_kg} kg)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: RAISE RESCUE ALERT (FARMER) ==================== */}
      {activeTab === "raise" && (
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div className="card" style={{ border: "1.5px solid #fecaca", background: "linear-gradient(135deg, #fff 0%, #fef2f2 100%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={22} color="#dc2626" />
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", margin: "0", color: "#991b1b" }}>
                  {lang === "ta" ? "அவசர பயிர் மீட்பு பதிவு படிவம்" : "Raise Emergency Crop Rescue Alert"}
                </h2>
                <p style={{ fontSize: "0.84rem", color: "#6b7280", margin: "2px 0 0" }}>
                  {lang === "ta" ? "அறுவடைக்கு பின் தேங்கும் விளைபொருட்களை உடனே பதிவிடவும்" : "Notify verified bulk buyers, hotels & food processors before harvest perishes"}
                </p>
              </div>
            </div>

            <form onSubmit={handleRaiseAlert} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Category & Crop Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Category (வகை)
                  </label>
                  <select
                    className="input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="tubers">🥔 Tubers (கிழங்கு வகைகள்)</option>
                    <option value="fruits">🥭 Fruits (பழ வகைகள்)</option>
                    <option value="south_nell">🌾 South Region Nell (தென்மண்டல நெல்)</option>
                    <option value="banana_byproducts">🍌 Banana By-Products (வாழை உபபொருட்கள்)</option>
                    <option value="keerai">🌿 Keerai Varieties (கீரை வகைகள்)</option>
                    <option value="vegetables">🍅 Fresh Vegetables (காய்கறிகள்)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Crop Name (பயிர் பெயர்)
                  </label>
                  <select
                    className="input"
                    value={form.crop_name}
                    onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
                    required
                  >
                    {form.category === "tubers" && (
                      <>
                        <option value="yam">🥔 Yam (சேனைக்கிழங்கு)</option>
                        <option value="tapioca">🥔 Tapioca (மரவள்ளிக்கிழங்கு)</option>
                        <option value="sweet_potato">🍠 Sweet Potato (சர்க்கரைவள்ளிக்கிழங்கு)</option>
                        <option value="colocasia">🥔 Colocasia / Taro (சேப்பங்கிழங்கு)</option>
                        <option value="potato">🥔 Potato (உருளைக்கிழங்கு)</option>
                      </>
                    )}
                    {form.category === "fruits" && (
                      <>
                        <option value="mango">🥭 Salem Alphonso Mango (மாம்பழம்)</option>
                        <option value="guava">🍈 Country Guava (கொய்யாப்பழம்)</option>
                        <option value="banana">🍌 Banana (வாழைப்பழம்)</option>
                        <option value="papaya">🍈 Papaya (பப்பாளி)</option>
                        <option value="pomegranate">🍎 Pomegranate (மாதுளை)</option>
                      </>
                    )}
                    {form.category === "south_nell" && (
                      <>
                        <option value="ponni_rice">🌾 Ponni Nell (பொன்னி நெல்)</option>
                        <option value="seeraga_samba">🌾 Seeraga Samba Heritage Nell</option>
                        <option value="karuppu_kavuni">🌾 Karuppu Kavuni Black Rice</option>
                        <option value="thooyamalli">🌾 Thooyamalli Traditional Rice</option>
                        <option value="ragi">🌾 Ragi / Finger Millet (கேழ்வரகு)</option>
                      </>
                    )}
                    {form.category === "banana_byproducts" && (
                      <>
                        <option value="banana_chips">🍌 Banana Chips (சிப்ஸ்)</option>
                        <option value="banana_stem">🎍 Banana Stem (வாழைத்தண்டு)</option>
                        <option value="banana_flower">🌺 Banana Flower (வாழைப்பூ)</option>
                        <option value="banana_leaf">🍃 Banana Leaf Bundles (வாழை இலை)</option>
                      </>
                    )}
                    {form.category === "keerai" && (
                      <>
                        <option value="murungai_keerai">🌿 Murungai Keerai (முருங்கைக்கீரை)</option>
                        <option value="agathi_keerai">🌿 Agathi Keerai (அகத்திக்கீரை)</option>
                        <option value="siru_keerai">🌱 Siru Keerai (சிறுகீரை)</option>
                        <option value="palak_keerai">🥬 Palak Keerai (பசலைக்கீரை)</option>
                      </>
                    )}
                    {form.category === "vegetables" && (
                      <>
                        <option value="tomato">🍅 Country Tomato (தக்காளி)</option>
                        <option value="brinjal">🍆 Purple Brinjal (கத்தரிக்காய்)</option>
                        <option value="onion">🧅 Small Shallots (வெங்காயம்)</option>
                        <option value="ladies_finger">🌱 Ladies Finger (வெண்டைக்காய்)</option>
                        <option value="drumstick">🌿 Drumstick (முருங்கைக்காய்)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Quantity & Pricing */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Quantity (kg/bundles)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={form.quantity_kg}
                    onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Original Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Discount % ({form.discount_percent}%)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="5"
                    value={form.discount_percent}
                    onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                  <div style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: "700" }}>
                    Offer Price: ₹{Math.round(form.original_price * (1 - form.discount_percent / 100))}/kg
                  </div>
                </div>
              </div>

              {/* Urgency & Hours */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Urgency Level (அவசர நிலை)
                  </label>
                  <select
                    className="input"
                    value={form.urgency_level}
                    onChange={(e) => setForm({ ...form, urgency_level: e.target.value })}
                  >
                    <option value="critical">🚨 Critical (&lt;12 hrs - Perishable)</option>
                    <option value="high">⚠️ High (&lt;24 hrs - Pre-Rain/Surplus)</option>
                    <option value="moderate">ℹ️ Moderate (&lt;48 hrs - Bulk Clearance)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Clearance Deadline (Hours)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={form.urgency_hours}
                    onChange={(e) => setForm({ ...form, urgency_hours: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  Emergency Reason & Notes (காரணம்)
                </label>
                <textarea
                  className="input"
                  rows="2"
                  value={form.triggered_reason}
                  onChange={(e) => setForm({ ...form, triggered_reason: e.target.value })}
                  placeholder="e.g., Heavy rain forecast, wedding cancellation surplus, riverbank bumper harvest"
                  required
                />
              </div>

              {/* Location & Logistics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Farm Pickup Location / Village
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={form.location_village}
                    onChange={(e) => setForm({ ...form, location_village: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  <input
                    type="checkbox"
                    id="logisticsCheck"
                    checked={form.logistics_requested}
                    onChange={(e) => setForm({ ...form, logistics_requested: e.target.checked })}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label htmlFor="logisticsCheck" style={{ fontSize: "0.86rem", color: "#166534", fontWeight: "600", cursor: "pointer" }}>
                    🚚 Request Urgent Rural Transporter / Co-op Farm-Gate Pickup (உடனடி வாகன வசதி தேவை)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: "700",
                  padding: "12px",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <Send size={18} />
                <span>Submit Rescue Alert for Admin Verification</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MY RAISED ALERTS (FARMER) ==================== */}
      {activeTab === "my_alerts" && (
        <div>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#1f2937" }}>
            📋 Your Raised Rescue Alerts & Live Status
          </h2>
          {myAlerts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "#6b7280" }}>You have not raised any rescue alerts yet.</p>
              <button onClick={() => setActiveTab("raise")} className="btn" style={{ background: "#0f5132", color: "#fff", marginTop: "12px" }}>
                Raise New Alert
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {myAlerts.map((alert) => (
                <div key={alert.id} className="card" style={{ border: "1.5px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "1.05rem", textTransform: "capitalize" }}>
                      {alert.crop_name.replace(/_/g, " ")} ({alert.quantity_kg} kg)
                    </strong>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      background: alert.status === "published" ? "#dcfce7" : alert.status === "pending_verification" ? "#fef3c7" : "#eff6ff",
                      color: alert.status === "published" ? "#166534" : alert.status === "pending_verification" ? "#b45309" : "#1d4ed8",
                    }}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: "4px 0 10px" }}>
                    ⚠️ {alert.triggered_reason}
                  </p>

                  <div style={{ fontSize: "0.85rem", color: "#374151", marginBottom: "8px" }}>
                    💰 Discount: <strong>{alert.discount_percent}% OFF</strong> (Offer: ₹{alert.discount_price}/kg)
                  </div>

                  <div style={{ fontSize: "0.82rem", color: "#0369a1", background: "#f0f9ff", padding: "8px", borderRadius: "6px" }}>
                    🚚 Logistics: <strong>{alert.logistics_partner}</strong> ({alert.logistics_status})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: ADMIN VERIFICATION & LOGISTICS ==================== */}
      {activeTab === "admin" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem", margin: "0", color: "#1f2937" }}>
              🛡️ Admin Verification Queue & Transporter Dispatch
            </h2>
            <button onClick={fetchAdminAlerts} className="btn" style={{ background: "#f3f4f6", color: "#374151", fontSize: "0.85rem" }}>
              <RefreshCw size={14} /> Refresh Queue
            </button>
          </div>

          <div className="card" style={{ padding: "0", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px" }}>Produce Item</th>
                  <th style={{ padding: "12px 16px" }}>Farmer / Location</th>
                  <th style={{ padding: "12px 16px" }}>Quantity & Offer</th>
                  <th style={{ padding: "12px 16px" }}>Emergency Reason</th>
                  <th style={{ padding: "12px 16px" }}>Transporter Status</th>
                  <th style={{ padding: "12px 16px" }}>Verification & Action</th>
                </tr>
              </thead>
              <tbody>
                {adminAlerts.map((row) => {
                  const img = CROP_IMAGES[row.crop_name] || CROP_IMAGES.default;
                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img src={img} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                          <div>
                            <strong style={{ textTransform: "capitalize" }}>{row.crop_name.replace(/_/g, " ")}</strong>
                            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{row.category}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        <div>{row.farmer_name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>📍 {row.location_village}</div>
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        <div><strong>{row.quantity_kg} kg</strong></div>
                        <div style={{ fontSize: "0.8rem", color: "#dc2626" }}>
                          ₹{row.discount_price}/kg <span style={{ textDecoration: "line-through", color: "#9ca3af" }}>₹{row.original_price}</span> ({row.discount_percent}% OFF)
                        </div>
                      </td>

                      <td style={{ padding: "12px 16px", maxWidth: "220px" }}>
                        <div style={{ fontSize: "0.82rem", color: "#991b1b" }}>⚠️ {row.triggered_reason}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Deadline: {row.urgency_hours || 24} hrs</div>
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "#0369a1" }}>{row.logistics_partner}</div>
                        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                          <select
                            value={row.logistics_status}
                            onChange={(e) => handleUpdateLogistics(row.id, e.target.value)}
                            style={{ fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px" }}
                          >
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="pickup_scheduled">Pickup Scheduled</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        {row.status === "pending_verification" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => handleAdminVerify(row.id, "approve")}
                              className="btn"
                              style={{ background: "#059669", color: "#fff", padding: "6px 10px", fontSize: "0.78rem" }}
                            >
                              <CheckCircle size={14} /> Approve & Publish
                            </button>
                            <button
                              onClick={() => handleAdminVerify(row.id, "reject")}
                              className="btn"
                              style={{ background: "#fee2e2", color: "#991b1b", padding: "6px 10px", fontSize: "0.78rem" }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "10px",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              background: row.status === "published" ? "#dcfce7" : row.status === "ordered" ? "#eff6ff" : "#f3f4f6",
                              color: row.status === "published" ? "#166534" : row.status === "ordered" ? "#1d4ed8" : "#374151"
                            }}>
                              {row.status.toUpperCase()}
                            </span>
                            <button
                              onClick={() => setLogisticsModalAlert(row)}
                              className="btn"
                              style={{ background: "#f0f9ff", color: "#0369a1", padding: "4px 8px", fontSize: "0.75rem" }}
                            >
                              <Truck size={12} /> Assign Truck
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== BULK ORDER MODAL ==================== */}
      {selectedLot && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "20px"
        }}>
          <div className="card" style={{ maxWidth: "480px", width: "100%", background: "#fff", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 12px", color: "#991b1b", display: "flex", alignItems: "center", gap: "8px" }}>
              <HeartHandshake size={22} /> Confirm Bulk Rescue Order
            </h3>

            <div style={{ display: "flex", gap: "12px", background: "#fef2f2", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
              <img src={CROP_IMAGES[selectedLot.crop_name] || CROP_IMAGES.default} alt="" style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
              <div>
                <strong style={{ textTransform: "capitalize", fontSize: "1.1rem" }}>{selectedLot.crop_name.replace(/_/g, " ")}</strong>
                <div style={{ fontSize: "0.82rem", color: "#6b7280" }}>Farmer: {selectedLot.farmer_name} (📍 {selectedLot.location_village})</div>
                <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#dc2626" }}>Discounted Rate: ₹{selectedLot.discount_price}/kg</div>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Order Quantity (kg) — Max Available: {selectedLot.quantity_kg} kg
              </label>
              <input
                type="number"
                min="10"
                max={selectedLot.quantity_kg}
                value={orderQty}
                onChange={(e) => setOrderQty(Math.min(selectedLot.quantity_kg, Number(e.target.value)))}
                className="input"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: "4px" }}>
                <span>Subtotal ({orderQty} kg @ ₹{selectedLot.discount_price}):</span>
                <strong>₹{orderQty * selectedLot.discount_price}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: "4px", color: "#059669" }}>
                <span>Farmer Waste Saved:</span>
                <strong>{orderQty} kg rescued</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#0369a1" }}>
                <span>Logistics Partner:</span>
                <strong>{selectedLot.logistics_partner || "Nellai Rural Co-op Truck"}</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setSelectedLot(null)}
                className="btn"
                style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkOrder}
                disabled={ordering}
                className="btn"
                style={{ flex: 2, background: "#dc2626", color: "#fff", fontWeight: "700" }}
              >
                {ordering ? "Processing..." : `Confirm & Pay ₹${orderQty * selectedLot.discount_price}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ASSIGN LOGISTICS MODAL ==================== */}
      {logisticsModalAlert && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "20px"
        }}>
          <div className="card" style={{ maxWidth: "440px", width: "100%", background: "#fff", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 12px", color: "#0369a1", display: "flex", alignItems: "center", gap: "8px" }}>
              <Truck size={22} /> Assign Rural Transporter
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#6b7280", marginBottom: "16px" }}>
              Assign local freight van / tractor mini-truck for farm gate pickup of <strong>{logisticsModalAlert.quantity_kg} kg {logisticsModalAlert.crop_name}</strong> from <strong>{logisticsModalAlert.location_village}</strong>.
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Select Transport Partner (போக்குவரத்து நிறுவனம்)
              </label>
              <select
                className="input"
                value={selectedTransporter}
                onChange={(e) => setSelectedTransporter(e.target.value)}
              >
                <option value="Nellai Agri Transport Co-op">🚚 Nellai Agri Transport Co-op (Alangulam Hub)</option>
                <option value="Madurai Express Agro-Van">🚐 Madurai Express Agro-Van Service</option>
                <option value="Tenkasi Farmer Freight Co-op">🚜 Tenkasi Farmer Freight Co-op</option>
                <option value="Tuticorin Coastal Rural Logistics">🚛 Tuticorin Coastal Rural Logistics</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setLogisticsModalAlert(null)}
                className="btn"
                style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignLogistics}
                className="btn"
                style={{ flex: 2, background: "#0369a1", color: "#fff", fontWeight: "700" }}
              >
                Dispatch Transporter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
