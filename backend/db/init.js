// Uzhavan Connect - Database initialization (SQLite, for local demo/dev)
const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = new Database(path.join(__dirname, "ullavan_connect.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('farmer','buyer','secondary_buyer','admin')),
    preferred_language TEXT DEFAULT 'ta',
    village TEXT,
    latitude REAL,
    longitude REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    crop_name TEXT NOT NULL,
    category TEXT DEFAULT 'vegetables',
    quantity_kg REAL NOT NULL,
    price_per_kg REAL NOT NULL,
    ai_suggested_price_min REAL,
    ai_suggested_price_max REAL,
    harvest_timestamp TEXT NOT NULL,
    freshness_tag TEXT,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active','sold','rescued','expired')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    quantity_kg REAL NOT NULL,
    total_price REAL NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
    order_status TEXT DEFAULT 'placed' CHECK (order_status IN ('placed','confirmed','delivered','cancelled')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS rescue_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    farmer_id INTEGER,
    crop_name TEXT,
    category TEXT DEFAULT 'vegetables',
    quantity_kg REAL DEFAULT 50,
    original_price REAL DEFAULT 30,
    discount_percent REAL DEFAULT 30,
    discount_price REAL DEFAULT 20,
    urgency_level TEXT DEFAULT 'high',
    urgency_hours INTEGER DEFAULT 24,
    triggered_reason TEXT,
    location_village TEXT,
    latitude REAL DEFAULT 8.7139,
    longitude REAL DEFAULT 77.7567,
    logistics_requested INTEGER DEFAULT 1,
    logistics_partner TEXT DEFAULT 'Nellai Agri Transport Co-op',
    logistics_status TEXT DEFAULT 'pending',
    admin_verified INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending_verification',
    buyer_id INTEGER,
    buyer_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Handle migration if rescue_alerts had older restrictive check constraint
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rescue_alerts_v2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER,
      farmer_id INTEGER,
      crop_name TEXT,
      category TEXT DEFAULT 'vegetables',
      quantity_kg REAL DEFAULT 50,
      original_price REAL DEFAULT 30,
      discount_percent REAL DEFAULT 30,
      discount_price REAL DEFAULT 20,
      urgency_level TEXT DEFAULT 'high',
      urgency_hours INTEGER DEFAULT 24,
      triggered_reason TEXT,
      location_village TEXT,
      latitude REAL DEFAULT 8.7139,
      longitude REAL DEFAULT 77.7567,
      logistics_requested INTEGER DEFAULT 1,
      logistics_partner TEXT DEFAULT 'Nellai Agri Transport Co-op',
      logistics_status TEXT DEFAULT 'pending',
      admin_verified INTEGER DEFAULT 1,
      status TEXT DEFAULT 'pending_verification',
      buyer_id INTEGER,
      buyer_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    DROP TABLE IF EXISTS rescue_alerts;
    ALTER TABLE rescue_alerts_v2 RENAME TO rescue_alerts;
  `);
} catch (e) {}

// Add category column if missing (backward compatibility)
try {
  db.exec("ALTER TABLE listings ADD COLUMN category TEXT DEFAULT 'vegetables'");
} catch (e) {}

// Seed initial realistic data if database is fresh or needs expansion
function seedDatabase() {
  const hash = bcrypt.hashSync("demo123", 10);
  const insertUser = db.prepare(`
    INSERT INTO users (name, phone, password_hash, role, village, latitude, longitude, preferred_language)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let u1 = db.prepare("SELECT id FROM users WHERE phone = '9876543210'").get();
  if (!u1) {
    const res = insertUser.run("Murugan K. (முத்து முருகன்)", "9876543210", hash, "farmer", "Alangulam, Tirunelveli", 8.7300, 77.7200, "ta");
    u1 = { id: res.lastInsertRowid };
  }

  let u2 = db.prepare("SELECT id FROM users WHERE phone = '9876543211'").get();
  if (!u2) {
    const res = insertUser.run("Selvam P. (செல்வம்)", "9876543211", hash, "farmer", "Ambasamudram", 8.7000, 77.4500, "ta");
    u2 = { id: res.lastInsertRowid };
  }

  let u3 = db.prepare("SELECT id FROM users WHERE phone = '9876543212'").get();
  if (!u3) {
    const res = insertUser.run("Arumugam N. (ஆறுமுகம்)", "9876543212", hash, "farmer", "Tenkasi", 8.9594, 77.3160, "ta");
    u3 = { id: res.lastInsertRowid };
  }

  let u4 = db.prepare("SELECT id FROM users WHERE phone = '9876543220'").get();
  if (!u4) {
    const res = insertUser.run("Priya S. (பிரியா)", "9876543220", hash, "buyer", "Tirunelveli Town", 8.7139, 77.7567, "en");
    u4 = { id: res.lastInsertRowid };
  }

  let u5 = db.prepare("SELECT id FROM users WHERE phone = '9876543230'").get();
  if (!u5) {
    const res = insertUser.run("Hotel Royal Residency", "9876543230", hash, "secondary_buyer", "Vannarpettai, Tirunelveli", 8.7250, 77.7400, "ta");
    u5 = { id: res.lastInsertRowid };
  }

  // Ensure Admin user exists for Developer Portal
  const adminExists = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
    const adminHash = bcrypt.hashSync("admin123", 10);
    insertUser.run("Platform Developer & Admin", "9999999999", adminHash, "admin", "HQ Command Center", 8.7139, 77.7567, "en");
  }

  const listingCount = db.prepare("SELECT COUNT(*) as count FROM listings").get().count;
  if (listingCount < 10) {
    console.log("🌱 Populating specialized Tamil Nadu agricultural listings...");
    const now = Date.now();
    const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

    const insertListing = db.prepare(`
      INSERT INTO listings (farmer_id, crop_name, category, quantity_kg, price_per_kg, ai_suggested_price_min, ai_suggested_price_max, harvest_timestamp, freshness_tag, latitude, longitude, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. Tubers (Yam, Tapioca, Sweet Potato, Colocasia, Farm Potato)
    insertListing.run(u1.id, "yam", "tubers", 150, 45, 42, 48, hoursAgo(4), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "tapioca", "tubers", 300, 25, 22, 28, hoursAgo(8), "fresh", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "sweet_potato", "tubers", 100, 38, 35, 42, hoursAgo(10), "fresh", 8.9550, 77.3200, "active");
    insertListing.run(u1.id, "colocasia", "tubers", 80, 52, 48, 55, hoursAgo(6), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "potato", "tubers", 220, 32, 28, 35, hoursAgo(5), "fresh", 8.7050, 77.4600, "active");

    // 2. Fruits (Mango, Guava, Banana, Papaya, Pomegranate)
    insertListing.run(u1.id, "mango", "fruits", 200, 95, 90, 105, hoursAgo(5), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "guava", "fruits", 90, 45, 40, 50, hoursAgo(3), "ultra-fresh", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "banana", "fruits", 180, 35, 32, 38, hoursAgo(2), "grade-a-fresh", 8.9550, 77.3200, "active");
    insertListing.run(u1.id, "papaya", "fruits", 120, 28, 25, 30, hoursAgo(7), "fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "pomegranate", "fruits", 75, 140, 130, 150, hoursAgo(4), "grade-a-fresh", 8.7050, 77.4600, "active");

    // 3. South Region Produce (Nell & Millets)
    insertListing.run(u1.id, "ponni_rice", "south_nell", 600, 34, 32, 36, hoursAgo(12), "traditional-crop", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "seeraga_samba", "south_nell", 250, 85, 80, 92, hoursAgo(16), "heritage-nell", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "karuppu_kavuni", "south_nell", 150, 120, 115, 130, hoursAgo(24), "medicinal-nell", 8.9550, 77.3200, "active");
    insertListing.run(u1.id, "ragi", "south_nell", 200, 40, 38, 44, hoursAgo(18), "fresh-millet", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "thooyamalli", "south_nell", 180, 75, 70, 80, hoursAgo(20), "heritage-nell", 8.7050, 77.4600, "active");

    // 4. Banana By-Products (Chips, Stem, Leaf, Flower, Fiber)
    insertListing.run(u1.id, "banana_chips", "banana_byproducts", 60, 220, 210, 240, hoursAgo(2), "fresh-farm-chips", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "banana_stem", "banana_byproducts", 90, 25, 20, 30, hoursAgo(3), "grade-a-fresh", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "banana_leaf", "banana_byproducts", 100, 15, 12, 18, hoursAgo(1), "harvest-fresh", 8.9550, 77.3200, "active");
    insertListing.run(u1.id, "banana_flower", "banana_byproducts", 80, 30, 25, 35, hoursAgo(4), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "banana_fiber", "banana_byproducts", 45, 180, 170, 200, hoursAgo(24), "eco-fiber", 8.7050, 77.4600, "active");

    // 5. Types of Keerai (Greens & Herbs)
    insertListing.run(u1.id, "murungai_keerai", "keerai", 60, 35, 30, 40, hoursAgo(2), "ultra-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "agathi_keerai", "keerai", 40, 30, 28, 35, hoursAgo(2), "ultra-fresh", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "siru_keerai", "keerai", 80, 20, 18, 24, hoursAgo(3), "ultra-fresh", 8.9550, 77.3200, "active");
    insertListing.run(u1.id, "palak_keerai", "keerai", 50, 28, 25, 32, hoursAgo(2), "ultra-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "vallarai_keerai", "keerai", 35, 45, 40, 50, hoursAgo(4), "medicinal-keerai", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "ponnanganni_keerai", "keerai", 55, 32, 30, 36, hoursAgo(3), "ultra-fresh", 8.9550, 77.3200, "active");

    // 6. Fresh Vegetables
    insertListing.run(u1.id, "tomato", "vegetables", 120, 26, 24, 28, hoursAgo(3), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "brinjal", "vegetables", 80, 32, 30, 35, hoursAgo(5), "grade-a-fresh", 8.7050, 77.4600, "active");
    insertListing.run(u3.id, "onion", "vegetables", 250, 42, 40, 45, hoursAgo(8), "fresh", 8.9550, 77.3200, "active");
    insertListing.run(u1.id, "okra", "vegetables", 75, 34, 32, 38, hoursAgo(4), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "drumstick", "vegetables", 90, 48, 45, 52, hoursAgo(3), "grade-a-fresh", 8.7050, 77.4600, "active");

    // 7. Newly Added Regional Specialties: Raw Mango & Black Gram
    insertListing.run(u1.id, "raw_mango", "fruits", 140, 40, 36, 44, hoursAgo(2), "grade-a-fresh", 8.7280, 77.7300, "active");
    insertListing.run(u2.id, "black_gram", "south_nell", 350, 95, 90, 100, hoursAgo(6), "traditional-crop", 8.7050, 77.4600, "active");

    console.log("✅ All specialized agricultural listings created successfully!");
  }

  // Ensure raw_mango and black_gram exist even on already initialized databases
  try {
    const insertListing = db.prepare(`
      INSERT INTO listings (farmer_id, crop_name, category, quantity_kg, price_per_kg, ai_suggested_price_min, ai_suggested_price_max, harvest_timestamp, freshness_tag, latitude, longitude, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const hasRawMango = db.prepare("SELECT id FROM listings WHERE crop_name = 'raw_mango'").get();
    if (!hasRawMango && u1) {
      insertListing.run(u1.id, "raw_mango", "fruits", 140, 40, 36, 44, new Date().toISOString(), "grade-a-fresh", 8.7280, 77.7300, "active");
    }
    const hasBlackGram = db.prepare("SELECT id FROM listings WHERE crop_name = 'black_gram'").get();
    if (!hasBlackGram && u2) {
      insertListing.run(u2.id, "black_gram", "south_nell", 350, 95, 90, 100, new Date().toISOString(), "traditional-crop", 8.7050, 77.4600, "active");
    }
  } catch (e) {}

  // Seed realistic Rescue Alerts if empty
  const rescueColumns = [
    "ALTER TABLE rescue_alerts ADD COLUMN farmer_id INTEGER",
    "ALTER TABLE rescue_alerts ADD COLUMN crop_name TEXT",
    "ALTER TABLE rescue_alerts ADD COLUMN category TEXT DEFAULT 'vegetables'",
    "ALTER TABLE rescue_alerts ADD COLUMN quantity_kg REAL DEFAULT 50",
    "ALTER TABLE rescue_alerts ADD COLUMN original_price REAL DEFAULT 30",
    "ALTER TABLE rescue_alerts ADD COLUMN discount_price REAL DEFAULT 20",
    "ALTER TABLE rescue_alerts ADD COLUMN urgency_level TEXT DEFAULT 'high'",
    "ALTER TABLE rescue_alerts ADD COLUMN urgency_hours INTEGER DEFAULT 24",
    "ALTER TABLE rescue_alerts ADD COLUMN location_village TEXT",
    "ALTER TABLE rescue_alerts ADD COLUMN latitude REAL DEFAULT 8.7139",
    "ALTER TABLE rescue_alerts ADD COLUMN longitude REAL DEFAULT 77.7567",
    "ALTER TABLE rescue_alerts ADD COLUMN logistics_requested INTEGER DEFAULT 1",
    "ALTER TABLE rescue_alerts ADD COLUMN logistics_partner TEXT DEFAULT 'Nellai Agri Transport Co-op'",
    "ALTER TABLE rescue_alerts ADD COLUMN logistics_status TEXT DEFAULT 'pending'",
    "ALTER TABLE rescue_alerts ADD COLUMN admin_verified INTEGER DEFAULT 1",
    "ALTER TABLE rescue_alerts ADD COLUMN buyer_id INTEGER",
    "ALTER TABLE rescue_alerts ADD COLUMN buyer_name TEXT"
  ];
  rescueColumns.forEach((sql) => {
    try { db.exec(sql); } catch (e) {}
  });

  const rescueCount = db.prepare("SELECT COUNT(*) as count FROM rescue_alerts").get().count;
  if (rescueCount < 5) {
    console.log("🚨 Seeding rich Rescue Alerts across categories...");
    const insertRescue = db.prepare(`
      INSERT INTO rescue_alerts (
        listing_id, farmer_id, crop_name, category, quantity_kg, original_price, discount_percent, discount_price, 
        urgency_level, urgency_hours, triggered_reason, location_village, latitude, longitude, 
        logistics_requested, logistics_partner, logistics_status, admin_verified, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. Tubers Rescue (Yam) - Published
    insertRescue.run(1, u1.id, "yam", "tubers", 200, 45, 40, 27, "critical", 12, "Surplus bumper harvest from Alangulam riverbank — requires bulk clearance", "Alangulam, Tirunelveli", 8.7280, 77.7300, 1, "Nellai Rural Logistics Co-op", "pickup_scheduled", 1, "published");

    // 2. Fruits Rescue (Salem Mangoes) - Published
    insertRescue.run(5, u1.id, "mango", "fruits", 150, 95, 50, 48, "critical", 10, "Peak ripeness Salem Alphonso — best for immediate fruit pulp & juices", "Alangulam, Tirunelveli", 8.7280, 77.7300, 1, "Madurai Express Agro-Van", "assigned", 1, "published");

    // 3. South Region Nell Rescue (Karuppu Kavuni) - Published
    insertRescue.run(11, u3.id, "karuppu_kavuni", "south_nell", 400, 120, 30, 84, "high", 36, "Pre-monsoon warehouse space clearance in Tenkasi farm", "Tenkasi", 8.9550, 77.3200, 1, "Tenkasi Farmer Freight Co-op", "pending", 1, "published");

    // 4. Banana Leaf Rescue - Published
    insertRescue.run(15, u3.id, "banana_leaf", "banana_byproducts", 100, 15, 40, 9, "high", 18, "Excess bundles harvested for canceled catering function", "Tenkasi", 8.9550, 77.3200, 1, "Nellai Agri Transport Co-op", "pickup_scheduled", 1, "published");

    // 5. Keerai Rescue (Murungai Keerai) - Published
    insertRescue.run(18, u1.id, "murungai_keerai", "keerai", 60, 35, 37, 22, "critical", 8, "Morning farm harvest tender moringa greens — must clear before sunset", "Alangulam, Tirunelveli", 8.7280, 77.7300, 1, "Alangulam Swift Mini-Truck", "in_transit", 1, "published");

    // 6. Pending Admin Verification (Tapioca)
    insertRescue.run(2, u2.id, "tapioca", "tubers", 300, 25, 40, 15, "high", 24, "Heavy rain forecast in Ambasamudram — fast rescue needed", "Ambasamudram", 8.7050, 77.4600, 1, "Pending Admin Verification", "pending", 0, "pending_verification");

    console.log("✅ Rescue Alerts seeded successfully!");
  }
}

seedDatabase();

module.exports = db;
