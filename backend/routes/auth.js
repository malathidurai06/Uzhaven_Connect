const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/init");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "uzhavan_connect_secure_jwt_secret_2026";
const TOKEN_EXPIRY = "30d"; // Long-lived 30-day session prevents accidental expiration

// Helper to generate signed JWT
function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, phone: user.phone },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, phone, password, role, village, latitude, longitude, preferred_language } = req.body;
  if (!name || !phone || !password || !role) {
    return res.status(400).json({ error: "Name, phone, password, and role are required" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE phone = ?").get(phone);
  if (existing) return res.status(409).json({ error: "Phone number already registered" });

  const password_hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(`
    INSERT INTO users (name, phone, password_hash, role, village, latitude, longitude, preferred_language)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    name, phone, password_hash, role, village || null,
    latitude || 8.7139, longitude || 77.7567, preferred_language || "ta"
  );

  const newUser = { id: result.lastInsertRowid, name, phone, role, village };
  const token = createToken(newUser);

  res.status(201).json({ token, user: newUser });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  if (!user) return res.status(401).json({ error: "Invalid phone number or password" });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid phone number or password" });

  const token = createToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role, village: user.village },
  });
});

// POST /api/auth/demo-login — Instant reliable authentication for demo roles
router.post("/demo-login", (req, res) => {
  const { role, phone } = req.body;
  let user = null;

  if (phone) {
    user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  } else if (role) {
    user = db.prepare("SELECT * FROM users WHERE role = ? LIMIT 1").get(role);
  }

  if (!user) {
    // Fallback seed user lookup
    user = db.prepare("SELECT * FROM users LIMIT 1").get();
  }

  if (!user) {
    return res.status(404).json({ error: "Demo user not found" });
  }

  const token = createToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role, village: user.village },
  });
});

// GET /api/auth/verify — Verify token validity and return current user
router.get("/verify", (req, res) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "No token provided" });

  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare("SELECT id, name, phone, role, village FROM users WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ valid: true, user });
  } catch (err) {
    res.status(401).json({ error: "Token expired or invalid", code: "TOKEN_EXPIRED" });
  }
});

module.exports = router;
