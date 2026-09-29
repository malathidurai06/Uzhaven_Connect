import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useApp } from "../context/AppContext";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  ShoppingBag, 
  HelpCircle, 
  Building2, 
  Sprout,
  Trash2,
  Download
} from "lucide-react";

const SUGGESTED_QUESTIONS = [
  {
    role: "farmer",
    category: "🌾 Farmer & Pricing",
    label: "தக்காளி இன்றைய AI சந்தை விலை நிலவரம் என்ன?",
    labelEn: "What is today's fair AI market price for Tomato?",
    query: "தக்காளி இன்றைய AI சந்தை விலை நிலவரம் என்ன?",
  },
  {
    role: "farmer",
    category: "🍃 Crop Rescue",
    label: "அழுகக்கூடிய பயிர்களுக்கு அவசர மீட்பு கோரிக்கை வைப்பது எப்படி?",
    labelEn: "How to raise an urgent Crop Rescue alert for surplus harvest?",
    query: "அழுகக்கூடிய பயிர்களுக்கு அவசர மீட்பு கோரிக்கை வைப்பது எப்படி?",
  },
  {
    role: "farmer",
    category: "🌱 Organic Advisory",
    label: "பூச்சி மேலாண்மை மற்றும் இயற்கை உரங்கள் என்ன?",
    labelEn: "What are effective organic pest control and bio-fertilizer formulas?",
    query: "பூச்சி மேலாண்மை மற்றும் இயற்கை உரங்கள் என்ன?",
  },
  {
    role: "buyer",
    category: "🛒 Retail Buyer",
    label: "விவசாயியிடம் இருந்து நேரடியாக வாங்குவது எப்படி?",
    labelEn: "How to buy fresh produce directly from nearby farmers?",
    query: "விவசாயியிடம் இருந்து நேரடியாக வாங்குவது எப்படி?",
  },
  {
    role: "buyer",
    category: "💳 Payments",
    label: "UPI மற்றும் Net Banking மூலம் எப்படி பணம் செலுத்துவது?",
    labelEn: "How do UPI, QR Code, and Net Banking payments work?",
    query: "UPI மற்றும் Net Banking மூலம் எப்படி பணம் செலுத்துவது?",
  },
  {
    role: "secondary_buyer",
    category: "🏨 Bulk Buyer / Hotel",
    label: "உணவகங்களுக்கு 40% தள்ளுபடியில் மொத்தமாக வாங்குவது எப்படி?",
    labelEn: "How can hotels & bulk processors buy rescue lots at 40% discount?",
    query: "உணவகங்களுக்கு 40% தள்ளுபடியில் மொத்தமாக வாங்குவது எப்படி?",
  },
  {
    role: "secondary_buyer",
    category: "🚚 Logistics",
    label: "நெல்லை விவசாய போக்குவரத்து மூலம் டெலிவரி எப்படி நடக்கிறது?",
    labelEn: "How is transport & delivery handled with Nellai Agri Co-op?",
    query: "நெல்லை விவசாய போக்குவரத்து மூலம் டெலிவரி எப்படி நடக்கிறது?",
  },
];

