const express = require("express");
const db = require("../db/init");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/orders — buyer places an order against a listing
router.post("/", authMiddleware, (req, res) => {
  const { listing_id, quantity_kg } = req.body;

  const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(listing_id);
  if (!listing || listing.status !== "active") {
    return res.status(400).json({ error: "Listing not available" });
  }
  if (quantity_kg > listing.quantity_kg) {
    return res.status(400).json({ error: "Requested quantity exceeds available stock" });
  }

  const total_price = quantity_kg * listing.price_per_kg;

  const insert = db.prepare(`
    INSERT INTO orders (listing_id, buyer_id, quantity_kg, total_price, payment_status, order_status)
    VALUES (?, ?, ?, ?, 'pending', 'placed')
  `);
  const result = insert.run(listing_id, req.user.id, quantity_kg, total_price);

  // Reduce remaining stock; mark sold if fully consumed
  const remaining = listing.quantity_kg - quantity_kg;
  if (remaining <= 0) {
    db.prepare("UPDATE listings SET status = 'sold', quantity_kg = 0 WHERE id = ?").run(listing_id);
  } else {
    db.prepare("UPDATE listings SET quantity_kg = ? WHERE id = ?").run(remaining, listing_id);
  }

  res.status(201).json({ id: result.lastInsertRowid, total_price, order_status: "placed" });
});

// GET /api/orders/mine — orders placed by the logged-in buyer, OR
// orders received against the logged-in farmer's listings
router.get("/mine", authMiddleware, (req, res) => {
  if (req.user.role === "farmer") {
    const rows = db.prepare(`
      SELECT o.*, l.crop_name, u.name as buyer_name
      FROM orders o
      JOIN listings l ON o.listing_id = l.id
      JOIN users u ON o.buyer_id = u.id
      WHERE l.farmer_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id);
    return res.json(rows);
  }

  const rows = db.prepare(`
    SELECT o.*, l.crop_name, u.name as farmer_name
    FROM orders o
    JOIN listings l ON o.listing_id = l.id
    JOIN users u ON l.farmer_id = u.id
    WHERE o.buyer_id = ?
    ORDER BY o.created_at DESC
  `).all(req.user.id);
  res.json(rows);
});

// PATCH /api/orders/:id/status — simple status update (e.g., mark paid/delivered)
router.patch("/:id/status", authMiddleware, (req, res) => {
  const { payment_status, order_status } = req.body;
  db.prepare(`
    UPDATE orders SET
      payment_status = COALESCE(?, payment_status),
      order_status = COALESCE(?, order_status)
    WHERE id = ?
  `).run(payment_status || null, order_status || null, req.params.id);
  res.json({ updated: true });
});

module.exports = router;
