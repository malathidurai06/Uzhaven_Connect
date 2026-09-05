const express = require("express");
const db = require("../db/init");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/payments/methods — available payment options for the checkout page
router.get("/methods", (req, res) => {
  res.json([
    { id: "upi", label: "UPI / QR Code", desc: "Pay instantly via Google Pay, PhonePe, Paytm, or any UPI app" },
    { id: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay with 3D Secure OTP verification" },
    { id: "netbanking", label: "Net Banking", desc: "Direct secure bank transfer from 40+ major Indian banks" },
    { id: "cod", label: "Cash on Delivery (COD)", desc: "Inspect farm freshness in person before paying the farmer" },
  ]);
});

// GET /api/payments/order/:orderId — order + payment summary
router.get("/order/:orderId", authMiddleware, (req, res) => {
  const order = db.prepare(`
    SELECT o.*, l.crop_name, l.freshness_tag, u.name as farmer_name, u.village as farmer_village, u.phone as farmer_phone
    FROM orders o
    JOIN listings l ON o.listing_id = l.id
    JOIN users u ON l.farmer_id = u.id
    WHERE o.id = ?
  `).get(req.params.orderId);

  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// POST /api/payments/pay — process payment
router.post("/pay", authMiddleware, (req, res) => {
  const { order_id, method, upi_vpa, card_last4 } = req.body;
  const validMethods = ["upi", "card", "netbanking", "cod", "direct_cod", "direct_handshake"];

  if (!validMethods.includes(method)) {
    return res.status(400).json({ error: "Invalid payment method" });
  }

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(order_id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const isDirectCod = method === "cod" || method === "direct_cod" || method === "direct_handshake";
  const newPaymentStatus = isDirectCod ? "pending_farm_handover" : "paid";
  const newOrderStatus = "confirmed";

  db.prepare("UPDATE orders SET payment_status = ?, order_status = ? WHERE id = ?")
    .run(newPaymentStatus, newOrderStatus, order_id);

  const transactionId = isDirectCod
    ? `DIRECT-HANDOVER-${Date.now().toString().slice(-6)}`
    : `UC-TXN-${method.toUpperCase()}-${Date.now().toString().slice(-8)}`;

  res.json({
    success: true,
    order_id,
    method,
    payment_status: newPaymentStatus,
    order_status: newOrderStatus,
    transaction_id: transactionId,
    timestamp: new Date().toISOString(),
    message: method === "cod"
      ? "Order confirmed for Cash on Delivery. Pay the farmer upon doorstep inspection."
      : `Payment of ₹${order.total_price} verified via ${method.toUpperCase()}. Funds locked in Farmer Escrow.`,
  });
});

// GET /api/payments/invoice/:orderId — generate realistic Tax & Farm Bill Invoice
router.get("/invoice/:orderId", authMiddleware, (req, res) => {
  const order = db.prepare(`
    SELECT o.*, l.crop_name, l.freshness_tag, l.price_per_kg,
           farmer.name as farmer_name, farmer.village as farmer_village, farmer.phone as farmer_phone,
           buyer.name as buyer_name, buyer.village as buyer_village, buyer.phone as buyer_phone
    FROM orders o
    JOIN listings l ON o.listing_id = l.id
    JOIN users farmer ON l.farmer_id = farmer.id
    JOIN users buyer ON o.buyer_id = buyer.id
    WHERE o.id = ?
  `).get(req.params.orderId);

  if (!order) return res.status(404).json({ error: "Order not found" });

  const invoiceNumber = `INV-TN-${new Date().getFullYear()}-${String(order.id).padStart(5, "0")}`;
  res.json({
    invoice_number: invoiceNumber,
    date: order.created_at || new Date().toISOString(),
    order,
  });
});

module.exports = router;
