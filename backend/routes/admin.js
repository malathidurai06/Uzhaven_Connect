const express = require("express");
const db = require("../db/init");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Middleware: Admin access check
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admin developer privilege required." });
  }
  next();
}

// GET /api/admin/overview — Full developer dashboard data
router.get("/overview", authMiddleware, requireAdmin, (req, res) => {
  try {
    // 1. Metrics & Aggregates
    const farmerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'farmer'").get().count;
    const buyerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role IN ('buyer', 'secondary_buyer')").get().count;
    const totalListings = db.prepare("SELECT COUNT(*) as count FROM listings").get().count;
    const activeListings = db.prepare("SELECT COUNT(*) as count FROM listings WHERE status = 'active'").get().count;
    const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE payment_status = 'paid'").get().total;
    const totalKgSold = db.prepare("SELECT COALESCE(SUM(quantity_kg), 0) as total FROM orders").get().total;

    // 2. All Registered Farmers
    const farmers = db.prepare(`
      SELECT u.id, u.name, u.phone, u.village, u.created_at,
             COUNT(l.id) as total_listings,
             COALESCE(SUM(l.quantity_kg), 0) as total_produce_kg
      FROM users u
      LEFT JOIN listings l ON u.id = l.farmer_id
      WHERE u.role = 'farmer'
      GROUP BY u.id
      ORDER BY u.id DESC
    `).all();

    // 3. All Registered Buyers
    const buyers = db.prepare(`
      SELECT u.id, u.name, u.phone, u.village, u.role, u.created_at,
             COUNT(o.id) as total_orders,
             COALESCE(SUM(o.total_price), 0) as total_spend
      FROM users u
      LEFT JOIN orders o ON u.id = o.buyer_id
      WHERE u.role IN ('buyer', 'secondary_buyer')
      GROUP BY u.id
      ORDER BY u.id DESC
    `).all();

    // 4. All Listed Products (Crops)
    const products = db.prepare(`
      SELECT l.*, u.name as farmer_name, u.phone as farmer_phone, u.village as farmer_village
      FROM listings l
      JOIN users u ON l.farmer_id = u.id
      ORDER BY l.created_at DESC
    `).all();

    // 5. All Orders Placed
    const orders = db.prepare(`
      SELECT o.*, 
             l.crop_name, l.price_per_kg,
             b.name as buyer_name, b.phone as buyer_phone, b.village as buyer_village,
             f.name as farmer_name, f.phone as farmer_phone
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      JOIN users b ON o.buyer_id = b.id
      JOIN users f ON l.farmer_id = f.id
      ORDER BY o.created_at DESC
    `).all();

    res.json({
      summary: {
        total_farmers: farmerCount,
        total_buyers: buyerCount,
        total_listings: totalListings,
        active_listings: activeListings,
        total_orders: orderCount,
        total_revenue_inr: totalRevenue,
        total_kg_sold: totalKgSold,
      },
      farmers,
      buyers,
      products,
      orders,
    });
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({ error: "Failed to load admin overview data" });
  }
});

// DELETE /api/admin/users/:id — Remove a user
router.delete("/users/:id", authMiddleware, requireAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    // Don't allow deleting self admin
    if (Number(userId) === Number(req.user.id)) {
      return res.status(400).json({ error: "Cannot delete the active admin account" });
    }

    db.prepare("DELETE FROM users WHERE id = ?").run(userId);
    res.json({ success: true, message: `User #${userId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// DELETE /api/admin/listings/:id — Delete a product listing
router.delete("/listings/:id", authMiddleware, requireAdmin, (req, res) => {
  try {
    const listingId = req.params.id;
    db.prepare("DELETE FROM listings WHERE id = ?").run(listingId);
    res.json({ success: true, message: `Product #${listingId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product listing" });
  }
});

// PUT /api/admin/orders/:id/status — Update order status
router.put("/orders/:id/status", authMiddleware, requireAdmin, (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const orderId = req.params.id;

    if (order_status) {
      db.prepare("UPDATE orders SET order_status = ? WHERE id = ?").run(order_status, orderId);
    }
    if (payment_status) {
      db.prepare("UPDATE orders SET payment_status = ? WHERE id = ?").run(payment_status, orderId);
    }

    res.json({ success: true, message: `Order #${orderId} updated` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;
