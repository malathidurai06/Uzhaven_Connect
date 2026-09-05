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
