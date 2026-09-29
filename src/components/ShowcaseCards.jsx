import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ShowcaseCards({ role }) {
  const { t } = useLanguage();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      {/* CARD 1: TOMATO AI ANALYSIS */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "100px",
            background: "linear-gradient(135deg, #064e3b, #059669)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              padding: "3px 8px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.18)",
              fontSize: "11px",
              fontWeight: "700",
              width: "fit-content",
            }}
          >
            AI Quality Engine
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#ffffff", fontWeight: "700" }}>
              Tomato AI Freshness
            </h3>
            <div style={{ fontSize: "11px", opacity: 0.85, color: "#ecfdf5" }}>
              CNN Model Evaluation
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Grade Standard</span>
              <span style={{ padding: "2px 8px", borderRadius: "4px", background: "#ecfdf5", color: "#047857", fontWeight: "700" }}>
                Grade A Premium
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Pesticide Check</span>
              <span style={{ padding: "2px 8px", borderRadius: "4px", background: "#ecfdf5", color: "#047857", fontWeight: "700" }}>
                Low Risk (7+ Days)
              </span>
            </div>

            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: "0 0 16px" }}>
              Upload tomato produce images for instant computer vision freshness scoring.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/crops")}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: "8px",
              border: "none",
              background: "#059669",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Open AI Scanner →
          </button>
        </div>
      </div>

      {/* CARD 2: LIVE APMC MARKET PRICES */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "100px",
            background: "linear-gradient(135deg, #0f766e, #0d9488)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              padding: "3px 8px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.18)",
              fontSize: "11px",
              fontWeight: "700",
              width: "fit-content",
            }}
          >
            APMC Benchmark
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#ffffff", fontWeight: "700" }}>
              Live Market Prices
            </h3>
            <div style={{ fontSize: "11px", opacity: 0.85, color: "#ccfbf1" }}>
              Bengaluru Reference
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Reference Rate</span>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f766e" }}>
                ₹35.00 / kg
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Source</span>
              <span style={{ fontWeight: "600", color: "#475569" }}>
                AGMARKNET APMC
              </span>
            </div>

            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: "0 0 16px" }}>
              Track real-time reference prices to compare farmer listings and place bids.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/market-prices")}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: "8px",
              border: "none",
              background: "#0f766e",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            View Price Trends →
          </button>
        </div>
      </div>

      {/* CARD 3: FARMER LEADERBOARD */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "100px",
            background: "linear-gradient(135deg, #b45309, #d97706)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              padding: "3px 8px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.18)",
              fontSize: "11px",
              fontWeight: "700",
              width: "fit-content",
            }}
          >
            Quality Leaderboard
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#ffffff", fontWeight: "700" }}>
              Farmer Quality Ranks
            </h3>
            <div style={{ fontSize: "11px", opacity: 0.85, color: "#fffbeb" }}>
              Freshness Score System
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Rank #1</span>
              <span style={{ fontWeight: "700", color: "#b45309" }}>
                Top Quality Farmer
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Visibility</span>
              <span style={{ padding: "2px 8px", borderRadius: "4px", background: "#fffbeb", color: "#b45309", fontWeight: "700" }}>
                Public to Buyers
              </span>
            </div>

            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: "0 0 16px" }}>
              Farmers ranked by crop quality grades, AI freshness, and pesticide safety.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/buyer-dashboard")}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: "8px",
              border: "none",
              background: "#d97706",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            View Leaderboard →
          </button>
        </div>
      </div>
    </div>
  );
}
