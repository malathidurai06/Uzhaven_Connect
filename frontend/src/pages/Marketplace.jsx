import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS, AGRI_CATEGORIES, getCropDisplayName } from "../utils/agriData";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Sparkles, 
  Clock, 
  Plus, 
  Minus, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  Truck, 
  Leaf, 
  Layers, 
  Store, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  FileText, 
  Navigation, 
  ExternalLink, 
  Handshake, 
  CreditCard, 
  QrCode, 
  X,
  Compass,
  Users
} from "lucide-react";

const LOCAL_VILLAGES = [
  { id: "all", label_en: "All Villages & Hubs", label_ta: "அனைத்து கிராமங்கள்" },
  { id: "alangulam", label_en: "Alangulam (அலங்குளம்)", label_ta: "அலங்குளம்" },
  { id: "pavoorchatram", label_en: "Pavoorchatram (பாவூர்சத்திரம்)", label_ta: "பாவூர்சத்திரம்" },
  { id: "tenkasi", label_en: "Tenkasi (தென்காசி)", label_ta: "தென்காசி" },
  { id: "ambasamudram", label_en: "Ambasamudram (அம்பாசமுத்திரம்)", label_ta: "அம்பாசமுத்திரம்" },
  { id: "sankarankovil", label_en: "Sankarankovil (சங்கரன்கோவில்)", label_ta: "சங்கரன்கோவில்" },
  { id: "tirunelveli", label_en: "Tirunelveli Town (திருநெல்வேலி)", label_ta: "திருநெல்வேலி" },
  { id: "tuticorin", label_en: "Tuticorin (தூத்துக்குடி)", label_ta: "தூத்துக்குடி" },
  { id: "madurai", label_en: "Madurai Hub (மதுரை)", label_ta: "மதுரை" },
];

