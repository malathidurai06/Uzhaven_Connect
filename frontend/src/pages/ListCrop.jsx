import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_IMAGES, CROP_ICONS, CROP_NAME_I18N, getCropDisplayName, AGRI_CATEGORIES } from "../utils/agriData";
import { parseTamilVoiceCommand } from "../utils/tamilVoiceParser";
import { 
  Sprout, 
  Sparkles, 
  MapPin, 
  Clock, 
  Mic, 
  MicOff,
  Volume2,
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  Send,
  Bot,
  Radio,
  RotateCcw,
  X,
  RefreshCw,
  FolderOpen
} from "lucide-react";

const CROPS_LIST = [
  // Tubers
  { id: "yam", category: "tubers" },
  { id: "tapioca", category: "tubers" },
  { id: "sweet_potato", category: "tubers" },
  { id: "colocasia", category: "tubers" },
  { id: "potato", category: "tubers" },

  // Fruits
  { id: "mango", category: "fruits" },
  { id: "raw_mango", category: "fruits" },
  { id: "guava", category: "fruits" },
  { id: "banana", category: "fruits" },
  { id: "papaya", category: "fruits" },
  { id: "pomegranate", category: "fruits" },
  { id: "jackfruit", category: "fruits" },
  { id: "watermelon", category: "fruits" },

  // South Region Nell & Millets & Pulses
  { id: "ponni_rice", category: "south_nell" },
  { id: "seeraga_samba", category: "south_nell" },
  { id: "thooyamalli", category: "south_nell" },
  { id: "karuppu_kavuni", category: "south_nell" },
  { id: "mappillai_samba", category: "south_nell" },
  { id: "ragi", category: "south_nell" },
  { id: "thinai", category: "south_nell" },
  { id: "black_gram", category: "south_nell" },

  // Banana By-Products
  { id: "banana_chips", category: "banana_byproducts" },
  { id: "banana_stem", category: "banana_byproducts" },
  { id: "banana_flower", category: "banana_byproducts" },
  { id: "banana_leaf", category: "banana_byproducts" },
  { id: "banana_fiber", category: "banana_byproducts" },

  // Types of Keerai
  { id: "murungai_keerai", category: "keerai" },
  { id: "agathi_keerai", category: "keerai" },
  { id: "siru_keerai", category: "keerai" },
  { id: "palak_keerai", category: "keerai" },
  { id: "vallarai_keerai", category: "keerai" },
  { id: "ponnanganni_keerai", category: "keerai" },

  // Fresh Vegetables
  { id: "drumstick", category: "vegetables" },
  { id: "ladies_finger", category: "vegetables" },
  { id: "tomato", category: "vegetables" },
  { id: "brinjal", category: "vegetables" },
  { id: "onion", category: "vegetables" },
  { id: "carrot", category: "vegetables" },
  { id: "cabbage", category: "vegetables" },
  { id: "beans", category: "vegetables" },
  { id: "chilli", category: "vegetables" },
  { id: "beetroot", category: "vegetables" },
  { id: "coconut", category: "vegetables" },
];

const REGIONS = ["Tirunelveli", "Madurai", "Nagercoil", "Tuticorin", "Tenkasi"];

const QUICK_VOICE_SAMPLES = [
  { text: "50 கிலோ மரவள்ளிக்கிழங்கு 30 ரூபாய்", label: "50kg Tapioca @ ₹30" },
  { text: "100 கிலோ சேனைக்கிழங்கு 45 ரூபாய்", label: "100kg Yam @ ₹45" },
  { text: "200 கிலோ பொன்னி நெல் 38 ரூபாய்", label: "200kg Ponni Nell @ ₹38" },
  { text: "30 கிலோ முருங்கைக்கீரை 20 ரூபாய்", label: "30kg Murungai Keerai @ ₹20" },
  { text: "40 கிலோ வெண்டைக்காய் 35 ரூபாய்", label: "40kg Ladies Finger @ ₹35" }
];

