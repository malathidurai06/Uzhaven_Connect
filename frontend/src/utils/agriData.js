// Uzhavan Connect — Agricultural Image Data, Categorization, and Localization

export const AGRI_CATEGORIES = [
  { id: "all", label_en: "All Produce", label_ta: "அனைத்து விளைபொருட்கள்", icon: "🌾" },
  { id: "tubers", label_en: "Tubers & Roots", label_ta: "கிழங்கு வகைகள்", icon: "🥔" },
  { id: "fruits", label_en: "Fresh Fruits", label_ta: "பழ வகைகள்", icon: "🥭" },
  { id: "south_nell", label_en: "South Region Nell & Millets", label_ta: "தென்மண்டல நெல் & தானியங்கள்", icon: "🌾" },
  { id: "banana_byproducts", label_en: "Banana By-Products", label_ta: "வாழை உபபொருட்கள்", icon: "🍌" },
  { id: "keerai", label_en: "Keerai & Greens", label_ta: "கீரை வகைகள்", icon: "🌿" },
  { id: "vegetables", label_en: "Fresh Vegetables", label_ta: "காய்கறிகள்", icon: "🍅" },
];

export const CROP_IMAGES = {
  // --- 1. TUBERS (Verified Authentic Images) ---
  yam: "/images/crops/yam.jpg",
  "elephant foot yam": "/images/crops/yam.jpg",
  tapioca: "/images/crops/tapioca.jpg",
  sweet_potato: "/images/crops/sweet_potato.jpg",
  colocasia: "/images/crops/colocasia.jpg",
  potato: "/images/crops/potato.jpg",

  // --- 2. FRUITS (Verified Authentic Images) ---
  mango: "/images/crops/mango.jpg",
  raw_mango: "/images/crops/raw_mango.jpg",
  "raw mango": "/images/crops/raw_mango.jpg",
  guava: "/images/crops/guava.jpg",
  banana: "/images/crops/banana.jpg",
  papaya: "/images/crops/papaya.jpg",
  pomegranate: "/images/crops/pomegranate.jpg",
  jackfruit: "/images/crops/coconut.jpg",

  // --- 3. SOUTH REGION NELL & MILLETS & PULSES (Verified Authentic Images) ---
  ponni_rice: "/images/crops/ponni_rice.jpg",
  seeraga_samba: "/images/crops/seeraga_samba.jpg",
  thooyamalli: "/images/crops/thooyamalli.jpg",
  karuppu_kavuni: "/images/crops/karuppu_kavuni.jpg",
  mappillai_samba: "/images/crops/karuppu_kavuni.jpg",
  ragi: "/images/crops/ragi.jpg",
  thinai: "/images/crops/ragi.jpg",
  black_gram: "/images/crops/black_gram.jpg",
  "black gram": "/images/crops/black_gram.jpg",
  urad_dal: "/images/crops/black_gram.jpg",

  // --- 4. BANANA BY-PRODUCTS (Verified Authentic Images) ---
  banana_chips: "/images/crops/banana_chips.jpg",
  banana_stem: "/images/crops/banana_stem.jpg",
  banana_flower: "/images/crops/banana_flower.jpg",
  banana_leaf: "/images/crops/banana_leaf.jpg",
  banana_fiber: "/images/crops/banana_fiber.jpg",

  // --- 5. TYPES OF KEERAI & GREENS (Verified Authentic Images) ---
  murungai_keerai: "/images/crops/murungai_keerai.jpg",
  agathi_keerai: "/images/crops/agathi_keerai.jpg",
  siru_keerai: "/images/crops/siru_keerai.jpg",
  arai_keerai: "/images/crops/siru_keerai.jpg",
  palak_keerai: "/images/crops/palak_keerai.jpg",
  manathakkali_keerai: "/images/crops/agathi_keerai.jpg",
  vallarai_keerai: "/images/crops/vallarai_keerai.jpg",
  vellarai_keerai: "/images/crops/vallarai_keerai.jpg",
  ponnanganni_keerai: "/images/crops/ponnanganni_keerai.jpg",
  ponnagannni_keerai: "/images/crops/ponnanganni_keerai.jpg",
  vendhaya_keerai: "/images/crops/siru_keerai.jpg",

  // --- 6. FRESH VEGETABLES (Verified Authentic Images) ---
  tomato: "/images/crops/tomato.jpg",
  brinjal: "/images/crops/brinjal.jpg",
  eggplant: "/images/crops/brinjal.jpg",
  onion: "/images/crops/onion.jpg",
  carrot: "/images/crops/carrot.jpg",
  cabbage: "/images/crops/cabbage.jpg",
  beans: "/images/crops/beans.jpg",
  okra: "/images/crops/okra.jpg",
  ladies_finger: "/images/crops/okra.jpg",
  "ladies finger": "/images/crops/okra.jpg",
  ladyfinger: "/images/crops/okra.jpg",
  drumstick: "/images/crops/drumstick.jpg",
  chilli: "/images/crops/chilli.jpg",
  beetroot: "/images/crops/beetroot.jpg",
  coconut: "/images/crops/coconut.jpg",
  default: "/images/crops/default.jpg",
};

