import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import FarmerLeaderboard from "../components/FarmerLeaderboard";
import Footer from "../components/Footer";

function AvailableCrops() {
  const { language, toggleLanguage, t } = useLanguage();
  const [farmer, setFarmer] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liveMarketPrice, setLiveMarketPrice] = useState(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState("");

  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [skipLoading, setSkipLoading] = useState(false);

  const BACKEND_URL = "http://127.0.0.1:8000";

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    const cleanPath = String(imagePath)
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    return `${BACKEND_URL}/${cleanPath}`;
  };

  // =====================================================
  // FETCH LIVE MARKET PRICE
  // =====================================================

  const loadLiveMarketPrice = async () => {
    setMarketLoading(true);
    setMarketError("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/market/market-price`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to fetch live market price."
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message ||
            "Live market price is unavailable."
        );
      }

      const marketPrice =
        data.market_price ??
        data.price ??
        data.current_price;

      if (
        marketPrice === undefined ||
        marketPrice === null ||
        Number.isNaN(Number(marketPrice))
      ) {
        throw new Error(
          "Live market price was not returned by the API."
        );
      }

      setLiveMarketPrice(Number(marketPrice));

    } catch (err) {
      console.error(
        "Market price error:",
        err
      );

      setMarketError(
        err.message ||
          "Unable to fetch live market price."
      );

    } finally {
      setMarketLoading(false);
    }
  };

  // =====================================================
  // AI TOMATO ANALYSIS
  // =====================================================

  const analyzeTomato = async (tomatoListing) => {

    if (
      !tomatoListing ||
      !Array.isArray(tomatoListing.images) ||
      tomatoListing.images.length === 0
    ) {
      setAiError(
        "No tomato image available for AI analysis."
      );
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {

      const imagePath =
        tomatoListing.images[0];

      const imageUrl =
        getImageUrl(imagePath);

      const imageResponse =
        await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          "Unable to load tomato image."
        );
      }

      const imageBlob =
        await imageResponse.blob();

      const formData =
        new FormData();

      formData.append(
        "file",
        imageBlob,
        "tomato.jpg"
      );

      formData.append(
        "last_spray_days",
        String(
          tomatoListing.days_since_spray || 0
        )
      );

      const response =
        await fetch(
          `${BACKEND_URL}/ai/predict`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "AI analysis failed."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "AI analysis failed."
        );
      }

      setAiResult(data);

    } catch (err) {

      console.error(
        "AI analysis error:",
        err
      );

      setAiError(
        err.message ||
          "Unable to perform AI tomato analysis."
      );

    } finally {
      setAiLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);
      setError("");

      // ---------------------------------------------------
      // BUYER
      // ---------------------------------------------------

      const savedUser =
        localStorage.getItem(
          "agritrust_user"
        );

      let currentBuyer = null;

      if (savedUser) {

        try {

          const user =
            JSON.parse(savedUser);

          if (
            user.role === "buyer"
          ) {
            currentBuyer = user;
            setBuyer(user);
          }

        } catch (err) {

          console.log(
            "Unable to read buyer login:",
            err
          );

        }
      }

      if (!currentBuyer) {
        setLoading(false);
        return;
      }

      // ---------------------------------------------------
      // FARMER
      // ---------------------------------------------------

      const savedFarmer =
        localStorage.getItem(
          "agritrust_farmer"
        );

      let currentFarmer = null;

      if (savedFarmer) {

        try {

          const farmerData =
            JSON.parse(savedFarmer);

          if (
            farmerData.role === "farmer"
          ) {
            currentFarmer =
              farmerData;

            setFarmer(
              farmerData
            );
          }

        } catch (err) {

          console.log(
            "Unable to read farmer information:",
            err
          );

        }
      }

      // ---------------------------------------------------
      // TOMATO LISTING
      // ---------------------------------------------------

      try {

        const response =
          await fetch(
            `${BACKEND_URL}/vegetable/tomatoes`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.message ||
              "Unable to fetch tomato listings."
          );
        }

        if (!data.success) {
          throw new Error(
            data.message ||
              "Unable to fetch tomato listings."
          );
        }

        const tomatoes =
          Array.isArray(
            data.tomatoes
          )
            ? data.tomatoes
            : [];

        let selectedListing =
          null;

        // -------------------------------------------------
        // FIND FARMER LISTING
        // -------------------------------------------------

        if (currentFarmer) {

          const farmerEmail =
            currentFarmer.email
              ?.trim()
              ?.toLowerCase();

          selectedListing =
            tomatoes.find(
              (tomato) =>
                tomato.farmer_email
                  ?.trim()
                  ?.toLowerCase() ===
                farmerEmail
            );
        }

        // -------------------------------------------------
        // FALLBACK
        // -------------------------------------------------

        if (
          !selectedListing &&
          tomatoes.length > 0
        ) {
          selectedListing =
            tomatoes[0];
        }

        if (selectedListing) {

          setListing(
            selectedListing
          );

          localStorage.setItem(
            "tomatoListingId",
            selectedListing._id
          );

          // Start AI analysis
          analyzeTomato(
            selectedListing
          );
        }

      } catch (err) {

        console.error(
          "Tomato listing error:",
          err
        );

        setError(
          err.message ||
            "Unable to load farmer crop listings."
        );

      } finally {

        setLoading(false);

      }
    };

    loadData();

    // Fetch live market price
    loadLiveMarketPrice();

    // Refresh every 5 minutes
    const interval =
      setInterval(
        loadLiveMarketPrice,
        5 * 60 * 1000
      );

    return () =>
      clearInterval(interval);

  }, []);

  // =====================================================
  // AI INFORMATION
  // =====================================================

  const prediction =
    aiResult?.prediction ||
    listing?.prediction ||
    listing?.condition ||
    listing?.ai_prediction ||
    null;

  const freshnessScore =
    aiResult?.freshness_score !==
      undefined &&
    aiResult?.freshness_score !==
      null
      ? Number(
          aiResult.freshness_score
        )
      : listing?.freshness_score !==
          null &&
        listing?.freshness_score !==
          undefined
      ? Number(
          listing.freshness_score
        )
      : null;

  const qualityGrade =
    aiResult?.quality_grade ||
    listing?.quality_grade ||
    listing?.quality_badge ||
    null;

  const aiConfidence =
    aiResult?.confidence !==
      undefined &&
    aiResult?.confidence !==
      null
      ? Number(
          aiResult.confidence
        )
      : null;

  // =====================================================
  // PESTICIDE RISK
  // =====================================================

  const pesticideRisk =
    String(
      listing?.pesticide_risk ||
        ""
    ).trim();

  const pesticideRiskText =
    pesticideRisk.toLowerCase();

  const isHighPesticideRisk =
    pesticideRiskText === "high" ||
    pesticideRiskText.includes(
      "high risk"
    );

  const isMediumPesticideRisk =
    pesticideRiskText ===
      "medium" ||
    pesticideRiskText.includes(
      "medium risk"
    );

  const isLowPesticideRisk =
    pesticideRiskText ===
      "low" ||
    pesticideRiskText.includes(
      "low risk"
    );

  // =====================================================
  // ROTTEN DETECTION
  // =====================================================

  const predictionText =
    String(
      prediction || ""
    ).toLowerCase();

  const qualityText =
    String(
      qualityGrade || ""
    ).toLowerCase();

  const isRotten =
    predictionText.includes(
      "rotten"
    ) ||
    predictionText.includes(
      "spoiled"
    ) ||
    predictionText.includes(
      "bad"
    ) ||
    predictionText.includes(
      "diseased"
    ) ||
    predictionText.includes(
      "damaged"
    ) ||
    predictionText.includes(
      "not suitable"
    ) ||
    qualityText.includes(
      "rotten"
    ) ||
    qualityText.includes(
      "poor"
    ) ||
    qualityText.includes(
      "not suitable"
    );

  const requiresBuyerDecision =
    isRotten ||
    isHighPesticideRisk;

  // =====================================================
  // SKIP CROP
  // =====================================================

  const skipCrop = async () => {

    if (!buyer || !listing) {
      alert(
        "Buyer or crop information is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to skip this crop?"
      );

    if (!confirmed) {
      return;
    }

    setSkipLoading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "buyer_name",
        buyer.name || "Buyer"
      );

      formData.append(
        "buyer_email",
        buyer.email || ""
      );

      let reason =
        "Buyer inspected this crop and decided not to place a bid.";

      if (
        isRotten &&
        isHighPesticideRisk
      ) {

        reason =
          "Buyer skipped this crop because the AI detected a possible quality problem and the crop has high pesticide risk.";

      } else if (isRotten) {

        reason =
          "Buyer skipped this crop because the tomato was detected as rotten, spoiled, damaged or unsuitable by the AI analysis.";

      } else if (
        isHighPesticideRisk
      ) {

        reason =
          "Buyer skipped this crop because it was classified as having high pesticide risk based on the days since pesticide spray.";

      }

      formData.append(
        "reason",
        reason
      );

      const response =
        await fetch(
          `${BACKEND_URL}/bid/skip/${listing._id}`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to skip this crop."
        );
      }

      alert(
        "Crop skipped successfully. The farmer can see your feedback."
      );

      window.location.href =
        "/buyer-dashboard";

    } catch (err) {

      console.error(
        "Skip crop error:",
        err
      );

      alert(
        err.message ||
          "Unable to skip this crop."
      );

    } finally {

      setSkipLoading(false);

    }
  };

  // =====================================================
  // BUYER LOGIN SCREEN
  // =====================================================

  if (
    !buyer &&
    !loading
  ) {

    return (
      <div style={styles.page}>

        <div style={styles.loginCard}>

          <div style={styles.bigIcon}>
            🛒
          </div>

          <h1>
            Buyer Access
          </h1>

          <p>
            Please login as a buyer to
            access available crops.
          </p>

          <button
            style={
              styles.primaryButton
            }
            onClick={() => {
              window.location.href =
                "/login";
            }}
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {

    return (
      <div style={styles.page}>

        <div
          style={
            styles.loadingCard
          }
        >

          <div
            style={
              styles.spinner
            }
          >
            🌾
          </div>

          <h2>
            Loading Marketplace
          </h2>

          <p>
            Finding available farmer
            crops...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO LISTING
  // =====================================================

  if (!listing) {

    return (
      <div style={styles.page}>

        <div style={styles.topBar}>

          <div>

            <div style={styles.brand}>
              🌱 AgriTrust
            </div>

            <div
              style={
                styles.subBrand
              }
            >
              Farmer Marketplace
            </div>

          </div>

          <button
            style={
              styles.outlineButton
            }
            onClick={() => {
              window.location.href =
                "/buyer-dashboard";
            }}
          >
            ← Dashboard
          </button>

        </div>

        <div
          style={
            styles.emptyCard
          }
        >

          <div
            style={
              styles.emptyIcon
            }
          >
            🌾
          </div>

          <h1>
            No Crops Available
          </h1>

          <p>
            There is currently no open
            tomato listing available
            for bidding.
          </p>

          <button
            style={
              styles.primaryButton
            }
            onClick={() => {
              window.location.href =
                "/buyer-dashboard";
            }}
          >
            Back to Dashboard
          </button>

          {error && (
            <p
              style={
                styles.errorText
              }
            >
              ⚠️ {error}
            </p>
          )}

        </div>

      </div>
    );
  }

  // =====================================================
  // IMAGES
  // =====================================================

  const images =
    Array.isArray(
      listing.images
    )
      ? listing.images
      : [];

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <div style={styles.topBar}>

        <div>

          <div style={styles.brand}>
            🌱 AgriTrust
          </div>

          <div
            style={
              styles.subBrand
            }
          >
            Transparent Farmer Marketplace
          </div>

        </div>

        <div
          style={
            styles.navActions
          }
        >

          <span
            style={
              styles.buyerBadge
            }
          >
            👤{" "}
            {buyer?.name ||
              "Buyer"}
          </span>

          <button
            onClick={toggleLanguage}
            type="button"
            style={{
              padding: "8px 14px",
              border: "1px solid #2e7d32",
              borderRadius: "10px",
              background: "#e8f5e9",
              color: "#2e7d32",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            🌐 {language === "en" ? "ಕನ್ನಡ" : "English"}
          </button>

          <button
            style={
              styles.outlineButton
            }
            onClick={() => {
              window.location.href =
                "/buyer-dashboard";
            }}
          >
            ← {t("nav_dashboard")}
          </button>

        </div>

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.hero}>

        <div>

          <div
            style={
              styles.eyebrow
            }
          >
            🌾 AVAILABLE CROP
          </div>

          <h1
            style={
              styles.heroTitle
            }
          >
            Fresh Farmer Tomatoes
          </h1>

          <p
            style={
              styles.heroText
            }
          >
            Review crop quality, market
            prices and AI insights before
            making your bid.
          </p>

        </div>

        <div
          style={
            styles.liveBadge
          }
        >
          <span
            style={
              styles.liveDot
            }
          >
            ●
          </span>

          Live Marketplace
        </div>

      </div>

      {/* =================================================
          LIVE MARKET PRICE
      ================================================= */}

      <div
        style={
          styles.marketStrip
        }
      >

        <div
          style={
            styles.marketLeft
          }
        >

          <div
            style={
              styles.marketIcon
            }
          >
            📈
          </div>

          <div>

            <div
              style={
                styles.marketLabel
              }
            >
              LIVE MARKET REFERENCE
            </div>

            <div
              style={
                styles.marketTitle
              }
            >
              Bengaluru APMC -
              Binny Mill (FF&V)
            </div>

          </div>

        </div>

        <div
          style={
            styles.marketPrice
          }
        >

          {marketLoading
            ? "Loading..."
            : liveMarketPrice !==
                null
            ? `₹${liveMarketPrice.toFixed(
                2
              )}/kg`
            : "Unavailable"}

        </div>

      </div>

      {marketError && (
        <div
          style={
            styles.smallError
          }
        >
          ⚠️ {marketError}
        </div>
      )}

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div
        style={
          styles.mainGrid
        }
      >

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div>

          {/* FARMER INFORMATION */}

          <div
            style={
              styles.card
            }
          >

            <div
              style={
                styles.cardHeader
              }
            >

              <div>

                <div
                  style={
                    styles.cardEyebrow
                  }
                >
                  SELLER
                </div>

                <h2
                  style={
                    styles.cardTitle
                  }
                >
                  👨‍🌾 Farmer Information
                </h2>

              </div>

              <div
                style={
                  styles.verifiedBadge
                }
              >
                ✓ Listed
              </div>

            </div>

            <div
              style={
                styles.infoGrid
              }
            >

              <div
                style={
                  styles.infoItem
                }
              >

                <span
                  style={
                    styles.infoLabel
                  }
                >
                  Name
                </span>

                <strong>
                  {listing.farmer_name ||
                    farmer?.name ||
                    "Not Available"}
                </strong>

              </div>

              <div
                style={
                  styles.infoItem
                }
              >

                <span
                  style={
                    styles.infoLabel
                  }
                >
                  Email
                </span>

                <strong>
                  {listing.farmer_email ||
                    farmer?.email ||
                    "Not Available"}
                </strong>

              </div>

              <div
                style={
                  styles.infoItem
                }
              >

                <span
                  style={
                    styles.infoLabel
                  }
                >
                  Phone
                </span>

                <strong>
                  {farmer?.phone ||
                    "Not Available"}
                </strong>

              </div>

              <div
                style={
                  styles.infoItem
                }
              >

                <span
                  style={
                    styles.infoLabel
                  }
                >
                  Location
                </span>

                <strong>
                  {listing.location ||
                    farmer?.location ||
                    "Not Available"}
                </strong>

              </div>

            </div>

          </div>

          {/* =================================================
              IMAGE GALLERY
          ================================================= */}

          <div
            style={
              styles.card
            }
          >

            <div
              style={
                styles.cardHeader
              }
            >

              <div>

                <div
                  style={
                    styles.cardEyebrow
                  }
                >
                  CROP GALLERY
                </div>

                <h2
                  style={
                    styles.cardTitle
                  }
                >
                  🍅 Tomato Images
                </h2>

              </div>

              <span
                style={
                  styles.imageCount
                }
              >
                {images.length} image
                {images.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            {images.length > 0 ? (

              <div
                style={
                  styles.imageGrid
                }
              >

                {images.map(
                  (
                    imagePath,
                    index
                  ) => {

                    const imageUrl =
                      getImageUrl(
                        imagePath
                      );

                    return (
                      <div
                        key={index}
                        style={
                          styles.imageCard
                        }
                      >

                        <img
                          src={
                            imageUrl
                          }
                          alt={`Tomato ${
                            index + 1
                          }`}
                          onClick={() => {
                            window.open(
                              imageUrl,
                              "_blank"
                            );
                          }}
                          style={
                            styles.cropImage
                          }
                        />

                        <div
                          style={
                            styles.imageOverlay
                          }
                        >
                          Tomato{" "}
                          {index + 1}
                        </div>

                      </div>
                    );

                  }
                )}

              </div>

            ) : (

              <div
                style={
                  styles.noImage
                }
              >
                📷 No tomato images
                available.
              </div>

            )}

            <p
              style={
                styles.imageHint
              }
            >
              Click an image to view it
              in full size.
            </p>

          </div>

          {/* =================================================
              CROP DETAILS
          ================================================= */}

          <div
            style={
              styles.card
            }
          >

            <div
              style={
                styles.cardEyebrow
              }
            >
              CROP DETAILS
            </div>

            <h2
              style={
                styles.cardTitle
              }
            >
              🍅 Crop Information
            </h2>

            <div
              style={
                styles.detailRows
              }
            >

              {/* CROP */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Crop
                </span>

                <strong>
                  {listing.vegetable_name ||
                    "Tomato"}
                </strong>

              </div>

              {/* QUANTITY */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Available Quantity
                </span>

                <strong>
                  {listing.quantity !==
                  undefined
                    ? `${listing.quantity} ${
                        listing.unit ||
                        "kg"
                      }`
                    : "Not Available"}
                </strong>

              </div>

              {/* MARKET */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Market
                </span>

                <strong>
                  Bengaluru APMC
                </strong>

              </div>

              {/* =================================================
                  LIVE MARKET PRICE
              ================================================= */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Live Market Price
                </span>

                <strong
                  style={
                    styles.priceText
                  }
                >
                  {liveMarketPrice !==
                  null
                    ? `₹${liveMarketPrice.toFixed(
                        2
                      )}/kg`
                    : "Not Available"}
                </strong>

              </div>

              {/* =================================================
                  AI STARTING PRICE
                  
                  IMPORTANT:
                  This now uses liveMarketPrice.
                  Therefore it will always match
                  the current live market reference.
              ================================================= */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  AI Starting Price
                </span>

                <strong
                  style={
                    styles.priceText
                  }
                >
                  {liveMarketPrice !==
                  null
                    ? `₹${liveMarketPrice.toFixed(
                        2
                      )}/kg`
                    : "Not Available"}
                </strong>

              </div>

              {/* PESTICIDE RISK */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Pesticide Risk
                </span>

                <strong
                  style={
                    isHighPesticideRisk
                      ? styles.highRiskText
                      : isMediumPesticideRisk
                      ? styles.mediumRiskText
                      : styles.lowRiskText
                  }
                >
                  {pesticideRisk ||
                    "Not Available"}
                </strong>

              </div>

              {/* DAYS SINCE SPRAY */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Days Since Spray
                </span>

                <strong>
                  {listing.days_since_spray !==
                    undefined &&
                  listing.days_since_spray !==
                    null
                    ? `${listing.days_since_spray} days`
                    : "Not Available"}
                </strong>

              </div>

              {/* SOURCE */}

              <div
                style={
                  styles.detailRow
                }
              >

                <span>
                  Source
                </span>

                <strong>
                  AGMARKNET
                </strong>

              </div>

            </div>

          </div>

          {/* =================================================
              AI ANALYSIS
          ================================================= */}

          <div
            style={{
              ...styles.card,
              ...(isRotten ||
              isHighPesticideRisk
                ? styles.warningCard
                : {}),
            }}
          >

            <div
              style={
                styles.cardHeader
              }
            >

              <div>

                <div
                  style={
                    styles.cardEyebrow
                  }
                >
                  SMART QUALITY CHECK
                </div>

                <h2
                  style={
                    styles.cardTitle
                  }
                >
                  🤖 AI Tomato Analysis
                </h2>

              </div>

              {aiResult &&
                !aiLoading && (

                  <span
                    style={
                      isRotten ||
                      isHighPesticideRisk
                        ? styles.dangerBadge
                        : styles.goodBadge
                    }
                  >
                    {isRotten
                      ? "⚠ Quality Alert"
                      : isHighPesticideRisk
                      ? "⚠ Pesticide Alert"
                      : "✓ Analyzed"}
                  </span>

              )}

            </div>

            <p
              style={
                styles.mutedText
              }
            >
              AI analysis provides
              decision-support information
              before bidding.
            </p>

            {/* AI LOADING */}

            {aiLoading && (

              <div
                style={
                  styles.aiLoading
                }
              >

                <div
                  style={
                    styles.aiIcon
                  }
                >
                  🤖
                </div>

                <h3>
                  AI Analysis in Progress
                </h3>

                <p>
                  Analyzing the uploaded
                  tomato image...
                </p>

              </div>

            )}

            {/* AI ERROR */}

            {aiError &&
              !aiLoading && (

                <div
                  style={
                    styles.errorBox
                  }
                >
                  ⚠️ {aiError}
                </div>

            )}

            {/* AI RESULT */}

            {aiResult &&
              !aiLoading && (

                <>

                  {isRotten && (

                    <div
                      style={
                        styles.rottenWarning
                      }
                    >

                      <div
                        style={
                          styles.warningIcon
                        }
                      >
                        ⚠️
                      </div>

                      <div>

                        <strong>
                          Possible Quality
                          Problem
                        </strong>

                        <p>
                          The AI analysis
                          indicates that this
                          tomato may be rotten,
                          damaged or unsuitable
                          for sale.
                        </p>

                      </div>

                    </div>

                  )}

                  {isHighPesticideRisk && (

                    <div
                      style={
                        styles.pesticideWarning
                      }
                    >

                      <div
                        style={
                          styles.warningIcon
                        }
                      >
                        🧪
                      </div>

                      <div>

                        <strong>
                          High Pesticide Risk
                        </strong>

                        <p>
                          This crop has been
                          classified as having
                          high pesticide risk
                          based on the number of
                          days since the last
                          pesticide spray.
                        </p>

                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: 700,
                          }}
                        >
                          Days since spray:{" "}
                          {listing.days_since_spray ??
                            "Not Available"}
                        </p>

                      </div>

                    </div>

                  )}

                  <div
                    style={
                      styles.aiGrid
                    }
                  >

                    <div
                      style={
                        styles.aiMetric
                      }
                    >
                      <span>
                        🍅 Condition
                      </span>

                      <strong>
                        {prediction ||
                          "Not Available"}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.aiMetric
                      }
                    >
                      <span>
                        🌱 Freshness
                      </span>

                      <strong>
                        {freshnessScore !==
                        null
                          ? `${freshnessScore.toFixed(
                              2
                            )}%`
                          : "Not Available"}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.aiMetric
                      }
                    >
                      <span>
                        🏷 Quality Grade
                      </span>

                      <strong>
                        {qualityGrade ||
                          "Not Available"}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.aiMetric
                      }
                    >
                      <span>
                        🤖 Confidence
                      </span>

                      <strong>
                        {aiConfidence !==
                        null
                          ? `${aiConfidence.toFixed(
                              2
                            )}%`
                          : "Not Available"}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.aiMetric
                      }
                    >
                      <span>
                        🧪 Pesticide Risk
                      </span>

                      <strong
                        style={
                          isHighPesticideRisk
                            ? styles.highRiskText
                            : isMediumPesticideRisk
                            ? styles.mediumRiskText
                            : styles.lowRiskText
                        }
                      >
                        {pesticideRisk ||
                          "Not Available"}
                      </strong>
                    </div>

                  </div>

                  <div
                    style={
                      isHighPesticideRisk
                        ? styles.highRiskComplete
                        : styles.analysisComplete
                    }
                  >
                    {isHighPesticideRisk
                      ? "⚠ AI Analysis Completed — High Pesticide Risk"
                      : "✓ AI Tomato Analysis Completed"}
                  </div>

                </>

            )}

            {!aiResult &&
              !aiLoading &&
              !aiError && (

                <div
                  style={
                    styles.noResult
                  }
                >
                  AI analysis is being
                  prepared.
                </div>

            )}

          </div>

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div>

          <div
            style={
              styles.stickyCard
            }
          >

            <div
              style={
                styles.bidHeader
              }
            >

              <div
                style={
                  styles.bidIcon
                }
              >
                💰
              </div>

              <div>

                <div
                  style={
                    styles.cardEyebrow
                  }
                >
                  MARKETPLACE
                </div>

                <h2
                  style={
                    styles.cardTitle
                  }
                >
                  Place Your Bid
                </h2>

              </div>

            </div>

            {/* BUYER */}

            <div
              style={
                styles.buyerBox
              }
            >

              <span
                style={
                  styles.infoLabel
                }
              >
                LOGGED IN BUYER
              </span>

              <strong>
                {buyer?.name ||
                  "Buyer"}
              </strong>

              <span>
                {buyer?.email}
              </span>

            </div>

            {/* CROP SUMMARY */}

            <div
              style={
                styles.bidCropSummary
              }
            >

              <div
                style={
                  styles.summaryRow
                }
              >

                <span>
                  Crop
                </span>

                <strong>
                  🍅{" "}
                  {listing.vegetable_name ||
                    "Tomato"}
                </strong>

              </div>

              <div
                style={
                  styles.summaryRow
                }
              >

                <span>
                  Quantity
                </span>

                <strong>
                  {listing.quantity}{" "}
                  {listing.unit ||
                    "kg"}
                </strong>

              </div>

              <div
                style={
                  styles.summaryRow
                }
              >

                <span>
                  Live Market
                </span>

                <strong>
                  {liveMarketPrice !==
                  null
                    ? `₹${liveMarketPrice.toFixed(
                        2
                      )}/kg`
                    : "Unavailable"}
                </strong>

              </div>

              <div
                style={
                  styles.summaryRow
                }
              >

                <span>
                  Pesticide Risk
                </span>

                <strong
                  style={
                    isHighPesticideRisk
                      ? styles.highRiskText
                      : isMediumPesticideRisk
                      ? styles.mediumRiskText
                      : styles.lowRiskText
                  }
                >
                  {pesticideRisk ||
                    "Not Available"}
                </strong>

              </div>

            </div>

            {/* LISTING ID */}

            <div
              style={
                styles.bidInfo
              }
            >

              <span>
                Listing ID
              </span>

              <small>
                {listing._id}
              </small>

            </div>

            {/* BUYER DECISION */}

            {requiresBuyerDecision ? (

              <div
                style={
                  styles.decisionBox
                }
              >

                <div
                  style={
                    styles.decisionTitle
                  }
                >
                  ⚠ Buyer Decision
                </div>

                {isRotten && (

                  <div
                    style={
                      styles.decisionWarning
                    }
                  >

                    <strong>
                      🍅 Quality Alert
                    </strong>

                    <p>
                      The AI detected a
                      possible quality problem
                      with this tomato.
                    </p>

                  </div>

                )}

                {isHighPesticideRisk && (

                  <div
                    style={
                      styles.decisionWarning
                    }
                  >

                    <strong>
                      🧪 High Pesticide Risk
                    </strong>

                    <p>
                      This crop has been
                      classified as high
                      pesticide risk.
                    </p>

                  </div>

                )}

                <p>
                  You can skip this crop or
                  continue if you still want
                  to buy it.
                </p>

                <button
                  type="button"
                  disabled={
                    skipLoading
                  }
                  onClick={
                    skipCrop
                  }
                  style={
                    styles.skipButton
                  }
                >
                  {skipLoading
                    ? "Skipping..."
                    : "✕ Skip This Crop"}
                </button>

                <button
                  type="button"
                  onClick={() => {

                    localStorage.setItem(
                      "tomatoListingId",
                      listing._id
                    );

                    window.location.href =
                      "/place-bid";

                  }}
                  style={
                    styles.bidButton
                  }
                >
                  💰 Bid Anyway
                </button>

              </div>

            ) : (

              <button
                type="button"
                onClick={() => {

                  localStorage.setItem(
                    "tomatoListingId",
                    listing._id
                  );

                  window.location.href =
                    "/place-bid";

                }}
                style={
                  styles.bidButton
                }
              >
                💵 Continue to Bidding
              </button>

            )}

            {/* TRUST */}

            <div
              style={
                styles.trustBox
              }
            >

              <div>
                🔒
              </div>

              <div>

                <strong>
                  Transparent Bidding
                </strong>

                <p>
                  Review market price,
                  crop information, pesticide
                  risk and AI quality insights
                  before placing your bid.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f4f8f4 0%, #eef5f0 45%, #f8faf8 100%)",
    padding: "25px",
    boxSizing: "border-box",
    color: "#183025",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  topBar: {
    maxWidth: "1180px",
    margin: "0 auto 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px 22px",
    background: "#ffffff",
    border: "1px solid #e3ebe5",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(35,70,45,0.08)",
  },

  brand: {
    fontSize: "25px",
    fontWeight: "800",
  },

  subBrand: {
    fontSize: "12px",
    color: "#718078",
    marginTop: "3px",
  },

  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  buyerBadge: {
    background: "#edf7ef",
    color: "#23733d",
    padding: "9px 13px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "700",
  },

  outlineButton: {
    background: "#ffffff",
    border: "1px solid #cfdad2",
    color: "#244b31",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },

  hero: {
    maxWidth: "1180px",
    margin: "0 auto 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    flexWrap: "wrap",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#398452",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  heroTitle: {
    margin: "0",
    fontSize: "38px",
    lineHeight: "1.1",
  },

  heroText: {
    color: "#68766e",
    maxWidth: "650px",
    lineHeight: "1.6",
    marginTop: "10px",
  },

  liveBadge: {
    background: "#ffffff",
    border: "1px solid #dce8df",
    padding: "11px 16px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "700",
  },

  liveDot: {
    color: "#31a052",
    marginRight: "7px",
  },

  marketStrip: {
    maxWidth: "1180px",
    margin: "0 auto 25px",
    background:
      "linear-gradient(135deg, #173e29, #276d42)",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  marketLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  marketIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  marketLabel: {
    fontSize: "10px",
    letterSpacing: "1.4px",
    opacity: 0.7,
    fontWeight: "800",
  },

  marketTitle: {
    marginTop: "4px",
    fontWeight: "700",
  },

  marketPrice: {
    fontSize: "28px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  smallError: {
    maxWidth: "1180px",
    margin: "-12px auto 18px",
    color: "#a33d3d",
    fontSize: "13px",
  },

  mainGrid: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.7fr) minmax(300px, 0.8fr)",
    gap: "24px",
    alignItems: "start",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e3ebe5",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow:
      "0 10px 28px rgba(35,70,45,0.06)",
  },

  stickyCard: {
    background: "#ffffff",
    border: "1px solid #dce8df",
    borderRadius: "22px",
    padding: "24px",
    boxShadow:
      "0 15px 35px rgba(35,70,45,0.1)",
    position: "sticky",
    top: "20px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px",
  },

  cardEyebrow: {
    color: "#6e7d74",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.4px",
    marginBottom: "5px",
  },

  cardTitle: {
    margin: "0",
    fontSize: "21px",
  },

  verifiedBadge: {
    background: "#edf8ef",
    color: "#2d7c43",
    padding: "7px 11px",
    borderRadius: "30px",
    fontSize: "11px",
    fontWeight: "800",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },

  infoItem: {
    background: "#f7faf7",
    border: "1px solid #edf2ee",
    borderRadius: "13px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  infoLabel: {
    fontSize: "10px",
    color: "#7a8780",
    fontWeight: "800",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "14px",
  },

  imageCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "16px",
    background: "#eef3ef",
    height: "190px",
    cursor: "pointer",
  },

  cropImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imageOverlay: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    background:
      "rgba(0,0,0,0.65)",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },

  imageCount: {
    color: "#697970",
    fontSize: "12px",
  },

  imageHint: {
    color: "#7b877f",
    fontSize: "12px",
  },

  noImage: {
    padding: "30px",
    background: "#f7faf7",
    borderRadius: "14px",
    textAlign: "center",
    color: "#718078",
  },

  detailRows: {
    marginTop: "15px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "14px 0",
    borderBottom:
      "1px solid #edf1ee",
  },

  priceText: {
    color: "#24743d",
  },

  highRiskText: {
    color: "#b42318",
    fontWeight: "900",
  },

  mediumRiskText: {
    color: "#b54708",
    fontWeight: "800",
  },

  lowRiskText: {
    color: "#24743d",
    fontWeight: "800",
  },

  mutedText: {
    color: "#728078",
    lineHeight: "1.6",
  },

  warningCard: {
    border:
      "1px solid #e9c9a5",
  },

  dangerBadge: {
    background: "#fff0e8",
    color: "#b65b24",
    padding: "7px 11px",
    borderRadius: "30px",
    fontSize: "11px",
    fontWeight: "800",
  },

  goodBadge: {
    background: "#edf8ef",
    color: "#2d7c43",
    padding: "7px 11px",
    borderRadius: "30px",
    fontSize: "11px",
    fontWeight: "800",
  },

  aiLoading: {
    textAlign: "center",
    padding: "30px",
    background: "#f7faf7",
    borderRadius: "16px",
  },

  aiIcon: {
    fontSize: "35px",
  },

  rottenWarning: {
    display: "flex",
    gap: "14px",
    padding: "16px",
    background: "#fff4eb",
    border:
      "1px solid #f0cfb0",
    borderRadius: "14px",
    marginBottom: "16px",
    color: "#824619",
  },

  pesticideWarning: {
    display: "flex",
    gap: "14px",
    padding: "16px",
    background: "#fff0ed",
    border:
      "1px solid #efc4bd",
    borderRadius: "14px",
    marginBottom: "16px",
    color: "#8f281d",
  },

  warningIcon: {
    fontSize: "25px",
  },

  aiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },

  aiMetric: {
    padding: "15px",
    background: "#f7faf7",
    border: "1px solid #edf2ee",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  analysisComplete: {
    marginTop: "15px",
    padding: "12px",
    background: "#edf8ef",
    color: "#2b7540",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "700",
    textAlign: "center",
  },

  highRiskComplete: {
    marginTop: "15px",
    padding: "12px",
    background: "#fff0ed",
    color: "#a52d20",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "800",
    textAlign: "center",
  },

  noResult: {
    padding: "15px",
    background: "#f7faf7",
    borderRadius: "12px",
    color: "#718078",
  },

  errorBox: {
    padding: "14px",
    background: "#fff1f1",
    border:
      "1px solid #f0cccc",
    borderRadius: "12px",
    color: "#a33d3d",
  },

  bidHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "20px",
  },

  bidIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#edf8ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  buyerBox: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "15px",
    background: "#f6f9f7",
    borderRadius: "14px",
    marginBottom: "15px",
  },

  bidCropSummary: {
    display: "grid",
    gap: "1px",
    background: "#e7eee9",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "15px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "13px 14px",
    background: "#f7faf7",
  },

  bidInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "12px 0",
    color: "#66756c",
    borderBottom:
      "1px solid #edf1ee",
  },

  decisionBox: {
    marginTop: "20px",
    padding: "18px",
    background: "#fffaf5",
    border:
      "1px solid #efd8c0",
    borderRadius: "16px",
  },

  decisionTitle: {
    fontWeight: "800",
    fontSize: "16px",
    marginBottom: "12px",
  },

  decisionWarning: {
    padding: "12px",
    marginBottom: "10px",
    background: "#fff4eb",
    border:
      "1px solid #f0cfb0",
    borderRadius: "11px",
    color: "#824619",
  },

  bidButton: {
    width: "100%",
    border: "none",
    background:
      "linear-gradient(135deg, #26753f, #3d9657)",
    color: "#ffffff",
    padding: "14px 18px",
    borderRadius: "13px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
    marginTop: "12px",
  },

  skipButton: {
    width: "100%",
    border:
      "1px solid #e1c9b3",
    background: "#ffffff",
    color: "#8c4b27",
    padding: "13px 18px",
    borderRadius: "13px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "14px",
    marginTop: "10px",
  },

  trustBox: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    padding: "15px",
    background: "#f6f9f7",
    borderRadius: "14px",
    color: "#66756c",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  primaryButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #26753f, #3d9657)",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
  },

  loginCard: {
    maxWidth: "450px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "40px",
    textAlign: "center",
  },

  bigIcon: {
    fontSize: "50px",
  },

  loadingCard: {
    maxWidth: "450px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "40px",
    textAlign: "center",
  },

  spinner: {
    fontSize: "45px",
  },

  emptyCard: {
    maxWidth: "650px",
    margin: "70px auto",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "45px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "55px",
  },

  errorText: {
    color: "#a33d3d",
    marginTop: "20px",
  },

  footer: {
    maxWidth: "1180px",
    margin: "35px auto 0",
    padding: "20px 5px",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    color: "#718078",
    fontSize: "12px",
    borderTop:
      "1px solid #dfe8e1",
  },
};

export default AvailableCrops;