import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS } from "../utils/agriData";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  PackageCheck,
  ShoppingBag
} from "lucide-react";

export default function MyOrders() {
  const { user, showToast, lang } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/mine");
      setOrders(res.data);
    } catch (err) {
      // Fallback sample orders for demo
      setOrders([
        {
          id: 101,
          crop_name: "tomato",
          quantity_kg: 5,
          total_price: 130,
          payment_status: "paid",
          order_status: "confirmed",
          farmer_name: "Murugan K.",
          farmer_village: "Alangulam, Tirunelveli",
          created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        },
        {
          id: 102,
          crop_name: "onion",
          quantity_kg: 10,
          total_price: 420,
          payment_status: "pending",
          order_status: "placed",
          farmer_name: "Selvam P.",
          farmer_village: "Ambasamudram",
          created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
        },
        {
          id: 103,
          crop_name: "brinjal",
          quantity_kg: 40,
          total_price: 720,
          payment_status: "paid",
          order_status: "delivered",
          farmer_name: "Arumugam N.",
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

  const filteredOrders = orders.filter((o) => {
    if (filter === "active") return o.order_status !== "delivered";
    if (filter === "completed") return o.order_status === "delivered";
    return true;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <span className="page-badge">
          <ClipboardList size={14} color="#0f5132" /> Order Tracking & Invoices
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "என் ஆர்டர்கள் & விநியோகம்" : "My Orders & Delivery Tracking"}
        </h1>
        <p className="page-subtitle">
          {lang === "ta"
            ? "விவசாயியிடமிருந்து அறுவடை செய்யப்பட்டு உங்கள் வீடு வரை வரும் நிலையை நேரலையாக கண்காணிக்கவும்."
            : "Real-time track and trace of your farm produce from initial harvest packing to doorstep handover."}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button
          onClick={() => setFilter("all")}
          className={`cat-pill ${filter === "all" ? "active" : ""}`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`cat-pill ${filter === "active" ? "active" : ""}`}
        >
          Active Deliveries
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`cat-pill ${filter === "completed" ? "active" : ""}`}
        >
          Completed
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
          const isDelivered = order.order_status === "delivered";
          const isConfirmed = order.order_status === "confirmed" || isDelivered;

          return (
            <div className="card" key={order.id} style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <img
                    src={imgUrl}
                    alt={order.crop_name}
                    style={{ width: "70px", height: "70px", borderRadius: "12px", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = CROP_IMAGES.default; }}
                  />
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "800", textTransform: "capitalize", color: "#083320" }}>
                      {CROP_ICONS[cropKey] || "🌱"} {order.crop_name}
                    </h3>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>
                      Farmer: <strong>{order.farmer_name || "Local Farmer"}</strong> · {order.quantity_kg} kg @ ₹{order.total_price}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>
                      Order #{order.id} · Placed {new Date(order.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Status Pills */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
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
                      Payment: {order.payment_status}
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
                      {order.order_status}
                    </span>
                  </div>

                  {order.payment_status === "pending" && (
                    <Link
                      to={`/payment/${order.id}`}
                      className="btn btn-accent"
                      style={{ padding: "6px 14px", fontSize: "0.82rem", marginTop: "10px" }}
                    >
                      <CreditCard size={14} /> Pay ₹{order.total_price}
                    </Link>
                  )}
                </div>
              </div>

              {/* 4-Step Visual Order Stepper */}
              <div className="order-stepper" style={{ marginTop: "28px" }}>
                <div className="step-item completed">
                  <div className="step-circle"><CheckCircle2 size={20} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>Order Placed</strong>
                </div>

                <div className={`step-item ${isConfirmed ? "completed" : "active"}`}>
                  <div className="step-circle"><Clock size={18} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>Farmer Confirmed</strong>
                </div>

                <div className={`step-item ${isConfirmed && !isDelivered ? "active" : isDelivered ? "completed" : ""}`}>
                  <div className="step-circle"><Truck size={18} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>Out for Handover</strong>
                </div>

                <div className={`step-item ${isDelivered ? "completed" : ""}`}>
                  <div className="step-circle"><PackageCheck size={18} /></div>
                  <strong style={{ fontSize: "0.78rem", color: "#083320" }}>Delivered Fresh</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