export const CROP_ICONS = {
  yam: "🥔",
  tapioca: "🥔",
  sweet_potato: "🍠",
  colocasia: "🥔",
  potato: "🥔",
  mango: "🥭",
  raw_mango: "🥭",
  "raw mango": "🥭",
  guava: "🍈",
  banana: "🍌",
  papaya: "🍈",
  pomegranate: "🍎",
  jackfruit: "🍈",
  ponni_rice: "🌾",
  seeraga_samba: "🌾",
  thooyamalli: "🌾",
  karuppu_kavuni: "🌾",
  mappillai_samba: "🌾",
  ragi: "🌾",
  thinai: "🌾",
  black_gram: "🫘",
  "black gram": "🫘",
  urad_dal: "🫘",
  banana_chips: "🍌",
  banana_stem: "🎍",
  banana_flower: "🌺",
  banana_fiber: "🧵",
  banana_leaf: "🍃",
  agathi_keerai: "🌿",
  murungai_keerai: "🌿",
  siru_keerai: "🌱",
  arai_keerai: "🌱",
  palak_keerai: "🥬",
  manathakkali_keerai: "🌿",
  vallarai_keerai: "🍀",
  vellarai_keerai: "🍀",
  ponnanganni_keerai: "🌿",
  ponnagannni_keerai: "🌿",
  vendhaya_keerai: "🌱",
  tomato: "🍅",
  brinjal: "🍆",
  eggplant: "🍆",
  broccoli: "🥦",
  onion: "🧅",
  carrot: "🥕",
  cabbage: "🥬",
  beans: "🫘",
  okra: "🌱",
  ladies_finger: "🌱",
  "ladies finger": "🌱",
  ladyfinger: "🌱",
  drumstick: "🌿",
  chilli: "🌶️",
  beetroot: "🥗",
  coconut: "🥥",
  default: "🌾",
};

