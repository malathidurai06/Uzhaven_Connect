// Uzhavan Connect — Intelligent Tamil & English Voice NLP Parser
// Multi-dialect fuzzy recognition for colloquial farmer speech, numbers, and regional crops

import { CROP_IMAGES, CROP_ICONS, getCropDisplayName } from "./agriData";

// Tamil number words mapping (supports colloquial slang like அஞ்சு, நாலு, அம்பது, நூத்தம்பது)
const TAMIL_NUMBERS = {
  "ஒன்று": 1, "ஒரு": 1, "ஒண்ணு": 1,
  "இரண்டு": 2, "ரெண்டு": 2, "ரெண்டரை": 2.5,
  "மூன்று": 3, "மூணு": 3,
  "நான்கு": 4, "நாலு": 4,
  "ஐந்து": 5, "அஞ்சு": 5,
  "ஆறு": 6,
  "ஏழு": 7,
  "எட்டு": 8,
  "ஒன்பது": 9,
  "பத்து": 10,
  "பதினைந்து": 15, "பதினஞ்சு": 15,
  "இருபது": 20, "இருபத்தைந்து": 25, "இருபத்தஞ்சு": 25,
  "முப்பது": 30, "முப்பத்தைந்து": 35, "முப்பத்தஞ்சு": 35,
  "நாற்பது": 40, "நாப்பது": 40, "நாற்பத்தைந்து": 45,
  "ஐம்பது": 50, "அம்பது": 50,
  "அறுபது": 60,
  "எழுபது": 70,
  "எண்பது": 80, "எம்பது": 80,
  "தொண்ணூறு": 90,
  "நூறு": 100,
  "நூற்று ஐம்பது": 150, "நூத்தம்பது": 150,
  "இருநூறு": 200, "முந்நூறு": 300, "நானூறு": 400, "ஐந்நூறு": 500,
  "ஆயிரம்": 1000
};