export default function AIChatbot() {
  const { user, lang, showToast } = useApp();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: lang === "ta" 
        ? "வணக்கம்! நான் உங்கள் **உழவன் AI விவசாய உதவியாளர்** 🌾.\n\nஉங்களுக்கு பயிர் விலை நிலவரம், தேவை கணிப்பு, அவசர பயிர் மீட்பு (Crop Rescue), மொத்த கொள்முதல், அல்லது பாதுகாப்பான கட்டண முறைகள் (UPI/Net Banking) பற்றி ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்!"
        : "Vanakkam! I am your **Uzhavan AI Smart Assistant** 🌾.\n\nI can help you with live crop market prices, 7-day demand forecasts, crop rescue discounts for hotels & bulk buyers, or payment & escrow methods (UPI / Net Banking). Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: ["Check Tomato Price", "How to pay via UPI or Net Banking?", "How does Crop Rescue work?", "Browse 40% Off Produce"]
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, farmer, buyer, secondary_buyer
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = lang === "ta" ? "ta-IN" : "en-IN";

      recog.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInput(text);
        setIsListening(false);
        handleSend(text);
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);

      recognitionRef.current = recog;
    }
  }, [lang]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition is not supported in this browser. Please type your query.", "error");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = lang === "ta" ? "ta-IN" : "en-IN";
      recognitionRef.current.start();
      setIsListening(true);
      showToast("Listening... Speak in Tamil or English", "info");
    }
  };

  const handleSpeak = (text, id) => {
    if (!window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for smooth speech
    const cleanText = text.replace(/[*#•`_-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "ta" ? "ta-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Response copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSend = async (customText = null) => {
    const query = (customText || input).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: query,
        role: user?.role || "general",
        language: lang,
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: res.data.reply || "Vanakkam! I processed your query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.data.suggested_actions || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: lang === "ta"
          ? "வணக்கம்! நீங்கள் கேட்ட கேள்விக்கான தகவல்களை உழவன் கனெக்ட் தளத்தில் சரிபார்க்கலாம். பயிர் விலை நிலவரம், பயிர் மீட்பு மற்றும் கட்டண வழிகாட்டல் பக்கங்களை பார்வையிடவும்."
          : "Thank you for reaching out! You can explore live market pricing, demand forecasting, and crop rescue directly through Uzhavan Connect's dashboard tools.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ["Check Tomato Price", "How to pay via UPI or Net Banking?", "How does Crop Rescue work?", "Browse 40% Off Produce"]
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    }
    setLoading(false);
  };

  const handleActionClick = (action) => {
    const act = action.toLowerCase();
    if (act.includes("tomato") || act.includes("price")) {
      handleSend("What is the AI recommended direct selling price for Tomato in Tirunelveli?");
    } else if (act.includes("demand") || act.includes("forecast")) {
      navigate("/ai/demand-forecast");
    } else if (act.includes("rescue") || act.includes("waste") || act.includes("40%")) {
      navigate("/rescue-alerts");
    } else if (act.includes("pay") || act.includes("upi") || act.includes("net banking")) {
      handleSend("How do UPI, QR Code, and Net Banking payments work?");
    } else if (act.includes("market") || act.includes("browse")) {
      navigate("/marketplace");
    } else if (act.includes("list")) {
      navigate("/list-crop");
    } else {
      handleSend(action);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: lang === "ta" 
          ? "உரையாடல் அழிக்கப்பட்டது. புதிய கேள்விகளைக் கேட்கவும்!" 
          : "Conversation cleared. Feel free to ask any agricultural or marketplace question!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ["Check Tomato Price", "How to pay via UPI or Net Banking?", "How does Crop Rescue work?", "Browse 40% Off Produce"]
      }
    ]);
    showToast("Chat history reset", "info");
  };

  const filteredQuestions = SUGGESTED_QUESTIONS.filter(
    (q) => selectedFilter === "all" || q.role === selectedFilter
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "30px" }}>
      
      {/* Header */}
      <div className="page-header" style={{ textAlign: "center", marginBottom: "24px" }}>
        <span className="page-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={15} color="#fbbf24" /> 24/7 Intelligent Multi-Lingual Agricultural AI Assistant
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "உழவன் AI விவசாய உதவியாளர்" : "Uzhavan Agri-AI Smart Assistant"}
        </h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          Instant answers on fair mandi prices, crop rescue discounts, hotel bulk procurement, organic pest management, and UPI/NetBanking payments.
        </p>
      </div>

      {/* Suggested Quick Question Filter Chips */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "12px" }}>
          <button
            type="button"
            className={`btn ${selectedFilter === "all" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSelectedFilter("all")}
            style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "20px" }}
          >
            All Questions
          </button>
          <button
            type="button"
            className={`btn ${selectedFilter === "farmer" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSelectedFilter("farmer")}
            style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "20px" }}
          >
            🧑‍🌾 For Farmers
          </button>
          <button
            type="button"
            className={`btn ${selectedFilter === "buyer" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSelectedFilter("buyer")}
            style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "20px" }}
          >
            🛒 For Retail Buyers
          </button>
          <button
            type="button"
            className={`btn ${selectedFilter === "secondary_buyer" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSelectedFilter("secondary_buyer")}
            style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "20px" }}
          >
            🏨 For Hotels & Bulk Buyers
          </button>
        </div>

        {/* Quick prompt badges */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {filteredQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q.query)}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                padding: "6px 12px",
                borderRadius: "14px",
                fontSize: "0.8rem",
                color: "#0f5132",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
              }}
            >
              <span>✨</span>
              <span>{lang === "ta" ? q.label : q.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="card" style={{ padding: "0", display: "flex", flexDirection: "column", height: "560px", boxShadow: "0 12px 36px rgba(0,0,0,0.06)", overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
        
        {/* Chat Top Bar */}
        <div style={{ background: "linear-gradient(135deg, #083320 0%, #0f5132 100%)", color: "#ffffff", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f5132" }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: "800", fontSize: "0.95rem" }}>Uzhavan AI Farm Companion</div>
              <div style={{ fontSize: "0.74rem", color: "#a7f3d0", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                Live · Tamil & English Knowledge Brain
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={clearChat}
              title="Clear Chat History"
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#ffffff", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}
            >
              <Trash2 size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#f8fafc", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  flexDirection: isUser ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: isUser ? "#1e40af" : "#0f5132",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                  }}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      background: isUser ? "#1e40af" : "#ffffff",
                      color: isUser ? "#ffffff" : "#1e293b",
                      padding: "14px 18px",
                      borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      border: isUser ? "none" : "1px solid #e2e8f0",
                      fontSize: "0.92rem",
                      lineHeight: "1.6",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}
                  >
                    {m.text}
                  </div>

                  {/* Actions & Utilities under AI bubble */}
                  {!isUser && (
                    <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{m.timestamp}</span>

                      <button
                        type="button"
                        onClick={() => handleSpeak(m.text, m.id)}
                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", fontSize: "0.74rem", padding: "2px 4px" }}
                        title="Read aloud"
                      >
                        {speakingId === m.id ? <VolumeX size={13} color="#ef4444" /> : <Volume2 size={13} />}
                        <span>{speakingId === m.id ? "Stop" : "Listen"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(m.text, m.id)}
                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", fontSize: "0.74rem", padding: "2px 4px" }}
                        title="Copy text"
                      >
                        {copiedId === m.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        <span>{copiedId === m.id ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  )}

                  {/* Dynamic Action Chips if present */}
                  {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                      {m.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleActionClick(action)}
                          style={{
                            background: "#ecfdf5",
                            color: "#065f46",
                            border: "1px solid #a7f3d0",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.76rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <span>👉</span>
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "flex-start" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f5132", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={16} />
              </div>
              <div style={{ background: "#ffffff", padding: "12px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="pulse-dot" style={{ width: "10px", height: "10px" }} />
                <span>Consulting Tamil Nadu agricultural knowledge model...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div style={{ padding: "14px 18px", background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={toggleListen}
            className={`btn ${isListening ? "btn-accent" : "btn-outline"}`}
            style={{ padding: "12px", borderRadius: "50%", width: "44px", height: "44px", justifyContent: "center", flexShrink: 0 }}
            title="Speak query in Tamil / English"
          >
            {isListening ? <MicOff size={18} color="#dc2626" /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              lang === "ta" 
                ? "உங்கள் விவசாயக் கேள்வியை இங்கே கேட்கவும் (எ.கா: தக்காளி விலை என்ன?)..." 
                : "Ask any farming, price, rescue, or payment question (e.g. Tomato price, UPI checkout)..."
            }
            style={{ flex: 1, margin: 0, padding: "12px 16px", fontSize: "0.92rem", borderRadius: "24px", border: "1.5px solid #cbd5e1" }}
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{ padding: "12px 18px", borderRadius: "24px", fontWeight: "700", gap: "6px" }}
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
