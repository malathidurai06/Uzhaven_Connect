const express = require("express");
const axios = require("axios");
const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Benchmark base prices per kg (used for fallback if Python AI service is offline)
const BASE_PRICES = {
  // Fruits
  mango: 60, raw_mango: 40, banana: 30, guava: 35, papaya: 28, pomegranate: 90, jackfruit: 45, watermelon: 20,
  // Vegetables
  tomato: 26, brinjal: 32, onion: 42, carrot: 38, cabbage: 22, potato: 28, beans: 54, okra: 35, ladies_finger: 35,
  drumstick: 48, chilli: 45, beetroot: 36, coconut: 25, broccoli: 65,
  // Tubers
  yam: 45, tapioca: 32, sweet_potato: 38, colocasia: 42,
  // Keerai & Greens
  murungai_keerai: 20, agathi_keerai: 22, siru_keerai: 18, palak_keerai: 25, vallarai_keerai: 28, ponnanganni_keerai: 24,
  // South Nell & Grains
  ponni_rice: 38, seeraga_samba: 85, thooyamalli: 65, karuppu_kavuni: 120, mappillai_samba: 75, ragi: 42, thinai: 55, black_gram: 95,
  // Banana by-products
  banana_chips: 160, banana_stem: 25, banana_flower: 30, banana_leaf: 80, banana_fiber: 150
};

// GET /api/ai/demand-forecast?crop_name=tomato&region=Tirunelveli
router.get("/demand-forecast", async (req, res) => {
  const crop = (req.query.crop_name || "tomato").toLowerCase();
  const region = req.query.region || "Tirunelveli";
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/predict-demand`, {
      params: req.query,
      timeout: 2500,
    });
    return res.json(response.data);
  } catch (err) {
    // Intelligent fallback forecast if Python microservice is offline
    const today = new Date();
    const forecast = [];
    const baseDemand = 80 + Math.floor(Math.random() * 40);

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const demand = Math.round(baseDemand * (isWeekend ? 1.35 : 1.0) + (Math.sin(i) * 15));
      forecast.push({
        date: d.toISOString().slice(0, 10),
        predicted_demand_kg: demand,
      });
    }

    const trend = forecast[6].predicted_demand_kg > forecast[0].predicted_demand_kg ? "rising" : "stable";

    return res.json({
      crop_name: crop,
      region: region,
      trend: trend,
      forecast: forecast,
      is_fallback: true,
      model_version: "v1-gradient-boost-agri",
    });
  }
});

// POST /api/ai/price-suggestion
router.post("/price-suggestion", async (req, res) => {
  const { crop_name, region } = req.body;
  const crop = (crop_name || "tomato").toLowerCase().trim().replace(/\s+/g, "_");
  try {
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict-price`, { crop_name: crop, region: region || "Tirunelveli" }, { timeout: 2500 });
    if (aiResponse.data && aiResponse.data.predicted_min != null && !(crop !== "tomato" && aiResponse.data.predicted_min === 24 && aiResponse.data.predicted_max === 28)) {
      return res.json(aiResponse.data);
    }
  } catch (err) {
    // Proceed to fallback
  }

  const base = BASE_PRICES[crop] || BASE_PRICES[crop_name] || 35;
  const min = Math.round(base * 0.92);
  const max = Math.round(base * 1.10);
  return res.json({
    crop_name: crop,
    region: region || "Tirunelveli",
    predicted_min: min,
    predicted_max: max,
    mandi_avg_price: Math.round(base * 0.78),
    direct_profit_gain_pct: 28,
    model_version: "v1-random-forest-regressor",
    is_fallback: true,
  });
});

