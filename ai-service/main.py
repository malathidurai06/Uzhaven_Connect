"""
Uzhavan Connect - AI Service (FastAPI)

Exposes three capabilities to the Node.js backend:
  1. POST /predict-price     -> AI Smart Price Recommendation
  2. GET  /predict-demand    -> AI Demand Prediction (7-day forecast)
  3. POST /voice-command     -> Tamil Voice Assistant (speech-to-text + intent parsing)

Run with:  uvicorn main:app --reload --port 8000
"""
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from datetime import date, timedelta
# pyrefly: ignore [missing-import]
import joblib
import os
import re

app = FastAPI(title="Uzhavan Connect AI Service")

# Allow CORS for frontend and backend integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PRICE_MODEL_PATH = os.path.join(BASE_DIR, "models", "price_model.joblib")
DEMAND_MODEL_PATH = os.path.join(BASE_DIR, "models", "demand_model.joblib")

price_bundle = joblib.load(PRICE_MODEL_PATH) if os.path.exists(PRICE_MODEL_PATH) else None
demand_bundle = joblib.load(DEMAND_MODEL_PATH) if os.path.exists(DEMAND_MODEL_PATH) else None


class PriceRequest(BaseModel):
    crop_name: str
    region: str


class VoiceCommandRequest(BaseModel):
    transcript: str
    language: str = "ta"


@app.get("/")
def root():
    return {
        "status": "Uzhavan Connect AI Service running",
        "price_model_loaded": price_bundle is not None,
        "demand_model_loaded": demand_bundle is not None,
    }


@app.post("/predict-price")
def predict_price(req: PriceRequest):
    if price_bundle is None:
        return {
            "crop_name": req.crop_name,
            "region": req.region,
            "predicted_min": 24.0,
            "predicted_max": 28.0,
            "note": "Defaulting to historical median baseline.",
        }

    model = price_bundle["model"]
    crop_encoder = price_bundle["crop_encoder"]
    region_encoder = price_bundle["region_encoder"]

    today = date.today()
    try:
        crop_encoded = crop_encoder.transform([req.crop_name.lower()])[0]
        region_encoded = region_encoder.transform([req.region])[0]
    except (ValueError, KeyError):
        return {
            "crop_name": req.crop_name,
            "region": req.region,
            "predicted_min": 24.0,
            "predicted_max": 28.0,
            "note": "Unknown crop or region for the current model. Using regional baseline.",
        }

    features = [[crop_encoded, region_encoded, today.month, 1.0]]  # demand_index defaulted to 1.0 (average)
    predicted_price = float(model.predict(features)[0])

    return {
        "crop_name": req.crop_name,
        "region": req.region,
        "predicted_min": round(predicted_price * 0.92, 2),
        "predicted_max": round(predicted_price * 1.08, 2),
        "model_version": "v1-random-forest",
    }


@app.get("/predict-demand")
def predict_demand(crop_name: str, region: str):
    today = date.today()
    if demand_bundle is None:
        # Fallback baseline forecast
        forecast = [
            {"date": (today + timedelta(days=i + 1)).isoformat(), "predicted_demand_kg": round(120.0 + i * 5, 1)}
            for i in range(7)
        ]
        return {"crop_name": crop_name, "region": region, "trend": "stable", "forecast": forecast}

    model = demand_bundle["model"]
    crop_encoder = demand_bundle["crop_encoder"]
    region_encoder = demand_bundle["region_encoder"]

    try:
        crop_encoded = crop_encoder.transform([crop_name.lower()])[0]
        region_encoded = region_encoder.transform([region])[0]
    except (ValueError, KeyError):
        forecast = [
            {"date": (today + timedelta(days=i + 1)).isoformat(), "predicted_demand_kg": round(100.0 + i * 4, 1)}
            for i in range(7)
        ]
        return {"crop_name": crop_name, "region": region, "trend": "stable", "forecast": forecast}

    forecast = []
    for i in range(7):
        target_date = today + timedelta(days=i + 1)
        features = [[crop_encoded, region_encoded, target_date.month, target_date.weekday()]]
        predicted_kg = float(model.predict(features)[0])
        forecast.append({
            "date": target_date.isoformat(),
            "predicted_demand_kg": round(predicted_kg, 1),
        })

    avg_first_half = sum(f["predicted_demand_kg"] for f in forecast[:3]) / 3
    avg_second_half = sum(f["predicted_demand_kg"] for f in forecast[4:]) / 3
    trend = "rising" if avg_second_half > avg_first_half * 1.05 else \
            "falling" if avg_second_half < avg_first_half * 0.95 else "stable"

    return {"crop_name": crop_name, "region": region, "trend": trend, "forecast": forecast}


