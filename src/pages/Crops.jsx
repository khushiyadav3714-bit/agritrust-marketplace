import React, { useState } from "react";

function Crops() {
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [lastSprayDays, setLastSprayDays] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    setImage(selectedImage || null);
    setResult(null);
    setError("");
  };

  // =====================================================
  // ANALYSE TOMATO + CREATE LISTING
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    // ---------------------------------------------------
    // CHECK IMAGE
    // ---------------------------------------------------

    if (!image) {
      setError("Please upload a tomato image.");
      return;
    }

    // ---------------------------------------------------
    // CHECK QUANTITY
    // ---------------------------------------------------

    if (quantity === "") {
      setError(
        "Please enter the quantity of tomatoes to sell."
      );
      return;
    }

    if (Number(quantity) <= 0) {
      setError(
        "Quantity must be greater than 0 kg."
      );
      return;
    }

    // ---------------------------------------------------
    // CHECK SPRAY DAYS
    // ---------------------------------------------------

    if (lastSprayDays === "") {
      setError(
        "Please enter the number of days since the last spray."
      );
      return;
    }

    if (Number(lastSprayDays) < 0) {
      setError(
        "Days since last spray cannot be negative."
      );
      return;
    }

    // =================================================
    // GET LOGGED-IN FARMER
    // =================================================

    const savedUser =
      localStorage.getItem("agritrust_user");

    if (!savedUser) {
      setError(
        "Please login as a farmer first."
      );
      return;
    }

    let farmer;

    try {
      farmer = JSON.parse(savedUser);
    } catch (error) {
      setError(
        "Unable to read farmer information."
      );
      return;
    }

    if (farmer.role !== "farmer") {
      setError(
        "Please login as a farmer."
      );
      return;
    }

    // ---------------------------------------------------
    // CHECK FARMER LOCATION
    // ---------------------------------------------------

    if (!farmer.location) {
      setError(
        "Farmer location is missing. Please register the farmer with a location."
      );
      return;
    }

    setLoading(true);

    try {

      // =================================================
      // STEP 1
      // AI TOMATO ANALYSIS
      // =================================================

      const aiFormData =
        new FormData();

      aiFormData.append(
        "file",
        image
      );

      aiFormData.append(
        "last_spray_days",
        lastSprayDays
      );

      const aiResponse =
        await fetch(
          "http://127.0.0.1:8000/ai/predict",
          {
            method: "POST",
            body: aiFormData,
          }
        );

      const aiData =
        await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(
          aiData.detail ||
          aiData.message ||
          "Tomato AI analysis failed."
        );
      }

      // =================================================
      // STEP 2
      // CREATE TOMATO LISTING
      // =================================================

      const listingFormData =
        new FormData();

      listingFormData.append(
        "farmer_name",
        farmer.name || "Farmer"
      );

      listingFormData.append(
        "farmer_email",
        farmer.email || ""
      );

      listingFormData.append(
        "quantity",
        quantity
      );

      listingFormData.append(
        "unit",
        "kg"
      );

      listingFormData.append(
        "days_since_spray",
        lastSprayDays
      );

      listingFormData.append(
        "location",
        farmer.location
      );

      // ONE IMAGE ONLY
      listingFormData.append(
        "image1",
        image
      );

      const listingResponse =
        await fetch(
          "http://127.0.0.1:8000/vegetable/tomato",
          {
            method: "POST",
            body: listingFormData,
          }
        );

      const listingData =
        await listingResponse.json();

      if (!listingResponse.ok) {
        throw new Error(
          listingData.detail ||
          listingData.message ||
          "Unable to create tomato listing."
        );
      }

      if (!listingData.success) {
        throw new Error(
          listingData.message ||
          "Unable to create tomato listing."
        );
      }

      // =================================================
      // SAVE REAL MONGODB LISTING ID
      // =================================================

      if (listingData.listing_id) {
        localStorage.setItem(
          "tomatoListingId",
          listingData.listing_id
        );
      }

      // =================================================
      // COMBINE AI + LISTING RESULT
      // =================================================

      setResult({
        ...aiData,

        quantity:
          Number(quantity),

        market_price:
          listingData.market_price,

        recommended_price:
          listingData.recommended_price,

        pesticide_risk:
          listingData.pesticide_risk,

        quality_badge:
          listingData.quality_badge,

        listing_id:
          listingData.listing_id,

        listing_created:
          true,
      });

    } catch (err) {

      console.error(
        "Tomato listing error:",
        err
      );

      setError(
        err.message ||
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // IMAGE PREVIEW
  // =====================================================

  const imagePreview =
    image
      ? URL.createObjectURL(image)
      : null;

  // =====================================================
  // ESTIMATED CROP VALUE
  // =====================================================

  const cropValue =
    result &&
    result.recommended_price !== null &&
    result.recommended_price !== undefined
      ? (
          result.quantity *
          Number(
            result.recommended_price
          )
        ).toFixed(2)
      : null;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="crops-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="crops-header">

        <h1>
          🍅 AI Tomato Analysis
        </h1>

        <p>
          Upload your tomato image and provide
          the crop details to get an AI-based
          quality and fair-price recommendation.
        </p>

      </div>


      {/* =================================================
          TOMATO INPUT CARD
      ================================================= */}

      <div className="crop-card">

        <h2>
          🍅 Tomato Details
        </h2>

        <form onSubmit={handleSubmit}>

          {/* CROP */}

          <div className="form-group">

            <label>
              Crop
            </label>

            <input
              type="text"
              value="Tomato"
              readOnly
            />

          </div>


          {/* QUANTITY */}

          <div className="form-group">

            <label>
              Quantity to Sell (kg)
            </label>

            <input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Enter quantity in kg"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* SPRAY DAYS */}

          <div className="form-group">

            <label>
              Days Since Last Spray
            </label>

            <input
              type="number"
              min="0"
              placeholder="Enter number of days"
              value={lastSprayDays}
              onChange={(e) =>
                setLastSprayDays(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* IMAGE */}

          <div className="form-group">

            <label>
              Upload One Tomato Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

          </div>


          {/* IMAGE PREVIEW */}

          {imagePreview && (

            <div className="image-preview">

              <img
                src={imagePreview}
                alt="Tomato preview"
              />

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="error-message">

              ⚠️ {error}

            </div>

          )}


          {/* ANALYSE BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "🤖 Analysing & Creating Listing..."
              : "🔍 Analyse Tomato & Create Listing"
            }

          </button>

        </form>

      </div>


      {/* =================================================
          AI RESULT
      ================================================= */}

      {result && (

        <div className="ai-result">

          <h2>
            🤖 AI Tomato Analysis
          </h2>


          {/* =================================================
              LISTING SUCCESS
          ================================================= */}

          {result.listing_created && (

            <div
              style={{
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "8px",
                background: "#e8f5e9",
              }}
            >

              <strong>
                ✅ Tomato listing created successfully!
              </strong>

              <p>
                Your crop is now available for
                buyer bidding.
              </p>

              <p>
                <strong>
                  Listing ID:
                </strong>{" "}
                {result.listing_id}
              </p>

            </div>

          )}


          {/* =================================================
              RESULT GRID
          ================================================= */}

          <div className="result-grid">

            {/* QUANTITY */}

            <div className="result-item">

              <span>
                Quantity to Sell
              </span>

              <strong>
                {result.quantity} kg
              </strong>

            </div>


            {/* CONDITION */}

            <div className="result-item">

              <span>
                🍅 Tomato Condition
              </span>

              <strong>
                {result.prediction ||
                  "Not Available"}
              </strong>

            </div>


            {/* FRESHNESS */}

            <div className="result-item">

              <span>
                🌱 AI Freshness Score
              </span>

              <strong>

                {result.freshness_score !==
                undefined
                  ? `${Number(
                      result.freshness_score
                    ).toFixed(2)}%`
                  : "Not Available"}

              </strong>

            </div>


            {/* QUALITY */}

            <div className="result-item">

              <span>
                🏷️ Quality Grade
              </span>

              <strong>
                {result.quality_grade ||
                  "Not Available"}
              </strong>

            </div>


            {/* PESTICIDE */}

            <div className="result-item">

              <span>
                🧪 Estimated Pesticide Risk
              </span>

              <strong>

                {result.pesticide_risk ||
                  result.estimated_pesticide_risk ||
                  "Not Available"}

              </strong>

            </div>


            {/* SPRAY DAYS */}

            <div className="result-item">

              <span>
                📅 Days Since Last Spray
              </span>

              <strong>

                {result.estimated_days_since_last_spray ??
                  lastSprayDays}{" "}
                days

              </strong>

            </div>


            {/* CONFIDENCE */}

            <div className="result-item">

              <span>
                🤖 AI Confidence
              </span>

              <strong>

                {result.confidence !==
                undefined
                  ? `${Number(
                      result.confidence
                    ).toFixed(2)}%`
                  : "Not Available"}

              </strong>

            </div>

          </div>


          {/* =================================================
              AI RECOMMENDATION
          ================================================= */}

          {result.recommended_action && (

            <div className="recommended-action">

              <h3>
                📋 AI Recommendation
              </h3>

              <p>
                {result.recommended_action}
              </p>

            </div>

          )}


          {/* =================================================
              MARKET PRICE
          ================================================= */}

          {result.market_price !==
            null &&
            result.market_price !==
            undefined && (

            <div className="price-section">

              <h3>
                📊 Current Market Reference Price
              </h3>

              <p className="price-value">

                ₹
                {Number(
                  result.market_price
                ).toFixed(2)}
                /kg

              </p>

              <p className="market-source">

                {result.market_source ||
                  result.source ||
                  "AGMARKNET - Bengaluru APMC"}

              </p>

            </div>

          )}


          {/* =================================================
              AI RECOMMENDED PRICE
          ================================================= */}

          {result.recommended_price !==
            null &&
            result.recommended_price !==
            undefined && (

            <div className="recommended-price">

              <h3>
                🤖 AI-Assisted Recommended Starting Price
              </h3>

              <p className="price-value">

                ₹
                {Number(
                  result.recommended_price
                ).toFixed(2)}
                /kg

              </p>

              <p>
                This is an AI-suggested starting
                price based on the current market
                reference price.
              </p>

            </div>

          )}


          {/* =================================================
              PRICE REASON
          ================================================= */}

          {result.recommendation_reason && (

            <div className="market-info">

              <h3>
                💡 Why is this price recommended?
              </h3>

              <p>
                {result.recommendation_reason}
              </p>

            </div>

          )}


          {/* =================================================
              ESTIMATED CROP VALUE
          ================================================= */}

          {cropValue !== null && (

            <div className="crop-value-section">

              <h3>
                💰 Estimated Value of Your Tomato Crop
              </h3>

              <p className="crop-value">

                ₹{cropValue}

              </p>

              <p>

                Based on {result.quantity} kg × ₹
                {Number(
                  result.recommended_price
                ).toFixed(2)}/kg

              </p>

            </div>

          )}


          {/* =================================================
              TRANSPARENT PRICING
          ================================================= */}

          <div className="market-source-section">

            <h3>
              🤝 Transparent Pricing
            </h3>

            <p>
              The market reference price is
              shown separately from the AI-assisted
              recommended starting price.
            </p>

            <p>
              The AI does not reduce the market
              reference price because of freshness
              score or pesticide risk.
            </p>

          </div>


          {/* =================================================
              PESTICIDE INFORMATION
          ================================================= */}

          <div className="market-source-section">

            <h3>
              🧪 Pesticide Risk Information
            </h3>

            <p>
              Pesticide risk is an estimated
              assessment based on the spray
              information provided by the farmer.
            </p>

            <p>
              It is not a laboratory measurement
              of pesticide residue.
            </p>

          </div>


          {/* =================================================
              BUYER BIDDING
          ================================================= */}

          <div className="recommended-action">

            <h3>
              🤝 Transparent Buyer Bidding
            </h3>

            <p>
              Farmers can compare buyer bids with
              the market reference price and AI
              recommended selling price before
              accepting an offer.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/buyer-bids";
              }}
            >
              View Buyer Bids
            </button>

          </div>


          {/* =================================================
              ANALYSE ANOTHER TOMATO
          ================================================= */}

          <button
            type="button"
            onClick={() => {

              setImage(null);
              setQuantity("");
              setLastSprayDays("");
              setResult(null);
              setError("");

            }}
          >
            🔄 Analyse Another Tomato
          </button>

        </div>

      )}

    </div>
  );
}

export default Crops;