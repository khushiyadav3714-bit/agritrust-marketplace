import React, { useState } from "react";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const { language, toggleLanguage, t } = useLanguage();
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const enteredEmail =
      email.trim().toLowerCase();

    setLoading(true);

    try {
      // =================================================
      // SELECT BACKEND LOGIN ENDPOINT
      // =================================================

      const endpoint =
        role === "farmer"
          ? "http://127.0.0.1:8000/auth/farmer/login"
          : "http://127.0.0.1:8000/auth/buyer/login";

      // =================================================
      // SEND LOGIN REQUEST
      // =================================================

      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: enteredEmail,
            password: password,
            role: role,
          }),
        }
      );

      // =================================================
      // READ RESPONSE
      // =================================================

      const data =
        await response.json();

      // =================================================
      // LOGIN ERROR
      // =================================================

      if (!response.ok) {
        alert(
          data.detail ||
            "Login failed. Please check your email and password."
        );

        return;
      }

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      console.log(
        "Login successful:",
        data
      );

      // =================================================
      // SAVE CURRENT USER
      // =================================================

      localStorage.setItem(
        "agritrust_user",
        JSON.stringify(data)
      );

      // =================================================
      // SAVE JWT TOKEN
      // =================================================

      if (data.access_token) {
        localStorage.setItem(
          "access_token",
          data.access_token
        );
      }

      // =================================================
      // ROLE REDIRECTION
      // =================================================

      if (data.role === "farmer") {
        window.location.href =
          "/dashboard";

        return;
      }

      if (data.role === "buyer") {
        window.location.href =
          "/buyer-dashboard";

        return;
      }

      alert(
        "Login successful, but user role is invalid."
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Unable to connect to the backend. Please make sure the FastAPI server is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #eef8f0 0%, #f8fbf8 50%, #e7f5ea 100%)",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >

      {/* =================================================
          MAIN LOGIN CONTAINER
      ================================================= */}

      <div
        className="agritrust-login-container"
        style={{
          width: "100%",
          maxWidth: "950px",
          minHeight: "570px",
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 0.95fr) minmax(0, 1.05fr)",
          background: "#ffffff",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(35, 90, 50, 0.15)",
          border:
            "1px solid rgba(30, 100, 50, 0.08)",
        }}
      >

        {/* =================================================
            LEFT BRAND SECTION
        ================================================= */}

        <div
          style={{
            position: "relative",
            padding: "50px 42px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "linear-gradient(145deg, #166534, #218c4a)",
            color: "#ffffff",
            overflow: "hidden",
          }}
        >

          {/* Decorative circles */}

          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.07)",
              right: "-90px",
              top: "-70px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "rgba(255,255,255,0.06)",
              left: "-90px",
              bottom: "-60px",
            }}
          />

          {/* BRAND */}

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "45px",
              }}
            >

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "rgba(255,255,255,0.16)",
                  fontSize: "25px",
                }}
              >
                🌱
              </div>

              <div
                style={{
                  fontSize: "27px",
                  fontWeight: "800",
                  letterSpacing:
                    "-0.5px",
                }}
              >
                AgriTrust
              </div>

            </div>

            <h1
              style={{
                fontSize: "42px",
                lineHeight: "1.12",
                margin:
                  "0 0 20px",
                fontWeight: "800",
                letterSpacing:
                  "-1px",
              }}
            >
              Connecting
              <br />
              Farmers & Buyers
            </h1>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                margin: 0,
                maxWidth: "380px",
                color:
                  "rgba(255,255,255,0.86)",
              }}
            >
              A transparent agricultural
              marketplace where farmers
              and buyers connect, compare
              prices and trade with confidence.
            </p>

          </div>

          {/* FEATURES */}

          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "40px",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >

              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  background:
                    "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                📊
              </span>

              Live market price information

            </div>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >

              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  background:
                    "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🤖
              </span>

              AI-powered crop insights

            </div>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
              }}
            >

              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  background:
                    "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🤝
              </span>

              Transparent bidding

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT LOGIN SECTION
        ================================================= */}

        <div
          style={{
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >

          {/* LOGIN HEADER */}

          <div
            style={{
              marginBottom: "30px",
            }}
          >

            <p
              style={{
                margin:
                  "0 0 8px",
                color: "#238446",
                fontSize: "13px",
                fontWeight: "700",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "1px",
              }}
            >
              Welcome back
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "800",
                color: "#17351f",
                letterSpacing:
                  "-0.5px",
              }}
            >
              Login to AgriTrust
            </h2>

            <p
              style={{
                margin:
                  "10px 0 0",
                color: "#718078",
                fontSize: "14px",
              }}
            >
              Continue to your agricultural
              marketplace.
            </p>

          </div>


          {/* =================================================
              ROLE SELECTOR
          ================================================= */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#34463a",
              }}
            >
              Login as
            </label>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "10px",
                padding: "5px",
                borderRadius: "14px",
                background: "#f1f6f2",
              }}
            >

              {/* FARMER */}

              <button
                type="button"
                onClick={() => {
                  setRole("farmer");
                }}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  background:
                    role === "farmer"
                      ? "#ffffff"
                      : "transparent",
                  color:
                    role === "farmer"
                      ? "#18743b"
                      : "#718078",
                  boxShadow:
                    role === "farmer"
                      ? "0 3px 12px rgba(30,80,40,0.10)"
                      : "none",
                }}
              >
                🌱 Farmer
              </button>


              {/* BUYER */}

              <button
                type="button"
                onClick={() => {
                  setRole("buyer");
                }}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  background:
                    role === "buyer"
                      ? "#ffffff"
                      : "transparent",
                  color:
                    role === "buyer"
                      ? "#18743b"
                      : "#718078",
                  boxShadow:
                    role === "buyer"
                      ? "0 3px 12px rgba(30,80,40,0.10)"
                      : "none",
                }}
              >
                🛒 Buyer
              </button>

            </div>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#34463a",
                }}
              >
                Email Address
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >

                <span
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    fontSize: "17px",
                  }}
                >
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "14px 15px 14px 45px",
                    border:
                      "1px solid #dce6de",
                    borderRadius: "12px",
                    outline: "none",
                    fontSize: "14px",
                    color: "#25352b",
                    background:
                      "#fbfdfb",
                  }}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#34463a",
                }}
              >
                Password
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >

                <span
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    fontSize: "17px",
                  }}
                >
                  🔒
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "14px 15px 14px 45px",
                    border:
                      "1px solid #dce6de",
                    borderRadius: "12px",
                    outline: "none",
                    fontSize: "14px",
                    color: "#25352b",
                    background:
                      "#fbfdfb",
                  }}
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "13px",
                padding: "15px",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
                fontSize: "15px",
                fontWeight: "800",
                color: "#ffffff",
                background:
                  loading
                    ? "#8db69a"
                    : "linear-gradient(135deg, #18743b, #23934c)",
                boxShadow:
                  "0 8px 20px rgba(24,116,59,0.20)",
              }}
            >
              {loading
                ? "Logging in..."
                : `Login as ${
                    role === "farmer"
                      ? "Farmer"
                      : "Buyer"
                  }`}
            </button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop:
                "1px solid #edf1ee",
              textAlign: "center",
            }}
          >

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#718078",
              }}
            >
              Don't have an account?{" "}

              <span
                onClick={() => {
                  window.location.href =
                    "/register";
                }}
                style={{
                  cursor: "pointer",
                  color: "#18743b",
                  fontWeight: "800",
                }}
              >
                Create an account
              </span>

            </p>

          </div>


          {/* TRUST MESSAGE */}

          <p
            style={{
              textAlign: "center",
              margin:
                "18px 0 0",
              fontSize: "11px",
              color: "#9aa69e",
            }}
          >
            🔐 Secure access to your AgriTrust account
          </p>

        </div>

      </div>


      {/* =================================================
          RESPONSIVE DESIGN
      ================================================= */}

      <style>
        {`
          @media (max-width: 760px) {

            .agritrust-login-container {
              grid-template-columns: 1fr !important;
              max-width: 520px !important;
              min-height: auto !important;
            }

            .agritrust-login-container > div:first-child {
              display: none !important;
            }

            .agritrust-login-container > div:last-child {
              padding: 35px 25px !important;
            }

          }

          @media (max-width: 420px) {

            .agritrust-login-container > div:last-child {
              padding: 30px 20px !important;
            }

          }
        `}
      </style>
      </div>

      <Footer />
    </div>
  );
}

export default Login;