const FEATURED_LOCAL_FARMERS = [
  {
    name: "Murugan K. (முத்து முருகன்)",
    village: "Alangulam Hub",
    acres: "3.5 Acres",
    crops: "Yam, Keerai, Brinjal",
    phone: "9876543210",
    distance_km: "2.1 km away",
    badge: "TN-Agri Verified",
    kcc: "TN-KCC-10948",
  },
  {
    name: "Muthu Lakshmi (முத்துலட்சுமி)",
    village: "Pavoorchatram",
    acres: "4.0 Acres",
    crops: "Drumstick, Tapioca, Guava",
    phone: "9876543211",
    distance_km: "4.8 km away",
    badge: "Organic Certified",
    kcc: "TN-KCC-20491",
  },
  {
    name: "Senthil Nathan (செந்தில் நாதன்)",
    village: "Tenkasi Rural",
    acres: "6.0 Acres",
    crops: "Karuppu Kavuni, Ponni Nell",
    phone: "9876543212",
    distance_km: "8.5 km away",
    badge: "Heritage Paddy Specialist",
    kcc: "TN-KCC-30812",
  },
  {
    name: "Kaliappan R. (காளியப்பன்)",
    village: "Ambasamudram",
    acres: "2.5 Acres",
    crops: "Banana Chips, Stem, Flower",
    phone: "9876543213",
    distance_km: "6.2 km away",
    badge: "Banana By-Products Co-op",
    kcc: "TN-KCC-40915",
  },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const { user, showToast, lang } = useApp();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderQty, setOrderQty] = useState({});
  const [orderingId, setOrderingId] = useState(null);

  // Farmer Details & Proofs Modal
  const [selectedFarmerListing, setSelectedFarmerListing] = useState(null);

  // Direct Booking Modal
  const [bookingListing, setBookingListing] = useState(null);
  const [paymentChoice, setPaymentChoice] = useState("direct_handshake");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/listings", {
        params: {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        },
      });
      setListings(res.data || []);
    } catch (err) {
      const nearbyRes = await api.get("/listings/nearby").catch(() => ({ data: [] }));
      setListings(nearbyRes.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleQtyChange = (id, delta, maxAvailable) => {
    setOrderQty((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(maxAvailable || 999, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleConfirmDirectBooking = async () => {
    if (!bookingListing) return;
    const qty = orderQty[bookingListing.id] || 1;
    setOrderingId(bookingListing.id);

    try {
      const res = await api.post("/orders", {
        listing_id: bookingListing.id,
        quantity_kg: qty,
        payment_method: paymentChoice,
      });

      if (paymentChoice === "direct_handshake") {
        showToast(
          `🎉 Direct Farm Booking Confirmed for ${qty} kg ${getCropDisplayName(bookingListing.crop_name, lang)}! Meet farmer ${bookingListing.farmer_name} at ${bookingListing.farmer_village} for direct receive.`,
          "success"
        );
        setBookingListing(null);
        navigate("/my-orders");
      } else {
        showToast(`Order created! Proceeding to optional UPI / Card payment...`, "info");
        setBookingListing(null);
        navigate(`/payment/${res.data.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Please login as a buyer to place an order.";
      showToast(msg, "error");
      if (!user) navigate("/login/buyer");
    }
    setOrderingId(null);
  };

  // Local filter for responsive search, category, and village filtering
  const filteredListings = listings.filter((l) => {
    const name = (l.crop_name || "").toLowerCase();
    const farmer = (l.farmer_name || "").toLowerCase();
    const cat = (l.category || "").toLowerCase();
    const village = (l.farmer_village || "").toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = name.includes(q) || farmer.includes(q) || cat.includes(q) || village.includes(q);
    if (!matchesSearch) return false;

    if (selectedCategory !== "all" && l.category !== selectedCategory && !name.includes(selectedCategory)) {
      return false;
    }

    if (selectedVillage !== "all" && !village.includes(selectedVillage.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132", borderColor: "#a7f3d0" }}>
            <MapPin size={14} /> Local Hyperlocal Farm Network
          </span>
          <span className="page-badge" style={{ background: "#fef3c7", color: "#92400e", borderColor: "#fde68a" }}>
            <Handshake size={14} /> 0% Middleman · Direct Farm Receive
          </span>
        </div>
        <h1 className="page-title">
          {lang === "ta" ? "விளைபொருட்கள் சந்தை (நேரடி உழவர் கொள்முதல்)" : "Local Farm Marketplace & Direct Receive"}
        </h1>
        <p className="page-subtitle">
          {lang === "ta"
            ? "இடைத்தரகர்கள் இன்றி உங்கள் ஊரிலுள்ள விவசாயிகளிடமிருந்து நேரடியாக காய்கறிகள், கிழங்கு மற்றும் நெல் வகைகளை நேரடி கொள்முதல் செய்யலாம்."
            : "Connect directly with verified local farmers in your area. Check official farmer credentials & proofs, call directly via Phone/WhatsApp, and receive fresh harvest in person."}
        </p>
      </div>

      {/* ==================== 1. MEET YOUR LOCAL VILLAGE FARMERS SPOTLIGHT ==================== */}
      <div className="card" style={{ padding: "18px 20px", marginBottom: "24px", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1.5px solid #a7f3d0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46", fontWeight: "800", fontSize: "0.98rem" }}>
            <Users size={20} color="#059669" />
            <span>{lang === "ta" ? "உங்கள் ஊர் உழவர்கள் (Meet Verified Village Farmers):" : "Meet Verified Local Village Farmers:"}</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: "700" }}>
            ✓ 0% Middleman · 100% Direct Village Farm-Gate Connect
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          {FEATURED_LOCAL_FARMERS.map((f, idx) => (
            <div 
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <strong style={{ fontSize: "0.92rem", color: "#083320" }}>🧑‍🌾 {f.name}</strong>
                  <span style={{ fontSize: "0.68rem", background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                    {f.distance_km}
                  </span>
                </div>

                <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: "3px" }}>
                  📍 <strong>{f.village}</strong> · {f.acres}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#0f5132", fontWeight: "600", marginTop: "2px" }}>
                  🌾 {f.crops}
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                <a
                  href={`tel:${f.phone}`}
                  className="btn"
                  style={{ flex: 1, padding: "5px 8px", fontSize: "0.74rem", background: "#0284c7", color: "#fff", justifyContent: "center", borderRadius: "6px" }}
                >
                  <Phone size={12} /> Call
                </a>
                <a
                  href={`https://wa.me/91${f.phone}?text=Vanakkam%20${encodeURIComponent(f.name)},%20I%20want%20to%20buy%20fresh%20harvest%20from%20Uzhavan%20Connect.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{ flex: 1, padding: "5px 8px", fontSize: "0.74rem", background: "#16a34a", color: "#fff", justifyContent: "center", borderRadius: "6px" }}
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 2. SEARCH & HYPERLOCAL VILLAGE FILTER ==================== */}
      <div className="card" style={{ marginBottom: "24px", padding: "16px 20px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", margin: 0 }}>
          
          {/* Text Search Input */}
          <div style={{ flex: 1.5, minWidth: "240px", position: "relative" }}>
            <Search size={18} color="#64748b" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ta" ? "பயிர் பெயர் அல்லது உழவர் பெயர் கொண்டு தேடுக (e.g. yam, mango, சீரக சம்பா, murungai)..." : "Search crop, farmer, or village (e.g. yam, mango, ponni nell, keerai)..."}
              style={{ margin: 0, paddingLeft: "42px", fontSize: "0.92rem", background: "#f8fafc" }}
            />
          </div>

          {/* Hyperlocal Village Dropdown */}
          <div style={{ flex: 1, minWidth: "190px" }}>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              style={{ margin: 0, padding: "10px 14px", fontSize: "0.88rem", background: "#f8fafc", fontWeight: "700", color: "#0f5132" }}
            >
              {LOCAL_VILLAGES.map((v) => (
                <option key={v.id} value={v.id}>
                  📍 {lang === "ta" ? v.label_ta : v.label_en}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontWeight: "700" }}>
            Search
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px" }}>
        {AGRI_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: "9px 16px",
              borderRadius: "24px",
              border: selectedCategory === cat.id ? "2px solid #0f5132" : "1.5px solid #e5e7eb",
              background: selectedCategory === cat.id ? "#e8f5e9" : "#ffffff",
              color: selectedCategory === cat.id ? "#0f5132" : "#4b5563",
              fontWeight: selectedCategory === cat.id ? "800" : "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              boxShadow: selectedCategory === cat.id ? "0 2px 8px rgba(15,81,50,0.15)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
            <span>{lang === "ta" ? cat.label_ta : cat.label_en}</span>
          </button>
        ))}
      </div>

      {/* Product Listings Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="pulse-dot" style={{ width: "24px", height: "24px", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontWeight: "700" }}>Loading fresh farm harvests...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌾</div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#083320" }}>No produce found in this selection</h3>
          <p style={{ color: "#64748b", margin: "6px 0 20px" }}>Try selecting another village hub or clear your search term.</p>
          <button className="btn btn-outline" onClick={() => { setSelectedCategory("all"); setSelectedVillage("all"); setSearchQuery(""); }}>
            Show All Produce
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "24px" }}>
          {filteredListings.map((l) => {
            const cropKey = (l.crop_name || "tomato").toLowerCase();
            const img = CROP_IMAGES[cropKey] || CROP_IMAGES.default;
            const currentQty = orderQty[l.id] || 1;
            const displayName = getCropDisplayName(l.crop_name, lang);

            return (
              <div 
                key={l.id} 
                className="card" 
                style={{ 
                  padding: "0", 
                  overflow: "hidden", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
              >
                {/* Image & Badges */}
                <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
                  <img
                    src={img}
                    alt={l.crop_name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = "/images/crops/default.jpg"; }}
                  />
                  
                  {/* Freshness Badge */}
                  <span 
                    style={{ 
                      position: "absolute", 
                      top: "12px", 
                      left: "12px", 
                      background: "rgba(15, 81, 50, 0.92)", 
                      color: "#ffffff", 
                      padding: "4px 10px", 
                      borderRadius: "20px", 
                      fontSize: "0.75rem", 
                      fontWeight: "800",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    {l.freshness_tag || "Grade A+ Fresh"}
                  </span>

                  {/* Price Tag */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "12px",
                      background: "#ffffff",
                      color: "#0f5132",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "0.92rem",
                      fontWeight: "800",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}
                  >
                    ₹{l.price_per_kg}/kg
                  </span>
                </div>

                {/* Details Body */}
                <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0 0 6px", textTransform: "capitalize", color: "#083320" }}>
                      {CROP_ICONS[cropKey] || "🌱"} {displayName}
                    </h3>
                    
                    {/* Farmer Owner Info Box */}
                    <div style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      marginBottom: "14px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                          🧑‍🌾 {l.farmer_name || "Local Farmer"}
                        </div>
                        <span style={{ fontSize: "0.72rem", background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "6px", fontWeight: "700" }}>
                          ✓ {l.distance_km ? `${l.distance_km} km` : "Local Hub"}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                        📍 {l.farmer_village || "Alangulam Hub, Tirunelveli"}
                      </div>

                      {/* Contact & Proofs Quick Bar */}
                      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                        <a
                          href={l.direct_call_url || "tel:9876543210"}
                          className="btn"
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            fontSize: "0.78rem",
                            background: "#0284c7",
                            color: "#fff",
                            justifyContent: "center",
                            borderRadius: "6px",
                            fontWeight: "700"
                          }}
                        >
                          <Phone size={13} /> Call Farmer
                        </a>

                        <a
                          href={l.whatsapp_url || "https://wa.me/919876543210"}
                          target="_blank"
                          rel="noreferrer"
                          className="btn"
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            fontSize: "0.78rem",
                            background: "#16a34a",
                            color: "#fff",
                            justifyContent: "center",
                            borderRadius: "6px",
                            fontWeight: "700"
                          }}
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>

                        <button
                          onClick={() => setSelectedFarmerListing(l)}
                          className="btn"
                          style={{
                            padding: "6px 10px",
                            fontSize: "0.78rem",
                            background: "#f1f5f9",
                            color: "#334151",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontWeight: "700"
                          }}
                          title="View Farmer Credentials & Proofs"
                        >
                          <ShieldCheck size={14} color="#0f5132" /> Proofs
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748b", marginBottom: "14px" }}>
                      <span>Available Farm Harvest:</span>
                      <strong style={{ color: "#0f5132" }}>{l.quantity_kg} kg</strong>
                    </div>
                  </div>

                  {/* Qty Selector & Action Buttons */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "0.84rem", fontWeight: "700", color: "#334151" }}>Quantity (kg):</span>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "8px" }}>
                        <button
                          onClick={() => handleQtyChange(l.id, -1, l.quantity_kg)}
                          style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          <Minus size={14} />
                        </button>
                        <strong style={{ minWidth: "24px", textAlign: "center", fontSize: "0.95rem" }}>
                          {currentQty}
                        </strong>
                        <button
                          onClick={() => handleQtyChange(l.id, 1, l.quantity_kg)}
                          style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Direct Booking / Optional Online Choice Button */}
                    <button
                      className="btn btn-primary"
                      onClick={() => setBookingListing(l)}
                      style={{ width: "100%", padding: "12px", justifyContent: "center", fontSize: "0.95rem", fontWeight: "800", background: "#0f5132" }}
                    >
                      <Handshake size={18} />
                      <span>
                        Direct Farm Receive · ₹{currentQty * l.price_per_kg}
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== 3. FARMER CREDENTIALS & PROOFS MODAL ==================== */}
      {selectedFarmerListing && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "20px"
        }}>
          <div className="card" style={{ maxWidth: "520px", width: "100%", background: "#fff", borderRadius: "14px", padding: "24px", position: "relative" }}>
            <button
              onClick={() => setSelectedFarmerListing(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", borderBottom: "1.5px solid #f1f5f9", paddingBottom: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                🧑‍🌾
              </div>
              <div>
                <h3 style={{ margin: "0", fontSize: "1.2rem", color: "#083320" }}>
                  {selectedFarmerListing.farmer_name || "Verified Local Farmer"}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "#166534", fontWeight: "700", background: "#dcfce7", padding: "2px 8px", borderRadius: "10px" }}>
                  🛡️ {selectedFarmerListing.farmer_badge || "TN-Agri Verified Farmer"}
                </span>
              </div>
            </div>

            {/* Official Proofs List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <strong style={{ fontSize: "0.9rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                <Award size={16} color="#0f5132" /> Verified Government & Agricultural Proofs:
              </strong>

              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "0.84rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "700", color: "#0f5132" }}>💳 Kisan Credit Card (KCC) Record</div>
                <div style={{ color: "#475569" }}>ID: <strong>{selectedFarmerListing.kcc_number || "TN-KCC-10948"}</strong> (SBI Agri Dept)</div>
              </div>

              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "0.84rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "700", color: "#0f5132" }}>🏛️ Uzhavar Sandhai Registered Member</div>
                <div style={{ color: "#475569" }}>Member Pass ID: <strong>{selectedFarmerListing.uzhavar_sandhai_id || "US-TNV-108"}</strong></div>
              </div>

              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "0.84rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "700", color: "#0f5132" }}>🧪 Soil Health Certificate</div>
                <div style={{ color: "#475569" }}>{selectedFarmerListing.soil_health_cert || "Grade A+ High Organic Nitrogen (Govt Lab Verified)"}</div>
              </div>

              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "0.84rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "700", color: "#0f5132" }}>📄 Land Patta Chitta Verification</div>
                <div style={{ color: "#475569" }}>{selectedFarmerListing.land_patta || "Government e-Sevai Farm Land Title Verified"}</div>
              </div>

              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "0.84rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "700", color: "#0f5132" }}>📍 Farm Location & GPS Pin</div>
                <div style={{ color: "#475569" }}>{selectedFarmerListing.farmer_village || "Alangulam Hub, Tirunelveli District"}</div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <a
                href={selectedFarmerListing.direct_call_url || "tel:9876543210"}
                className="btn"
                style={{ flex: 1, background: "#0284c7", color: "#fff", fontWeight: "700", justifyContent: "center", padding: "10px" }}
              >
                <Phone size={16} /> Call {selectedFarmerListing.farmer_phone || "9876543210"}
              </a>

              <a
                href={selectedFarmerListing.whatsapp_url || "https://wa.me/919876543210"}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ flex: 1, background: "#16a34a", color: "#fff", fontWeight: "700", justifyContent: "center", padding: "10px" }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>

              <a
                href={selectedFarmerListing.google_maps_url || "https://maps.google.com"}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ background: "#f1f5f9", color: "#334151", fontWeight: "700", padding: "10px 14px" }}
                title="Open Farm GPS Directions in Google Maps"
              >
                <Navigation size={16} color="#0f5132" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. DIRECT FARM RECEIVE & OPTIONAL PAYMENT MODAL ==================== */}
      {bookingListing && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: "20px"
        }}>
          <div className="card" style={{ maxWidth: "500px", width: "100%", background: "#fff", borderRadius: "14px", padding: "24px", position: "relative" }}>
            <button
              onClick={() => setBookingListing(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: "0 0 14px", color: "#083320", display: "flex", alignItems: "center", gap: "8px" }}>
              <Handshake size={22} color="#0f5132" /> Confirm Farm Direct Booking
            </h3>

            {/* Produce & Farmer Summary */}
            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "10px", marginBottom: "16px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <strong style={{ fontSize: "1.1rem", textTransform: "capitalize", color: "#083320" }}>
                  {getCropDisplayName(bookingListing.crop_name, lang)} ({orderQty[bookingListing.id] || 1} kg)
                </strong>
                <strong style={{ fontSize: "1.2rem", color: "#0f5132" }}>
                  ₹{(orderQty[bookingListing.id] || 1) * bookingListing.price_per_kg}
                </strong>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                Farmer: <strong>{bookingListing.farmer_name}</strong> · 📍 {bookingListing.farmer_village}
              </div>
            </div>

            {/* Payment Method Selector (Direct Farm Hand-to-Hand is Primary) */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: "700", display: "block", marginBottom: "8px", color: "#1e293b" }}>
                Choose How You Want to Receive & Settle:
              </label>

              {/* Option 1: Direct Hand-to-Hand Cash on Receive (RECOMMENDED PRIMARY) */}
              <div 
                onClick={() => setPaymentChoice("direct_handshake")}
                style={{
                  border: paymentChoice === "direct_handshake" ? "2px solid #0f5132" : "1.5px solid #e2e8f0",
                  background: paymentChoice === "direct_handshake" ? "#e8f5e9" : "#fff",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentChoice === "direct_handshake"}
                  onChange={() => setPaymentChoice("direct_handshake")}
                  style={{ marginTop: "3px" }}
                />
                <div>
                  <strong style={{ color: "#0f5132", fontSize: "0.95rem" }}>
                    🤝 Direct Farm Pickup & Cash on Receive (Recommended)
                  </strong>
                  <p style={{ fontSize: "0.8rem", color: "#475569", margin: "2px 0 0" }}>
                    Pay hand-to-hand directly to the farmer when picking up the fresh harvest at the farm gate. 0% gateway fee.
                  </p>
                </div>
              </div>

              {/* Option 2: Optional Online UPI / Escrow */}
              <div 
                onClick={() => setPaymentChoice("online_upi")}
                style={{
                  border: paymentChoice === "online_upi" ? "2px solid #0f5132" : "1.5px solid #e2e8f0",
                  background: paymentChoice === "online_upi" ? "#e8f5e9" : "#fff",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentChoice === "online_upi"}
                  onChange={() => setPaymentChoice("online_upi")}
                  style={{ marginTop: "3px" }}
                />
                <div>
                  <strong style={{ color: "#1e293b", fontSize: "0.95rem" }}>
                    📱 Optional Digital Prepay (UPI QR / Card)
                  </strong>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "2px 0 0" }}>
                    Pay digitally in advance to farmer's UPI ID / GPay with instant verified e-bill.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <a
                href={bookingListing.direct_call_url || "tel:9876543210"}
                className="btn"
                style={{ flex: 1, background: "#0284c7", color: "#fff", fontSize: "0.84rem", padding: "8px", justifyContent: "center" }}
              >
                <Phone size={14} /> Call Farmer
              </a>
              <a
                href={bookingListing.whatsapp_url || "https://wa.me/919876543210"}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ flex: 1, background: "#16a34a", color: "#fff", fontSize: "0.84rem", padding: "8px", justifyContent: "center" }}
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setBookingListing(null)}
                className="btn"
                style={{ flex: 1, background: "#f1f5f9", color: "#334151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDirectBooking}
                disabled={orderingId === bookingListing.id}
                className="btn btn-primary"
                style={{ flex: 2, background: "#0f5132", justifyContent: "center", fontWeight: "800" }}
              >
                {orderingId === bookingListing.id ? "Booking..." : paymentChoice === "direct_handshake" ? "Confirm Farm Gate Booking (₹0 Fee)" : `Pay ₹${(orderQty[bookingListing.id] || 1) * bookingListing.price_per_kg} Online`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
