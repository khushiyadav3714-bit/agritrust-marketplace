import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import FarmerLeaderboard from "../components/FarmerLeaderboard";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import ShowcaseCards from "../components/ShowcaseCards";

function BuyerDashboard() {
  const { language, toggleLanguage, t } = useLanguage();
  const [buyer, setBuyer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // GET CURRENT BUYER
  // =====================================================

  useEffect(() => {
    const savedUser =
      localStorage.getItem("agritrust_user");

    if (!savedUser) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role === "buyer") {
        setBuyer(user);
      }
    } catch (error) {
      console.error(
        "Unable to read buyer login:",
        error
      );
    }
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    window.location.href = path;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("agritrust_user");
    window.location.href = "/login";
  };

  // =====================================================
  // BUYER ACCESS CHECK
  // =====================================================

  if (!buyer) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #eef8f0, #f8fbf8)",
          padding: "20px",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "40px 30px",
            textAlign: "center",
            boxShadow:
              "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: "75px",
              height: "75px",
              margin: "0 auto 20px",
              borderRadius: "22px",
              background: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
            }}
          >
            🛒
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              color: "#173b25",
              fontSize: "28px",
            }}
          >
            Buyer Access
          </h1>

          <p
            style={{
              color: "#66736a",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            Please login as a buyer to
            access your AgriTrust dashboard.
          </p>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              background: "#2e7d32",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f8f5",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#1f2d24",
      }}
    >
      {/* =================================================
          TOP MOBILE BAR
      ================================================= */}

      <div
        style={{
          display: "none",
          padding: "15px 20px",
          background: "#ffffff",
          borderBottom:
            "1px solid #e5ebe5",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
        className="mobile-topbar"
      >
        <div
          style={{
            fontSize: "21px",
            fontWeight: "bold",
            color: "#246b36",
          }}
        >
          🌿 AgriTrust
        </div>

        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          style={{
            border: "none",
            background: "#eef7ef",
            borderRadius: "10px",
            padding: "10px 13px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* =================================================
          APP LAYOUT
      ================================================= */}

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          style={{
            width: "250px",
            background:
              "linear-gradient(180deg, #173b25 0%, #205b31 100%)",
            color: "#ffffff",
            padding: "28px 18px",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
          className={
            menuOpen
              ? "sidebar-open"
              : "sidebar"
          }
        >
          {/* LOGO */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding:
                "5px 10px 30px",
            }}
          >
            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "14px",
                background:
                  "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              🌿
            </div>

            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                AgriTrust
              </div>

              <div
                style={{
                  fontSize: "11px",
                  opacity: 0.7,
                  marginTop: "3px",
                }}
              >
                Smart Agriculture
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <div
            style={{
              fontSize: "11px",
              letterSpacing: "1px",
              opacity: 0.6,
              padding:
                "0 12px 12px",
              textTransform:
                "uppercase",
            }}
          >
            Buyer Menu
          </div>

          <button
            onClick={() => goTo("/buyer-dashboard")}
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              borderRadius: "12px",
              padding: "13px 14px",
              background:
                "rgba(255,255,255,0.14)",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            🏠 &nbsp; Dashboard
          </button>

          <button
            onClick={() =>
              goTo("/available-crops")
            }
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              borderRadius: "12px",
              padding: "13px 14px",
              background: "transparent",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            🌾 &nbsp; Available Crops
          </button>

          <button
            onClick={() => goTo("/my-bids")}
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              borderRadius: "12px",
              padding: "13px 14px",
              background: "transparent",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            💰 &nbsp; My Bids
          </button>

          <button
            onClick={() =>
              goTo("/market-prices")
            }
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              borderRadius: "12px",
              padding: "13px 14px",
              background: "transparent",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            📊 &nbsp; Market Prices
          </button>

          {/* BOTTOM PROFILE */}

          <div
            style={{
              marginTop: "auto",
              borderTop:
                "1px solid rgba(255,255,255,0.15)",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#dcedc8",
                  color: "#24552f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
              >
                {(buyer.name || "B")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace:
                      "nowrap",
                    overflow: "hidden",
                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {buyer.name ||
                    "Buyer"}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.65,
                  }}
                >
                  Buyer Account
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                width: "100%",
                border:
                  "1px solid rgba(255,255,255,0.25)",
                borderRadius: "10px",
                padding: "10px",
                background:
                  "transparent",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              ↪ Logout
            </button>
          </div>
        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          style={{
            flex: 1,
            padding: "30px",
            boxSizing: "border-box",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 7px",
                  color: "#6c7b71",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                {t("buyer_dashboard")}
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  color: "#173b25",
                }}
              >
                {t("welcome")}, {buyer.name || "Buyer"} 👋
              </h1>

              <p
                style={{
                  color: "#718078",
                  margin: "8px 0 0",
                }}
              >
                {t("buyer_dashboard_desc")}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={toggleLanguage}
                type="button"
                style={{
                  padding: "10px 16px",
                  border: "1px solid #2e7d32",
                  borderRadius: "12px",
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                🌐 {language === "en" ? "ಕನ್ನಡ" : "English"}
              </button>

              <button
                onClick={logout}
                style={{
                  border: "1px solid #dce5dc",
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "11px 17px",
                  cursor: "pointer",
                  color: "#496050",
                  fontWeight: "bold",
                }}
              >
                {t("logout")}
              </button>
            </div>
          </div>

          {/* HERO BANNER & SHOWCASE CARDS (MATCHING REFERENCE DESIGN CONCEPT) */}
          <HeroBanner role="buyer" />
          <ShowcaseCards role="buyer" />

          {/* =================================================
              QUICK STATS
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "17px",
                padding: "20px",
                border:
                  "1px solid #e5ebe5",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "12px",
                }}
              >
                🌾
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#718078",
                }}
              >
                Marketplace
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginTop: "5px",
                  color: "#1f4e2b",
                }}
              >
                Available Crops
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "17px",
                padding: "20px",
                border:
                  "1px solid #e5ebe5",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "12px",
                }}
              >
                💰
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#718078",
                }}
              >
                Activity
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginTop: "5px",
                  color: "#1f4e2b",
                }}
              >
                My Bids
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "17px",
                padding: "20px",
                border:
                  "1px solid #e5ebe5",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "12px",
                }}
              >
                📊
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#718078",
                }}
              >
                Reference
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginTop: "5px",
                  color: "#1f4e2b",
                }}
              >
                Market Prices
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "17px",
                padding: "20px",
                border:
                  "1px solid #e5ebe5",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "12px",
                }}
              >
                🤖
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#718078",
                }}
              >
                Technology
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginTop: "5px",
                  color: "#1f4e2b",
                }}
              >
                AI Quality
              </div>
            </div>
          </div>

          {/* =================================================
              FARMER AI FRESHNESS LEADERBOARD
          ================================================= */}

          <FarmerLeaderboard />

          {/* =================================================
              SECTION TITLE
          ================================================= */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                color: "#1f3827",
              }}
            >
              Quick Actions
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color: "#77847b",
                fontSize: "14px",
              }}
            >
              Everything you need to
              participate in the marketplace.
            </p>
          </div>

          {/* =================================================
              MAIN ACTION CARDS
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            {/* AVAILABLE CROPS */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "23px",
                border:
                  "1px solid #e4ebe4",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.035)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  background: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  marginBottom: "17px",
                }}
              >
                🌾
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  color: "#21462b",
                }}
              >
                Available Crops
              </h3>

              <p
                style={{
                  color: "#718078",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  minHeight:
                    "68px",
                }}
              >
                Explore farmer listings,
                quantities, locations,
                market prices and AI
                crop quality.
              </p>

              <button
                onClick={() =>
                  goTo("/available-crops")
                }
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "11px",
                  padding: "12px",
                  background: "#2e7d32",
                  color: "#ffffff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                View Available Crops →
              </button>
            </div>

            {/* MY BIDS */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "23px",
                border:
                  "1px solid #e4ebe4",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.035)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  background: "#fff4df",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  marginBottom: "17px",
                }}
              >
                💰
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  color: "#21462b",
                }}
              >
                My Bids
              </h3>

              <p
                style={{
                  color: "#718078",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  minHeight:
                    "68px",
                }}
              >
                Track the bids you have
                placed and see whether
                they are pending, accepted
                or rejected.
              </p>

              <button
                onClick={() =>
                  goTo("/my-bids")
                }
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "11px",
                  padding: "12px",
                  background: "#557b31",
                  color: "#ffffff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                View My Bids →
              </button>
            </div>

            {/* MARKET PRICES */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "23px",
                border:
                  "1px solid #e4ebe4",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.035)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  background: "#e7f1ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  marginBottom: "17px",
                }}
              >
                📊
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  color: "#21462b",
                }}
              >
                Market Prices
              </h3>

              <p
                style={{
                  color: "#718078",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  minHeight:
                    "68px",
                }}
              >
                Check the current market
                reference price before
                deciding how much to bid.
              </p>

              <button
                onClick={() =>
                  goTo("/market-prices")
                }
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "11px",
                  padding: "12px",
                  background: "#356fa3",
                  color: "#ffffff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                View Market Prices →
              </button>
            </div>

            {/* TRANSPARENT BIDDING */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "23px",
                border:
                  "1px solid #e4ebe4",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.035)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  background: "#f1eafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  marginBottom: "17px",
                }}
              >
                🤝
              </div>

              <h3
                style={{
                  margin:
                    "0 0 8px",
                  color: "#21462b",
                }}
              >
                Transparent Bidding
              </h3>

              <p
                style={{
                  color: "#718078",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  minHeight:
                    "68px",
                }}
              >
                Make informed decisions
                using crop information,
                market references and
                AI quality analysis.
              </p>

              <button
                onClick={() =>
                  goTo("/available-crops")
                }
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "11px",
                  padding: "12px",
                  background: "#6b4f9c",
                  color: "#ffffff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Start Bidding →
              </button>
            </div>
          </div>

          {/* =================================================
              BUYER PROFILE
          ================================================= */}

          <div
            style={{
              marginTop: "28px",
              background: "#ffffff",
              borderRadius: "20px",
              border:
                "1px solid #e4ebe4",
              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "21px",
                    color: "#21462b",
                  }}
                >
                  👤 Buyer Profile
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#77847b",
                    fontSize: "13px",
                  }}
                >
                  Your registered account
                  information
                </p>
              </div>

              <div
                style={{
                  padding:
                    "7px 12px",
                  borderRadius: "20px",
                  background: "#e9f6eb",
                  color: "#2e7d32",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                ● Active Buyer
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "15px",
              }}
            >
              <div
                style={{
                  background: "#f7f9f7",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#7a877d",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  NAME
                </div>

                <strong>
                  {buyer.name ||
                    "Not Available"}
                </strong>
              </div>

              <div
                style={{
                  background: "#f7f9f7",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#7a877d",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  EMAIL
                </div>

                <strong
                  style={{
                    wordBreak:
                      "break-word",
                  }}
                >
                  {buyer.email ||
                    "Not Available"}
                </strong>
              </div>

              <div
                style={{
                  background: "#f7f9f7",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#7a877d",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  PHONE
                </div>

                <strong>
                  {buyer.phone ||
                    "Not Available"}
                </strong>
              </div>

              <div
                style={{
                  background: "#f7f9f7",
                  padding: "15px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#7a877d",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  LOCATION
                </div>

                <strong>
                  {buyer.location ||
                    "Not Available"}
                </strong>
              </div>
            </div>
          </div>

          {/* =================================================
              HOW AGRITRUST WORKS
          ================================================= */}

          <div
            style={{
              marginTop: "28px",
              background: "#eef7ef",
              borderRadius: "20px",
              padding: "25px",
              border:
                "1px solid #dcebdc",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 8px",
                color: "#21462b",
                fontSize: "21px",
              }}
            >
              🌱 How AgriTrust Helps You
            </h2>

            <p
              style={{
                margin:
                  "0 0 20px",
                color: "#66756a",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              AgriTrust gives buyers the
              information they need before
              making a purchase decision.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "15px",
              }}
            >
              <div>
                <strong>
                  01. Inspect
                </strong>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6e7c72",
                    lineHeight:
                      "1.5",
                  }}
                >
                  View crop images and
                  farmer information.
                </p>
              </div>

              <div>
                <strong>
                  02. Compare
                </strong>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6e7c72",
                    lineHeight:
                      "1.5",
                  }}
                >
                  Compare the crop with
                  market reference prices.
                </p>
              </div>

              <div>
                <strong>
                  03. Analyze
                </strong>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6e7c72",
                    lineHeight:
                      "1.5",
                  }}
                >
                  Use AI quality information
                  as decision support.
                </p>
              </div>

              <div>
                <strong>
                  04. Bid
                </strong>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6e7c72",
                    lineHeight:
                      "1.5",
                  }}
                >
                  Place a transparent bid
                  on the crop.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            style={{
              textAlign: "center",
              padding:
                "30px 10px 10px",
              color: "#89958c",
              fontSize: "12px",
            }}
          >
            🌿 AgriTrust · Smart &
            Transparent Agricultural Marketplace
          </div>
        </main>
      </div>

      {/* =================================================
          RESPONSIVE CSS
      ================================================= */}

      <style>
        {`
          @media (max-width: 800px) {

            .mobile-topbar {
              display: flex !important;
            }

            .sidebar {
              display: none !important;
            }

            .sidebar-open {
              display: flex !important;
              position: fixed !important;
              left: 0;
              top: 0;
              bottom: 0;
              z-index: 200;
              width: 250px !important;
              box-shadow:
                10px 0 30px rgba(0,0,0,0.15);
            }

            main {
              padding: 20px !important;
            }

          }

          @media (max-width: 550px) {

            h1 {
              font-size: 25px !important;
            }

            main {
              padding: 15px !important;
            }

          }

          button {
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease,
              opacity 0.15s ease;
          }

          button:hover {
            opacity: 0.92;
          }

          button:active {
            transform: scale(0.98);
          }
        `}
      </style>
      <Footer />
    </div>
  );
}

export default BuyerDashboard;