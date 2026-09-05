import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { AppProvider, useApp } from "./context/AppContext.jsx";
import NavBar from "./components/NavBar.jsx";
import FloatingVoiceButton from "./components/FloatingVoiceButton.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import FarmerLogin from "./pages/FarmerLogin.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import BulkBuyerLogin from "./pages/BulkBuyerLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

import RegisterGateway from "./pages/RegisterGateway.jsx";
import FarmerRegister from "./pages/FarmerRegister.jsx";
import BuyerRegister from "./pages/BuyerRegister.jsx";
import BulkBuyerRegister from "./pages/BulkBuyerRegister.jsx";

import Marketplace from "./pages/Marketplace.jsx";
import ListCrop from "./pages/ListCrop.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import RescueAlerts from "./pages/RescueAlerts.jsx";
import PriceInsights from "./pages/PriceInsights.jsx";
import DemandForecast from "./pages/DemandForecast.jsx";
import VoiceAssistant from "./pages/VoiceAssistant.jsx";
import Payment from "./pages/Payment.jsx";
import FarmerDashboard from "./pages/FarmerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function PageWrapper({ children }) {
  return <div className="page-container">{children}</div>;
}

// Role-Aware Smart Dashboard Router
function RoleDashboardRedirect() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "farmer") return <Navigate to="/farmer/dashboard" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "secondary_buyer") return <Navigate to="/ai/crop-rescue" replace />;
  return <Navigate to="/buyer/dashboard" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Smart Role-Based Dashboards */}
          <Route path="/dashboard" element={<RoleDashboardRedirect />} />
          <Route path="/farmer/dashboard" element={<PageWrapper><FarmerDashboard /></PageWrapper>} />
          <Route path="/buyer/dashboard" element={<PageWrapper><BuyerDashboard /></PageWrapper>} />
          <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />

          <Route path="/marketplace" element={<PageWrapper><Marketplace /></PageWrapper>} />
          <Route path="/list-crop" element={<PageWrapper><ListCrop /></PageWrapper>} />
          <Route path="/my-orders" element={<PageWrapper><MyOrders /></PageWrapper>} />
          <Route path="/rescue-alerts" element={<PageWrapper><RescueAlerts /></PageWrapper>} />
          <Route path="/ai/crop-rescue" element={<PageWrapper><RescueAlerts /></PageWrapper>} />
          
          {/* 3 Dedicated Separate Login Routes */}
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/login/farmer" element={<PageWrapper><FarmerLogin /></PageWrapper>} />
          <Route path="/login/buyer" element={<PageWrapper><BuyerLogin /></PageWrapper>} />
          <Route path="/login/bulk-buyer" element={<PageWrapper><BulkBuyerLogin /></PageWrapper>} />
          <Route path="/login/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />

          {/* 3 Dedicated Separate Register Routes */}
          <Route path="/register" element={<PageWrapper><RegisterGateway /></PageWrapper>} />
          <Route path="/register/farmer" element={<PageWrapper><FarmerRegister /></PageWrapper>} />
          <Route path="/register/buyer" element={<PageWrapper><BuyerRegister /></PageWrapper>} />
          <Route path="/register/bulk-buyer" element={<PageWrapper><BulkBuyerRegister /></PageWrapper>} />

          <Route path="/ai/price-insights" element={<PageWrapper><PriceInsights /></PageWrapper>} />
          <Route path="/ai/demand-forecast" element={<PageWrapper><DemandForecast /></PageWrapper>} />
          <Route path="/ai/voice-assistant" element={<PageWrapper><VoiceAssistant /></PageWrapper>} />
          <Route path="/payment/:orderId" element={<PageWrapper><Payment /></PageWrapper>} />
        </Routes>
        <FloatingVoiceButton />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