export const CROP_NAME_I18N = {
  // --- 1. Tubers ---
  yam: { en: "Elephant Foot Yam", ta: "சேனைக்கிழங்கு (Yam)" },
  "elephant foot yam": { en: "Elephant Foot Yam", ta: "சேனைக்கிழங்கு (Yam)" },
  tapioca: { en: "Tapioca / Cassava", ta: "மரவள்ளிக்கிழங்கு (Tapioca)" },
  sweet_potato: { en: "Sweet Potato", ta: "சர்க்கரைவள்ளிக்கிழங்கு (Sweet Potato)" },
  colocasia: { en: "Colocasia / Taro Corms", ta: "சேப்பங்கிழங்கு (Colocasia)" },
  potato: { en: "Farm Potato", ta: "உருளைக்கிழங்கு (Potato)" },

  // --- 2. Fruits ---
  mango: { en: "Salem Fresh Mango", ta: "மாம்பழம் (Salem Mango)" },
  raw_mango: { en: "Fresh Raw Green Mango", ta: "பச்சை மாங்காய் (Raw Mango)" },
  "raw mango": { en: "Fresh Raw Green Mango", ta: "பச்சை மாங்காய் (Raw Mango)" },
  guava: { en: "Country Pink Guava", ta: "நாட்டு கொய்யா (Country Guava)" },
  banana: { en: "Poovan Fresh Banana", ta: "வாழைப்பழம் (Fresh Banana)" },
  papaya: { en: "Red Lady Sweet Papaya", ta: "பப்பாளிப்பழம் (Sweet Papaya)" },
  pomegranate: { en: "Ruby Red Pomegranate", ta: "மாதுளம்பழம் (Pomegranate)" },
  jackfruit: { en: "Panruti Jackfruit", ta: "பலாப்பழம் (Jackfruit)" },
  watermelon: { en: "Farm Fresh Watermelon", ta: "தர்பூசணி (Watermelon)" },

  // --- 3. South Region Nell & Millets & Pulses ---
  ponni_rice: { en: "Nellai Ponni Paddy / Nell", ta: "பொன்னி நெல் (Ponni Nell)" },
  seeraga_samba: { en: "Seeraga Samba Heritage Rice", ta: "சீரக சம்பா அரிசி (Seeraga Samba)" },
  thooyamalli: { en: "Thooyamalli Traditional Rice", ta: "தூயமல்லி அரிசி (Thooyamalli)" },
  karuppu_kavuni: { en: "Karuppu Kavuni Black Rice", ta: "கருப்பு கவுனி அரிசி (Karuppu Kavuni)" },
  mappillai_samba: { en: "Mappillai Samba Red Rice", ta: "மாப்பிள்ளை சம்பா அரிசி (Mappillai Samba)" },
  ragi: { en: "Finger Millet / Ragi", ta: "கேழ்வரகு / ராகி (Ragi)" },
  thinai: { en: "Foxtail Millet (Thinai)", ta: "தினை தானியம் (Thinai)" },
  black_gram: { en: "Whole Black Gram (Urad Dal)", ta: "கருப்பு உளுந்து (Black Gram)" },
  "black gram": { en: "Whole Black Gram (Urad Dal)", ta: "கருப்பு உளுந்து (Black Gram)" },
  urad_dal: { en: "Whole Black Gram (Urad Dal)", ta: "கருப்பு உளுந்து (Black Gram)" },

  // --- 4. Banana By-Products ---
  banana_chips: { en: "Nendran Banana Chips (Coconut Oil)", ta: "வாழைக்காய் சிப்ஸ் (Banana Chips)" },
  banana_stem: { en: "Fresh White Banana Stem", ta: "வாழைத்தண்டு (Banana Stem)" },
  banana_flower: { en: "Fresh Banana Blossom (Flower)", ta: "வாழைப்பூ (Banana Flower)" },
  banana_leaf: { en: "Fresh Green Banana Leaf Bundle", ta: "வாழை இலைக்கட்டு (Banana Leaf)" },
  banana_fiber: { en: "Natural Golden Banana Fiber", ta: "வாழை நார் (Banana Fiber)" },

  // --- 5. Types of Keerai & Greens ---
  murungai_keerai: { en: "Murungai Keerai (Moringa Leaves)", ta: "முருங்கைக்கீரை (Murungai Keerai)" },
  agathi_keerai: { en: "Agathi Keerai", ta: "அகத்திக்கீரை (Agathi Keerai)" },
  siru_keerai: { en: "Fresh Green Siru Keerai", ta: "சிறுகீரை (Siru Keerai)" },
  arai_keerai: { en: "Arai Keerai", ta: "அரைக்கீரை (Arai Keerai)" },
  palak_keerai: { en: "Palak Spinach Keerai", ta: "பாலக்கீரை / பசலை (Palak)" },
  manathakkali_keerai: { en: "Manathakkali Keerai", ta: "மணத்தக்காளிக்கீரை (Manathakkali)" },
  vallarai_keerai: { en: "Vallarai Keerai (Gotu Kola)", ta: "வல்லாரைக்கீரை (Vallarai Keerai)" },
  vellarai_keerai: { en: "Vallarai Keerai (Gotu Kola)", ta: "வல்லாரைக்கீரை (Vallarai Keerai)" },
  ponnanganni_keerai: { en: "Ponnanganni Water Keerai", ta: "பொன்னாங்கண்ணிக்கீரை (Ponnanganni)" },
  ponnagannni_keerai: { en: "Ponnanganni Water Keerai", ta: "பொன்னாங்கண்ணிக்கீரை (Ponnanganni)" },
  vendhaya_keerai: { en: "Vendhaya (Fenugreek) Keerai", ta: "வெந்தயக்கீரை (Vendhaya Keerai)" },

  // --- 6. Fresh Vegetables ---
  drumstick: { en: "Fresh Farm Drumstick", ta: "முருங்கைக்காய் (Drumstick)" },
  okra: { en: "Ladies Finger (வெண்டைக்காய்)", ta: "வெண்டைக்காய் (Ladies Finger)" },
  ladies_finger: { en: "Ladies Finger (வெண்டைக்காய்)", ta: "வெண்டைக்காய் (Ladies Finger)" },
  "ladies finger": { en: "Ladies Finger (வெண்டைக்காய்)", ta: "வெண்டைக்காய் (Ladies Finger)" },
  ladyfinger: { en: "Ladies Finger (வெண்டைக்காய்)", ta: "வெண்டைக்காய் (Ladies Finger)" },
  tomato: { en: "Country Fresh Tomato", ta: "நாட்டு தக்காளி (Country Tomato)" },
  brinjal: { en: "Country Violet Brinjal", ta: "கத்தரிக்காய் (Country Brinjal)" },
  eggplant: { en: "Country Violet Brinjal", ta: "கத்தரிக்காய் (Country Brinjal)" },
  onion: { en: "Small Sambar Shallot Onion", ta: "சின்ன வெங்காயம் (Shallots)" },
  carrot: { en: "Ooty Fresh Carrot", ta: "ஊட்டி கேரட் (Fresh Carrot)" },
  cabbage: { en: "Crispy Green Cabbage", ta: "முட்டைக்கோஸ் (Cabbage)" },
  beans: { en: "Bush Green Beans", ta: "பீன்ஸ் (Bush Beans)" },
  chilli: { en: "Spicy Green Chilli", ta: "பச்சை மிளகாய் (Green Chilli)" },
  beetroot: { en: "Sweet Beetroot", ta: "பீட்ரூட் (Beetroot)" },
  coconut: { en: "Pollachi Farm Coconut", ta: "பொள்ளாச்சி தேங்காய் (Coconut)" },
};

