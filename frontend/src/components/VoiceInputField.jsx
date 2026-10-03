import React, { useState, useRef, useEffect } from "react";
import { Mic, Check, Eye, EyeOff, Volume2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { sanitizeSpokenInput } from "./VoiceInputButton";

export default function VoiceInputField({
  label,
  icon: Icon,
  type = "text",
  name,
  value = "",
  onChange,
  onVoiceChange,
  placeholder = "",
  required = false,
  voiceType = "text",
  voiceHint = "",
  extraAction = null,
  disabled = false,
  style = {}
}) {
  const { lang, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [justCaptured, setJustCaptured] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleVoiceToggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(
        lang === "ta"
          ? "⚠️ உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. Chrome/Edge உலாவியை பயன்படுத்தவும்."
          : "⚠️ Speech recognition is not supported in this browser. Please use Chrome or Edge.",
        "error"
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (err) {}
      }
      setIsListening(false);
      return;
    }

    // Request mic access
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        showToast(
          lang === "ta"
            ? "⚠️ மைக்ரோஃபோன் அணுகலை URL பாரில் 🔒 கிளிக் செய்து அனுமதிக்கவும்."
            : "⚠️ Microphone access blocked. Please allow mic in your browser.",
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
      recognition.lang = lang === "ta" ? "ta-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        if (inputRef.current) inputRef.current.focus();
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (transcript.trim()) {
          const sanitized = sanitizeSpokenInput(transcript, voiceType);
          if (sanitized) {
            if (onVoiceChange) {
              onVoiceChange(sanitized);
            } else if (onChange) {
              onChange({ target: { name, value: sanitized } });
            }
          }
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          showToast(lang === "ta" ? "மைக் அனுமதி தேவை" : "Microphone permission required", "error");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setJustCaptured(true);
        setTimeout(() => setJustCaptured(false), 2000);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const actualInputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: "16px", ...style }}>
      {/* Label Row */}
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "700",
              fontSize: "0.86rem",
              color: "#1e293b",
              margin: 0
            }}
          >
            {Icon && <Icon size={14} color="#059669" />}
            <span>{label}</span>
          </label>
          {extraAction}
        </div>
      )}

      {/* Input Box with Integrated Embedded Mic */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: "10px",
          border: isListening
            ? "2px solid #ef4444"
            : justCaptured
            ? "2px solid #10b981"
            : "1.5px solid #cbd5e1",
          background: isListening
            ? "#fff5f5"
            : justCaptured
            ? "#f0fdf4"
            : "#ffffff",
          boxShadow: isListening
            ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
            : "0 1px 3px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease"
        }}
      >
        <input
          ref={inputRef}
          type={actualInputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={isListening ? (lang === "ta" ? "🎙️ பேசவும்..." : "🎙️ Speak now...") : placeholder}
          required={required}
          disabled={disabled}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            padding: "12px 14px",
            paddingRight: type === "password" ? "76px" : "44px",
            fontSize: "0.95rem",
            color: "#0f172a",
            outline: "none",
            borderRadius: "10px"
          }}
        />

        {/* Right Embedded Actions: Mic & Password Eye */}
        <div
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                borderRadius: "6px"
              }}
              title={showPassword ? "Hide" : "Show"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {/* Integrated Modern Mic Icon Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            title={
              isListening
                ? lang === "ta" ? "கேட்கிறது... பேசவும்" : "Listening... Speak now"
                : lang === "ta" ? `🎙️ குரலில் பேச தொடவும் ${voiceHint ? `(${voiceHint})` : ""}` : "🎙️ Touch to speak"
            }
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: isListening ? "1px solid #ef4444" : "1px solid transparent",
              background: isListening
                ? "#ef4444"
                : justCaptured
                ? "#10b981"
                : "rgba(16, 185, 129, 0.12)",
              color: isListening || justCaptured ? "#ffffff" : "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              animation: isListening ? "pulseVoiceMic 1.2s infinite ease-in-out" : "none"
            }}
          >
            {isListening ? (
              <Mic size={16} color="#ffffff" />
            ) : justCaptured ? (
              <Check size={16} color="#ffffff" />
            ) : (
              <Mic size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Live Helper Transcript / Hint Indicator */}
      {isListening && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.78rem",
            color: "#dc2626",
            fontWeight: "700",
            marginTop: "4px",
            paddingLeft: "2px",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "ping 1s infinite" }} />
          <span>
            {lang === "ta"
              ? `குரல் கேட்டுக்கொண்டிருக்கிறது... ${voiceHint ? `(எ.கா: ${voiceHint})` : "பேசவும்"}`
              : `Listening in real-time... ${voiceHint ? `(e.g., ${voiceHint})` : "Speak now"}`}
          </span>
        </div>
      )}

      {/* Mic Animation styles */}
      <style>{`
        @keyframes pulseVoiceMic {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 7px rgba(239, 68, 68, 0.2); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
