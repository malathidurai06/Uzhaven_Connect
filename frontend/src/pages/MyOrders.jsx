import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS, getCropDisplayName } from "../utils/agriData";
import confetti from "canvas-confetti";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  PackageCheck,
  ShoppingBag,
  Phone,
  MessageCircle,
  FileText,
  Zap,
  RotateCcw,
  Sparkles
} from "lucide-react";

export default function MyOrders() {
  const { user, showToast, lang } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [simulatingId, setSimulatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/mine");
      setOrders(res.data || []);
    } catch (err) {
      // Fallback sample orders for demo
      setOrders([
        {
          id: 10,
          crop_name: "raw_mango",
          quantity_kg: 3,
          total_price: 90,
          payment_status: "pending",
          order_status: "placed",
          farmer_name: "Murugan K. (முத்து முருகன்)",
          farmer_village: "Alangulam, Tirunelveli",
          created_at: new Date().toISOString(),
        },
        {
          id: 6,
          crop_name: "sweet_potato",
          quantity_kg: 1,
          total_price: 38,
          payment_status: "paid",
          order_status: "delivered",
          farmer_name: "Arumugam N. (ஆறுமுகம்)",
          farmer_village: "Tenkasi",
          created_at: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newOrderStatus, newPaymentStatus = null) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        order_status: newOrderStatus,
        payment_status: newPaymentStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                order_status: newOrderStatus || o.order_status,
                payment_status: newPaymentStatus || o.payment_status,
              }
            : o
        )
      );

      if (newOrderStatus === "delivered") {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        showToast(
          lang === "ta" ? "🎉 விளைபொருள் வெற்றிகரமாக ஒப்படைக்கப்பட்டது!" : "🎉 Produce delivered fresh!",
          "success"
        );
      } else {
        showToast(
          lang === "ta" ? `✓ நிலை மாற்றப்பட்டது: ${newOrderStatus}` : `✓ Order status updated: ${newOrderStatus}`,
          "info"
        );
      }
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                order_status: newOrderStatus || o.order_status,
                payment_status: newPaymentStatus || o.payment_status,
              }
            : o
        )
      );
      showToast(`Updated to ${newOrderStatus}`, "info");
    }
  };

  // 1-Click Live Auto-Simulation of entire delivery progression
  const handleAutoSimulate = async (orderId) => {
    setSimulatingId(orderId);
    showToast(
      lang === "ta" ? "⚡ நேரலை விநியோக இயக்கம் தொடங்குகிறது..." : "⚡ Live delivery simulation started...",
      "info"
    );

    // Step 1: Placed
    await handleUpdateStatus(orderId, "placed", "pending");

    // Step 2: Farmer Confirmed after 1.5s
    setTimeout(async () => {
      await handleUpdateStatus(orderId, "confirmed", "paid");
      showToast("🧑‍🌾 Farmer confirmed & packed harvest with ice packing!", "info");

      // Step 3: Out for Handover after 2.5s
      setTimeout(async () => {
        await handleUpdateStatus(orderId, "confirmed"); // Keep confirmed or in-transit
        showToast("🚚 In-Transit: Hyperlocal mini-van is arriving at doorstep!", "info");

        // Step 4: Delivered Fresh after 3.5s
        setTimeout(async () => {
          await handleUpdateStatus(orderId, "delivered", "paid");
          setSimulatingId(null);
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.order_status !== "delivered";
    if (filter === "completed") return o.order_status === "delivered";
    return true;
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132", borderColor: "#a7f3d0" }}>
          <ClipboardList size={14} color="#0f5132" /> {lang === "ta" ? "நேரலை விநியோக கண்காணிப்பு" : "Live Delivery Tracking & Invoices"}
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "என் ஆர்டர்கள் & நேரலை விநியோக நிலை" : "My Orders & Real-time Delivery Tracking"}
        </h1>
        <p className="page-subtitle">
          {lang === "ta"
            ? "உழவரிடமிருந்து இன்று காலை அறுவடை செய்யப்பட்டு உங்கள் வீடு வரை வரும் நிலையை நேரலையாக கண்காணிக்கவும்."
            : "Real-time track and trace of your direct farm produce from harvest packing to doorstep handover."}
        </p>
      </div>

      {/* Helper Quick Actions Banner */}
      <div 
        style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          border: "1.5px solid #a7f3d0",
          borderRadius: "14px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} />
          </div>
          <div>
            <strong style={{ fontSize: "0.92rem", color: "#065f46", display: "block" }}>
              {lang === "ta" ? "💡 எளிய நேரலை இயக்கம் (1-Click Interactive Tracking):" : "💡 1-Click Interactive Tracking Controls:"}
            </strong>
            <span style={{ fontSize: "0.78rem", color: "#047857" }}>
              {lang === "ta" ? "கீழே உள்ள பட்டன்களை அழுத்தி உடனடியாக அடுத்த நிலைக்கு மாற்றலாம் அல்லது தானியங்கி இயக்கத்தை பார்க்கலாம்." : "Click buttons on each card to instantly advance delivery steps or simulate live handover."}
            </span>
          </div>
        </div>

        <Link 
          to="/marketplace" 
          className="btn btn-primary"
          style={{ padding: "8px 16px", fontSize: "0.84rem", background: "#0f5132" }}
        >
          <ShoppingBag size={14} /> {lang === "ta" ? "+ புதிய கொள்முதல்" : "+ Order More Harvest"}
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          className={`cat-pill ${filter === "all" ? "active" : ""}`}
        >
          {lang === "ta" ? `அனைத்து ஆர்டர்கள் (${orders.length})` : `All Orders (${orders.length})`}
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`cat-pill ${filter === "active" ? "active" : ""}`}
        >
          {lang === "ta" ? "செயலில் உள்ளவை (Active)" : "Active Deliveries"}
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`cat-pill ${filter === "completed" ? "active" : ""}`}
        >
          {lang === "ta" ? "நிறைவடைந்தவை (Completed)" : "Completed"}
        </button>
      </div>

      {/* Orders List */}
      {loading && <p>Loading your orders...</p>}

      {!loading && filteredOrders.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "2.5rem" }}>📦</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#083320", margin: "10px 0" }}>
            No Orders Found
          </h3>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            Explore fresh nearby harvests in the marketplace and place your first direct order!
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            <ShoppingBag size={16} /> Browse Marketplace
          </Link>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredOrders.map((order) => {
          const cropKey = (order.crop_name || "tomato").toLowerCase();
          const imgUrl = CROP_IMAGES[cropKey] || CROP_IMAGES.default;
          const displayName = getCropDisplayName(order.crop_name, lang);
          const isDelivered = order.order_status === "delivered";
          const isConfirmed = order.order_status === "confirmed" || isDelivered;
          const isSimulating = simulatingId === order.id;

          return (
            <div 
              className="card" 
              key={order.id} 
              style={{ 
                padding: "24px",
                border: isDelivered ? "1.5px solid #a7f3d0" : "1.5px solid #cbd5e1",
                borderRadius: "14px",
                boxShadow: isDelivered ? "0 4px 15px rgba(16, 185, 129, 0.1)" : "0 4px 12px rgba(0,0,0,0.04)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <img
                    src={imgUrl}
                    alt={order.crop_name}
                    style={{ width: "74px", height: "74px", borderRadius: "12px", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = "/images/crops/default.jpg"; }}
                  />
                  <div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#083320", margin: "0 0 4px" }}>
                      {CROP_ICONS[cropKey] || "🌱"} {displayName}
                    </h3>
                    <div style={{ fontSize: "0.88rem", color: "#475569" }}>
                      🧑‍🌾 Farmer: <strong>{order.farmer_name || "Local Farmer"}</strong> · {order.quantity_kg} kg @ <strong style={{ color: "#0f5132" }}>₹{order.total_price}</strong>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>
                      Order #{order.id} · Placed on {new Date(order.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Status Pills & Invoice Button */}
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span
                      style={{
                        background: order.payment_status === "paid" ? "#d1fae5" : "#fef3c7",
                        color: order.payment_status === "paid" ? "#065f46" : "#b45309",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                      }}
                    >
                      Payment: {order.payment_status === "paid" ? "✓ Paid Escrow" : "⏳ Pending"}
                    </span>

                    <span
                      style={{
                        background: isDelivered ? "#d1fae5" : "#e0f2fe",
                        color: isDelivered ? "#065f46" : "#0369a1",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                      }}
                    >
                      {isDelivered ? "✓ DELIVERED" : order.order_status === "confirmed" ? "🚚 PACKED & IN TRANSIT" : "📦 PLACED"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      to={`/payment/${order.id}`}
                      className="btn btn-outline"
                      style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    >
                      <FileText size={13} /> {order.payment_status === "paid" ? "📄 Invoice Bill" : "💳 Pay Online"}
                    </Link>

                    <a
                      href={`tel:9876543210`}
                      className="btn"
                      style={{ padding: "6px 10px", fontSize: "0.8rem", background: "#0284c7", color: "#fff" }}
                      title="Call Farmer"
                    >
                      <Phone size={13} /> Call
                    </a>

                    <a
                      href={`https://wa.me/919876543210?text=Vanakkam%20Farmer,%20regarding%20my%20Order%20%23${order.id}%20for%20${encodeURIComponent(order.crop_name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      style={{ padding: "6px 10px", fontSize: "0.8rem", background: "#16a34a", color: "#fff" }}
                      title="WhatsApp Farmer"
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* 4-Step Visual Order Stepper */}
              <div className="order-stepper" style={{ marginTop: "24px", marginBottom: "18px" }}>
                <div 
                  className="step-item completed"
                  onClick={() => handleUpdateStatus(order.id, "placed")}
                  style={{ cursor: "pointer" }}
                  title="Click to set Order Placed"
                >
                  <div className="step-circle"><CheckCircle2 size={20} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>1. Order Placed</strong>
                </div>

                <div 
                  className={`step-item ${isConfirmed ? "completed" : "active"}`}
                  onClick={() => handleUpdateStatus(order.id, "confirmed")}
                  style={{ cursor: "pointer" }}
                  title="Click to set Farmer Confirmed"
                >
                  <div className="step-circle"><Clock size={18} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>2. Farmer Confirmed</strong>
                </div>

                <div 
                  className={`step-item ${isConfirmed && !isDelivered ? "active" : isDelivered ? "completed" : ""}`}
                  onClick={() => handleUpdateStatus(order.id, "confirmed")}
                  style={{ cursor: "pointer" }}
                  title="Click to set Out for Handover"
                >
                  <div className="step-circle"><Truck size={18} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>3. Out for Handover</strong>
                </div>

                <div 
                  className={`step-item ${isDelivered ? "completed" : ""}`}
                  onClick={() => handleUpdateStatus(order.id, "delivered", "paid")}
                  style={{ cursor: "pointer" }}
                  title="Click to set Delivered Fresh"
                >
                  <div className="step-circle"><PackageCheck size={18} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>4. Delivered Fresh</strong>
                </div>
              </div>

              {/* 1-Click Interactive Control Action Bar on each card */}
              <div 
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ fontSize: "0.82rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} color="#059669" />
                  <span>{lang === "ta" ? "நேரடி நிலைக் கட்டுப்பாடு (Direct Controls):" : "Direct Tracking Advance Controls:"}</span>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {order.order_status === "placed" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "confirmed")}
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: "0.78rem", background: "#0284c7", color: "#fff", fontWeight: "700" }}
                    >
                      👉 {lang === "ta" ? "2. உழவர் உறுதிப்படுத்தினார்" : "Advance ➔ Farmer Confirmed"}
                    </button>
                  )}

                  {order.order_status === "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "delivered", "paid")}
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: "0.78rem", background: "#0f5132", color: "#fff", fontWeight: "700" }}
                    >
                      🚚 {lang === "ta" ? "4. விநியோகம் முடிந்தது (Delivered)" : "Advance ➔ Mark Delivered Fresh"}
                    </button>
                  )}

                  {order.payment_status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, order.order_status, "paid")}
                      className="btn"
                      style={{ padding: "6px 12px", fontSize: "0.78rem", background: "#10b981", color: "#fff", fontWeight: "700" }}
                    >
                      💳 {lang === "ta" ? "கட்டணம் செலுத்தப்பட்டது (Paid)" : "Mark Paid (UPI)"}
                    </button>
                  )}

                  {/* 1-Click Auto Simulation Button */}
                  <button
                    onClick={() => handleAutoSimulate(order.id)}
                    disabled={isSimulating}
                    className="btn btn-outline"
                    style={{ padding: "6px 12px", fontSize: "0.78rem", borderColor: "#f59e0b", color: "#b45309", background: "#fffbeb", fontWeight: "700" }}
                  >
                    <Zap size={13} />
                    <span>{isSimulating ? "Simulating..." : lang === "ta" ? "⚡ நேரலை மாதிரி இயக்கம் (Auto-Demo)" : "⚡ Auto-Simulate Live Delivery"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
