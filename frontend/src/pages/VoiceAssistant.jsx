import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { parseTamilVoiceCommand } from "../utils/tamilVoiceParser";
import { CROP_IMAGES, CROP_ICONS } from "../utils/agriData";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  ShieldCheck,
  Bot,
  HelpCircle,
  TrendingUp,
  Coins,
  PackageCheck
} from "lucide-react";

const SAMPLES = [
  { 
    ta: "மாம்பழம் விலை என்ன?", 
    en: "What is today's mango market price?",
    type: "check_price",
    crop: "mango",
    qty: null
  },
  { 
    ta: "அஞ்சு கிலோ வெண்டிங்காக எவ்ளோ?", 
    en: "What is the price of 5 kg ladies finger / okra?",
    type: "check_price",
    crop: "ladies_finger",
    qty: 5
  },
  { 
    ta: "50 கிலோ வெண்டைக்காய் 35 ரூபாய் விற்க வேண்டும்", 
    en: "I want to list 50 kg ladies finger at ₹35",
    type: "list_crop",
    crop: "ladies_finger",
    qty: 50
  },
  { 
    ta: "100 கிலோ சேனைக்கிழங்கு 45 ரூபாய் விற்க வேண்டும்", 
    en: "I want to list 100 kg yam at ₹45",
    type: "list_crop",
    crop: "yam",
    qty: 100
  },
  { 
    ta: "இன்றைய மரவள்ளிக்கிழங்கு விலை என்ன?", 
    en: "What is today's tapioca price?",
    type: "check_price",
    crop: "tapioca",
    qty: null
  },
  { 
    ta: "200 கிலோ பொன்னி நெல் 38 ரூபாய்", 
    en: "200 kg Ponni rice at ₹38",
    type: "list_crop",
    crop: "ponni_rice",
    qty: 200
  },
  { 
    ta: "நாளைக்கு 50 கிலோ தக்காளி விற்க வேண்டும்", 
    en: "I want to sell 50 kg tomatoes tomorrow",
    type: "list_crop",
    crop: "tomato",
    qty: 50
  },
];

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const { lang, showToast } = useApp();

  const [transcript, setTranscript] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState("ta-IN");
  const [permissionStatus, setPermissionStatus] = useState("unknown"); // 'granted' | 'denied' | 'prompt' | 'unknown'

  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Check initial browser permission status if supported
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "microphone" }).then((perm) => {
        setPermissionStatus(perm.state);
        perm.onchange = () => setPermissionStatus(perm.state);
      }).catch(() => {});
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Tamil text-to-speech audio feedback
  const speakResponse = (message) => {
    if ("speechSynthesis" in window && message) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "ta-IN";
      utterance.rate = 0.95; // Clear and easy to follow for rural farmers
      utterance.pitch = 1.0;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Explicitly trigger browser microphone permission popup
  const requestMicPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately stop tracks to release mic hardware for SpeechRecognition
        stream.getTracks().forEach((track) => track.stop());
        setPermissionStatus("granted");
        return true;
      }
      return true;
    } catch (err) {
      console.warn("Microphone access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionStatus("denied");
        showToast("⚠️ Microphone access is blocked. Please click the 🔒 (lock) icon in your address bar and Allow Microphone!", "error");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        showToast("⚠️ No microphone hardware found. Please connect a microphone or headset.", "warning");
      } else {
        showToast(`⚠️ Microphone error: ${err.message}`, "warning");
      }
      return false;
    }
  };

  // Toggle or start speech recognition
  const toggleMic = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge!", "warning");
      handleSelectSample(SAMPLES[0]);
      return;
    }

    if (listening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setListening(false);
      return;
    }

    // 1. Explicitly prompt user for mic permission
    const granted = await requestMicPermission();
    if (!granted) {
      return;
    }

    // 2. Clean up any previous recognition instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedVoiceLang;

      recognition.onstart = () => {
        setListening(true);
        showToast(
          selectedVoiceLang === "ta-IN" 
            ? "🎙️ மைக் தயாராக உள்ளது! தமிழில் பேசவும்..." 
            : "🎙️ Microphone is LIVE! Speak your crop details now...", 
          "info"
        );
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const currentText = (final + interim).trim();

        if (currentText) {
          setTranscript(currentText);
          setManualInput(currentText);

          // Instantly parse and show details automatically in real-time
          const result = parseTamilVoiceCommand(currentText);
          if (result) {
            setParsedData(result);
          }

          // Debounced automatic speech response when user pauses
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => {
            if (result && !speaking && result.speech_response_ta) {
              speakResponse(result.speech_response_ta);
            }
          }, 1500);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setPermissionStatus("denied");
          showToast("Microphone access was blocked. Please click the 🔒 icon in the address bar to Allow Microphone.", "warning");
          setListening(false);
        } else if (event.error === "no-speech") {
          console.log("No speech detected yet. Still listening...");
        } else if (event.error === "network") {
          showToast("Speech service network error. Try switching to English or click the 1-Click sample buttons below.", "warning");
          setListening(false);
        } else if (event.error === "audio-capture") {
          showToast("No audio received. Please check your microphone connection.", "error");
          setListening(false);
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setListening(false);
    }
  };

  // Handle Preset Sample Click (Instant Viva Demo)
  const handleSelectSample = (sample) => {
    setTranscript(sample.ta);
    setManualInput(sample.ta);
    const result = parseTamilVoiceCommand(sample.ta);
    setParsedData(result);
    if (result) {
      speakResponse(result.speech_response_ta);
      showToast("✓ Voice command recognized & parsed automatically!", "success");
    }
  };

  // Handle Manual Text Analysis
  const handleManualAnalyze = (e) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) {
      showToast("Please enter or speak a phrase (e.g. '50 kg tomato 30 rupees')", "info");
      return;
    }
    setTranscript(manualInput);
    const result = parseTamilVoiceCommand(manualInput);
    setParsedData(result);
    if (result) {
      speakResponse(result.speech_response_ta);
      showToast("✓ Text parsed successfully by NLP engine!", "success");
    }
  };

  // 1-Click Action Execution
  const handleExecuteAction = () => {
    if (!parsedData) return;

    if (parsedData.intent === "list_crop") {
      navigate("/list-crop", {
        state: {
          crop_name: parsedData.crop_name || "tomato",
          quantity_kg: parsedData.quantity_kg || 50,
          price_per_kg: parsedData.estimated_price_per_kg,
        },
      });
    } else if (parsedData.intent === "check_price") {
      navigate("/ai/price-insights", {
        state: {
          crop_name: parsedData.crop_name || "mango",
          region: "Tirunelveli",
        },
      });
    } else if (parsedData.intent === "buy_crop") {
      navigate("/marketplace", {
        state: {
          crop_name: parsedData.crop_name,
        },
      });
    } else {
      navigate("/my-orders");
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: "center", marginBottom: "28px" }}>
        <span className="page-badge">
          <Sparkles size={14} color="#f59e0b" /> Real-time Speech-to-Intent NLP · தமிழ் & English
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "🧑‍🌾 உழவர் குரல் வழி AI உதவியாளர்" : "🧑‍🌾 Smart Farmer Voice Assistant"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto", maxWidth: "680px" }}>
          {lang === "ta"
            ? "எந்தவித தட்டச்சுமின்றி நேரடியாக தமிழில் பேசினாலே விவரங்கள் தானாகத் தோன்றி உங்கள் விளைபொருட்களை ஒரே கிளிக்கில் விற்கலாம்."
            : "Simply speak naturally in Tamil or English. The AI automatically detects your crop, calculates fair market value, and creates instant listings."}
        </p>
      </div>

      {/* Browser Permission Help Banner if blocked */}
      {permissionStatus === "denied" && (
        <div style={{
          background: "#fef2f2",
          border: "1.5px solid #ef4444",
          borderRadius: "12px",
          padding: "14px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#991b1b", fontSize: "0.9rem" }}>
            <span style={{ fontSize: "1.4rem" }}>🔒</span>
            <div>
              <strong>Microphone is blocked in browser settings.</strong>
              <div style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: "2px" }}>
                Click the 🔒 icon next to <code>localhost:5000</code> in your browser address bar ➔ Set Microphone to <strong>Allow</strong> ➔ Refresh page.
              </div>
            </div>
          </div>
          <button
            onClick={toggleMic}
            className="btn btn-sm"
            style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700" }}
          >
            Retry Mic Access
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "32px", alignItems: "start" }}>
        
        {/* Left Column: Big Interactive Voice Orb & Live Mic Controls */}
        <div className="voice-orb-container" style={{ padding: "36px 24px", position: "relative" }}>
          
          {/* Top Bar inside Orb Box */}
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ 
              fontSize: "0.82rem", 
              color: listening ? "#fbbf24" : "#a7f3d0", 
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              {listening ? (
                <>
                  <span className="pulse-dot" style={{ width: "10px", height: "10px", background: "#ef4444" }} />
                  கேட்கிறது... பேசுங்கள் (LISTENING LIVE)
                </>
              ) : (
                "மைக்கை தொட்டு பேசவும்"
              )}
            </span>

            <select
              value={selectedVoiceLang}
              onChange={(e) => setSelectedVoiceLang(e.target.value)}
              style={{ 
                width: "auto", 
                background: "rgba(255,255,255,0.18)", 
                color: "#ffffff", 
                border: "1px solid rgba(255,255,255,0.3)", 
                padding: "6px 12px", 
                borderRadius: "8px", 
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              <option value="ta-IN" style={{ color: "#000" }}>🇮🇳 தமிழ் (Tamil - India)</option>
              <option value="en-IN" style={{ color: "#000" }}>🇮🇳 English (India)</option>
            </select>
          </div>

          {/* Big Glowing Circular Pulsing Voice Button */}
          <div
            className={`voice-orb-interactive ${listening ? "listening" : ""}`}
            onClick={toggleMic}
            style={{ cursor: "pointer", margin: "32px 0 20px" }}
            title={listening ? "Click to stop listening" : "Click to speak into microphone"}
          >
            {listening ? (
              <MicOff size={58} color="#ffffff" />
            ) : (
              <Mic size={58} color="#ffffff" />
            )}
          </div>

          {/* Sound Wave Animation */}
          <div className="voice-soundwave" style={{ marginBottom: "16px" }}>
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
            <div className="soundwave-bar" style={{ animationPlayState: listening || speaking ? "running" : "paused" }} />
          </div>

          <h3 style={{ fontSize: "1.2rem", color: "#ffffff", fontWeight: "800", margin: "0 0 6px" }}>
            {listening ? "🎙️ நாங்கள் கேட்கிறோம்... பேசவும்" : "மைக்கை தொட்டு தமிழில் பேசவும்"}
          </h3>
          <p style={{ color: "#d1fae5", fontSize: "0.88rem", maxWidth: "340px", margin: "0 auto" }}>
            {listening 
              ? "எ.கா: '50 கிலோ தக்காளி விற்க வேண்டும்' அல்லது 'வெங்காயம் விலை என்ன'"
              : "Click the glowing mic button above and speak your crop & quantity naturally."}
          </p>

          {speaking && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: "8px", 
              color: "#fbbf24", 
              fontSize: "0.88rem", 
              marginTop: "16px",
              background: "rgba(0,0,0,0.25)",
              padding: "8px 16px",
              borderRadius: "999px"
            }}>
              <Volume2 size={18} />
              <strong>குரல் வழிகாட்டி பேசுகிறது (Speaking Audio Response...)</strong>
            </div>
          )}

          {/* Quick Clear Button */}
          {transcript && (
            <button
              onClick={() => {
                setTranscript("");
                setManualInput("");
                setParsedData(null);
              }}
              style={{
                position: "absolute",
                bottom: "12px",
                right: "16px",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#ffffff",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RotateCcw size={12} /> Clear
            </button>
          )}
        </div>

        {/* Right Column: Live Recognized Details & Automatic Action Cards */}
        <div>
          
          {/* Live Transcript & Manual Input Box */}
          <div className="card" style={{ marginBottom: "20px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ margin: 0, fontWeight: "700", color: "#083320" }}>
                🎙️ நீங்கள் பேசியது (Live Speech / Text Input):
              </label>
              {transcript && (
                <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: "800", background: "#e8f5e9", padding: "2px 8px", borderRadius: "999px" }}>
                  ✓ பகுப்பாய்வு செய்யப்பட்டது
                </span>
              )}
            </div>

            <form onSubmit={handleManualAnalyze} style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="பேசவும் அல்லது தட்டச்சு செய்யவும் (e.g. 50 கிலோ தக்காளி 30 ரூபாய்)"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#083320",
                  background: "#f8fafc"
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "0 20px", fontWeight: "700", whiteSpace: "nowrap" }}
              >
                பகுப்பாய்வு செய் (Analyze)
              </button>
            </form>

            <div style={{ 
              background: "#f1f5f9", 
              border: "1px dashed #cbd5e1", 
              borderRadius: "8px", 
              padding: "10px 14px",
              marginTop: "12px",
              fontSize: "0.88rem",
              color: transcript ? "#083320" : "#64748b",
              fontWeight: transcript ? "700" : "500",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>🎙️</span>
              {transcript ? (
                <span>கண்டறியப்பட்ட பேச்சு: <em>"{transcript}"</em></span>
              ) : (
                <span>மைக்கை அழுத்தி பேசினால் வார்த்தைகள் இங்கே தானாக தோன்றும் (அல்லது மேலே டைப் செய்யவும்).</span>
              )}
            </div>
          </div>

          {/* AUTOMATIC DETAILS CARD — Renders IMMEDIATELY without extra clicks */}
          {parsedData && (
            <div
              className="card"
              style={{
                marginBottom: "24px",
                background: "linear-gradient(135deg, #f0fdf4 0%, #fffbeb 100%)",
                border: "2px solid #10b981",
                padding: "24px",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.18)",
                animation: "fadeIn 0.3s ease-out"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={20} color="#10b981" />
                  <strong style={{ fontSize: "1.1rem", color: "#083320" }}>
                    பகுப்பாய்வு விவரங்கள் (Extracted Crop Details)
                  </strong>
                </div>

                <span style={{ 
                  background: "#0f5132", 
                  color: "#ffffff", 
                  fontSize: "0.76rem", 
                  fontWeight: "800", 
                  padding: "4px 12px", 
                  borderRadius: "999px" 
                }}>
                  {parsedData.intent === "list_crop" ? "📦 விற்பனை பதிவு (Sell Crop)" : "💰 விலை கணிப்பு (Price AI)"}
                </span>
              </div>

              {/* Crop Visual Grid */}
              <div style={{ display: "flex", gap: "18px", alignItems: "center", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "18px" }}>
                <img
                  src={parsedData.crop_image}
                  alt={parsedData.crop_name}
                  style={{ width: "85px", height: "85px", borderRadius: "12px", objectFit: "cover", border: "2px solid #e2e8f0" }}
                  onError={(e) => { e.currentTarget.src = CROP_IMAGES.default; }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "1.4rem" }}>{parsedData.crop_icon}</span>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#083320", textTransform: "capitalize", margin: 0 }}>
                      {parsedData.crop_name_ta} {parsedData.crop_name_en ? `(${parsedData.crop_name_en})` : ""}
                    </h3>
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                    {parsedData.is_crop_recognized ? (
                      <>
                        <div style={{ background: "#e8f5e9", color: "#0f5132", padding: "4px 10px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: "700" }}>
                          ⚖️ அளவு: <strong>{parsedData.quantity_kg} கிலோ (kg)</strong>
                        </div>
                        <div style={{ background: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: "700" }}>
                          💵 நியாயமான விலை: <strong>₹{parsedData.estimated_price_per_kg}/kg</strong>
                        </div>
                        <div style={{ background: "#d1fae5", color: "#059669", padding: "4px 10px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: "800" }}>
                          🌾 மொத்த வருமானம்: <strong>₹{parsedData.estimated_total.toLocaleString()}</strong>
                        </div>
                      </>
                    ) : (
                      <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "6px 12px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: "700" }}>
                        ⚠️ நீங்கள் பேசியதில் பயிரின் பெயர் கண்டறியப்படவில்லை. எ.கா: 'வெண்டைக்காய்', 'சேனைக்கிழங்கு', 'தக்காளி' என்று கூறவும்.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 1-Click Action Button */}
              <button
                onClick={handleExecuteAction}
                className="btn btn-primary"
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  fontSize: "1.08rem", 
                  fontWeight: "800",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 4px 14px rgba(15, 81, 50, 0.3)"
                }}
              >
                <span>{lang === "ta" ? parsedData.action_title_ta : parsedData.action_title_en}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* 1-Click Preset Farmer Prompts (For Instant Viva Demonstration) */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Play size={18} color="#0f5132" />
              <strong style={{ fontSize: "0.95rem", color: "#083320" }}>
                உடனடி மாதிரி குரல் கட்டளைகள் (1-Click Test Prompts):
              </strong>
            </div>

            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "14px" }}>
              Click any of these everyday Tamil farmer phrases to see instant real-time parsing and card generation:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    textAlign: "left",
                    color: "#0f5132",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.background = "#e8f5e9"; 
                    e.currentTarget.style.borderColor = "#10b981"; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.background = "#f8fafc"; 
                    e.currentTarget.style.borderColor = "#e2e8f0"; 
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "0.95rem" }}>
                      🎙️ "{s.ta}"
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                      {s.en}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0f5132", fontWeight: "700", fontSize: "0.8rem" }}>
                    <span>சோதிக்க (Test)</span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
