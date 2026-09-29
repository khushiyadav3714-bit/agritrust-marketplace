import React, { useState } from "react";
import Footer from "../components/Footer";

function Register() {
  const [role, setRole] = useState("farmer");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    crop: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // SAVE USER
  // =====================================================

  const saveUser = (storageKey, userData) => {
    let users = [];

    const existingData =
      localStorage.getItem(storageKey);

    if (existingData) {
      try {
        const parsed =
          JSON.parse(existingData);

        if (Array.isArray(parsed)) {
          users = parsed;
        } else if (
          parsed &&
          typeof parsed === "object"
        ) {
          users = [parsed];
        }
      } catch (error) {
        console.log(
          "Unable to read existing users:",
          error
        );
      }
    }

    const email =
      userData.email.toLowerCase();

    const existingIndex =
      users.findIndex(
        (user) =>
          user.email &&
          user.email.toLowerCase() ===
            email
      );

    if (existingIndex !== -1) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(users)
    );
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // BACKEND ENDPOINT
      // =================================================

      const endpoint =
        role === "farmer"
          ? "http://127.0.0.1:8000/auth/farmer/register"
          : "http://127.0.0.1:8000/auth/buyer/register";

      // =================================================
      // REQUEST DATA
      // =================================================

      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),

        crop:
          role === "farmer"
            ? formData.crop.trim()
            : null,

        password: formData.password,
        role: role,
      };

      // =================================================
      // SEND TO BACKEND
      // =================================================

      const response =
        await fetch(endpoint, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            requestData
          ),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Registration failed."
        );
      }

      // =================================================
      // USER DATA
      // =================================================

      const userData = {
        name: formData.name.trim(),

        email: formData.email.trim(),

        phone: formData.phone.trim(),

        location:
          formData.location.trim(),

        crop:
          role === "farmer"
            ? formData.crop.trim()
            : null,

        role: role,
      };

      // =================================================
      // SAVE FARMER
      // =================================================

      if (role === "farmer") {
        saveUser(
          "agritrust_farmers",
          userData
        );

        localStorage.setItem(
          "agritrust_farmer",
          JSON.stringify(userData)
        );
      }

      // =================================================
      // SAVE BUYER
      // =================================================

      if (role === "buyer") {
        saveUser(
          "agritrust_buyers",
          userData
        );

        localStorage.setItem(
          "agritrust_buyer",
          JSON.stringify(userData)
        );
      }

      // =================================================
      // COMPATIBILITY KEY
      // =================================================

      localStorage.setItem(
        "agritrust_registered_user",
        JSON.stringify(userData)
      );

      localStorage.removeItem(
        "agritrust_user"
      );

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        `${
          role === "farmer"
            ? "Farmer"
            : "Buyer"
        } account created successfully!`
      );

      // =================================================
      // CLEAR FORM
      // =================================================

      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        crop: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SWITCH ROLE
  // =====================================================

  const switchRole = (newRole) => {
    setRole(newRole);

    setMessage("");
    setError("");

    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      crop: "",
      password: "",
      confirmPassword: "",
    });
  };

  // =====================================================
  // INPUT STYLE
  // =====================================================

  const inputStyle = {
    width: "100%",
    padding: "14px 15px",
    borderRadius: "12px",
    border: "1px solid #d8e2dc",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    background: "#fbfdfb",
    color: "#263238",
  };

  // =====================================================
  // LABEL STYLE
  // =====================================================

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#37474f",
    marginBottom: "7px",
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #eaf6ec 0%, #f7fbf8 48%, #eef8f0 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 18px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          background: "#ffffff",
          borderRadius: "26px",
          padding: "42px",
          boxSizing: "border-box",
          boxShadow:
            "0 20px 55px rgba(46,125,50,0.14)",
          border:
            "1px solid rgba(46,125,50,0.08)",
        }}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >

          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 12px",
              borderRadius: "22px",
              background:
                "linear-gradient(135deg,#2e7d32,#66bb6a)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "36px",
              boxShadow:
                "0 10px 25px rgba(46,125,50,0.22)",
            }}
          >
            🌱
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "800",
              color: "#1b5e20",
            }}
          >
            AgriTrust
          </h1>

          <p
            style={{
              margin:
                "7px 0 0",
              color: "#78909c",
              fontSize: "14px",
            }}
          >
            Smart Agriculture Marketplace
          </p>

        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >

          <h2
            style={{
              margin: 0,
              color: "#263238",
              fontSize: "27px",
            }}
          >
            Create Your Account
          </h2>

          <p
            style={{
              margin:
                "9px 0 0",
              color: "#78909c",
              fontSize: "15px",
            }}
          >
            Join AgriTrust and connect
            directly with the agricultural
            marketplace.
          </p>

        </div>

        {/* =================================================
            ROLE SELECTION
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",
            gap: "15px",
            marginBottom: "26px",
          }}
        >

          {/* FARMER */}

          <button
            type="button"
            onClick={() =>
              switchRole("farmer")
            }
            style={{
              padding: "17px",
              borderRadius: "15px",
              border:
                role === "farmer"
                  ? "2px solid #2e7d32"
                  : "1px solid #dce5df",
              background:
                role === "farmer"
                  ? "#edf8ef"
                  : "#ffffff",
              cursor: "pointer",
              color:
                role === "farmer"
                  ? "#1b5e20"
                  : "#607d8b",
              transition:
                "0.2s",
            }}
          >

            <div
              style={{
                fontSize: "22px",
                marginBottom: "5px",
              }}
            >
              🌾
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: "800",
              }}
            >
              Farmer
            </div>

            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Sell your crops
            </div>

          </button>

          {/* BUYER */}

          <button
            type="button"
            onClick={() =>
              switchRole("buyer")
            }
            style={{
              padding: "17px",
              borderRadius: "15px",
              border:
                role === "buyer"
                  ? "2px solid #2e7d32"
                  : "1px solid #dce5df",
              background:
                role === "buyer"
                  ? "#edf8ef"
                  : "#ffffff",
              cursor: "pointer",
              color:
                role === "buyer"
                  ? "#1b5e20"
                  : "#607d8b",
            }}
          >

            <div
              style={{
                fontSize: "22px",
                marginBottom: "5px",
              }}
            >
              🛒
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: "800",
              }}
            >
              Buyer
            </div>

            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Buy fresh crops
            </div>

          </button>

        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <div
            style={{
              padding: "14px 16px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#e8f5e9",
              border:
                "1px solid #a5d6a7",
              color: "#1b5e20",
              fontWeight: "600",
            }}
          >
            ✓ {message}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            style={{
              padding: "14px 16px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#ffebee",
              border:
                "1px solid #ef9a9a",
              color: "#c62828",
              fontWeight: "600",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div
            style={{
              marginBottom: "19px",
            }}
          >

            <label style={labelStyle}>
              {role === "farmer"
                ? "Farmer Name"
                : "Buyer / Business Name"}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                role === "farmer"
                  ? "Enter your full name"
                  : "Enter your name or business name"
              }
              required
              style={inputStyle}
            />

          </div>

          {/* EMAIL + PHONE */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,minmax(0,1fr))",
              gap: "18px",
            }}
          >

            <div
              style={{
                marginBottom: "19px",
              }}
            >

              <label style={labelStyle}>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={inputStyle}
              />

            </div>

            <div
              style={{
                marginBottom: "19px",
              }}
            >

              <label style={labelStyle}>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                style={inputStyle}
              />

            </div>

          </div>

          {/* LOCATION */}

          <div
            style={{
              marginBottom: "19px",
            }}
          >

            <label style={labelStyle}>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Village / City"
              required
              style={inputStyle}
            />

          </div>

          {/* PRIMARY CROP */}

          {role === "farmer" && (
            <div
              style={{
                marginBottom: "19px",
              }}
            >

              <label style={labelStyle}>
                Primary Crop
              </label>

              <input
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                placeholder="Example: Tomato"
                required
                style={inputStyle}
              />

            </div>
          )}

          {/* PASSWORD + CONFIRM */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,minmax(0,1fr))",
              gap: "18px",
            }}
          >

            <div
              style={{
                marginBottom: "19px",
              }}
            >

              <label style={labelStyle}>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                minLength="6"
                style={inputStyle}
              />

            </div>

            <div
              style={{
                marginBottom: "19px",
              }}
            >

              <label style={labelStyle}>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm password"
                required
                minLength="6"
                style={inputStyle}
              />

            </div>

          </div>

          {/* =================================================
              TERMS
          ================================================= */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              margin:
                "5px 0 23px",
              color: "#607d8b",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >

            <input
              type="checkbox"
              required
              style={{
                width: "17px",
                height: "17px",
                accentColor: "#2e7d32",
              }}
            />

            <span>
              I agree to the AgriTrust
              terms and conditions.
            </span>

          </label>

          {/* =================================================
              CREATE ACCOUNT
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "13px",
              background:
                loading
                  ? "#9e9e9e"
                  : "linear-gradient(135deg,#2e7d32,#43a047)",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "800",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
              boxShadow:
                "0 8px 20px rgba(46,125,50,0.22)",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account →"}
          </button>

        </form>

        {/* =================================================
            LOGIN
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            paddingTop: "22px",
            borderTop:
              "1px solid #edf1ee",
            color: "#78909c",
            fontSize: "14px",
          }}
        >

          Already have an account?{" "}

          <span
            onClick={() => {
              window.location.href =
                "/login";
            }}
            style={{
              color: "#2e7d32",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Login
          </span>

        </div>

      </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;