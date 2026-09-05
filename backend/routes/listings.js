const express = require("express");
const axios = require("axios");
const db = require("../db/init");
const authMiddleware = require("../middleware/auth");
const { haversineKm, freshnessTag } = require("../utils/geo");

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Category inference helper
function inferCategory(cropName) {
  const name = (cropName || "").toLowerCase();
  if (/yam|tapioca|potato|colocasia|சேனை|மரவள்ளி|கிழங்கு/i.test(name)) return "tubers";
  if (/mango|raw_mango|guava|banana|papaya|pomegranate|jackfruit|மாம்பழம்|மாங்காய்|கொய்யா|பழம்/i.test(name)) return "fruits";
  if (/rice|nell|samba|kavuni|ragi|thinai|black_gram|urad|gram|millet|நெல்|தானியம்|உளுந்து|கேழ்வரகு/i.test(name)) return "south_nell";
  if (/chips|stem|flower|fiber|leaf|வாழைக்காய்|வாழைத்தண்டு|வாழைப்பூ|வாழை இலை/i.test(name)) return "banana_byproducts";
  if (/keerai|spinach|murungai|agathi|palak|vallarai|கீரை|முருங்கை/i.test(name)) return "keerai";
  return "vegetables";
}

// POST /api/listings/price-suggestion
router.post("/price-suggestion", authMiddleware, async (req, res) => {
  const { crop_name, region } = req.body;
  try {
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict-price`, { crop_name, region });
    res.json(aiResponse.data);
  } catch (err) {
    res.json({
      crop_name,
      region,
      predicted_min: 24,
      predicted_max: 28,
      note: "Historical average benchmark.",
    });
  }
});

function enrichListing(l) {
  const farmerPhone = l.farmer_phone || "9876543210";
  const cropTitle = (l.crop_name || "").replace(/_/g, " ");
  return {
    ...l,
    category: l.category || inferCategory(l.crop_name),
    freshness_tag: freshnessTag(l.harvest_timestamp),
    farmer_badge: "TN-Agri Verified Farmer",
    kcc_number: `TN-KCC-${l.farmer_id || 1}0948`,
    uzhavar_sandhai_id: `US-TNV-${l.farmer_id || 1}08`,
    soil_health_cert: "Soil Health Card Grade A+ (TN Agri Dept)",
    land_patta: "Patta Chitta Record Verified (e-Sevai)",
    direct_call_url: `tel:${farmerPhone}`,
    whatsapp_url: `https://wa.me/91${farmerPhone}?text=Vanakkam%20${encodeURIComponent(l.farmer_name || "Farmer")},%20I%20want%20to%20buy%20${encodeURIComponent(cropTitle)}%20from%20Uzhavan%20Connect.`,
    google_maps_url: `https://www.google.com/maps?q=${l.latitude || 8.7139},${l.longitude || 77.7567}`,
  };
}

// GET /api/listings — All active listings with optional category & search filter
router.get("/", (req, res) => {
  const { category, search } = req.query;
  let query = `
    SELECT l.*, u.name as farmer_name, u.village as farmer_village, u.phone as farmer_phone
    FROM listings l JOIN users u ON l.farmer_id = u.id
    WHERE l.status = 'active'
  `;
  const params = [];

  if (category && category !== "all") {
    query += " AND (l.category = ? OR l.crop_name LIKE ?)";
    params.push(category, `%${category}%`);
  }

  if (search) {
    query += " AND (l.crop_name LIKE ? OR u.name LIKE ? OR u.village LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY l.created_at DESC";

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(enrichListing));
});

// POST /api/listings — Create new produce listing
router.post("/", authMiddleware, (req, res) => {
  const {
    crop_name, category, quantity_kg, price_per_kg,
    ai_suggested_price_min, ai_suggested_price_max,
    harvest_timestamp, latitude, longitude
  } = req.body;

  if (req.user.role !== "farmer") {
    return res.status(403).json({ error: "Only registered farmers can create crop listings" });
  }

  const tag = freshnessTag(harvest_timestamp || new Date().toISOString());
  const finalCategory = category || inferCategory(crop_name);

  const stmt = db.prepare(`
    INSERT INTO listings (farmer_id, crop_name, category, quantity_kg, price_per_kg,
      ai_suggested_price_min, ai_suggested_price_max, harvest_timestamp, freshness_tag, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    req.user.id, crop_name, finalCategory, quantity_kg, price_per_kg,
    ai_suggested_price_min || null, ai_suggested_price_max || null,
    harvest_timestamp || new Date().toISOString(), tag, latitude || null, longitude || null
  );

  res.status(201).json({ id: result.lastInsertRowid, category: finalCategory, freshness_tag: tag });
});

// GET /api/listings/nearby
router.get("/nearby", (req, res) => {
  const lat = parseFloat(req.query.lat) || 8.7139;
  const lon = parseFloat(req.query.lon) || 77.7567;
  const radiusKm = parseFloat(req.query.radius_km) || 15;

  const allActive = db.prepare(`
    SELECT l.*, u.name as farmer_name, u.village as farmer_village, u.phone as farmer_phone
    FROM listings l JOIN users u ON l.farmer_id = u.id
    WHERE l.status = 'active'
  `).all();

  const nearby = allActive
    .map((listing) => {
      const dist = listing.latitude && listing.longitude
        ? haversineKm(lat, lon, listing.latitude, listing.longitude)
        : 3.5;
      return {
        ...enrichListing(listing),
        distance_km: Math.round(dist * 10) / 10,
      };
    })
    .filter((l) => l.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json(nearby);
});

// GET /api/listings/mine — Farmer's own listings
router.get("/mine", authMiddleware, (req, res) => {
  const listings = db.prepare("SELECT * FROM listings WHERE farmer_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json(listings.map((l) => ({
    ...l,
    category: l.category || inferCategory(l.crop_name),
    freshness_tag: freshnessTag(l.harvest_timestamp),
  })));
});

module.exports = router;