# ---------------------------------------------------------------------------
# Tamil Voice Assistant — intent parsing
# ---------------------------------------------------------------------------

KNOWN_CROPS = {
    # Vegetables & Okra
    "வெண்டைக்காய்": "ladies_finger",
    "வெண்டை": "ladies_finger",
    "வெண்டிங்காய்": "ladies_finger",
    "வெண்டிங்காக": "ladies_finger",
    "வெண்டிங்கா": "ladies_finger",
    "வெண்டக்காய்": "ladies_finger",
    "வெண்டக்கா": "ladies_finger",
    "ladies finger": "ladies_finger",
    "lady finger": "ladies_finger",
    "okra": "ladies_finger",
    "vendaikai": "ladies_finger",
    "vendakkai": "ladies_finger",

    # Tomato
    "தக்காளி": "tomato",
    "நாட்டு தக்காளி": "tomato",
    "தக்காளி பழம்": "tomato",
    "tomato": "tomato",
    "thakkali": "tomato",

    # Brinjal
    "கத்தரிக்காய்": "brinjal",
    "கத்தரி": "brinjal",
    "கத்திரிக்காய்": "brinjal",
    "brinjal": "brinjal",
    "kathirikai": "brinjal",

    # Onion
    "வெங்காயம்": "onion",
    "சின்ன வெங்காயம்": "onion",
    "பெரிய வெங்காயம்": "onion",
    "onion": "onion",
    "vengayam": "onion",

    # Drumstick
    "முருங்கைக்காய்": "drumstick",
    "முருங்கை": "drumstick",
    "drumstick": "drumstick",

    # Tubers
    "சேனைக்கிழங்கு": "yam",
    "சேனை கிழங்கு": "yam",
    "சேனை": "yam",
    "கருணைக்கிழங்கு": "yam",
    "yam": "yam",
    "senai": "yam",
    "senaikilangu": "yam",
    "மரவள்ளிக்கிழங்கு": "tapioca",
    "மரவள்ளி": "tapioca",
    "குச்சி கிழங்கு": "tapioca",
    "tapioca": "tapioca",
    "maravalli": "tapioca",
    "maravallikilangu": "tapioca",
    "சர்க்கரைவள்ளிக்கிழங்கு": "sweet_potato",
    "சர்க்கரைவள்ளி": "sweet_potato",
    "sweet potato": "sweet_potato",
    "sarkaravalli": "sweet_potato",
    "சேப்பங்கிழங்கு": "colocasia",
    "சேம்பு": "colocasia",
    "colocasia": "colocasia",
    "seppankilangu": "colocasia",
    "உருளைக்கிழங்கு": "potato",
    "உருளை": "potato",
    "potato": "potato",
    "urulai": "potato",
    "urulaikilangu": "potato",

    # Keerai
    "முருங்கைக்கீரை": "murungai_keerai",
    "murungai keerai": "murungai_keerai",
    "அகத்திக்கீரை": "agathi_keerai",
    "agathi keerai": "agathi_keerai",
    "சிறுகீரை": "siru_keerai",
    "siru keerai": "siru_keerai",
    "பாலக்கீரை": "palak_keerai",
    "palak keerai": "palak_keerai",
    "பசலைக்கீரை": "palak_keerai",
    "வல்லாரைக்கீரை": "vallarai_keerai",
    "vallarai keerai": "vallarai_keerai",
    "பொன்னாங்கண்ணிக்கீரை": "ponnanganni_keerai",
    "ponnanganni keerai": "ponnanganni_keerai",

    # Nell & Millets & Pulses
    "பொன்னி நெல்": "ponni_rice",
    "பொன்னி அரிசி": "ponni_rice",
    "பொன்னி": "ponni_rice",
    "ponni rice": "ponni_rice",
    "ponni nell": "ponni_rice",
    "ponni": "ponni_rice",
    "nell": "ponni_rice",
    "paddy": "ponni_rice",
    "சீரக சம்பா": "seeraga_samba",
    "seeraga samba": "seeraga_samba",
    "தூயமல்லி": "thooyamalli",
    "thooyamalli": "thooyamalli",
    "கருப்பு கவுனி": "karuppu_kavuni",
    "karuppu kavuni": "karuppu_kavuni",
    "மாப்பிள்ளை சம்பா": "mappillai_samba",
    "mappillai samba": "mappillai_samba",
    "கேழ்வரகு": "ragi",
    "ராகி": "ragi",
    "ragi": "ragi",
    "தினை": "thinai",
    "thinai": "thinai",
    "உளுந்து": "black_gram",
    "கருப்பு உளுந்து": "black_gram",
    "உளுந்தம் பருப்பு": "black_gram",
    "black gram": "black_gram",
    "urad dal": "black_gram",
    "urad": "black_gram",
    "ulunthu": "black_gram",

    # Banana & Fruits
    "வாழைக்காய் சிப்ஸ்": "banana_chips",
    "வாழைத்தண்டு": "banana_stem",
    "வாழைப்பூ": "banana_flower",
    "வாழை இலை": "banana_leaf",
    "வாழை நார்": "banana_fiber",
    "வாழைப்பழம்": "banana",
    "வாழை": "banana",
    "banana": "banana",
    "பச்சை மாங்காய்": "raw_mango",
    "மாங்காய்": "raw_mango",
    "மாங்கா": "raw_mango",
    "raw mango": "raw_mango",
    "mangai": "raw_mango",
    "மாம்பழம்": "mango",
    "mango": "mango",
    "கொய்யாப்பழம்": "guava",
    "கொய்யா": "guava",
    "guava": "guava",
    "பப்பாளிப்பழம்": "papaya",
    "பப்பாளி": "papaya",
    "papaya": "papaya",
    "மாதுளம்பழம்": "pomegranate",
    "மாதுளை": "pomegranate",
    "pomegranate": "pomegranate",
    "பலாப்பழம்": "jackfruit",
    "பலா": "jackfruit",
    "jackfruit": "jackfruit",
    "தர்பூசணி": "watermelon",
    "watermelon": "watermelon",

    # Vegetables
    "கேரட்": "carrot",
    "முட்டைகோஸ்": "cabbage",
    "கோஸ்": "cabbage",
    "பீன்ஸ்": "beans",
    "பச்சை மிளகாய்": "chilli",
    "மிளகாய்": "chilli",
    "பீட்ரூட்": "beetroot",
    "தேங்காய்": "coconut",
    "பூக்கோசு": "broccoli",
}

