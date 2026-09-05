const jwt = require("jsonwebtoken");
const db = require("../db/init");

const JWT_SECRET = process.env.JWT_SECRET || "uzhavan_connect_secure_jwt_secret_2026";

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ error: "Authentication token required", code: "NO_TOKEN" });
  }

  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();

  // If token is mock demo string, auto-resolve with matching role
  if (token === "mock_demo_jwt_token" || token === "demo_token") {
    const defaultFarmer = db.prepare("SELECT id, role, name, phone FROM users WHERE role = 'farmer' LIMIT 1").get();
    req.user = defaultFarmer || { id: 1, role: "farmer", name: "Murugan K." };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // If token expired or invalid, check if user ID can be verified or return clear code
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please re-authenticate.", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid authentication token", code: "INVALID_TOKEN" });
  }
}

module.exports = authMiddleware;