export const BASE_CROP_PRICES = {
  // Fruits
  mango: { min: 55, max: 66, avg: 60 },
  raw_mango: { min: 36, max: 44, avg: 40 },
  "raw mango": { min: 36, max: 44, avg: 40 },
  banana: { min: 26, max: 34, avg: 30 },
  guava: { min: 30, max: 40, avg: 35 },
  papaya: { min: 24, max: 32, avg: 28 },
  pomegranate: { min: 80, max: 100, avg: 90 },
  jackfruit: { min: 38, max: 50, avg: 45 },
  watermelon: { min: 16, max: 24, avg: 20 },

  // Fresh Vegetables
  tomato: { min: 24, max: 28, avg: 26 },
  brinjal: { min: 28, max: 35, avg: 32 },
  eggplant: { min: 28, max: 35, avg: 32 },
  onion: { min: 38, max: 46, avg: 42 },
  carrot: { min: 34, max: 42, avg: 38 },
  cabbage: { min: 18, max: 25, avg: 22 },
  potato: { min: 25, max: 32, avg: 28 },
  beans: { min: 48, max: 60, avg: 54 },
  okra: { min: 30, max: 38, avg: 35 },
  ladies_finger: { min: 30, max: 38, avg: 35 },
  "ladies finger": { min: 30, max: 38, avg: 35 },
  ladyfinger: { min: 30, max: 38, avg: 35 },
  drumstick: { min: 42, max: 55, avg: 48 },
  chilli: { min: 40, max: 50, avg: 45 },
  beetroot: { min: 32, max: 40, avg: 36 },
  coconut: { min: 22, max: 28, avg: 25 },
  broccoli: { min: 58, max: 72, avg: 65 },

  // Tubers
  yam: { min: 40, max: 50, avg: 45 },
  "elephant foot yam": { min: 40, max: 50, avg: 45 },
  tapioca: { min: 28, max: 36, avg: 32 },
  sweet_potato: { min: 34, max: 42, avg: 38 },
  colocasia: { min: 38, max: 46, avg: 42 },

  // Keerai & Greens
  murungai_keerai: { min: 18, max: 24, avg: 20 },
  agathi_keerai: { min: 18, max: 25, avg: 22 },
  siru_keerai: { min: 15, max: 20, avg: 18 },
  arai_keerai: { min: 15, max: 20, avg: 18 },
  palak_keerai: { min: 22, max: 28, avg: 25 },
  manathakkali_keerai: { min: 18, max: 25, avg: 22 },
  vallarai_keerai: { min: 24, max: 32, avg: 28 },
  vellarai_keerai: { min: 24, max: 32, avg: 28 },
  ponnanganni_keerai: { min: 20, max: 28, avg: 24 },
  ponnagannni_keerai: { min: 20, max: 28, avg: 24 },
  vendhaya_keerai: { min: 16, max: 22, avg: 18 },

  // South Nell & Grains
  ponni_rice: { min: 34, max: 42, avg: 38 },
  seeraga_samba: { min: 78, max: 92, avg: 85 },
  thooyamalli: { min: 58, max: 72, avg: 65 },
  karuppu_kavuni: { min: 108, max: 130, avg: 120 },
  mappillai_samba: { min: 68, max: 82, avg: 75 },
  ragi: { min: 38, max: 46, avg: 42 },
  thinai: { min: 48, max: 60, avg: 55 },
  black_gram: { min: 86, max: 104, avg: 95 },
  "black gram": { min: 86, max: 104, avg: 95 },
  urad_dal: { min: 86, max: 104, avg: 95 },

  // Banana By-Products
  banana_chips: { min: 145, max: 175, avg: 160 },
  banana_stem: { min: 20, max: 28, avg: 25 },
  banana_flower: { min: 25, max: 35, avg: 30 },
  banana_leaf: { min: 70, max: 90, avg: 80 },
  banana_fiber: { min: 135, max: 165, avg: 150 },
};