TAMIL_NUMBERS = {
    "ஒன்று": 1, "ஒரு": 1, "ஒண்ணு": 1, "இரண்டு": 2, "ரெண்டு": 2, "மூன்று": 3, "மூணு": 3, "நான்கு": 4, "நாலு": 4,
    "ஐந்து": 5, "அஞ்சு": 5, "பத்து": 10, "இருபது": 20, "முப்பது": 30, "நாற்பது": 40,
    "ஐம்பது": 50, "அம்பது": 50, "அறுபது": 60, "எழுபது": 70, "எண்பது": 80, "தொண்ணூறு": 90,
    "நூறு": 100, "இருநூறு": 200, "ஐந்நூறு": 500, "ஆயிரம்": 1000
}


def parse_intent(transcript: str):
    text = transcript.strip()
    lowered = text.lower()

    detected_crop = None
    for tamil_word, english_name in KNOWN_CROPS.items():
        if tamil_word in text or english_name in lowered:
            detected_crop = english_name
            break

    # If no exact match, try prefix check for colloquial word endings
    if not detected_crop:
        words = text.split()
        for w in words:
            if len(w) >= 3:
                for tamil_word, english_name in KNOWN_CROPS.items():
                    if w.startswith(tamil_word[:3]) or tamil_word.startswith(w[:3]):
                        detected_crop = english_name
                        break
                if detected_crop:
                    break

    # Extract quantity (digits or Tamil words)
    qty_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:கிலோ|kg|கிலோகிராம்)?", text, re.IGNORECASE)
    quantity_kg = None
    if qty_match:
        quantity_kg = float(qty_match.group(1))
    else:
        for word, val in TAMIL_NUMBERS.items():
            if word in text:
                quantity_kg = float(val)
                break

    if quantity_kg is None:
        quantity_kg = 50.0  # sensible default for farmer convenience

    if "விலை" in text or "price" in lowered or "ரேட்" in text or "எவ்வளவு" in text or "எவ்ளோ" in text:
        intent = "check_price"
    elif "ஆர்டர்" in text or "order" in lowered or "நிலை" in text:
        intent = "check_order_status"
    elif "வாங்க" in text or "buy" in lowered:
        intent = "buy_crop"
    else:
        intent = "list_crop"

    return {
        "intent": intent,
        "crop_name": detected_crop,
        "is_crop_recognized": detected_crop is not None,
        "quantity_kg": quantity_kg,
    }


@app.post("/voice-command")
def voice_command(req: VoiceCommandRequest):
    parsed = parse_intent(req.transcript)
    return {
        "transcript": req.transcript,
        "language": req.language,
        "parsed": parsed,
    }
