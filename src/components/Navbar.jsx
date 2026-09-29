import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { DEFAULT_FARMER, DEFAULT_BUYER } from "../App";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("agritrust_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    } else {
      setUser(DEFAULT_FARMER);
      localStorage.setItem("agritrust_user", JSON.stringify(DEFAULT_FARMER));
    }
  }, []);

  const switchRole = () => {
    if (user?.role === "buyer") {
      localStorage.setItem("agritrust_user", JSON.stringify(DEFAULT_FARMER));
      localStorage.setItem("agritrust_farmer", JSON.stringify(DEFAULT_FARMER));
      setUser(DEFAULT_FARMER);
      window.location.href = "/farmer-dashboard";
    } else {
      localStorage.setItem("agritrust_user", JSON.stringify(DEFAULT_BUYER));
      localStorage.setItem("agritrust_buyer", JSON.stringify(DEFAULT_BUYER));
      setUser(DEFAULT_BUYER);
      window.location.href = "/buyer-dashboard";
    }
  };

  const currentPath = window.location.pathname;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* BRAND LOGO */}
      <div
        onClick={() => (window.location.href = user?.role === "buyer" ? "/buyer-dashboard" : "/farmer-dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #059669, #047857)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
          }}
        >
          🌱
        </div>
        <div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "#059669", letterSpacing: "-0.02em" }}>
            AgriTrust AI
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
            Tomato Marketplace
          </div>
        </div>
      </div>

      {/* QUICK TABS NAVIGATION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#f1f5f9",
          padding: "4px",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={() => (window.location.href = user?.role === "buyer" ? "/buyer-dashboard" : "/farmer-dashboard")}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "10px",
            background: currentPath.includes("dashboard") || currentPath === "/" ? "#ffffff" : "transparent",
            color: currentPath.includes("dashboard") || currentPath === "/" ? "#059669" : "#475569",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: currentPath.includes("dashboard") || currentPath === "/" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
          }}
        >
          🏠 {t("nav_dashboard")}
        </button>

        <button
          onClick={() => (window.location.href = "/crops")}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "10px",
            background: currentPath === "/crops" || currentPath === "/ai-prediction" ? "#ffffff" : "transparent",
            color: currentPath === "/crops" || currentPath === "/ai-prediction" ? "#059669" : "#475569",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: currentPath === "/crops" || currentPath === "/ai-prediction" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
          }}
        >
          🍅 AI Scanner
        </button>

        <button
          onClick={() => (window.location.href = "/available-crops")}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "10px",
            background: currentPath === "/available-crops" || currentPath === "/place-bid" ? "#ffffff" : "transparent",
            color: currentPath === "/available-crops" || currentPath === "/place-bid" ? "#059669" : "#475569",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: currentPath === "/available-crops" || currentPath === "/place-bid" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
          }}
        >
          🌾 {t("nav_available_crops")}
        </button>

        <button
          onClick={() => (window.location.href = "/market-prices")}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "10px",
            background: currentPath === "/market-prices" ? "#ffffff" : "transparent",
            color: currentPath === "/market-prices" ? "#059669" : "#475569",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: currentPath === "/market-prices" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
          }}
        >
          📊 {t("nav_market_prices")}
        </button>
      </div>

      {/* CONTROLS: ROLE SWITCHER & LANGUAGE & USER PROFILE */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* 1-CLICK INSTANT ROLE SWITCHER BUTTON */}
        <button
          onClick={switchRole}
          title="Click to instantly toggle between Farmer and Buyer mode without registering!"
          style={{
            padding: "8px 14px",
            border: "1.5px solid #f59e0b",
            borderRadius: "12px",
            background: "#fffbeb",
            color: "#b45309",
            fontWeight: "800",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(245, 158, 11, 0.15)",
          }}
        >
          {user?.role === "buyer" ? "🛒 Buyer View 🔄 Switch to Farmer 👨‍🌾" : "👨‍🌾 Farmer View 🔄 Switch to Buyer 🛒"}
        </button>

        {/* LANGUAGE SWITCHER */}
        <button
          onClick={toggleLanguage}
          type="button"
          style={{
            padding: "8px 14px",
            border: "1px solid #059669",
            borderRadius: "12px",
            background: "#ecfdf5",
            color: "#047857",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          🌐 {language === "en" ? "ಕನ್ನಡ" : "English"}
        </button>

        {/* USER NAME BADGE */}
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "10px",
            background: "#f1f5f9",
            color: "#334155",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          👤 {user?.name ? user.name.split(" ")[0] : "User"}
        </div>
      </div>
    </nav>
  );
}