export function getCropBaselinePrice(cropName) {
  if (!cropName) return { min: 24, max: 28, avg: 26 };
  const cleanKey = cropName.toLowerCase().trim().replace(/\s+/g, "_");
  const rawKey = cropName.toLowerCase().trim();
  return BASE_CROP_PRICES[cleanKey] || BASE_CROP_PRICES[rawKey] || { min: 30, max: 40, avg: 35 };
}

export function getCropDisplayName(cropName, lang = "en") {
  if (!cropName) return lang === "ta" ? "விளைபொருள்" : "Crop";
  const cleanKey = cropName.toLowerCase().trim().replace(/\s+/g, "_");
  const rawKey = cropName.toLowerCase().trim();
  const found = CROP_NAME_I18N[cleanKey] || CROP_NAME_I18N[rawKey];
  if (found) {
    return lang === "ta" ? found.ta : found.en;
  }
  return cropName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const DEMO_ACCOUNTS = [
  {
    role: "farmer",
    name: "Murugan K. (முத்து முருகன்)",
    phone: "9876543210",
    label: "🧑‍🌾 Farmer (Murugan)",
    village: "Alangulam, Tirunelveli",
    badge: "Farmer",
  },
  {
    role: "buyer",
    name: "Priya S. (பிரியா)",
    phone: "9876543220",
    label: "🛒 Consumer (Priya)",
    village: "Tirunelveli Town",
    badge: "Buyer",
  },
  {
    role: "secondary_buyer",
    name: "Hotel Royal Residency",
    phone: "9876543230",
    label: "🏨 Bulk Buyer (Royal Hotel)",
    village: "Vannarpettai, Tirunelveli",
    badge: "Bulk / Hotel",
  },
  {
    role: "admin",
    name: "Platform Developer Admin",
    phone: "9999999999",
    label: "🛡️ Developer Admin",
    village: "HQ Command Center",
    badge: "Admin",
  },
];

export const TRANSLATIONS = {
  en: {
    brand_title: "Uzhavan Connect",
    brand_sub: "Direct Farm Marketplace & AI",
    hero_badge: "Tamil Nadu's 1st Direct Farm Network",
    hero_tagline: "Empowering Farmers with AI Fair Pricing & Hyperlocal Direct Sales",
    hero_desc: "Eliminating middlemen exploitation. Get harvest-fresh produce in under 24 hours delivered to your doorstep.",
    
    // Explicit requested button labels
    btn_list_crop: "List Crops",
    btn_browse_marketplace: "Browse Marketplace",
    btn_try_voice: "Try Voice Search",

    nav_home: "Home",
    nav_marketplace: "Marketplace",
    nav_list_crop: "List Crops",
    nav_my_orders: "Orders",
    nav_crop_rescue: "Rescue Deals",
    nav_ai_tools: "AI Suite",
    nav_voice_assistant: "Tamil Voice Assistant",
    nav_price_insights: "Price Recommendation",
    nav_demand_forecast: "Demand Forecast",
    nav_login: "Login",
    nav_logout: "Logout",
  },
  ta: {
    brand_title: "உழவன் கனெக்ட்",
    brand_sub: "நேரடி உழவர் சந்தை & செயற்கை நுண்ணறிவு",
    hero_badge: "தமிழகத்தின் நேரடி உழவர் சந்தை தளம்",
    hero_tagline: "விவசாயிகளுக்கு நேரடி நியாய விலை மற்றும் நுகர்வோருக்கு புதிய விளைபொருட்கள்",
    hero_desc: "இடைத்தரகர்கள் இன்றி உழவர்களிடமிருந்து நேரடியாக காய்கறிகள் மற்றும் விளைபொருட்களை வாங்கலாம்.",
    
    // Explicit requested button labels (Tamil)
    btn_list_crop: "பயிர் விற்பனை பதிவு (List Crops)",
    btn_browse_marketplace: "சந்தையை பார்வையிட (Browse Marketplace)",
    btn_try_voice: "குரல் வழி தேடல் (Try Voice Search)",

    nav_home: "முகப்பு",
    nav_marketplace: "விளைபொருட்கள் சந்தை",
    nav_list_crop: "பயிர் விற்பனை பதிவு",
    nav_my_orders: "எனது ஆர்டர்கள்",
    nav_crop_rescue: "உபரி தள்ளுபடி சலுகை",
    nav_ai_tools: "செயற்கை நுண்ணறிவு",
    nav_voice_assistant: "குரல் வழி விற்பனை",
    nav_price_insights: "நியாய விலை வழிகாட்டி",
    nav_demand_forecast: "7 நாள் தேவை கணிப்பு",
    nav_login: "உள்நுழைக",
    nav_logout: "வெளியேறு",
  },
};

export const ALL_SUPPORTED_CROPS = [
  // Fruits
  { id: "mango", name: "Mango (மாம்பழம்)", category: "fruits" },
  { id: "raw_mango", name: "Raw Mango (பச்சை மாங்காய்)", category: "fruits" },
  { id: "banana", name: "Banana (வாழைப்பழம்)", category: "fruits" },
  { id: "guava", name: "Guava (கொய்யா)", category: "fruits" },
  { id: "papaya", name: "Papaya (பப்பாளி)", category: "fruits" },
  { id: "pomegranate", name: "Pomegranate (மாதுளை)", category: "fruits" },
  { id: "jackfruit", name: "Jackfruit (பலாப்பழம்)", category: "fruits" },
  { id: "watermelon", name: "Watermelon (தர்பூசணி)", category: "fruits" },

  // Vegetables
  { id: "tomato", name: "Tomato (தக்காளி)", category: "vegetables" },
  { id: "brinjal", name: "Brinjal (கத்தரிக்காய்)", category: "vegetables" },
  { id: "onion", name: "Onion (வெங்காயம்)", category: "vegetables" },
  { id: "ladies_finger", name: "Okra / Ladies Finger (வெண்டைக்காய்)", category: "vegetables" },
  { id: "drumstick", name: "Drumstick (முருங்கைக்காய்)", category: "vegetables" },
  { id: "carrot", name: "Carrot (கேரட்)", category: "vegetables" },
  { id: "cabbage", name: "Cabbage (முட்டைகோஸ்)", category: "vegetables" },
  { id: "potato", name: "Potato (உருளைக்கிழங்கு)", category: "vegetables" },
  { id: "beans", name: "Beans (பீன்ஸ்)", category: "vegetables" },
  { id: "chilli", name: "Chilli (பச்சை மிளகாய்)", category: "vegetables" },
  { id: "beetroot", name: "Beetroot (பீட்ரூட்)", category: "vegetables" },
  { id: "coconut", name: "Coconut (தேங்காய்)", category: "vegetables" },

  // Tubers
  { id: "yam", name: "Yam (சேனைக்கிழங்கு)", category: "tubers" },
  { id: "tapioca", name: "Tapioca (மரவள்ளிக்கிழங்கு)", category: "tubers" },
  { id: "sweet_potato", name: "Sweet Potato (சர்க்கரைவள்ளி)", category: "tubers" },
  { id: "colocasia", name: "Colocasia (சேப்பங்கிழங்கு)", category: "tubers" },

  // Keerai & Greens
  { id: "murungai_keerai", name: "Murungai Keerai (முருங்கைக்கீரை)", category: "keerai" },
  { id: "agathi_keerai", name: "Agathi Keerai (அகத்திக்கீரை)", category: "keerai" },
  { id: "siru_keerai", name: "Siru Keerai (சிறுகீரை)", category: "keerai" },
  { id: "palak_keerai", name: "Palak Keerai (பாலக்கீரை)", category: "keerai" },
  { id: "vallarai_keerai", name: "Vallarai Keerai (வல்லாரை)", category: "keerai" },
  { id: "ponnanganni_keerai", name: "Ponnanganni (பொன்னாங்கண்ணி)", category: "keerai" },

  // South Nell & Grains
  { id: "ponni_rice", name: "Ponni Rice (பொன்னி நெல்)", category: "south_nell" },
  { id: "seeraga_samba", name: "Seeraga Samba (சீரக சம்பா)", category: "south_nell" },
  { id: "thooyamalli", name: "Thooyamalli (தூயமல்லி)", category: "south_nell" },
  { id: "karuppu_kavuni", name: "Karuppu Kavuni (கருப்பு கவுனி)", category: "south_nell" },
  { id: "mappillai_samba", name: "Mappillai Samba (மாப்பிள்ளை சம்பா)", category: "south_nell" },
  { id: "ragi", name: "Ragi (கேழ்வரகு)", category: "south_nell" },
  { id: "thinai", name: "Thinai (தினை)", category: "south_nell" },
  { id: "black_gram", name: "Black Gram (கருப்பு உளுந்து)", category: "south_nell" },

  // Banana by-products
  { id: "banana_chips", name: "Banana Chips (வாழைக்காய் சிப்ஸ்)", category: "banana_byproducts" },
  { id: "banana_stem", name: "Banana Stem (வாழைத்தண்டு)", category: "banana_byproducts" },
  { id: "banana_flower", name: "Banana Flower (வாழைப்பூ)", category: "banana_byproducts" },
  { id: "banana_leaf", name: "Banana Leaf (வாழை இலை)", category: "banana_byproducts" },
  { id: "banana_fiber", name: "Banana Fiber (வாழை நார்)", category: "banana_byproducts" }
];

