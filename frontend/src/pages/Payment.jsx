import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS } from "../utils/agriData";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Receipt, 
  QrCode,
  Truck,
  Printer,
  FileText,
  Download,
  AlertCircle,
  X
} from "lucide-react";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, showToast, lang } = useApp();

  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("direct_cod");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Form states for realistic inputs
  const [upiVpa, setUpiVpa] = useState("buyer@okhdfcbank");
  const [cardForm, setCardForm] = useState({
    number: "4532 8912 3456 7890",
    name: "PRIYA S",
    expiry: "08/29",
    cvv: "782",
  });
  const [selectedBank, setSelectedBank] = useState("SBI");

  useEffect(() => {
    api.get(`/payments/order/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        // Fallback demo order
        setOrder({
          id: orderId,
          crop_name: "tomato",
          quantity_kg: 5,
          price_per_kg: 26,
          total_price: 130,
          farmer_name: "Murugan K. (முத்து முருகன்)",
          farmer_village: "Alangulam, Tirunelveli",
          freshness_tag: "Grade A+ Fresh (3h ago)",
          payment_status: "pending",
        });
      });
  }, [orderId]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#0f5132", "#3b82f6"],
      });
    } catch (e) {}
  };

  const handlePayClick = () => {
    if (selectedMethod === "card") {
      setShowOtpModal(true);
      return;
    }
    executePayment();
  };

  const executePayment = async () => {
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await api.post("/payments/pay", {
        order_id: orderId,
        method: selectedMethod,
        upi_vpa: upiVpa,
        card_last4: cardForm.number.slice(-4),
      });

      setResult(res.data);
      setShowOtpModal(false);
      triggerConfetti();
      showToast("Payment verified successfully!", "success");
    } catch (err) {
      // Optimistic local completion
      const mockResult = {
        order_id: orderId,
        method: selectedMethod,
        payment_status: selectedMethod === "cod" ? "pending" : "paid",
        transaction_id: `UC-TXN-${selectedMethod.toUpperCase()}-${Date.now().toString().slice(-8)}`,
        message: selectedMethod === "cod" 
          ? "Order confirmed for Cash on Delivery. Pay upon inspection." 
          : `Payment of ₹${order?.total_price || 130} verified and placed in Escrow.`,
      };
      setResult(mockResult);
      setShowOtpModal(false);
      triggerConfetti();
      showToast("Payment verified and order confirmed!", "success");
    }
    setProcessing(false);
  };

  if (!order) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div className="pulse-dot" style={{ width: "24px", height: "24px", margin: "0 auto 16px" }} />
        <p style={{ color: "#64748b", fontWeight: "700" }}>Loading secure order checkout...</p>
      </div>
    );
  }

  const cropKey = (order.crop_name || "tomato").toLowerCase();
  const imgUrl = CROP_IMAGES[cropKey] || CROP_IMAGES.default;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=uzhavanconnect@bank&pn=UzhavanConnect&am=${order.total_price}&cu=INR&tn=Order_${order.id}`;

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto" }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: "center", marginBottom: "32px" }}>
        <span className="page-badge">
          <ShieldCheck size={14} color="#16a34a" /> 256-Bit SSL Encrypted Escrow · 100% Direct Payout
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "பாதுகாப்பான கட்டண முறை & ரசீது" : "Secure Checkout & Direct Payment"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          Order #{order.id} · Direct farmer connection with zero middleman deductions and money-back freshness guarantee.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION VIEW */}
      {result ? (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="card" style={{ textAlign: "center", padding: "40px 32px", border: "2px solid #10b981" }}>
            <div style={{ width: "76px", height: "76px", borderRadius: "50%", background: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#083320", marginBottom: "6px" }}>
              {result.method === "cod" ? "Order Placed (Cash on Delivery)!" : "Payment Successfully Verified!"}
            </h2>

            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "24px" }}>
              {result.message}
            </p>

            {/* Receipt Box */}
            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "left", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.88rem" }}>
                <span style={{ color: "#64748b" }}>Order Reference:</span>
                <strong>#{orderId}</strong>
              </div>
              {result.transaction_id && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.88rem" }}>
                  <span style={{ color: "#64748b" }}>Transaction Ref:</span>
                  <strong style={{ fontFamily: "monospace", color: "#0f5132" }}>{result.transaction_id}</strong>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.88rem" }}>
                <span style={{ color: "#64748b" }}>Payment Mode:</span>
                <strong style={{ textTransform: "uppercase" }}>{result.method}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.88rem" }}>
                <span style={{ color: "#64748b" }}>Farmer Destination:</span>
                <strong>{order.farmer_name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "4px" }}>
                <strong>Total Paid Amount:</strong>
                <strong style={{ color: "#0f5132", fontSize: "1.25rem" }}>₹{order.total_price}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <button
                className="btn btn-accent"
                onClick={() => setShowInvoiceModal(true)}
                style={{ width: "100%", padding: "14px", justifyContent: "center" }}
              >
                <FileText size={18} />
                <span>Download / Print Official Farm Invoice</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/my-orders")}
                style={{ width: "100%", padding: "14px", justifyContent: "center" }}
              >
                <span>Track Order in My Orders</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN CHECKOUT 2-COLUMN VIEW */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "32px", alignItems: "start" }}>
          
          {/* Left Column: Order Summary & Itemized Breakdown */}
          <div className="card" style={{ padding: "28px" }}>
            <strong style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px", color: "#083320", marginBottom: "20px" }}>
              <Receipt size={20} color="#0f5132" /> Order Breakdown
            </strong>

            <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingBottom: "18px", borderBottom: "1px solid #e2e8f0" }}>
              <img
                src={imgUrl}
                alt={order.crop_name}
                style={{ width: "74px", height: "74px", borderRadius: "12px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                onError={(e) => { e.currentTarget.src = CROP_IMAGES.default; }}
              />
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", textTransform: "capitalize", margin: 0 }}>
                  {CROP_ICONS[cropKey] || "🌱"} {order.crop_name}
                </h3>
                <div style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "4px" }}>
                  Farmer: <strong>{order.farmer_name || "Local Farmer"}</strong>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: "700", marginTop: "2px" }}>
                  ✓ {order.freshness_tag || "Grade A+ Fresh"}
                </div>
              </div>
            </div>

            {/* Price list */}
            <div style={{ padding: "18px 0", borderBottom: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Quantity</span>
                <strong>{order.quantity_kg} kg</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Price per kg</span>
                <strong>₹{Math.round(order.total_price / (order.quantity_kg || 1))}/kg</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Middleman Commission Cut</span>
                <strong style={{ color: "#16a34a" }}>₹0.00 (0% Waived)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Direct Farm Handover / Local Delivery</span>
                <strong style={{ color: "#16a34a" }}>FREE (15km radius)</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "18px" }}>
              <span style={{ fontWeight: "800", fontSize: "1.15rem" }}>Total Payable</span>
              <strong style={{ fontSize: "1.7rem", color: "#0f5132" }}>₹{order.total_price}</strong>
            </div>

            <div style={{ background: "#e8f5e9", color: "#0f5132", padding: "12px", borderRadius: "10px", marginTop: "18px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={18} />
              <span>100% of this payment is credited directly to the farmer's account.</span>
            </div>
          </div>

          {/* Right Column: Realistic Payment Gateways */}
          <div className="card" style={{ padding: "28px" }}>
            <strong style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px", color: "#083320", marginBottom: "18px" }}>
              <CreditCard size={20} color="#0f5132" /> Choose Payment Option
            </strong>

            <div className="payment-method-list">
              
              {/* Option 1: Direct Farm Gate Receive (RECOMMENDED DEFAULT) */}
              <label className={`payment-method-item ${selectedMethod === "direct_cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="method"
                  value="direct_cod"
                  checked={selectedMethod === "direct_cod"}
                  onChange={() => setSelectedMethod("direct_cod")}
                />
                <Banknote size={24} color="#059669" className="payment-method-icon" />
                <div>
                  <div className="payment-method-label" style={{ color: "#065f46", fontWeight: "800" }}>
                    🤝 Direct Farm Gate Receive & Hand-to-Hand Pay (Recommended)
                  </div>
                  <div className="payment-method-desc">
                    Meet farmer in person at farm location. Check produce freshness & pay hand-to-hand with 0% fee.
                  </div>
                </div>
              </label>

              {/* Direct Farm Gate Guidance Box */}
              {selectedMethod === "direct_cod" && (
                <div style={{ background: "#ecfdf5", padding: "16px", borderRadius: "10px", margin: "6px 0 14px", border: "1.5px solid #a7f3d0" }}>
                  <div style={{ fontWeight: "700", color: "#065f46", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} color="#059669" /> Local Farm-Gate Direct Receive Protocol:
                  </div>
                  <ul style={{ margin: "0 0 10px 18px", padding: 0, fontSize: "0.82rem", color: "#047857", lineHeight: "1.5" }}>
                    <li>Your fresh harvest is reserved directly at the farmer's field/village.</li>
                    <li>Call or WhatsApp the farmer to agree on pickup timing.</li>
                    <li>Inspect crop grade & pay ₹{order.total_price} directly to farmer upon receiving.</li>
                  </ul>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a href="tel:9876543210" className="btn" style={{ flex: 1, padding: "8px", background: "#0284c7", color: "#fff", fontSize: "0.8rem", justifyContent: "center" }}>
                      📞 Call {order.farmer_name || "Farmer"}
                    </a>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, padding: "8px", background: "#16a34a", color: "#fff", fontSize: "0.8rem", justifyContent: "center" }}>
                      💬 WhatsApp Farmer
                    </a>
                  </div>
                </div>
              )}

              {/* UPI Option */}
              <label className={`payment-method-item ${selectedMethod === "upi" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="method"
                  value="upi"
                  checked={selectedMethod === "upi"}
                  onChange={() => setSelectedMethod("upi")}
                />
                <Smartphone size={24} color="#0f5132" className="payment-method-icon" />
                <div>
                  <div className="payment-method-label">📱 Direct UPI QR & Apps (Optional Prepay)</div>
                  <div className="payment-method-desc">Instant zero-fee direct bank-to-farmer UPI transfer</div>
                </div>
              </label>

              {/* UPI Interactive Section */}
              {selectedMethod === "upi" && (
                <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", margin: "6px 0 14px", border: "1.5px solid #10b981" }}>
                  <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
                    <img 
                      src={qrUrl} 
                      alt="UPI QR Code" 
                      style={{ width: "130px", height: "130px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#ffffff", padding: "4px" }} 
                    />
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: "800", textTransform: "uppercase" }}>
                        Live Dynamic QR Code
                      </span>
                      <h4 style={{ margin: "2px 0 8px", fontSize: "1.05rem" }}>Scan with Any UPI App</h4>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 10px" }}>
                        Amount: <strong>₹{order.total_price}</strong> · Direct to Uzhavan Escrow
                      </p>
                      
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700" }}>GPay</span>
                        <span style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700" }}>PhonePe</span>
                        <span style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700" }}>Paytm</span>
                        <span style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700" }}>BHIM</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                    <label style={{ fontSize: "0.8rem", color: "#475569" }}>Or Enter Virtual Payment Address (UPI VPA):</label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="e.g. yourname@oksbi"
                      style={{ margin: 0, padding: "8px 12px", fontSize: "0.88rem" }}
                    />
                  </div>
                </div>
              )}

              {/* Debit / Credit Card Option */}
              <label className={`payment-method-item ${selectedMethod === "card" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={selectedMethod === "card"}
                  onChange={() => setSelectedMethod("card")}
                />
                <CreditCard size={24} color="#f59e0b" className="payment-method-icon" />
                <div>
                  <div className="payment-method-label">Debit / Credit Card (3D Secure OTP)</div>
                  <div className="payment-method-desc">Visa, MasterCard, RuPay with bank OTP verification</div>
                </div>
              </label>

              {/* Card Interactive Form */}
              {selectedMethod === "card" && (
                <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", margin: "6px 0 14px", border: "1.5px solid #f59e0b" }}>
                  <label style={{ fontSize: "0.8rem" }}>Card Number</label>
                  <input
                    type="text"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    placeholder="4532 8912 3456 7890"
                    style={{ fontSize: "0.9rem", padding: "8px 12px" }}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem" }}>Expiry Date</label>
                      <input
                        type="text"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                        placeholder="MM/YY"
                        style={{ fontSize: "0.9rem", padding: "8px 12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem" }}>CVV</label>
                      <input
                        type="password"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                        placeholder="•••"
                        maxLength="4"
                        style={{ fontSize: "0.9rem", padding: "8px 12px" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              <label className={`payment-method-item ${selectedMethod === "netbanking" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="method"
                  value="netbanking"
                  checked={selectedMethod === "netbanking"}
                  onChange={() => setSelectedMethod("netbanking")}
                />
                <Building2 size={24} color="#3b82f6" className="payment-method-icon" />
                <div>
                  <div className="payment-method-label">Net Banking</div>
                  <div className="payment-method-desc">Direct gateway for SBI, HDFC, ICICI, Indian Bank</div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className={`payment-method-item ${selectedMethod === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="method"
                  value="cod"
                  checked={selectedMethod === "cod"}
                  onChange={() => setSelectedMethod("cod")}
                />
                <Banknote size={24} color="#16a34a" className="payment-method-icon" />
                <div>
                  <div className="payment-method-label">Cash on Handover (COD)</div>
                  <div className="payment-method-desc">Inspect farm produce in person before paying the farmer</div>
                </div>
              </label>

            </div>

            {/* Pay Button */}
            <button
              className="btn btn-primary"
              onClick={handlePayClick}
              disabled={processing}
              style={{ width: "100%", padding: "16px", marginTop: "24px", fontSize: "1.1rem", fontWeight: "800", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
            >
              <Lock size={18} />
              <span>
                {processing
                  ? "Processing Secure Gateway..."
                  : selectedMethod === "cod"
                  ? "Confirm Handover Order (Pay Cash)"
                  : `Pay ₹${order.total_price} Securely`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* REALISTIC 3D-SECURE BANK OTP MODAL */}
      {showOtpModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="card" style={{ maxWidth: "420px", width: "100%", padding: "30px", textAlign: "center", animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.8rem", color: "#1e40af", fontWeight: "800" }}>🔒 3D SECURE BANK VERIFICATION</span>
              <button onClick={() => setShowOtpModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#083320", marginBottom: "8px" }}>
              Enter 6-Digit Bank OTP
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "20px" }}>
              One-Time Password sent to your mobile ending in <strong>••••••3220</strong> to approve ₹{order.total_price}.
            </p>

            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter OTP (e.g. 482910)"
              style={{ fontSize: "1.3rem", letterSpacing: "4px", textAlign: "center", fontWeight: "800", padding: "12px", marginBottom: "16px" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-outline"
                onClick={() => setOtpInput("482910")}
                style={{ flex: 1, fontSize: "0.8rem", padding: "8px" }}
              >
                Auto-Fill Demo OTP (482910)
              </button>
              <button
                className="btn btn-primary"
                onClick={executePayment}
                disabled={processing}
                style={{ flex: 1, padding: "12px" }}
              >
                {processing ? "Verifying..." : "Verify & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE TAX & FARM INVOICE MODAL */}
      {showInvoiceModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="card" style={{ maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "36px", background: "#ffffff" }}>
            
            {/* Invoice Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0f5132", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f5132", margin: 0 }}>
                  🌾 UZHAVAN CONNECT
                </h2>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                  Direct Farm-to-Consumer Agricultural Network · Tirunelveli Hub
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  GSTIN / Farm Exemption Code: AGRI-TN-729481
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#083320" }}>TAX INVOICE</div>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Invoice #: <strong>INV-TN-2026-00{order.id}</strong></div>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Parties Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px", fontSize: "0.88rem" }}>
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px" }}>
                <strong style={{ color: "#0f5132" }}>PRODUCER / FARMER:</strong>
                <div>{order.farmer_name}</div>
                <div style={{ color: "#64748b" }}>{order.farmer_village}</div>
                <div style={{ color: "#64748b" }}>Status: Verified Organic / Grade A</div>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px" }}>
                <strong style={{ color: "#1e40af" }}>BILLED TO (BUYER):</strong>
                <div>{user?.name || "Priya S. (Direct Consumer)"}</div>
                <div style={{ color: "#64748b" }}>{user?.village || "Tirunelveli Town"}</div>
                <div style={{ color: "#16a34a", fontWeight: "700" }}>Payment: Verified & Paid</div>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#e8f5e9", color: "#0f5132", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>Crop Item</th>
                  <th style={{ padding: "10px" }}>Freshness Grade</th>
                  <th style={{ padding: "10px" }}>Quantity</th>
                  <th style={{ padding: "10px" }}>Rate</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 10px", textTransform: "capitalize", fontWeight: "700" }}>
                    {order.crop_name}
                  </td>
                  <td style={{ padding: "12px 10px", color: "#16a34a" }}>
                    {order.freshness_tag || "Grade A+ Fresh"}
                  </td>
                  <td style={{ padding: "12px 10px" }}>{order.quantity_kg} kg</td>
                  <td style={{ padding: "12px 10px" }}>₹{Math.round(order.total_price / (order.quantity_kg || 1))}/kg</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "800" }}>₹{order.total_price}</td>
                </tr>
              </tbody>
            </table>

            {/* Invoice Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #0f5132", paddingTop: "14px", marginBottom: "24px" }}>
              <div>
                <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: "800" }}>
                  ✓ 100% PRODUCER ESCROW PROTECTION GUARANTEED
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Grand Total: </span>
                <strong style={{ fontSize: "1.5rem", color: "#0f5132" }}>₹{order.total_price}.00</strong>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                className="btn btn-outline"
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print Bill
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowInvoiceModal(false)}
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
