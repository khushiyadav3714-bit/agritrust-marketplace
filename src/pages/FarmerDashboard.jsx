import React from "react";
import PriceTrendChart from "./PriceTrendChart";

function FarmerDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf7",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e8e8e8",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "25px",
            }}
          >
            🌱
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                color: "#2e7d32",
              }}
            >
              AgriTrust
            </h2>

            <small
              style={{
                color: "#777",
              }}
            >
              Farmer Marketplace
            </small>
          </div>

        </div>


        <button
          onClick={() => {
            localStorage.removeItem(
              "agritrust_user"
            );

            window.location.href =
              "/login";
          }}
          style={{
            padding: "10px 18px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#ffffff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "40px 20px 70px",
        }}
      >

        {/* =================================================
            WELCOME SECTION
        ================================================= */}

        <section
          style={{
            background:
              "linear-gradient(135deg, #2e7d32, #43a047)",
            borderRadius: "22px",
            padding: "35px",
            color: "#ffffff",
            marginBottom: "30px",
            boxShadow:
              "0 8px 25px rgba(46,125,50,0.18)",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "25px",
            }}
          >

            <div>

              <p
                style={{
                  margin: "0 0 8px",
                  opacity: 0.9,
                  fontSize: "14px",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                }}
              >
                FARMER DASHBOARD
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "34px",
                }}
              >
                Welcome, Farmer! 👋
              </h1>

              <p
                style={{
                  margin:
                    "12px 0 0",
                  maxWidth: "650px",
                  lineHeight: 1.6,
                  opacity: 0.95,
                }}
              >
                Manage your crops, monitor
                market prices and connect
                directly with buyers through
                the AgriTrust marketplace.
              </p>

            </div>


            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "25px",
                background:
                  "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "50px",
              }}
            >
              👨‍🌾
            </div>

          </div>

        </section>


        {/* =================================================
            QUICK OVERVIEW
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              borderRadius: "17px",
              padding: "22px",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                marginBottom: "10px",
              }}
            >
              🌾
            </div>

            <small
              style={{
                color: "#777",
              }}
            >
              CROP MANAGEMENT
            </small>

            <h3
              style={{
                margin:
                  "7px 0 0",
              }}
            >
              My Crops
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                marginBottom: 0,
              }}
            >
              Manage your listings
            </p>
          </div>


          <div
            style={{
              background: "#ffffff",
              borderRadius: "17px",
              padding: "22px",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                marginBottom: "10px",
              }}
            >
              📊
            </div>

            <small
              style={{
                color: "#777",
              }}
            >
              MARKET
            </small>

            <h3
              style={{
                margin:
                  "7px 0 0",
              }}
            >
              Live Prices
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                marginBottom: 0,
              }}
            >
              Track current prices
            </p>
          </div>


          <div
            style={{
              background: "#ffffff",
              borderRadius: "17px",
              padding: "22px",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                marginBottom: "10px",
              }}
            >
              🤝
            </div>

            <small
              style={{
                color: "#777",
              }}
            >
              MARKETPLACE
            </small>

            <h3
              style={{
                margin:
                  "7px 0 0",
              }}
            >
              Buyer Bids
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                marginBottom: 0,
              }}
            >
              Review buyer offers
            </p>
          </div>


          <div
            style={{
              background: "#ffffff",
              borderRadius: "17px",
              padding: "22px",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                marginBottom: "10px",
              }}
            >
              🤖
            </div>

            <small
              style={{
                color: "#777",
              }}
            >
              ARTIFICIAL INTELLIGENCE
            </small>

            <h3
              style={{
                margin:
                  "7px 0 0",
              }}
            >
              AI Analysis
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                marginBottom: 0,
              }}
            >
              AI-powered insights
            </p>
          </div>

        </div>
        <PriceTrendChart />


        {/* =================================================
            FARMER SERVICES
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >

          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              🌱 Farmer Services
            </h2>

            <p
              style={{
                color: "#777",
                margin:
                  "5px 0 0",
              }}
            >
              Everything you need to manage
              your crop marketplace.
            </p>
          </div>

        </div>


        {/* =================================================
            SERVICE CARDS
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "22px",
          }}
        >

          {/* MY CROPS */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "19px",
              padding: "27px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "16px",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                marginBottom: "18px",
              }}
            >
              🌾
            </div>

            <h2>
              My Crops
            </h2>

            <p
              style={{
                color: "#666",
                lineHeight: 1.6,
                minHeight: "50px",
              }}
            >
              View your registered crops,
              AI quality information,
              buyer feedback and listing
              status.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "/my-crops";
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#2e7d32",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View My Crops →
            </button>

          </div>


          {/* MARKET PRICES */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "19px",
              padding: "27px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "16px",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                marginBottom: "18px",
              }}
            >
              📊
            </div>

            <h2>
              Live Market Prices
            </h2>

            <p
              style={{
                color: "#666",
                lineHeight: 1.6,
                minHeight: "50px",
              }}
            >
              Check current tomato market
              reference prices from
              Bengaluru APMC.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "/market-prices";
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#2e7d32",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View Live Prices →
            </button>

          </div>


          {/* BUYER BIDS */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "19px",
              padding: "27px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "16px",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                marginBottom: "18px",
              }}
            >
              🤝
            </div>

            <h2>
              Buyer Bids
            </h2>

            <p
              style={{
                color: "#666",
                lineHeight: 1.6,
                minHeight: "50px",
              }}
            >
              Review offers submitted by
              buyers and choose the best
              available bid.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "/buyer-bids";
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#2e7d32",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View Buyer Bids →
            </button>

          </div>


          {/* AI PREDICTION */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "19px",
              padding: "27px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "16px",
                background: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                marginBottom: "18px",
              }}
            >
              🤖
            </div>

            <h2>
              AI Prediction
            </h2>

            <p
              style={{
                color: "#666",
                lineHeight: 1.6,
                minHeight: "50px",
              }}
            >
              Get AI-based crop quality
              insights and intelligent
              price recommendations.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "/ai-prediction";
              }}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#2e7d32",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Open AI Analysis →
            </button>

          </div>

        </div>


        {/* =================================================
            HOW AGRITRUST HELPS
        ================================================= */}

        <div
          style={{
            marginTop: "30px",
            background: "#ffffff",
            borderRadius: "19px",
            padding: "27px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            🤝 How AgriTrust Helps Farmers
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >

            <div>
              <h3>
                🌾 Direct Marketplace
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                Connect directly with buyers
                and receive transparent
                offers for your crops.
              </p>
            </div>

            <div>
              <h3>
                📊 Market Transparency
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                Compare your crop prices with
                current market reference
                prices.
              </p>
            </div>

            <div>
              <h3>
                🤖 AI Support
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                Use AI-generated crop quality
                information to support
                better selling decisions.
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
            marginTop: "35px",
            color: "#888",
            fontSize: "13px",
          }}
        >
          🌱 AgriTrust • Transparent
          Agricultural Marketplace
        </div>

      </main>

    </div>
  );
}

export default FarmerDashboard;