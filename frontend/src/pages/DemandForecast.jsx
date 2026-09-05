import React, { useState, useEffect } from "react";
import api from "../api";
import { useApp } from "../context/AppContext";
import { CROP_ICONS } from "../utils/agriData";
import { 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  Lightbulb, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock 
} from "lucide-react";

const CROPS = [
  { id: "tomato", name: "Tomato (தக்காளி)" },
  { id: "brinjal", name: "Brinjal (கத்தரிக்காய்)" },
  { id: "broccoli", name: "Broccoli (பூக்கோசு)" },
  { id: "onion", name: "Onion (வெங்காயம்)" },
  { id: "carrot", name: "Carrot (கேரட்)" },
  { id: "cabbage", name: "Cabbage (முட்டைகோஸ்)" },
  { id: "potato", name: "Potato (உருளைக்கிழங்கு)" },
  { id: "beans", name: "Beans (பீன்ஸ்)" },
  { id: "okra", name: "Okra / Ladyfinger (வெண்டைக்காய்)" },
  { id: "drumstick", name: "Drumstick (முருங்கைக்காய்)" },
  { id: "chilli", name: "Chilli (பச்சை மிளகாய்)" },
  { id: "beetroot", name: "Beetroot (பீட்ரூட்)" },
  { id: "banana", name: "Banana (வாழைப்பழம்)" },
  { id: "coconut", name: "Coconut (தேங்காய்)" },
];

const REGIONS = ["Tirunelveli", "Madurai", "Nagercoil", "Tuticorin", "Tenkasi"];

export default function DemandForecast() {
  const { lang, showToast } = useApp();

  const [crop, setCrop] = useState("tomato");
  const [region, setRegion] = useState("Tirunelveli");
  const [forecast, setForecast] = useState(null);
  const [trend, setTrend] = useState("rising");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/ai/demand-forecast", { params: { crop_name: crop, region } });
      setForecast(res.data.forecast);
      setTrend(res.data.trend || "rising");
    } catch (err) {
      setError("Using offline forecast model simulation.");
      // Simulated 7-day fallback
      const today = new Date();
      const mockForecast = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i + 1);
        const dayOfWeek = d.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        return {
          date: d.toISOString().slice(0, 10),
          predicted_demand_kg: Math.round(95 + (isWeekend ? 45 : 0) + Math.sin(i) * 18),
        };
      });
      setForecast(mockForecast);
      setTrend("rising");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForecast();
  }, [crop, region]);

  const maxDemand = forecast ? Math.max(...forecast.map((f) => f.predicted_demand_kg)) : 100;
  const totalDemand = forecast ? Math.round(forecast.reduce((sum, f) => sum + f.predicted_demand_kg, 0)) : 0;
  const avgDaily = forecast ? Math.round(totalDemand / forecast.length) : 0;
  const peakDay = forecast ? forecast.reduce((max, f) => f.predicted_demand_kg > max.predicted_demand_kg ? f : max, forecast[0]) : null;

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <span className="page-badge">
          <TrendingUp size={14} color="#0f5132" /> Gradient Boosting Regressor
        </span>
        <h1 className="page-title">
          {lang === "ta" ? "7-நாள் பயிர் தேவை முன்னறிவிப்பு" : "AI 7-Day Crop Demand Forecast"}
        </h1>
        <p className="page-subtitle">
          {lang === "ta"
            ? "கிரேடியன்ட் பூஸ்டிங் அல்காரிதம் மூலம் அடுத்த 7 நாட்களுக்கான சந்தை தேவையை கணித்து, எப்போது அறுவடை செய்ய வேண்டும் என்று வழிகாட்டுகிறது."
            : "Plan harvesting and sowing with confidence. Gradient Boosting ML forecasts day-by-day consumer demand curves for your local district."}
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="card" style={{ marginBottom: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "flex-end" }}>
          <div>
            <label>Select Crop</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {CROP_ICONS[c.id] || "🌱"} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select District / Hub</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  📍 {r} District
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={fetchForecast}
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "12px" }}
            >
              <Sparkles size={16} />
              <span>{loading ? "Forecasting..." : "Refresh Forecast"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demand Metric Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Market Trend</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: trend === "rising" ? "#16a34a" : "#ea580c" }}>
              {trend.toUpperCase()}
            </span>
            {trend === "rising" ? <ArrowUpRight size={22} color="#16a34a" /> : <ArrowDownRight size={22} color="#ea580c" />}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>Based on 7-day regression slope</div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>7-Day Total Demand</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f5132", marginTop: "6px" }}>
            {totalDemand.toLocaleString()} kg
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>Estimated local consumption</div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Peak Demand Day</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#f59e0b", marginTop: "6px" }}>
            {peakDay ? formatDate(peakDay.date).split(",")[0] : "Saturday"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
            {peakDay ? `${Math.round(peakDay.predicted_demand_kg)} kg expected` : ""}
          </div>
        </div>
      </div>

      {/* Interactive 7-Day Chart */}
      {forecast && (
        <div className="demand-chart-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#083320" }}>
              Daily Demand Trajectory for {crop.toUpperCase()} in {region}
            </h2>
            <span className="page-badge" style={{ background: "#e8f5e9", color: "#0f5132" }}>
              Peak Capacity: {Math.round(maxDemand)} kg/day
            </span>
          </div>

          <div className="demand-bars-wrap">
            {forecast.map((f, idx) => {
              const heightPct = Math.max(12, Math.round((f.predicted_demand_kg / maxDemand) * 100));
              const isPeak = f.date === peakDay?.date;

              return (
                <div 
                  className="demand-col" 
                  key={f.date}
                  onMouseEnter={() => setHoveredDay(f)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div
                    className="demand-bar"
                    style={{
                      height: `${heightPct}%`,
                      background: isPeak 
                        ? "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)" 
                        : "linear-gradient(180deg, #34d399 0%, #0f5132 100%)",
                      boxShadow: isPeak ? "0 0 15px rgba(245, 158, 11, 0.4)" : "none",
                    }}
                  >
                    <span className="demand-bar-val">
                      {Math.round(f.predicted_demand_kg)}kg
                    </span>
                  </div>
                  <div className="demand-col-date">
                    {formatDate(f.date).split(",")[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Agronomist Advice Box */}
          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: "14px", marginTop: "24px" }}>
            <Lightbulb size={24} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ color: "#92400e", fontSize: "0.95rem" }}>
                AI Agronomist Harvesting Recommendation
              </strong>
              <p style={{ fontSize: "0.88rem", color: "#78350f", marginTop: "4px" }}>
                {peakDay ? (
                  <>
                    Demand for <strong>{crop}</strong> in <strong>{region}</strong> peaks on <strong>{formatDate(peakDay.date)}</strong> ({Math.round(peakDay.predicted_demand_kg)} kg). 
                    To fetch Grade A+ freshness prices, harvest your produce the preceding evening and list it on Ullavan Connect by 6:00 AM!
                  </>
                ) : (
                  "Consistent daily demand observed across Tirunelveli district."
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
