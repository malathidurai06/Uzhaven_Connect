const express = require("express");
const axios = require("axios");
const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Benchmark base prices per kg (used for fallback if Python AI service is offline)
const BASE_PRICES = {
  tomato: 26, brinjal: 32, onion: 42, carrot: 38,
  cabbage: 22, potato: 28, beans: 54, okra: 35,
  banana: 30, coconut: 25, drumstick: 48,
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
  const crop = (crop_name || "tomato").toLowerCase();
  try {
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict-price`, { crop_name, region }, { timeout: 2500 });
    return res.json(aiResponse.data);
  } catch (err) {
    const base = BASE_PRICES[crop] || 30;
    const min = Math.round(base * 0.92);
    const max = Math.round(base * 1.12);
    return res.json({
      crop_name: crop,
      region: region || "Tirunelveli",
      predicted_min: min,
      predicted_max: max,
      mandi_avg_price: Math.round(base * 0.78),
      direct_profit_gain_pct: 26,
      model_version: "v1-random-forest-regressor",
      is_fallback: true,
    });
  }
});

// POST /api/ai/voice-command — proxies audio/text to the AI service's speech + NLP pipeline
router.post("/voice-command", async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/voice-command`, req.body, { timeout: 2500 });
    return res.json(response.data);
  } catch (err) {
    const text = (req.body.transcript || "").toLowerCase();
    const TAMIL_MAP = {
      "தக்காளி": "tomato", "tomato": "tomato",
      "கத்தரிக்காய்": "brinjal", "brinjal": "brinjal",
      "வெங்காயம்": "onion", "onion": "onion",
      "கேரட்": "carrot", "carrot": "carrot",
      "முட்டைகோஸ்": "cabbage", "cabbage": "cabbage",
      "உருளைக்கிழங்கு": "potato", "potato": "potato",
      "பீன்ஸ்": "beans", "beans": "beans",
      "வெண்டைக்காய்": "okra", "okra": "okra",
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

    let intent = "unknown";
    if (text.includes("விலை") || text.includes("price") || text.includes("rate") || text.includes("cost")) {
      intent = "check_price";
    } else if (text.includes("ஆர்டர்") || text.includes("order") || text.includes("status")) {
      intent = "check_order_status";
    } else if (text.includes("விற்க") || text.includes("sell") || text.includes("list") || text.includes("add")) {
      intent = "list_crop";
    }

    return res.json({
      transcript: req.body.transcript,
      language: req.body.language || "ta",
      parsed: {
        intent,
        crop_name: detected_crop,
        quantity_kg,
      },
      is_fallback: true,
    });
  }
});

module.exports = router;
