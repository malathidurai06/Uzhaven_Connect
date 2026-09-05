import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mic } from "lucide-react";

export default function FloatingVoiceButton() {
  const location = useLocation();

  // Hide on the actual voice assistant page
  if (location.pathname === "/ai/voice-assistant") return null;

  return (
    <Link
      to="/ai/voice-assistant"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 990,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "linear-gradient(135deg, #083320 0%, #0f5132 100%)",
        color: "#ffffff",
        padding: "12px 18px",
        borderRadius: "9999px",
        textDecoration: "none",
        fontWeight: "700",
        fontSize: "0.9rem",
        boxShadow: "0 8px 25px rgba(8, 51, 32, 0.4)",
        border: "1.5px solid rgba(245, 158, 11, 0.5)",
        backdropFilter: "blur(10px)",
        transition: "all 0.25s ease",
      }}
      className="floating-voice-pill"
      title="Open Tamil Voice Assistant"
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "#f59e0b",
          color: "#083320",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Mic size={16} />
      </div>
      <span>🎙️ குரல் உதவியாளர் (Voice AI)</span>
    </Link>
  );
}
