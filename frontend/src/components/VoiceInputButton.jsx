import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Check, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";

// Tamil and English number mappings for voice-to-phone/PIN conversion
const NUMBER_WORDS = {
  // Tamil digits
  "பூஜ்ஜியம்": "0", "சைபர்": "0", "ஜீரோ": "0",
  "ஒன்று": "1", "ஒன்னு": "1", "ஒரு": "1",
  "இரண்டு": "2", "ரெண்டு": "2", "இரு": "2",
  "மூன்று": "3", "மூணு": "3",
  "நான்கு": "4", "நாலு": "4",
  "ஐந்து": "5", "அஞ்சு": "5",
  "ஆறு": "6",
  "ஏழு": "7",
  "எட்டு": "8",
  "ஒன்பது": "9", "ஒம்போது": "9",
  // English words
  "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
  "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
  "double": "double", "triple": "triple"
};

/**
 * Converts spoken text into clean text or numbers
 */
export function sanitizeSpokenInput(rawText, type = "text") {
  if (!rawText) return "";
  let text = rawText.trim();

  if (type === "phone" || type === "number" || type === "pin") {
    // Replace spoken words with digits
    let cleaned = text.toLowerCase();
    
    // Handle double / triple
    cleaned = cleaned.replace(/double\s+(\d|\w+)/gi, (_, digit) => {
      const d = NUMBER_WORDS[digit] || digit;
      return d + d;
    });

    Object.keys(NUMBER_WORDS).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleaned = cleaned.replace(regex, NUMBER_WORDS[word]);
    });

    // Extract only digits
    const digitsOnly = cleaned.replace(/\D/g, "");
    if (digitsOnly.length > 0) {
      return digitsOnly.slice(0, type === "pin" ? 6 : 10);
    }
  }

  // Remove trailing period from speech-to-text
  return text.replace(/\.$/, "");
}

/**
 * VoiceInputButton component for inline microphone input on form fields
 */
export default function VoiceInputButton({
  onResult,
  type = "text",
  fieldName = "Field",
  placeholderHint = "",
  style = {},
  size = 15,
  compact = false
}) {
  const { lang, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [justCaptured, setJustCaptured] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleStartListening = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        lang === "ta"
          ? "⚠️ உங்கள் உலாவியில் குரல் உள்ளீடு வசதி இல்லை. Chrome அல்லது Edge உலாவியை பயன்படுத்தவும்."
          : "⚠️ Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.",
        "error"
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
      setIsListening(false);
      return;
    }

    // Request mic permissions explicitly
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        showToast(
          lang === "ta"
            ? "⚠️ மைக்ரோஃபோன் அணுகல் தடுக்கப்பட்டுள்ளது. URL பாரில் உள்ள 🔒 ஐகானை கிளிக் செய்து மைக்ரோஃபோனை அனுமதிக்கவும்."
            : "⚠️ Microphone access is blocked. Please allow mic permission in your browser URL bar.",
          "error"
        );
        return;
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      // Use Tamil if language is set to Tamil or if it's general text, otherwise fallback to en-IN
      recognition.lang = lang === "ta" ? "ta-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText("");
        showToast(
          lang === "ta"
            ? `🎙️ ${fieldName} - இப்போது பேசவும்... ${placeholderHint ? `(எ.கா: ${placeholderHint})` : ""}`
            : `🎙️ Listening for ${fieldName}... Speak now...`,
          "info"
        );
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interim = "";

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }

        setInterimText(interim);

        const captured = finalTranscript || interim;
        if (captured && captured.trim()) {
          const sanitized = sanitizeSpokenInput(captured, type);
          if (sanitized && onResult) {
            onResult(sanitized);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          showToast(
            lang === "ta"
              ? "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது."
              : "Microphone permission denied.",
            "error"
          );
        } else if (event.error !== "no-speech") {
          showToast(
            lang === "ta"
              ? "குரலை துல்லியமாக பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
              : "Could not capture voice clearly. Please try again.",
            "warning"
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setJustCaptured(true);
        setTimeout(() => setJustCaptured(false), 2000);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start SpeechRecognition:", err);
      setIsListening(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
      <button
        type="button"
        onClick={handleStartListening}
        title={
          isListening
            ? lang === "ta"
              ? "🎧 கேட்டுக்கொண்டிருக்கிறது... பேசவும் (நிறுத்த கிளிக் செய்யவும்)"
              : "Listening... Speak now (click to stop)"
            : lang === "ta"
            ? `🎙️ ${fieldName} குரல் மூலம் பேச தொடவும்`
            : `🎙️ Touch to speak ${fieldName}`
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          padding: compact ? "4px 8px" : "6px 10px",
          borderRadius: "8px",
          border: isListening ? "1.5px solid #ef4444" : justCaptured ? "1.5px solid #10b981" : "1.5px solid #cbd5e1",
          background: isListening
            ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
            : justCaptured
            ? "#ecfdf5"
            : "#f8fafc",
          color: isListening ? "#dc2626" : justCaptured ? "#059669" : "#475569",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "0.78rem",
          transition: "all 0.2s ease",
          boxShadow: isListening ? "0 0 12px rgba(239, 68, 68, 0.45)" : "none",
          animation: isListening ? "pulseMic 1.2s infinite ease-in-out" : "none",
          ...style
        }}
      >
        {isListening ? (
          <>
            <Mic size={size} color="#dc2626" className="spin-slow" />
            <span style={{ fontSize: "0.74rem", fontWeight: "700", color: "#dc2626" }}>
              {lang === "ta" ? "கேட்கிறது..." : "Listening..."}
            </span>
          </>
        ) : justCaptured ? (
          <>
            <Check size={size} color="#059669" />
            <span style={{ fontSize: "0.74rem", color: "#059669" }}>✓</span>
          </>
        ) : (
          <>
            <Mic size={size} color="#059669" />
            {!compact && (
              <span style={{ fontSize: "0.74rem" }}>
                {lang === "ta" ? "பேசுக 🎙️" : "Speak 🎙️"}
              </span>
            )}
          </>
        )}
      </button>

      {/* Pulsing visual CSS */}
      <style>{`
        @keyframes pulseMic {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.15); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
