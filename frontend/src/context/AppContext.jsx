import React, { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS, DEMO_ACCOUNTS } from "../utils/agriData";
import api from "../api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // On initial load, verify token health if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user) {
      api.get("/auth/verify")
        .then((res) => {
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Token expired or invalid: auto-refresh via demo login if applicable
          if (user.phone) {
            api.post("/auth/demo-login", { phone: user.phone, role: user.role })
              .then((res) => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
              })
              .catch(() => {});
          }
        });
    }
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ta" : "en"));
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const loginAsDemo = async (demoAccount) => {
    try {
      const res = await api.post("/auth/demo-login", {
        phone: demoAccount.phone,
        role: demoAccount.role,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      showToast(`Logged in as ${demoAccount.name} (${res.data.user.role?.toUpperCase()})!`, "success");
    } catch (err) {
      // Fallback
      const fallbackUser = {
        id: demoAccount.role === "farmer" ? 1 : demoAccount.role === "buyer" ? 4 : 5,
        name: demoAccount.name,
        role: demoAccount.role,
        village: demoAccount.village,
        phone: demoAccount.phone,
      };
      localStorage.setItem("token", "mock_demo_jwt_token");
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      showToast(`Demo mode: Active as ${demoAccount.name}`, "success");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    showToast("Logged out successfully.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        user,
        setUser,
        loginAsDemo,
        logout,
        toasts,
        showToast,
      }}
    >
      {children}
      {/* Toast floating notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