// Full Comprehensive Crop Dictionary with rich colloquial Tamil dialect synonyms
export const CROPS_DICTIONARY = [
  // --- 1. FRESH VEGETABLES ---
  {
    id: "ladies_finger",
    ta: "வெண்டைக்காய்",
    en: "Ladies Finger",
    aliases: [
      "வெண்டைக்காய்", "வெண்டை", "வெண்டிங்காய்", "வெண்டிங்காக", "வெண்டிங்கா", "வெண்டக்காய்", "வெண்டக்கா", "வெண்டக்காயி",
      "vendaikkai", "vendakkai", "vendaikai", "vendakai", "venda", "ladies finger", "lady finger", "ladyfinger", "okra", "bhendi", "bhindi"
    ],
    avgPrice: 35,
    icon: "🌱"
  },
  {
    id: "tomato",
    ta: "தக்காளி",
    en: "Tomato",
    aliases: [
      "தக்காளி", "நாட்டு தக்காளி", "பெங்களூரு தக்காளி", "தக்காளி பழம்", "தக்காளிபழம்",
      "tomato", "tomatoes", "thakkali", "thakali", "takali", "thakkali pazham"
    ],
    avgPrice: 26,
    icon: "🍅"
  },
  {
    id: "brinjal",
    ta: "கத்தரிக்காய்",
    en: "Brinjal",
    aliases: [
      "கத்தரிக்காய்", "கத்தரி", "கத்திரிக்காய்", "கத்தரிக்கா", "நீல கத்தரி", "வரி கத்தரி",
      "brinjal", "eggplant", "aubergine", "kathirikai", "katharikai", "kathirikka"
    ],
    avgPrice: 32,
    icon: "🍆"
  },
  {
    id: "onion",
    ta: "வெங்காயம்",
    en: "Onion",
    aliases: [
      "வெங்காயம்", "சின்ன வெங்காயம்", "பெரிய வெங்காயம்", "சாம்பார் வெங்காயம்", "வெங்காய",
      "onion", "shallots", "onions", "vengayam", "chinna vengayam", "sambhar vengayam"
    ],
    avgPrice: 42,
    icon: "🧅"
  },
  {
    id: "drumstick",
    ta: "முருங்கைக்காய்",
    en: "Drumstick",
    aliases: [
      "முருங்கைக்காய்", "முருங்கை காய்", "முருங்கை", "செடி முருங்கை", "முருங்கா",
      "drumstick", "moringa", "murungakkai", "murungakai", "murungai"
    ],
    avgPrice: 65,
    icon: "🌿"
  },
  {
    id: "carrot",
    ta: "கேரட்",
    en: "Carrot",
    aliases: ["கேரட்", "கேரட்டு", "ஊட்டி கேரட்", "carrot", "carrots"],
    avgPrice: 38,
    icon: "🥕"
  },
  {
    id: "cabbage",
    ta: "முட்டைகோஸ்",
    en: "Cabbage",
    aliases: ["முட்டைகோஸ்", "முட்டைக்கோஸ்", "கோஸ்", "முட்டை கோஸ்", "cabbage", "muttakose"],
    avgPrice: 22,
    icon: "🥬"
  },
  {
    id: "potato",
    ta: "உருளைக்கிழங்கு",
    en: "Potato",
    aliases: ["உருளைக்கிழங்கு", "உருளை கிழங்கு", "உருளை", "potato", "potatoes", "urulaikilangu", "urulai"],
    avgPrice: 28,
    icon: "🥔"
  },
  {
    id: "beans",
    ta: "பீன்ஸ்",
    en: "Beans",
    aliases: ["பீன்ஸ்", "பீன்சு", "பீன்", "beans", "green beans"],
    avgPrice: 55,
    icon: "🫘"
  },
  {
    id: "chilli",
    ta: "பச்சை மிளகாய்",
    en: "Green Chilli",
    aliases: ["பச்சை மிளகாய்", "பச்சைமிளகாய்", "மிளகாய்", "green chilli", "chilli", "chili", "milagai"],
    avgPrice: 48,
    icon: "🌶️"
  },
  {
    id: "beetroot",
    ta: "பீட்ரூட்",
    en: "Beetroot",
    aliases: ["பீட்ரூட்", "பீட் ரூட்", "beetroot"],
    avgPrice: 36,
    icon: "🥗"
  },
  {
    id: "coconut",
    ta: "தேங்காய்",
    en: "Coconut",
    aliases: ["தேங்காய்", "தென்னை", "தேங்கா", "coconut", "thekai", "thengai"],
    avgPrice: 25,
    icon: "🥥"
  },

  // --- 2. TUBERS & ROOTS ---
  {
    id: "yam",
    ta: "சேனைக்கிழங்கு",
    en: "Yam",
    aliases: [
      "சேனைக்கிழங்கு", "சேனை கிழங்கு", "சேனை", "சேனைக்காய்", "கருணைக்கிழங்கு", "கருணை",
      "yam", "elephant foot yam", "senaikilangu", "senai", "karunaikilangu"
    ],
    avgPrice: 45,
    icon: "🥔"
  },
  {
    id: "tapioca",
    ta: "மரவள்ளிக்கிழங்கு",
    en: "Tapioca",
    aliases: [
      "மரவள்ளிக்கிழங்கு", "மரவள்ளி கிழங்கு", "மரவள்ளி", "குச்சி கிழங்கு", "குச்சி", "கப்பக்கிழங்கு",
      "tapioca", "cassava", "maravalli", "maravallikilangu", "kappakilangu", "kuchikilangu"
    ],
    avgPrice: 32,
    icon: "🥔"
  },
  {
    id: "sweet_potato",
    ta: "சர்க்கரைவள்ளிக்கிழங்கு",
    en: "Sweet Potato",
    aliases: [
      "சர்க்கரைவள்ளிக்கிழங்கு", "சர்க்கரைவள்ளி", "சர்க்கரை கிழங்கு", "சீனிக்கிழங்கு",
      "sweet potato", "sweetpotato", "sarkaravalli", "seenikilangu"
    ],
    avgPrice: 38,
    icon: "🍠"
  },
  {
    id: "colocasia",
    ta: "சேப்பங்கிழங்கு",
    en: "Colocasia",
    aliases: [
      "சேப்பங்கிழங்கு", "சேப்பங்கிளங்கு", "சேப்பங்கிழங்கு", "சேம்பு",
      "colocasia", "taro", "arbi", "seppankilangu", "sembu"
    ],
    avgPrice: 42,
    icon: "🥔"
  },

  // --- 3. TYPES OF KEERAI & GREENS ---
  {
    id: "murungai_keerai",
    ta: "முருங்கைக்கீரை",
    en: "Murungai Keerai",
    aliases: [
      "முருங்கைக்கீரை", "முருங்கை கீரை", "முருங்கை இலை", "முருங்கைத்தழை",
      "murungai keerai", "moringa leaves", "drumstick leaves"
    ],
    avgPrice: 20,
    icon: "🌿"
  },
  {
    id: "agathi_keerai",
    ta: "அகத்திக்கீரை",
    en: "Agathi Keerai",
    aliases: [
      "அகத்திக்கீரை", "அகத்தி கீரை", "அகத்தி",
      "agathi keerai", "agathi", "sesbania"
    ],
    avgPrice: 22,
    icon: "🌿"
  },
  {
    id: "siru_keerai",
    ta: "சிறுகீரை",
    en: "Siru Keerai",
    aliases: [
      "சிறுகீரை", "சிறு கீரை", "சீறு கீரை", "சீறுகீரை",
      "siru keerai", "seeru keerai", "amarnath"
    ],
    avgPrice: 18,
    icon: "🥬"
  },
  {
    id: "palak_keerai",
    ta: "பாலக்கீரை",
    en: "Palak Keerai",
    aliases: [
      "பாலக்கீரை", "பாலக் கீரை", "பாலக்", "பசலைக்கீரை", "பசலை கீரை", "பசலை",
      "palak keerai", "palak", "spinach", "pasalai keerai"
    ],
    avgPrice: 25,
    icon: "🥬"
  },
  {
    id: "vallarai_keerai",
    ta: "வல்லாரைக்கீரை",
    en: "Vallarai Keerai",
    aliases: [
      "வல்லாரைக்கீரை", "வல்லாரை கீரை", "வல்லாரை", "வெள்ளாரை", "வல்லார",
      "vallarai keerai", "vallarai", "vellarai keerai", "gotu kola"
    ],
    avgPrice: 28,
    icon: "🌿"
  },
  {
    id: "ponnanganni_keerai",
    ta: "பொன்னாங்கண்ணிக்கீரை",
    en: "Ponnanganni Keerai",
    aliases: [
      "பொன்னாங்கண்ணிக்கீரை", "பொன்னாங்கண்ணி கீரை", "பொன்னாங்கண்ணி", "பொன்னாகண்ணி",
      "ponnanganni keerai", "ponnanganni", "ponnaganni"
    ],
    avgPrice: 24,
    icon: "🌿"
  },

  // --- 4. SOUTH REGION NELL & MILLETS ---
  {
    id: "ponni_rice",
    ta: "பொன்னி நெல்",
    en: "Ponni Rice",
    aliases: [
      "பொன்னி நெல்", "பொன்னி அரிசி", "பொன்னி", "நெல்", "அரிசி",
      "ponni rice", "ponni nell", "ponni", "paddy"
    ],
    avgPrice: 38,
    icon: "🌾"
  },
  {
    id: "seeraga_samba",
    ta: "சீரக சம்பா",
    en: "Seeraga Samba",
    aliases: [
      "சீரக சம்பா", "சீரகசம்பா", "சீரக சம்பா அரிசி",
      "seeraga samba", "jeera samba", "jeerakasamba"
    ],
    avgPrice: 85,
    icon: "🌾"
  },
  {
    id: "thooyamalli",
    ta: "தூயமல்லி அரிசி",
    en: "Thooyamalli",
    aliases: [
      "தூயமல்லி", "தூயமல்லி அரிசி", "தூய மல்லி",
      "thooyamalli", "thuyamalli"
    ],
    avgPrice: 65,
    icon: "🌾"
  },
  {
    id: "karuppu_kavuni",
    ta: "கருப்பு கவுனி அரிசி",
    en: "Karuppu Kavuni",
    aliases: [
      "கருப்பு கவுனி", "கருப்புக்கவுனி", "கருப்பு கவுனி அரிசி", "கவுனி அரிசி",
      "karuppu kavuni", "black rice", "kavuni"
    ],
    avgPrice: 120,
    icon: "🌾"
  },
  {
    id: "mappillai_samba",
    ta: "மாப்பிள்ளை சம்பா அரிசி",
    en: "Mappillai Samba",
    aliases: [
      "மாப்பிள்ளை சம்பா", "மாப்பிள்ளைசம்பா", "மாப்பிள்ளை சம்பா அரிசி",
      "mappillai samba", "bridegroom rice"
    ],
    avgPrice: 75,
    icon: "🌾"
  },
  {
    id: "ragi",
    ta: "கேழ்வரகு / ராகி",
    en: "Ragi",
    aliases: [
      "கேழ்வரகு", "ராகி", "கேப்பை", "கேழ்வரகு மாவு",
      "ragi", "finger millet", "kezhvaragu", "keppai"
    ],
    avgPrice: 42,
    icon: "🌾"
  },
  {
    id: "thinai",
    ta: "தினை தானியம்",
    en: "Thinai",
    aliases: [
      "தினை", "தினை தானியம்", "தினை அரிசி",
      "thinai", "foxtail millet"
    ],
    avgPrice: 55,
    icon: "🌾"
  },
  {
    id: "black_gram",
    ta: "கருப்பு உளுந்து",
    en: "Black Gram",
    aliases: [
      "உளுந்து", "கருப்பு உளுந்து", "உளுந்தம் பருப்பு", "உளுந்து பருப்பு", "உளுந்தம்பருப்பு",
      "black gram", "blackgram", "urad dal", "urad dhal", "urad", "ulunthu", "ulundu"
    ],
    avgPrice: 95,
    icon: "🫘"
  },

  // --- 5. BANANA BY-PRODUCTS ---
  {
    id: "banana_chips",
    ta: "வாழைக்காய் சிப்ஸ்",
    en: "Banana Chips",
    aliases: [
      "வாழைக்காய் சிப்ஸ்", "வாழை சிப்ஸ்", "சிப்ஸ்",
      "banana chips", "raw banana chips", "chips"
    ],
    avgPrice: 160,
    icon: "🍌"
  },
  {
    id: "banana_stem",
    ta: "வாழைத்தண்டு",
    en: "Banana Stem",
    aliases: [
      "வாழைத்தண்டு", "வாழை தண்டு", "தண்டு",
      "banana stem", "plantain stem"
    ],
    avgPrice: 25,
    icon: "🎍"
  },
  {
    id: "banana_flower",
    ta: "வாழைப்பூ",
    en: "Banana Flower",
    aliases: [
      "வாழைப்பூ", "வாழை பூ", "பூ",
      "banana flower", "plantain flower"
    ],
    avgPrice: 30,
    icon: "🌺"
  },
  {
    id: "banana_leaf",
    ta: "வாழை இலைக்கட்டு",
    en: "Banana Leaf",
    aliases: [
      "வாழை இலை", "வாழை இலைக்கட்டு", "தலைவாழை இலை", "இலைக்கட்டு",
      "banana leaf", "plantain leaf"
    ],
    avgPrice: 80,
    icon: "🍃"
  },
  {
    id: "banana_fiber",
    ta: "வாழை நார்",
    en: "Banana Fiber",
    aliases: [
      "வாழை நார்", "வாழை நார் கட்டு",
      "banana fiber", "plantain fiber"
    ],
    avgPrice: 150,
    icon: "🧵"
  },

  // --- 6. FRUITS ---
  {
    id: "banana",
    ta: "வாழைப்பழம்",
    en: "Banana",
    aliases: [
      "வாழைப்பழம்", "வாழைக்காய்", "வாழை பழம்", "வாழை",
      "banana", "plantain", "valai", "valappazham"
    ],
    avgPrice: 30,
    icon: "🍌"
  },
  {
    id: "raw_mango",
    ta: "பச்சை மாங்காய்",
    en: "Raw Mango",
    aliases: [
      "பச்சை மாங்காய்", "மாங்காய்", "பச்சைமாங்காய்", "மாங்கா", "பச்சை மாங்கா",
      "raw mango", "rawmango", "green mango", "mangai", "pacha mangai"
    ],
    avgPrice: 40,
    icon: "🥭"
  },
  {
    id: "mango",
    ta: "மாம்பழம்",
    en: "Mango",
    aliases: [
      "மாம்பழம்", "மாம்பழ", "சேலம் மாம்பழம்",
      "mango", "alphonso", "mambalam"
    ],
    avgPrice: 60,
    icon: "🥭"
  },
  {
    id: "guava",
    ta: "நாட்டு கொய்யா",
    en: "Guava",
    aliases: [
      "கொய்யாப்பழம்", "கொய்யா", "நாட்டு கொய்யா", "கொய்யா பழம்",
      "guava", "koyya", "koyyappazham"
    ],
    avgPrice: 45,
    icon: "🍈"
  },
  {
    id: "papaya",
    ta: "பப்பாளிப்பழம்",
    en: "Papaya",
    aliases: [
      "பப்பாளிப்பழம்", "பப்பாளி", "பப்பாளி பழம்",
      "papaya", "pappali"
    ],
    avgPrice: 35,
    icon: "🍈"
  },
  {
    id: "pomegranate",
    ta: "மாதுளம்பழம்",
    en: "Pomegranate",
    aliases: [
      "மாதுளம்பழம்", "மாதுளை", "மாதுளம் பழம்",
      "pomegranate", "madulai"
    ],
    avgPrice: 110,
    icon: "🍎"
  },
  {
    id: "jackfruit",
    ta: "பலாப்பழம்",
    en: "Jackfruit",
    aliases: [
      "பலாப்பழம்", "பலாக்காய்", "பலா", "பலா பழம்",
      "jackfruit", "pala", "palappazham"
    ],
    avgPrice: 40,
    icon: "🍈"
  },
  {
    id: "watermelon",
    ta: "தர்பூசணி",
    en: "Watermelon",
    aliases: [
      "தர்பூசணி", "தர்பூசனி", "தர்பூஸ்",
      "watermelon", "tharpoosani"
    ],
    avgPrice: 20,
    icon: "🍉"
  },
  {
    id: "broccoli",
    ta: "பூக்கோசு (Broccoli)",
    en: "Broccoli",
    aliases: ["ப்ராக்கோலி", "ப்ரோக்கோலி", "பூக்கோசு", "broccoli"],
    avgPrice: 65,
    icon: "🥦"
  }
];

