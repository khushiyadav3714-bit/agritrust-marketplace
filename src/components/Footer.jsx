import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#94a3b8",
        padding: "45px 20px 25px",
        marginTop: "auto",
        borderTop: "1px solid #1e293b",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "35px",
          paddingBottom: "35px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        {/* BRAND COL */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: "800",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🌱
            </span>
            AgriTrust AI
          </div>
          <p style={{ lineHeight: "1.6", color: "#94a3b8" }}>
            {t("dashboard_desc")}
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4
            style={{
              color: "#ffffff",
              fontSize: "15px",
              marginBottom: "14px",
              letterSpacing: "0.5px",
            }}
          >
            Marketplace Links
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <li>
              <a href="/market-prices" style={{ color: "#cbd5e1" }}>
                📊 {t("live_prices")}
              </a>
            </li>
            <li>
              <a href="/available-crops" style={{ color: "#cbd5e1" }}>
                🌾 {t("nav_available_crops")}
              </a>
            </li>
            <li>
              <a href="/ai-prediction" style={{ color: "#cbd5e1" }}>
                🤖 {t("nav_ai_prediction")}
              </a>
            </li>
          </ul>
        </div>

        {/* APMC BENCHMARK */}
        <div>
          <h4
            style={{
              color: "#ffffff",
              fontSize: "15px",
              marginBottom: "14px",
              letterSpacing: "0.5px",
            }}
          >
            Reference & Intelligence
          </h4>
          <p style={{ lineHeight: "1.6", color: "#94a3b8" }}>
            Real-time market reference prices benchmarked directly from Bengaluru APMC & AI EfficientNet CNN freshness scoring.
          </p>
        </div>

        {/* LANGUAGE & CONTROLS */}
        <div>
          <h4
            style={{
              color: "#ffffff",
              fontSize: "15px",
              marginBottom: "14px",
              letterSpacing: "0.5px",
            }}
          >
            Settings & Language
          </h4>
          <button
            onClick={toggleLanguage}
            type="button"
            style={{
              padding: "10px 16px",
              border: "1px solid #059669",
              borderRadius: "10px",
              background: "rgba(5,150,105,0.15)",
              color: "#34d399",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🌐 {language === "en" ? "Switch to ಕನ್ನಡ" : "Switch to English"}
          </button>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "20px auto 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        <div>© {new Date().getFullYear()} AgriTrust AI Marketplace. All rights reserved.</div>
        <div style={{ display: "flex", gap: "15px" }}>
          <span>Direct Farmer Bidding</span>
          <span>•</span>
          <span>AI Freshness Evaluation</span>
        </div>
      </div>
    </footer>
  );
}
