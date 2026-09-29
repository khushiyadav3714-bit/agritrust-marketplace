import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FarmerLeaderboard() {
  const { language, toggleLanguage, t } = useLanguage();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${BACKEND_URL}/vegetable/farmer-rankings`);
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.rankings)) {
          setRankings(data.rankings);
        } else {
          throw new Error("Unable to load farmer rankings.");
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError("Unable to load farmer quality rankings.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return "#059669";
    if (score >= 75) return "#d97706";
    return "#dc2626";
  };

  const getBadgeText = (item) => {
    if (item.badge_key && t(item.badge_key) !== item.badge_key) {
      return t(item.badge_key);
    }
    return item.badge_default || "Top Rated Farmer";
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        border: "1px solid #e2e8f0",
        marginBottom: "24px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "16px",
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: "14px",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "4px",
              background: "#ecfdf5",
              color: "#047857",
              fontSize: "11px",
              fontWeight: "700",
              marginBottom: "4px",
            }}
          >
            Farmer Quality Leaderboard
          </div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "18px",
              fontWeight: "800",
              letterSpacing: "-0.01em",
            }}
          >
            {t("farmer_leaderboard_title")}
          </h2>
          <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px" }}>
            {t("farmer_leaderboard_subtitle")}
          </p>
        </div>

        <button
          onClick={toggleLanguage}
          type="button"
          style={{
            padding: "6px 12px",
            border: "1px solid #059669",
            borderRadius: "8px",
            background: "#ecfdf5",
            color: "#047857",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "12px",
          }}
        >
          🌐 {language === "en" ? "ಕನ್ನಡ" : "English"}
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
          Loading Leaderboard...
        </div>
      ) : error ? (
        <div style={{ padding: "12px", background: "#fef2f2", color: "#991b1b", borderRadius: "8px", fontSize: "13px" }}>
          ⚠️ {error}
        </div>
      ) : rankings.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
          No farmer listings available for ranking yet.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "10px 12px" }}>Rank</th>
                <th style={{ padding: "10px 12px" }}>{t("farmer_name")}</th>
                <th style={{ padding: "10px 12px" }}>{t("location")}</th>
                <th style={{ padding: "10px 12px" }}>{t("avg_freshness")}</th>
                <th style={{ padding: "10px 12px" }}>{t("quality_badge")}</th>
                <th style={{ padding: "10px 12px" }}>{t("total_crops")}</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: index % 2 === 0 ? "#ffffff" : "#fafcfa",
                  }}
                >
                  {/* RANK */}
                  <td style={{ padding: "12px", fontWeight: "800" }}>
                    {item.rank === 1 ? (
                      <span style={{ color: "#d97706" }}>🥇 #1</span>
                    ) : item.rank === 2 ? (
                      <span style={{ color: "#475569" }}>🥈 #2</span>
                    ) : item.rank === 3 ? (
                      <span style={{ color: "#b45309" }}>🥉 #3</span>
                    ) : (
                      <span style={{ color: "#64748b" }}>#{item.rank}</span>
                    )}
                  </td>

                  {/* FARMER NAME */}
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a" }}>{item.farmer_name}</div>
                    <small style={{ color: "#94a3b8", fontSize: "11px" }}>{item.farmer_email}</small>
                  </td>

                  {/* LOCATION */}
                  <td style={{ padding: "12px", color: "#475569" }}>
                    {item.location}
                  </td>

                  {/* AVG FRESHNESS BAR */}
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "70px",
                          height: "6px",
                          background: "#e2e8f0",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(item.avg_freshness_score, 100)}%`,
                            height: "100%",
                            background: getScoreColor(item.avg_freshness_score),
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: "700", fontSize: "12px", color: getScoreColor(item.avg_freshness_score) }}>
                        {item.avg_freshness_score}%
                      </span>
                    </div>
                  </td>

                  {/* BADGE */}
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: item.rank === 1 ? "#fffbeb" : "#f1f5f9",
                        color: item.rank === 1 ? "#d97706" : "#334155",
                        fontWeight: "700",
                        fontSize: "11px",
                        border: "1px solid #e2e8f0",
                        display: "inline-block",
                      }}
                    >
                      {getBadgeText(item)}
                    </span>
                  </td>

                  {/* TOTAL CROPS */}
                  <td style={{ padding: "12px", fontWeight: "700", color: "#059669" }}>
                    {item.total_crops} Listings
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