export default function ListCrop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, showToast, lang } = useApp();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    crop_name: location.state?.crop_name || "yam",
    region: location.state?.region || "Tirunelveli",
    quantity_kg: location.state?.quantity_kg || "50",
    price_per_kg: location.state?.price_per_kg || "35",
    harvest_timestamp: new Date().toISOString().slice(0, 16),
    latitude: 8.7139,
    longitude: 77.7567,
  });

  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("all");
  const [suggestion, setSuggestion] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("Default (Tirunelveli Hub)");

  // --- Live Camera Viewfinder State ---
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedSnapUrl, setCapturedSnapUrl] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Voice AI Real-Time State ---
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceAiStatus, setVoiceAiStatus] = useState("");
  const [aiDetectedData, setAiDetectedData] = useState(null);
  const recognitionRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Live Camera Functions
  const startCamera = async (facing = cameraFacingMode) => {
    setCameraError(null);
    setCapturedSnapUrl(null);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        lang === "ta"
          ? "கேமரா அனுமதி கிடைக்கவில்லை அல்லது கேமரா இணைக்கப்படவில்லை. தயவுசெய்து அனுமதி அளிக்கவும்."
          : "Camera permission denied or camera not found on this device."
      );
    }
  };

  const openCameraModal = () => {
    setShowCameraModal(true);
    startCamera(cameraFacingMode);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCapturedSnapUrl(null);
    setCameraError(null);
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedSnapUrl(dataUrl);

      // Stop camera video stream after snapping
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }
  };

  const confirmCapturedPhoto = () => {
    if (capturedSnapUrl) {
      setCustomPhotoUrl(capturedSnapUrl);
      setForm((prev) => ({
        ...prev,
        harvest_timestamp: new Date().toISOString().slice(0, 16),
      }));
      showToast(
        lang === "ta"
          ? "📸 உங்கள் நேரடி கேமரா புகைப்படம் இணைக்கப்பட்டது!"
          : "📸 Live camera harvest photo attached!",
        "success"
      );
      stopCamera();
    }
  };

  const switchCameraFacing = () => {
    const newFacing = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(newFacing);
    startCamera(newFacing);
  };

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // Voice AI Parser Handler
  const processVoiceAiCommand = (rawText) => {
    if (!rawText) return;
    const parsed = parseTamilVoiceCommand(rawText);
    if (parsed && parsed.crop_name) {
      setAiDetectedData(parsed);
      setForm((prev) => ({
        ...prev,
        crop_name: parsed.crop_name,
        quantity_kg: parsed.quantity_kg || prev.quantity_kg,
        price_per_kg: parsed.estimated_price_per_kg || prev.price_per_kg,
        harvest_timestamp: new Date().toISOString().slice(0, 16),
      }));

      setVoiceAiStatus(
        lang === "ta"
          ? `✓ AI கண்டறிந்தது: ${getCropDisplayName(parsed.crop_name, "ta")} (${parsed.quantity_kg} கிலோ @ ₹${parsed.estimated_price_per_kg}/கிலோ)`
          : `✓ Voice AI Identified: ${getCropDisplayName(parsed.crop_name, "en")} (${parsed.quantity_kg} kg @ ₹${parsed.estimated_price_per_kg}/kg)`
      );

      showToast(
        `🤖 Voice AI: ${getCropDisplayName(parsed.crop_name, lang)} auto-filled!`,
        "success"
      );
    }
  };

  // Toggle Microphone with explicit permission request
  const toggleVoiceAiListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        "Speech Recognition is not supported on this browser. Please use Chrome/Edge or click a quick sample below.",
        "warning"
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // 1. Explicitly prompt user for mic permission
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        showToast("⚠️ Microphone access is blocked. Please click the 🔒 icon in the URL bar to allow microphone access.", "error");
        return;
      }
    }

    // 2. Clean up any previous recognition instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "ta" ? "ta-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceAiStatus(
          lang === "ta"
            ? "🎧 குரல் கேட்டுக்கொண்டிருக்கிறது... பேசுங்கள்..."
            : "🎧 Listening in real-time... Speak your crop and price..."
        );
      };

      recognition.onresult = (event) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setVoiceTranscript(currentText);

        if (currentText.trim()) {
          processVoiceAiCommand(currentText);
        }
      };

      recognition.onerror = (event) => {
        console.warn("ListCrop speech error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          showToast("Microphone is blocked. Click the lock 🔒 icon in the address bar to allow.", "warning");
        } else if (event.error === "network") {
          showToast("Speech service error. Click any 1-Click quick sample button below.", "info");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setVoiceTranscript("");
      setAiDetectedData(null);
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition in ListCrop:", err);
      setIsListening(false);
    }
  };

  // When farmer clicks on a produce photo
  const handleSelectProducePhoto = (cropId) => {
    setForm((prev) => ({
      ...prev,
      crop_name: cropId,
      harvest_timestamp: new Date().toISOString().slice(0, 16),
    }));
    setCustomPhotoUrl(null);
    showToast(
      `✓ ${getCropDisplayName(cropId, lang)} ${
        lang === "ta" ? "தேர்ந்தெடுக்கப்பட்டது! விலை கணக்கிடப்படுகிறது..." : "Selected! Price calculating..."
      }`,
      "success"
    );
  };

  // Farmer uploads photo from gallery
  const handleFileGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCustomPhotoUrl(previewUrl);
      showToast(
        lang === "ta" ? "📸 உங்கள் புகைப்பட கோப்பு இணைக்கப்பட்டது!" : "📸 Custom photo attached!",
        "success"
      );
      stopCamera();
    }
  };

  // Auto-fetch AI price suggestion when crop or region changes
  const fetchPriceSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const res = await api.post("/listings/price-suggestion", {
        crop_name: form.crop_name,
        region: form.region,
      });
      setSuggestion(res.data);
      if (res.data.predicted_min) {
        const mid = Math.round((res.data.predicted_min + res.data.predicted_max) / 2);
        setForm((prev) => ({ ...prev, price_per_kg: mid }));
      }
    } catch (err) {
      setSuggestion({ predicted_min: 25, predicted_max: 35 });
    }
    setLoadingSuggestion(false);
  };

  useEffect(() => {
    fetchPriceSuggestion();
  }, [form.crop_name, form.region]);

  const handleUseGps = () => {
    if ("geolocation" in navigator) {
      setGpsStatus("Detecting GPS coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
          setGpsStatus(`GPS Locked: ${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°`);
          showToast("GPS Location acquired successfully!", "success");
        },
        () => {
          setGpsStatus("Using Tirunelveli Hub (8.7139° N, 77.7567° E)");
          showToast("Using default Tirunelveli coordinates.", "info");
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login as a farmer to publish a listing.", "error");
      navigate("/login/farmer");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/listings", {
        ...form,
        quantity_kg: Number(form.quantity_kg),
        price_per_kg: Number(form.price_per_kg),
        ai_suggested_price_min: suggestion?.predicted_min,
        ai_suggested_price_max: suggestion?.predicted_max,
      });
      showToast(
        `🎉 ${getCropDisplayName(form.crop_name, lang)} ${
          lang === "ta" ? "வெற்றிகரமாக இணையதளத்தில் வெளியிடப்பட்டது!" : "successfully published to live website!"
        }`,
        "success"
      );
      navigate("/marketplace");
    } catch (err) {
      showToast(err.response?.data?.error || "Error publishing listing. Check farmer login status.", "error");
    }
    setSubmitting(false);
  };

  const displayedImage = customPhotoUrl || CROP_IMAGES[form.crop_name.toLowerCase()] || CROP_IMAGES.default;

  const filteredCrops = CROPS_LIST.filter(
    (c) => selectedFilterCategory === "all" || c.category === selectedFilterCategory
  );

  return (
    <div>
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileGalleryUpload}
        style={{ display: "none" }}
      />

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132", borderColor: "#a7f3d0" }}>
            <Sprout size={14} /> {lang === "ta" ? "உழவர் நேரடி விற்பனை தளம்" : "Farmer Direct Listing Portal"}
          </span>
          <span className="page-badge" style={{ background: "#fef3c7", color: "#92400e", borderColor: "#fde68a" }}>
            <Camera size={14} /> {lang === "ta" ? "நேரடி கேமரா படம் பிடிக்கலாம்" : "Live Camera Capture"}
          </span>
        </div>
        <h1 className="page-title">
          {lang === "ta" ? "விளைபொருளை தேர்வு செய்து இணையதளத்தில் விற்கவும்" : "Select Harvest Photo & Send to Website"}
        </h1>
        <p className="page-subtitle">
          {lang === "ta"
            ? "நீங்கள் அறுவடை செய்த விளைபொருளின் புகைப்படத்தை தொடுங்கள் அல்லது நேரடி கேமரா மூலம் படம் பிடித்து, நேரடியாக சந்தை இணையதளத்தில் வெளியிடவும்."
            : "Harvested your crop? Click the produce photo below or open live camera to take a fresh field photo, review AI fair price, and send it straight to the live website!"}
        </p>
      </div>

      {/* ==================== 1. VISUAL HARVEST PHOTO PICKER ==================== */}
      <div className="card" style={{ padding: "20px", marginBottom: "28px", border: "2px solid #a7f3d0", background: "#f0fdf4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
          <div>
            <strong style={{ fontSize: "1.1rem", color: "#065f46", display: "flex", alignItems: "center", gap: "8px" }}>
              <ImageIcon size={20} color="#059669" /> 
              {lang === "ta" ? "1. அறுவடை செய்த பயிரின் படத்தை தொடவும் (Click Product Image):" : "1. Click the Produce Photo You Harvested:"}
            </strong>
            <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#047857" }}>
              {lang === "ta" ? "படத்தின் கீழ் உள்ள பெயர் தமிழ் மற்றும் ஆங்கிலத்தில் மாறும்." : "Photos and names dynamically switch between Tamil & English."}
            </p>
          </div>

          {/* Live Camera Viewfinder Launcher Button */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={openCameraModal}
              className="btn"
              style={{ background: "#0f5132", color: "#fff", padding: "9px 18px", fontSize: "0.88rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 8px rgba(15, 81, 50, 0.25)" }}
            >
              <Camera size={18} /> {lang === "ta" ? "📷 கேமரா மூலம் படம் பிடிக்க" : "📷 Open Live Camera"}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn"
              style={{ background: "#ffffff", color: "#334155", border: "1.5px solid #cbd5e1", padding: "9px 14px", fontSize: "0.85rem", fontWeight: "700" }}
              title="Upload from Device Storage"
            >
              <FolderOpen size={16} /> {lang === "ta" ? "கேலரி" : "Gallery"}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "10px", marginBottom: "14px" }}>
          {AGRI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFilterCategory(cat.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                border: selectedFilterCategory === cat.id ? "2px solid #0f5132" : "1px solid #cbd5e1",
                background: selectedFilterCategory === cat.id ? "#0f5132" : "#ffffff",
                color: selectedFilterCategory === cat.id ? "#ffffff" : "#334155",
                fontWeight: selectedFilterCategory === cat.id ? "800" : "500",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{cat.icon}</span>
              <span>{lang === "ta" ? cat.label_ta : cat.label_en}</span>
            </button>
          ))}
        </div>

        {/* Responsive Photo Selector Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "12px",
          maxHeight: "280px",
          overflowY: "auto",
          padding: "4px"
        }}>
          {filteredCrops.map((c) => {
            const isSelected = form.crop_name === c.id;
            const cropImg = CROP_IMAGES[c.id] || CROP_IMAGES.default;
            const displayName = getCropDisplayName(c.id, lang);

            return (
              <div
                key={c.id}
                onClick={() => handleSelectProducePhoto(c.id)}
                style={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: isSelected ? "3px solid #0f5132" : "1.5px solid #cbd5e1",
                  background: isSelected ? "#dcfce7" : "#ffffff",
                  boxShadow: isSelected ? "0 4px 12px rgba(15,81,50,0.25)" : "0 1px 3px rgba(0,0,0,0.08)",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {isSelected && (
                  <div style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "#0f5132",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                  }}>
                    <Check size={14} />
                  </div>
                )}

                <div style={{ height: "90px", width: "100%", overflow: "hidden" }}>
                  <img
                    src={cropImg}
                    alt={c.id}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = "/images/crops/default.jpg"; }}
                  />
                </div>

                {/* Produce Name Under Image */}
                <div style={{ padding: "6px 8px", textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{
                    fontSize: "0.76rem",
                    fontWeight: isSelected ? "800" : "600",
                    color: isSelected ? "#0f5132" : "#1e293b",
                    lineHeight: "1.2",
                  }}>
                    {displayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== 2. DETAILS & VOICE AI FORM ==================== */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "32px", alignItems: "start" }}>
        
        {/* Left: Listing Controls */}
        <form className="card" onSubmit={handleSubmit} style={{ padding: "28px" }}>
          <strong style={{ fontSize: "1.15rem", display: "block", marginBottom: "16px", color: "#083320" }}>
            2. {lang === "ta" ? "அளவு மற்றும் விலையை உறுதிசெய்க" : "Confirm Quantity & Price"}
          </strong>

          {/* ==================== VOICE AI ENGINE ==================== */}
          <div style={{
            background: isListening 
              ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" 
              : "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
            border: isListening ? "2px solid #ef4444" : "1.5px solid #0284c7",
            borderRadius: "14px",
            padding: "16px 18px",
            marginBottom: "22px",
            boxShadow: isListening ? "0 0 15px rgba(239, 68, 68, 0.3)" : "none",
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: isListening ? "#ef4444" : "#0284c7",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Bot size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: "0.95rem", color: isListening ? "#991b1b" : "#0369a1" }}>
                    🎙️ Voice AI ({lang === "ta" ? "செயற்கை நுண்ணறிவு குரல் உதவியாளர்" : "Intelligent Speech-to-Listing"})
                  </strong>
                </div>
              </div>

              {/* Status Pill */}
              <span style={{
                fontSize: "0.74rem",
                padding: "3px 10px",
                borderRadius: "20px",
                fontWeight: "800",
                background: isListening ? "#dc2626" : "#0284c7",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <Radio size={12} className={isListening ? "spin" : ""} />
                {isListening ? (lang === "ta" ? "🔴 நேரடி பதிவு" : "🔴 Listening...") : (lang === "ta" ? "குரல் AI தயார்" : "Voice AI Ready")}
              </span>
            </div>

            {/* Live Mic Action & Transcript Area */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={toggleVoiceAiListening}
                className="btn"
                style={{
                  background: isListening ? "#dc2626" : "#0284c7",
                  color: "#ffffff",
                  padding: "10px 18px",
                  fontSize: "0.9rem",
                  fontWeight: "800",
                  borderRadius: "10px",
                  boxShadow: isListening ? "0 0 12px rgba(220, 38, 38, 0.5)" : "0 2px 6px rgba(2, 132, 199, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isListening ? (lang === "ta" ? "நிறுத்துக (Stop Mic)" : "Stop Mic") : (lang === "ta" ? "🎙️ பேசுங்கள் (Speak Now)" : "🎙️ Speak to Voice AI")}</span>
              </button>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <input
                  type="text"
                  value={voiceTranscript}
                  onChange={(e) => {
                    setVoiceTranscript(e.target.value);
                    processVoiceAiCommand(e.target.value);
                  }}
                  placeholder={lang === "ta" ? "பேசவும் அல்லது தட்டச்சு செய்யவும்: எ.கா. '100 கிலோ மரவள்ளிக்கிழங்கு 35 ரூபாய்'" : "Speak or type e.g. '100 kg tapioca 35 rupees'..."}
                  style={{
                    margin: 0,
                    padding: "9px 12px",
                    fontSize: "0.85rem",
                    background: "#ffffff",
                    borderColor: isListening ? "#f87171" : "#cbd5e1",
                  }}
                />
              </div>
            </div>

            {/* Voice AI Real-Time Feedback */}
            {voiceAiStatus && (
              <div style={{
                background: "#ffffff",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                color: isListening ? "#dc2626" : "#065f46",
                fontWeight: "700",
                marginBottom: "10px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <Sparkles size={14} color={isListening ? "#dc2626" : "#059669"} />
                {voiceAiStatus}
              </div>
            )}

            {/* Quick Sample Voice Prompts for Farmers */}
            <div>
              <div style={{ fontSize: "0.74rem", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
                🗣️ {lang === "ta" ? "மாதிரி குரல் சொற்றொடர்கள் (Quick Voice Samples - Click to Auto-Run):" : "Quick Voice Samples (Click to test Voice AI):"}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {QUICK_VOICE_SAMPLES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setVoiceTranscript(s.text);
                      processVoiceAiCommand(s.text);
                    }}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #93c5fd",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "0.76rem",
                      color: "#1e40af",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>🎙️</span> {lang === "ta" ? s.text : s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                {lang === "ta" ? "தேர்ந்தெடுக்கப்பட்ட பயிர்" : "Selected Crop"}
              </label>
              <input
                type="text"
                disabled
                value={getCropDisplayName(form.crop_name, lang)}
                style={{ background: "#f8fafc", fontWeight: "800", color: "#0f5132" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                {lang === "ta" ? "மண்டலம் / மாவட்டம்" : "Region / Hub"}
              </label>
              <select name="region" value={form.region} onChange={handleChange}>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    📍 {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                {lang === "ta" ? "அறுவடை அளவு (Quantity in kg)" : "Harvest Quantity (kg)"}
              </label>
              <input
                type="number"
                name="quantity_kg"
                value={form.quantity_kg}
                onChange={handleChange}
                placeholder="e.g. 100"
                required
                min="1"
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                {lang === "ta" ? "விற்பனை விலை (₹/kg)" : "Your Price (₹/kg)"}
              </label>
              <input
                type="number"
                name="price_per_kg"
                value={form.price_per_kg}
                onChange={handleChange}
                placeholder="e.g. 35"
                required
                min="1"
              />
            </div>
          </div>

          {/* AI Mandi Benchmark */}
          {suggestion && (
            <div style={{ background: "#e8f5e9", border: "1px solid #a7f3d0", padding: "10px 14px", borderRadius: "8px", marginBottom: "18px", fontSize: "0.84rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#0f5132", fontWeight: "700" }}>
                🤖 AI Mandi Fair Benchmark:
              </span>
              <strong style={{ color: "#083320" }}>
                ₹{suggestion.predicted_min} – ₹{suggestion.predicted_max}/kg
              </strong>
            </div>
          )}

          {/* GPS Location Pin */}
          <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Farm Coordinates:</div>
              <div style={{ fontSize: "0.84rem", fontWeight: "700", color: "#1e293b" }}>{gpsStatus}</div>
            </div>
            <button
              type="button"
              onClick={handleUseGps}
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            >
              <MapPin size={13} /> {lang === "ta" ? "GPS எடு" : "Auto-Locate"}
            </button>
          </div>

          {/* Submit Button to Send to Website */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "1.05rem", fontWeight: "800", justifyContent: "center", background: "#0f5132" }}
          >
            <Send size={18} />
            <span>
              {submitting
                ? "Publishing..."
                : lang === "ta"
                ? "🌾 இணையதளத்தில் வெளியிடு (Send to Website)"
                : "🌾 Send & Publish to Website"}
            </span>
          </button>
        </form>

        {/* Right: Live Marketplace Preview Card */}
        <div className="card" style={{ padding: "24px", position: "sticky", top: "24px" }}>
          <strong style={{ fontSize: "1rem", color: "#083320", display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <Sparkles size={18} color="#0f5132" /> 
            {lang === "ta" ? "நேரடி முன்னோட்டம் (Website Preview)" : "Live Marketplace Website Preview"}
          </strong>

          {/* Preview Produce Card */}
          <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ position: "relative", height: "180px" }}>
              <img
                src={displayedImage}
                alt={form.crop_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.currentTarget.src = "/images/crops/default.jpg"; }}
              />
              <span style={{ position: "absolute", top: "10px", left: "10px", background: "#0f5132", color: "#fff", fontSize: "0.72rem", fontWeight: "800", padding: "3px 8px", borderRadius: "20px" }}>
                ✓ Grade A+ Fresh (0h ago)
              </span>
              <span style={{ position: "absolute", bottom: "10px", right: "10px", background: "#fff", color: "#0f5132", fontSize: "0.9rem", fontWeight: "800", padding: "4px 10px", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                ₹{form.price_per_kg || 35}/kg
              </span>
            </div>

            <div style={{ padding: "16px" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.15rem", color: "#083320" }}>
                {CROP_ICONS[form.crop_name.toLowerCase()] || "🌱"} {getCropDisplayName(form.crop_name, lang)}
              </h3>
              
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "10px" }}>
                🧑‍🌾 Farmer: <strong>{user?.name || "Murugan K."}</strong> · 📍 {form.region} Hub
              </div>

              <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: "6px", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Listed Stock:</span>
                <strong style={{ color: "#0f5132" }}>{form.quantity_kg || 50} kg</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ==================== 3. LIVE CAMERA VIEWFINDER MODAL ==================== */}
      {showCameraModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}>
          <div className="card" style={{
            maxWidth: "560px",
            width: "100%",
            background: "#083320",
            color: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            position: "relative",
            boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Camera size={20} color="#10b981" />
                <strong style={{ fontSize: "1.1rem" }}>
                  {lang === "ta" ? "நேரடி பண்ணை கேமரா (Live Farm Camera)" : "Live Farm Field Camera"}
                </strong>
              </div>
              <button
                onClick={stopCamera}
                style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "4px" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Hidden canvas for snapshot rendering */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Live Camera Viewport / Captured Preview */}
            <div style={{
              position: "relative",
              width: "100%",
              height: "320px",
              background: "#000000",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              border: "2px solid #10b981",
            }}>
              {cameraError ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#fca5a5" }}>
                  <AlertCircle size={36} style={{ margin: "0 auto 8px" }} />
                  <p style={{ margin: "0 0 14px", fontSize: "0.9rem" }}>{cameraError}</p>
                  <button
                    onClick={() => startCamera(cameraFacingMode)}
                    className="btn"
                    style={{ background: "#10b981", color: "#fff", padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    <RefreshCw size={14} /> Retry Camera
                  </button>
                </div>
              ) : capturedSnapUrl ? (
                // Show captured photo preview
                <img
                  src={capturedSnapUrl}
                  alt="Captured Crop"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                // Show live camera video feed
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Viewfinder Target Guidelines */}
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    right: "20px",
                    bottom: "20px",
                    border: "2px dashed rgba(255,255,255,0.5)",
                    borderRadius: "8px",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: "10px",
                  }}>
                    <span style={{
                      background: "rgba(0,0,0,0.6)",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      padding: "3px 10px",
                      borderRadius: "12px",
                    }}>
                      🎯 {lang === "ta" ? "விளைபொருளை கட்டத்திற்குள் வைக்கவும்" : "Align harvest inside frame"}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Camera Controls Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {!capturedSnapUrl ? (
                <>
                  <button
                    type="button"
                    onClick={switchCameraFacing}
                    className="btn"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", fontSize: "0.85rem" }}
                    title="Switch Front / Rear Camera"
                  >
                    <RefreshCw size={16} /> {lang === "ta" ? "கேமரா மாற்று" : "Flip Cam"}
                  </button>

                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="btn"
                    style={{
                      background: "#10b981",
                      color: "#083320",
                      padding: "12px 28px",
                      fontSize: "1rem",
                      fontWeight: "800",
                      borderRadius: "30px",
                      boxShadow: "0 0 15px rgba(16, 185, 129, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Camera size={20} />
                    <span>{lang === "ta" ? "📸 படம் எடு (Snap Now)" : "📸 Snap Photo"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "10px 14px", fontSize: "0.85rem" }}
                  >
                    <FolderOpen size={16} /> {lang === "ta" ? "கேலரி" : "Gallery"}
                  </button>
                </>
              ) : (
                // Captured Photo Confirmation Controls
                <>
                  <button
                    type="button"
                    onClick={() => startCamera(cameraFacingMode)}
                    className="btn"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "10px 18px", fontSize: "0.88rem", fontWeight: "700" }}
                  >
                    <RotateCcw size={16} /> {lang === "ta" ? "மீண்டும் எடுக்க (Retake)" : "Retake"}
                  </button>

                  <button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    className="btn"
                    style={{
                      background: "#10b981",
                      color: "#083320",
                      padding: "10px 24px",
                      fontSize: "0.95rem",
                      fontWeight: "800",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Check size={18} /> {lang === "ta" ? "இப்படத்தை பயன்படுத்து (Use Photo)" : "Use This Photo"}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
