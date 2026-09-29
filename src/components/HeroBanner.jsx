import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function HeroBanner({ role }) {
  const { t } = useLanguage();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "24px",
        background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)",
        color: "#ffffff",
        boxShadow: "0 10px 25px -5px rgba(4, 120, 87, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Subtle Mesh Background */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0, left: 0,
          background: "radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Sleek Top-Right Tag */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "6px 14px",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: "14px" }}>🍅</span>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#fef08a", letterSpacing: "0.3px", textTransform: "uppercase" }}>
          AI Verified Freshness
        </span>
      </div>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "32px 32px 28px",
          maxWidth: "750px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.12)",
            fontSize: "11px",
            fontWeight: "700",
            marginBottom: "12px",
            letterSpacing: "0.5px",
            color: "#a7f3d0",
            textTransform: "uppercase",
          }}
        >
          AgriTrust Intelligence Platform
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            margin: "0 0 10px",
            lineHeight: "1.25",
            letterSpacing: "-0.02em",
            color: "#ffffff",
          }}
        >
          Tomato Marketplace & <br />
          <span style={{ color: "#fef08a" }}>
            AI Quality Assessment
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "13px",
            lineHeight: "1.55",
            margin: "0 0 20px",
            opacity: 0.9,
            maxWidth: "580px",
            color: "#ecfdf5",
          }}
        >
          Real-time tomato freshness scoring, APMC Bengaluru price benchmarks, and direct farmer-buyer bidding.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {role === "farmer" ? (
            <>
              <button
                onClick={() => (window.location.href = "/crops")}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#059669",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                🍅 Analyze Crop
              </button>

              <button
                onClick={() => (window.location.href = "/my-crops")}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                My Crops
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => (window.location.href = "/available-crops")}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#059669",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                🌾 Available Crops
              </button>

              <button
                onClick={() => (window.location.href = "/market-prices")}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                📊 Market Prices
              </button>
            </>
          )}
        </div>
      </div>

      {/* Compact Feature Bar */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.2)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "12px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "14px",
          fontSize: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🍅</span>
          <div>
            <div style={{ fontWeight: "700", color: "#ffffff" }}>AI Quality Score</div>
            <div style={{ fontSize: "11px", opacity: 0.7, color: "#ecfdf5" }}>EfficientNet Model</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🧪</span>
          <div>
            <div style={{ fontWeight: "700", color: "#ffffff" }}>Pesticide Safety</div>
            <div style={{ fontSize: "11px", opacity: 0.7, color: "#ecfdf5" }}>Spray Days Check</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📊</span>
          <div>
            <div style={{ fontWeight: "700", color: "#ffffff" }}>APMC Benchmark</div>
            <div style={{ fontSize: "11px", opacity: 0.7, color: "#ecfdf5" }}>Bengaluru Reference</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🏆</span>
          <div>
            <div style={{ fontWeight: "700", color: "#ffffff" }}>Farmer Leaderboard</div>
            <div style={{ fontSize: "11px", opacity: 0.7, color: "#ecfdf5" }}>Freshness Rankings</div>
          </div>
        </div>
      </div>
    </div>
  );
}
