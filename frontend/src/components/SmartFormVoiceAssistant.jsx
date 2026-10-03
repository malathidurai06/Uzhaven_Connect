import React, { useState, useRef } from "react";
import { Mic, Sparkles, CheckCircle2, Volume2, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { sanitizeSpokenInput } from "./VoiceInputButton";

/**
 * Parses full spoken Tamil/English sentences to populate an entire registration/login form
 */
export function parseFullVoiceForm(transcript, activeRole = "farmer") {
  const result = {};
  const lower = transcript.toLowerCase();

  // 1. Phone Extraction (look for 10 digits or spoken numbers)
  const phoneMatch = transcript.match(/\b[6-9]\d{9}\b/) || transcript.replace(/\D/g, "").match(/[6-9]\d{9}/);
  if (phoneMatch) {
    result.phone = phoneMatch[0];
  } else {
    // Check if phone was spoken with Tamil words
    const spokenSanitized = sanitizeSpokenInput(transcript, "phone");
    if (spokenSanitized && spokenSanitized.length >= 10) {
      result.phone = spokenSanitized.slice(-10);
    }
  }

  // 2. Village / District extraction
  const districts = [
    { key: "ஆலங்குளம்", val: "ஆலங்குளம், தென்காசி" },
    { key: "தென்காசி", val: "ஆலங்குளம், தென்காசி" },
    { key: "பாளையங்கோட்டை", val: "பாளையங்கோட்டை, திருநெல்வேலி" },
    { key: "திருநெல்வேலி", val: "பாளையங்கோட்டை, திருநெல்வேலி" },
    { key: "மேலூர்", val: "மேலூர், மதுரை" },
    { key: "மதுரை", val: "மேலூர், மதுரை" },
    { key: "கோவில்பட்டி", val: "கோவில்பட்டி, தூத்துக்குடி" },
    { key: "தூத்துக்குடி", val: "கோவில்பட்டி, தூத்துக்குடி" },
    { key: "பொள்ளாச்சி", val: "பொள்ளாச்சி, கோயம்புத்தூர்" },
    { key: "கோயம்புத்தூர்", val: "பொள்ளாச்சி, கோயம்புத்தூர்" },
    { key: "மேட்டூர்", val: "மேட்டூர், சேலம்" },
    { key: "சேலம்", val: "மேட்டூர், சேலம்" },
    { key: "கும்பகோணம்", val: "கும்பகோணம், தஞ்சாவூர்" },
    { key: "தஞ்சாவூர்", val: "கும்பகோணம், தஞ்சாவூர்" },
    { key: "ஈரோடு", val: "ஈரோடு, தமிழ்நாடு" },
    { key: "திண்டுக்கல்", val: "திண்டுக்கல், தமிழ்நாடு" },
    { key: "விருதுநகர்", val: "விருதுநகர், தமிழ்நாடு" }
  ];

  for (const dist of districts) {
    if (transcript.includes(dist.key) || lower.includes(dist.key.toLowerCase())) {
      result.village = dist.val;
      break;
    }
  }

  // 3. Name extraction
  // Look for patterns like "பெயர் [Name]" or "name is [Name]" or "நான் [Name]"
  const nameTamilMatch = transcript.match(/(?:பெயர்|நான்)\s+([^\d,.]+(?:\s+[^\d,.]+){0,3})/i);
  const nameEngMatch = transcript.match(/(?:my name is|name is|i am)\s+([a-zA-Z\s]+)/i);

  if (nameTamilMatch && nameTamilMatch[1]) {
    result.name = nameTamilMatch[1].replace(/(ஊர்|எண்|போன்|கிராமம்|பயிர்).*/i, "").trim();
  } else if (nameEngMatch && nameEngMatch[1]) {
    result.name = nameEngMatch[1].replace(/(from|village|phone|crop).*/i, "").trim();
  } else if (!result.phone && transcript.split(" ").length <= 4) {
    // If short phrase without numbers, treat as name
    result.name = transcript.trim();
  }

  // 4. Crops / Extra info extraction
  const cropKeywords = ["தக்காளி", "வெங்காயம்", "கத்தரிக்காய்", "வாழை", "வெண்டை", "மிளகாய்", "நெல்", "தேங்காய்", "உருளை"];
  const detectedCrops = cropKeywords.filter(crop => transcript.includes(crop));
  if (detectedCrops.length > 0) {
    result.extra_info = detectedCrops.join(", ") + " (உழவர் விளைச்சல்)";
  }

  return result;
}

export default function SmartFormVoiceAssistant({ onFormPopulate, activeRole = "farmer" }) {
  const { lang, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        lang === "ta"
          ? "குரல் வழி உள்ளீடு உங்கள் உலாவியில் ஆதரிக்கப்படவில்லை. Chrome பயன்படுத்தவும்."
          : "Speech recognition not supported in this browser.",
        "error"
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

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = lang === "ta" ? "ta-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        showToast(
          lang === "ta"
            ? "🎙️ பேசுங்கள்: 'என் பெயர் முருகன், ஊர் பொள்ளாச்சி, எண் 9842175151'..."
            : "🎙️ Speak: 'My name is Murugan, town Pollachi, phone 9842175151'...",
          "info"
        );
      };

      recognition.onresult = (event) => {
        let current = "";
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);

        if (event.results[0].isFinal || current.length > 10) {
          const parsedData = parseFullVoiceForm(current, activeRole);
          if (Object.keys(parsedData).length > 0 && onFormPopulate) {
            onFormPopulate(parsedData);
          }
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          const finalParsed = parseFullVoiceForm(transcript, activeRole);
          if (Object.keys(finalParsed).length > 0) {
            onFormPopulate(finalParsed);
            showToast(
              lang === "ta"
                ? "✨ குரல் மூலம் படிவ விபரங்கள் நிரப்பப்பட்டன!"
                : "✨ Form fields auto-populated by voice!",
              "success"
            );
          }
        }
      };

      recognition.onerror = (e) => {
        console.warn("Smart assistant error:", e.error);
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div
      style={{
        background: isListening ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" : "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
        border: isListening ? "1.5px solid #ef4444" : "1.5px solid #10b981",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        transition: "all 0.3s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: isListening ? "#ef4444" : "#10b981",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isListening ? "0 0 14px rgba(239, 68, 68, 0.5)" : "none"
          }}
        >
          <Mic size={18} />
        </div>
        <div>
          <div style={{ fontWeight: "800", fontSize: "0.88rem", color: isListening ? "#991b1b" : "#065f46" }}>
            {isListening
              ? (lang === "ta" ? "🎧 முழு விபரங்களையும் பேசவும்..." : "🎧 Listening to your full details...")
              : (lang === "ta" ? "🎙️ முழு படிவத்தையும் குரல் மூலம் நிரப்பலாம்" : "🎙️ Fill entire form by voice assistant")}
          </div>
          <div style={{ fontSize: "0.78rem", color: isListening ? "#b91c1c" : "#475569" }}>
            {transcript ? (
              <span style={{ fontWeight: "700", color: "#0f172a" }}>"{transcript}"</span>
            ) : (
              <span>
                {lang === "ta"
                  ? "எ.கா: 'என் பெயர் முருகன், ஊர் தென்காசி, எண் 9842175151'"
                  : "e.g., 'My name is Murugan, town Tenkasi, mobile 9842175151'"}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={startListening}
        style={{
          background: isListening ? "#dc2626" : "#059669",
          color: "#ffffff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "700",
          fontSize: "0.82rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)"
        }}
      >
        <Mic size={15} />
        <span>{isListening ? (lang === "ta" ? "நிறுத்து" : "Stop") : (lang === "ta" ? "குரலில் பேசுக 🎙️" : "Speak All 🎙️")}</span>
      </button>
    </div>
  );
}