// Extract numbers from text (supports digits and Tamil words)
export function extractQuantity(text) {
  if (!text) return null;
  const clean = text.toLowerCase();

  // Check digits e.g. "50 kg", "100 கிலோ", "25", "5 கிலோ"
  const digitMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:கிலோ|kg|கிலோகிராம்|kilos?|மூட்டை)?/);
  if (digitMatch && digitMatch[1]) {
    return parseFloat(digitMatch[1]);
  }

  // Check Tamil number words
  for (const [word, val] of Object.entries(TAMIL_NUMBERS)) {
    if (clean.includes(word)) {
      return val;
    }
  }

  return null;
}

// Extract crop entity with multi-tier exact and fuzzy matching
export function extractCrop(text) {
  if (!text) return null;
  const clean = text.toLowerCase().trim();

  // 1. Tier 1: Exact alias substring matching
  for (const crop of CROPS_DICTIONARY) {
    for (const alias of crop.aliases) {
      const loweredAlias = alias.toLowerCase().trim();
      if (clean.includes(loweredAlias)) {
        return crop;
      }
    }
  }

  // 2. Tier 2: Stem / prefix matching for colloquial suffixes (like "வெண்டிங்காக" -> "வெண்டி", "தக்காளியில" -> "தக்காளி")
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (word.length >= 3) {
      for (const crop of CROPS_DICTIONARY) {
        for (const alias of crop.aliases) {
          const loweredAlias = alias.toLowerCase().trim();
          // Check if word starts with alias stem or alias starts with word stem
          if (word.startsWith(loweredAlias.slice(0, 4)) && loweredAlias.length >= 4) {
            return crop;
          }
          if (loweredAlias.startsWith(word.slice(0, 4)) && word.length >= 4) {
            return crop;
          }
        }
      }
    }
  }

  return null;
}