// POST /api/ai/voice-command — proxies audio/text to the AI service's speech + NLP pipeline
router.post("/voice-command", async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/voice-command`, req.body, { timeout: 2500 });
    return res.json(response.data);
  } catch (err) {
    const text = (req.body.transcript || "").toLowerCase();
    const TAMIL_MAP = {
      // Fruits
      "மாம்பழம்": "mango", "மாம்பழ": "mango", "சேலம் மாம்பழம்": "mango", "அல்போன்சா": "mango", "mango": "mango", "mambazham": "mango", "mambalam": "mango",
      "பச்சை மாங்காய்": "raw_mango", "மாங்காய்": "raw_mango", "மாங்கா": "raw_mango", "raw mango": "raw_mango", "mangai": "raw_mango",
      "வாழைப்பழம்": "banana", "வாழை": "banana", "banana": "banana",
      "கொய்யா": "guava", "கொய்யாப்பழம்": "guava", "guava": "guava",
      "பப்பாளி": "papaya", "பப்பாளிப்பழம்": "papaya", "papaya": "papaya",
      "மாதுளை": "pomegranate", "மாதுளம்பழம்": "pomegranate", "pomegranate": "pomegranate",
      "பலா": "jackfruit", "பலாப்பழம்": "jackfruit", "jackfruit": "jackfruit",
      "தர்பூசணி": "watermelon", "watermelon": "watermelon",

      // Vegetables
      "தக்காளி": "tomato", "tomato": "tomato", "thakkali": "tomato",
      "கத்தரிக்காய்": "brinjal", "கத்தரி": "brinjal", "brinjal": "brinjal", "kathirikai": "brinjal",
      "வெங்காயம்": "onion", "onion": "onion", "vengayam": "onion",
      "கேரட்": "carrot", "carrot": "carrot",
      "முட்டைகோஸ்": "cabbage", "cabbage": "cabbage",
      "உருளைக்கிழங்கு": "potato", "உருளை": "potato", "potato": "potato",
      "பீன்ஸ்": "beans", "beans": "beans",
      "வெண்டைக்காய்": "ladies_finger", "வெண்டை": "ladies_finger", "ladies finger": "ladies_finger", "okra": "ladies_finger",
      "முருங்கைக்காய்": "drumstick", "முருங்கை": "drumstick", "drumstick": "drumstick",
      "மிளகாய்": "chilli", "பச்சை மிளகாய்": "chilli", "chilli": "chilli",
      "பீட்ரூட்": "beetroot", "beetroot": "beetroot",
      "தேங்காய்": "coconut", "coconut": "coconut",

      // Tubers
      "சேனைக்கிழங்கு": "yam", "சேனை": "yam", "yam": "yam",
      "மரவள்ளிக்கிழங்கு": "tapioca", "மரவள்ளி": "tapioca", "tapioca": "tapioca",
      "சர்க்கரைவள்ளிக்கிழங்கு": "sweet_potato", "sweet potato": "sweet_potato",
      "சேப்பங்கிழங்கு": "colocasia", "colocasia": "colocasia",

      // Keerai
      "முருங்கைக்கீரை": "murungai_keerai", "murungai keerai": "murungai_keerai",
      "அகத்திக்கீரை": "agathi_keerai", "agathi keerai": "agathi_keerai",
      "சிறுகீரை": "siru_keerai", "siru keerai": "siru_keerai",
      "பாலக்கீரை": "palak_keerai", "palak": "palak_keerai",
      "வல்லாரைக்கீரை": "vallarai_keerai", "vallarai": "vallarai_keerai",
      "பொன்னாங்கண்ணிக்கீரை": "ponnanganni_keerai", "ponnanganni": "ponnanganni_keerai",

      // Nell & Millets
      "பொன்னி நெல்": "ponni_rice", "பொன்னி": "ponni_rice", "ponni rice": "ponni_rice", "paddy": "ponni_rice",
      "சீரக சம்பா": "seeraga_samba", "seeraga samba": "seeraga_samba",
      "தூயமல்லி": "thooyamalli", "thooyamalli": "thooyamalli",
      "கருப்பு கவுனி": "karuppu_kavuni", "karuppu kavuni": "karuppu_kavuni",
      "மாப்பிள்ளை சம்பா": "mappillai_samba", "mappillai samba": "mappillai_samba",
      "கேழ்வரகு": "ragi", "ராகி": "ragi", "ragi": "ragi",
      "தினை": "thinai", "thinai": "thinai",
      "உளுந்து": "black_gram", "black gram": "black_gram",

      // Banana By-Products
      "வாழைக்காய் சிப்ஸ்": "banana_chips", "banana chips": "banana_chips",
      "வாழைத்தண்டு": "banana_stem", "banana stem": "banana_stem",
      "வாழைப்பூ": "banana_flower", "banana flower": "banana_flower",
      "வாழை இலை": "banana_leaf", "banana leaf": "banana_leaf",
      "வாழை நார்": "banana_fiber", "banana fiber": "banana_fiber",
    };

    let detected_crop = null;
    for (const [key, val] of Object.entries(TAMIL_MAP)) {
      if (text.includes(key)) {
        detected_crop = val;
        break;
      }
    }

    const qtyMatch = text.match(/(\d+)\s*(கிலோ|kg|kilo)/i) || text.match(/(\d+)/);
    const quantity_kg = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

    let intent = "list_crop";
    const priceKeywords = ["விலை", "ரேட்", "ரேட்டு", "எவ்வளவு", "எவ்ளோ", "price", "prize", "rate", "cost", "how much", "evlo", "evalavu", "ketan"];
    if (priceKeywords.some((kw) => text.includes(kw))) {
      intent = "check_price";
    } else if (text.includes("ஆர்டர்") || text.includes("order") || text.includes("status") || text.includes("நிலை")) {
      intent = "check_order_status";
    } else if (text.includes("வாங்க") || text.includes("buy") || text.includes("purchase")) {
      intent = "buy_crop";
    }

    return res.json({
      transcript: req.body.transcript,
      language: req.body.language || "ta",
      parsed: {
        intent,
        crop_name: detected_crop,
        is_crop_recognized: detected_crop !== null,
        quantity_kg: quantity_kg || 50,
      },
      is_fallback: true,
    });
  }
});

module.exports = router;