// Extract user intent
export function extractIntent(text) {
  if (!text) return "list_crop";
  const clean = text.toLowerCase();

  // Price inquiry keywords
  if (
    clean.includes("விலை") || 
    clean.includes("ரேட்") || 
    clean.includes("எவ்வளவு") || 
    clean.includes("எவ்ளோ") || 
    clean.includes("விலை என்ன") || 
    clean.includes("price") || 
    clean.includes("rate") || 
    clean.includes("cost")
  ) {
    return "check_price";
  }

  // Order status inquiry keywords
  if (
    clean.includes("ஆர்டர்") || 
    clean.includes("நிலை") || 
    clean.includes("டெலிவரி") || 
    clean.includes("எப்போது வரும்") || 
    clean.includes("order") || 
    clean.includes("track") || 
    clean.includes("status")
  ) {
    return "check_order_status";
  }

  // Buying keywords
  if (
    clean.includes("வாங்க") || 
    clean.includes("வாங்க வேண்டும்") || 
    clean.includes("வாங்கணும்") || 
    clean.includes("தேவை") || 
    clean.includes("buy") || 
    clean.includes("purchase") || 
    clean.includes("need")
  ) {
    return "buy_crop";
  }

  // Listing / Selling keywords
  return "list_crop";
}

// Complete NLP parse with smart detection (NO HARDCODED TOMATO FALLBACK!)
export function parseTamilVoiceCommand(transcript) {
  if (!transcript || !transcript.trim()) {
    return null;
  }

  const detectedCrop = extractCrop(transcript);
  const detectedQty = extractQuantity(transcript) || 50;
  const intent = extractIntent(transcript);

  // If a valid crop was identified
  if (detectedCrop) {
    const pricePerKg = detectedCrop.avgPrice;
    const totalPrice = Math.round(pricePerKg * detectedQty);

    let speechResponseTa = "";
    let actionTitleTa = "";
    let actionTitleEn = "";
    let actionRoute = "/list-crop";

    if (intent === "check_price") {
      speechResponseTa = `இன்றைய சந்தையில் ${detectedCrop.ta} (${detectedCrop.en}) விலை ஒரு கிலோ சுமார் ₹${pricePerKg} முதல் ₹${pricePerKg + 5} வரை உள்ளது.`;
      actionTitleTa = `💰 ${detectedCrop.ta} விரிவான விலை நிலவரம் காண்க`;
      actionTitleEn = `💰 View Full ${detectedCrop.en} Price Analytics`;
      actionRoute = "/ai/price-insights";
    } else if (intent === "buy_crop") {
      speechResponseTa = `சந்தையில் உள்ள தரமான ${detectedCrop.ta} (${detectedCrop.en}) காட்டப்படுகிறது. ஒரு கிலோ ₹${pricePerKg}.`;
      actionTitleTa = `🛒 சந்தையில் ${detectedCrop.ta} வாங்கவும்`;
      actionTitleEn = `🛒 Buy Fresh ${detectedCrop.en} in Marketplace`;
      actionRoute = "/marketplace";
    } else if (intent === "check_order_status") {
      speechResponseTa = `உங்கள் சமீபத்திய ஆர்டர்களின் டெலிவரி நிலை சரிபார்க்கப்படுகிறது.`;
      actionTitleTa = `🚚 ஆர்டர் டெலிவரி நிலையை அறியவும்`;
      actionTitleEn = `🚚 Track Delivery in My Orders`;
      actionRoute = "/my-orders";
    } else {
      // Default: list_crop
      speechResponseTa = `சரிங்க! ${detectedQty} கிலோ ${detectedCrop.ta} (${detectedCrop.en}) சந்தையில் விற்க பதிவு செய்யப்படுகிறது. நியாயமான விலை ஒரு கிலோ ₹${pricePerKg}. மொத்தம் ₹${totalPrice.toLocaleString()}.`;
      actionTitleTa = `✅ ₹${pricePerKg}/கிலோ விலையில் ${detectedCrop.ta} விற்கவும்`;
      actionTitleEn = `✅ Publish ${detectedQty}kg ${detectedCrop.en} at ₹${pricePerKg}/kg`;
      actionRoute = "/list-crop";
    }

    return {
      transcript,
      intent,
      is_crop_recognized: true,
      crop_name: detectedCrop.id,
      crop_name_ta: detectedCrop.ta,
      crop_name_en: detectedCrop.en,
      crop_icon: detectedCrop.icon || CROP_ICONS[detectedCrop.id] || "🌱",
      crop_image: CROP_IMAGES[detectedCrop.id] || CROP_IMAGES.default,
      quantity_kg: detectedQty,
      estimated_price_per_kg: pricePerKg,
      estimated_total: totalPrice,
      speech_response_ta: speechResponseTa,
      action_title_ta: actionTitleTa,
      action_title_en: actionTitleEn,
      action_route: actionRoute,
    };
  }

  // If NO crop was matched in speech: DO NOT FORCE TOMATO! Provide clean guidance!
  const speechResponseTa = `நீங்கள் பேசியதில் பயிரின் பெயர் தெளிவாக கண்டறியப்படவில்லை. தயவுசெய்து வெண்டைக்காய், தக்காளி, சேனைக்கிழங்கு, முருங்கைக்காய் அல்லது நெல் போன்ற பயிரின் பெயரை கூறி பேசவும்.`;

  return {
    transcript,
    intent,
    is_crop_recognized: false,
    crop_name: null,
    crop_name_ta: "பயிர் பெயர் தேவை (Crop Name Required)",
    crop_name_en: "Unrecognized Crop",
    crop_icon: "❓",
    crop_image: CROP_IMAGES.default,
    quantity_kg: detectedQty,
    estimated_price_per_kg: 30,
    estimated_total: Math.round(30 * detectedQty),
    speech_response_ta: speechResponseTa,
    action_title_ta: `🌾 விளைபொருட்கள் பட்டியலிலிருந்து பயிரைத் தேர்ந்தெடுக்கவும்`,
    action_title_en: `🌾 Select crop from Marketplace list`,
    action_route: "/list-crop",
  };
}
