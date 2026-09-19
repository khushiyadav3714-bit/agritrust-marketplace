import React, {
  useEffect,
  useState,
} from "react";

function MyCrops() {

  const [farmer, setFarmer] =
    useState(null);

  const [listing, setListing] =
    useState(null);

  const [skipFeedback, setSkipFeedback] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [feedbackLoading, setFeedbackLoading] =
    useState(false);

  const [removeLoading, setRemoveLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // AI STATES
  // =====================================================

  const [aiResult, setAiResult] =
    useState(null);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiError, setAiError] =
    useState("");


  // =====================================================
  // BACKEND URL
  // =====================================================

  const BACKEND_URL =
    "http://127.0.0.1:8000";


  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (
    imagePath
  ) => {

    if (!imagePath) {
      return "";
    }

    const cleanPath =
      String(imagePath)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    return `${BACKEND_URL}/${cleanPath}`;
  };


  // =====================================================
  // LOAD BUYER SKIP FEEDBACK
  // =====================================================

  const loadSkipFeedback = async (
    listingId
  ) => {

    if (!listingId) {

      console.log(
        "No listing ID available for feedback."
      );

      return;
    }

    setFeedbackLoading(true);

    try {

      console.log(
        "Loading buyer feedback for listing:",
        listingId
      );

      const response =
        await fetch(
          `${BACKEND_URL}/bid/skip-feedback/${listingId}`
        );

      const data =
        await response.json();

      console.log(
        "Buyer skip feedback response:",
        data
      );

      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          "Unable to load buyer feedback."
        );

      }

      if (
        data.success === false
      ) {

        throw new Error(
          data.message ||
          "Unable to load buyer feedback."
        );

      }

      setSkipFeedback(
        Array.isArray(data.feedback)
          ? data.feedback
          : []
      );

    } catch (err) {

      console.error(
        "Feedback loading error:",
        err
      );

      setSkipFeedback([]);

    } finally {

      setFeedbackLoading(false);

    }

  };


  // =====================================================
  // AI TOMATO ANALYSIS
  // =====================================================

  const analyzeTomato = async (
    tomatoListing
  ) => {

    if (
      !tomatoListing ||
      !Array.isArray(
        tomatoListing.images
      ) ||
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

      // =================================================
      // GET FIRST TOMATO IMAGE
      // =================================================

      const imagePath =
        tomatoListing.images[0];

      const imageUrl =
        getImageUrl(
          imagePath
        );

      console.log(
        "MyCrops AI image URL:",
        imageUrl
      );


      // =================================================
      // LOAD IMAGE
      // =================================================

      const imageResponse =
        await fetch(
          imageUrl
        );

      if (!imageResponse.ok) {

        throw new Error(
          "Unable to load tomato image."
        );

      }


      const imageBlob =
        await imageResponse.blob();


      // =================================================
      // FORM DATA
      // =================================================

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
          tomatoListing.days_since_spray ||
          tomatoListing.days_since_last_spray ||
          0
        )
      );


      // =================================================
      // CALL AI API
      // =================================================

      console.log(
        "Calling AI prediction API..."
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


      console.log(
        "MyCrops AI response:",
        data
      );


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


      // =================================================
      // SAVE AI RESULT
      // =================================================

      setAiResult(data);


    } catch (err) {

      console.error(
        "MyCrops AI analysis error:",
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
  // LOAD FARMER + LISTING
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);
      setError("");


      // =================================================
      // GET LOGGED-IN FARMER
      // =================================================

      const savedUser =
        localStorage.getItem(
          "agritrust_user"
        );


      let currentFarmer = null;


      if (savedUser) {

        try {

          const user =
            JSON.parse(
              savedUser
            );


          console.log(
            "Logged-in user:",
            user
          );


          if (
            user.role === "farmer"
          ) {

            currentFarmer =
              user;

            setFarmer(
              user
            );

          }

        } catch (err) {

          console.error(
            "Unable to read farmer login:",
            err
          );

        }

      }


      // =================================================
      // FARMER LOGIN CHECK
      // =================================================

      if (!currentFarmer) {

        setLoading(false);

        return;

      }


      // =================================================
      // GET TOMATO LISTINGS
      // =================================================

      try {

        const response =
          await fetch(
            `${BACKEND_URL}/vegetable/tomatoes`
          );


        const data =
          await response.json();


        console.log(
          "Tomato listings response:",
          data
        );


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


        // =================================================
        // FIND CURRENT FARMER LISTING
        // =================================================

        const farmerEmail =
          currentFarmer.email
            ?.trim()
            ?.toLowerCase();


        const farmerListing =
          tomatoes.find(
            (tomato) => {

              const tomatoEmail =
                tomato.farmer_email
                  ?.trim()
                  ?.toLowerCase();


              return (
                tomatoEmail ===
                farmerEmail
              );

            }
          );


        console.log(
          "Farmer listing found:",
          farmerListing
        );


        // =================================================
        // LISTING FOUND
        // =================================================

        if (farmerListing) {

          setListing(
            farmerListing
          );


          // Save listing ID
          localStorage.setItem(
            "tomatoListingId",
            farmerListing._id
          );


          console.log(
            "Farmer listing ID:",
            farmerListing._id
          );


          // =================================================
          // LOAD BUYER FEEDBACK
          // =================================================

          await loadSkipFeedback(
            farmerListing._id
          );


          // =================================================
          // RUN AI ANALYSIS
          // =================================================

          analyzeTomato(
            farmerListing
          );


        } else {

          console.log(
            "No listing found for farmer:",
            farmerEmail
          );


          setListing(null);

          setSkipFeedback([]);

        }


      } catch (err) {

        console.error(
          "Tomato listing error:",
          err
        );


        setError(
          err.message ||
          "Unable to load tomato listing."
        );

      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // =====================================================
  // AI VALUES
  // =====================================================

  const condition =
    aiResult?.prediction ||
    listing?.prediction ||
    "Pending AI Scan";


  const freshness =
    aiResult?.freshness_score !==
      undefined &&
    aiResult?.freshness_score !==
      null

      ? `${Number(
          aiResult.freshness_score
        ).toFixed(2)}%`

      : listing?.freshness_score !==
          undefined &&
        listing?.freshness_score !==
          null

      ? `${Number(
          listing.freshness_score
        ).toFixed(2)}%`

      : "Not available";


  const quality =
    aiResult?.quality_grade ||
    listing?.quality_grade ||
    listing?.quality_badge ||
    "Pending AI Scan";


  const confidence =
    aiResult?.confidence !==
      undefined &&
    aiResult?.confidence !==
      null

      ? `${Number(
          aiResult.confidence
        ).toFixed(2)}%`

      : listing?.confidence !==
          undefined &&
        listing?.confidence !==
          null

      ? `${Number(
          listing.confidence
        ).toFixed(2)}%`

      : "Not available";


  // =====================================================
  // ROTTEN DETECTION
  // =====================================================

  const conditionText =
    String(
      condition || ""
    ).toLowerCase();


  const qualityText =
    String(
      quality || ""
    ).toLowerCase();


  const isRotten =
    conditionText.includes(
      "rotten"
    ) ||
    conditionText.includes(
      "spoiled"
    ) ||
    conditionText.includes(
      "bad"
    ) ||
    conditionText.includes(
      "diseased"
    ) ||
    conditionText.includes(
      "damaged"
    ) ||
    conditionText.includes(
      "not suitable"
    ) ||
    qualityText.includes(
      "rotten"
    ) ||
    qualityText.includes(
      "poor"
    ) ||
    qualityText.includes(
      "rejected"
    ) ||
    qualityText.includes(
      "not suitable"
    );


  // =====================================================
  // REMOVE CROP
  // =====================================================

  const removeCrop = async () => {

    if (!listing) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to remove this crop listing?"
      );


    if (!confirmed) {
      return;
    }


    setRemoveLoading(true);


    try {

      console.log(
        "Removing crop:",
        listing._id
      );


      const response =
        await fetch(
          `${BACKEND_URL}/bid/crop/${listing._id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      console.log(
        "Remove crop response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          "Unable to remove crop."
        );

      }


      if (!data.success) {

        throw new Error(
          data.message ||
          "Unable to remove crop."
        );

      }


      alert(
        "Crop removed successfully."
      );


      setListing(null);

      setSkipFeedback([]);

      setAiResult(null);

      localStorage.removeItem(
        "tomatoListingId"
      );


    } catch (err) {

      console.error(
        "Remove crop error:",
        err
      );


      alert(
        err.message ||
        "Unable to remove crop."
      );


    } finally {

      setRemoveLoading(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >

        <div
          style={{
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            🌱
          </div>


          <h2
            style={{
              color: "#183b28",
            }}
          >
            Loading My Crops...
          </h2>


          <p
            style={{
              color: "#718096",
            }}
          >
            Fetching your tomato listing
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!farmer) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >

        <div
          style={{
            background: "white",
            padding: "45px",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "450px",
            width: "100%",
            boxShadow:
              "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >

          <div
            style={{
              fontSize: "55px",
            }}
          >
            🌱
          </div>


          <h1
            style={{
              color: "#183b28",
            }}
          >
            Farmer Access
          </h1>


          <p
            style={{
              color: "#718096",
              lineHeight: "1.6",
            }}
          >
            Please login as a farmer to
            view your crop information.
          </p>


          <button
            onClick={() => {
              window.location.href =
                "/login";
            }}
            style={{
              background: "#2e9d50",
              color: "white",
              border: "none",
              padding: "13px 25px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
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
  // MAIN PAGE
  // =====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f6",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#1f2937",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          background: "white",
          borderBottom:
            "1px solid #e5e7eb",
          padding:
            "18px 5%",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >

        {/* BRAND */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >

          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "15px",
              background:
                "linear-gradient(135deg,#39b54a,#198754)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow:
                "0 5px 15px rgba(46,157,80,0.2)",
            }}
          >
            🌱
          </div>


          <div>

            <h1
              style={{
                margin: 0,
                fontSize: "27px",
                color: "#183b28",
                fontWeight: "700",
              }}
            >
              AgriTrust
            </h1>


            <p
              style={{
                margin:
                  "4px 0 0",
                color: "#718096",
                fontSize: "14px",
              }}
            >
              Farmer Marketplace
            </p>

          </div>

        </div>


        {/* FARMER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
          }}
        >

          <div
            style={{
              textAlign: "right",
            }}
          >

            <span
              style={{
                display: "block",
                fontSize: "13px",
                color: "#718096",
              }}
            >
              Farmer
            </span>


            <strong
              style={{
                fontSize: "17px",
                color: "#183b28",
              }}
            >
              {farmer.name ||
                "Farmer"}
            </strong>

          </div>


          <button
            onClick={() => {
              window.location.href =
                "/farmer-dashboard";
            }}
            style={{
              background: "white",
              border:
                "1px solid #d7dee5",
              borderRadius: "10px",
              padding:
                "11px 18px",
              cursor: "pointer",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            📊 Dashboard
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          padding:
            "40px 5%",
        }}
      >

        {/* PAGE TITLE */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#183b28",
            }}
          >
            🌱 My Crops
          </h1>


          <p
            style={{
              marginTop: "8px",
              color: "#718096",
              fontSize: "15px",
            }}
          >
            Manage your registered crop
            and view AI-powered quality
            insights.
          </p>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            style={{
              background: "#fff5f5",
              border:
                "1px solid #fecaca",
              color: "#b91c1c",
              borderRadius: "15px",
              padding: "18px",
              marginBottom: "25px",
            }}
          >
            ⚠️ {error}
          </div>

        )}


        {/* =================================================
            FARMER INFORMATION
        ================================================= */}

        <section
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "28px",
            marginBottom: "25px",
            boxShadow:
              "0 6px 25px rgba(0,0,0,0.05)",
            border:
              "1px solid #edf0ee",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#183b28",
              fontSize: "21px",
            }}
          >
            👨‍🌾 Farmer Information
          </h2>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(210px,1fr))",
              gap: "20px",
            }}
          >

            <InfoItem
              label="Name"
              value={
                farmer.name ||
                "Not available"
              }
            />


            <InfoItem
              label="Email"
              value={
                farmer.email ||
                "Not available"
              }
            />


            <InfoItem
              label="Phone"
              value={
                farmer.phone ||
                "Not available"
              }
            />


            <InfoItem
              label="Location"
              value={
                listing?.location ||
                farmer.location ||
                "Not available"
              }
            />

          </div>

        </section>


        {/* =================================================
            NO LISTING
        ================================================= */}

        {!listing ? (

          <section
            style={{
              background: "white",
              borderRadius: "22px",
              padding:
                "55px 30px",
              textAlign: "center",
              boxShadow:
                "0 6px 25px rgba(0,0,0,0.05)",
            }}
          >

            <div
              style={{
                fontSize: "60px",
              }}
            >
              🍅
            </div>


            <h2>
              No Open Tomato Listing
            </h2>


            <p
              style={{
                color: "#718096",
              }}
            >
              You currently do not have
              an open tomato crop listing.
            </p>

          </section>

        ) : (

          <>

            {/* =================================================
                PRICE + PESTICIDE
            ================================================= */}

            <section
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "30px",
                boxShadow:
                  "0 6px 25px rgba(0,0,0,0.05)",
              }}
            >

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(300px,1fr))",
                  gap: "25px",
                }}
              >

                {/* PRICE */}

                <div
                  style={{
                    background:
                      "linear-gradient(135deg,#f0faec,#e8f7e5)",
                    border:
                      "1px solid #cfe8c9",
                    borderRadius: "18px",
                    padding: "30px",
                    textAlign: "center",
                  }}
                >

                  <p
                    style={{
                      margin: 0,
                      color: "#315b3b",
                      fontWeight: "700",
                      fontSize: "15px",
                      letterSpacing:
                        "0.5px",
                    }}
                  >
                    AI RECOMMENDED
                    STARTING PRICE
                  </p>


                  <div
                    style={{
                      fontSize: "34px",
                      fontWeight: "800",
                      color: "#183b28",
                      marginTop: "16px",
                    }}
                  >

                    {listing.recommended_price !==
                      null &&
                    listing.recommended_price !==
                      undefined

                      ? `₹${Number(
                          listing.recommended_price
                        ).toFixed(2)}/kg`

                      : "Not available"}

                  </div>

                </div>


                {/* PESTICIDE */}

                <div
                  style={{
                    background:
                      "linear-gradient(135deg,#fafbfc,#f4f6f8)",
                    border:
                      "1px solid #dde2e7",
                    borderRadius: "18px",
                    padding: "30px",
                    textAlign: "center",
                  }}
                >

                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    PESTICIDE INFORMATION
                  </p>


                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      marginTop: "18px",
                    }}
                  >

                    Days Since Spray:{" "}

                    {listing.days_since_spray ??
                      listing.days_since_last_spray ??
                      "Not available"}

                  </div>


                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "17px",
                      color:
                        listing.pesticide_risk
                          ?.toLowerCase()
                          .includes("high")
                          ? "#dc2626"
                          : "#15803d",
                    }}
                  >

                    Risk:{" "}

                    {listing.pesticide_risk ||
                      "Not available"}

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                CROP INFORMATION
            ================================================= */}

            <section
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "30px",
                boxShadow:
                  "0 6px 25px rgba(0,0,0,0.05)",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: "#183b28",
                }}
              >
                🍅 Crop Information
              </h2>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                  gap: "18px",
                }}
              >

                <InfoItem
                  label="Crop"
                  value={
                    listing.vegetable_name ||
                    "Tomato"
                  }
                />


                <InfoItem
                  label="Quantity"
                  value={`${listing.quantity || 0} ${
                    listing.unit || "kg"
                  }`}
                />


                <InfoItem
                  label="Market Price"
                  value={
                    listing.market_price !==
                      undefined &&
                    listing.market_price !==
                      null

                      ? `₹${Number(
                          listing.market_price
                        ).toFixed(2)}/kg`

                      : "Not available"
                  }
                />


                <InfoItem
                  label="Listing Status"
                  value={
                    listing.status ||
                    "Open"
                  }
                />

              </div>

            </section>


            {/* =================================================
                AI TOMATO ANALYSIS
            ================================================= */}

            <section
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "32px",
                marginBottom: "30px",
                boxShadow:
                  "0 6px 25px rgba(0,0,0,0.05)",
              }}
            >

              {/* AI HEADER */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "25px",
                }}
              >

                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "15px",
                    background:
                      "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}
                >
                  🤖
                </div>


                <div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: "25px",
                      color: "#1f2937",
                    }}
                  >
                    AI Tomato Analysis
                  </h2>


                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      color: "#718096",
                    }}
                  >
                    Intelligent quality
                    assessment
                  </p>

                </div>

              </div>


              {/* AI LOADING */}

              {aiLoading && (

                <div
                  style={{
                    background:
                      "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "15px",
                    padding: "18px",
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >

                  🤖 AI is analyzing
                  your tomato image...

                </div>

              )}


              {/* AI ERROR */}

              {aiError && (

                <div
                  style={{
                    background:
                      "#fff7ed",
                    border:
                      "1px solid #fed7aa",
                    color: "#9a3412",
                    borderRadius: "12px",
                    padding: "15px",
                    marginBottom: "20px",
                  }}
                >

                  ⚠️ {aiError}

                </div>

              )}


              {/* =================================================
                  AI CARDS
              ================================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(4,minmax(0,1fr))",
                  gap: "20px",
                }}
              >

                <AIBox
                  icon="🍅"
                  title="CONDITION"
                  value={
                    aiLoading
                      ? "Analyzing..."
                      : condition
                  }
                />


                <AIBox
                  icon="🌱"
                  title="FRESHNESS SCORE"
                  value={
                    aiLoading
                      ? "Analyzing..."
                      : freshness
                  }
                />


                <AIBox
                  icon="🏷️"
                  title="QUALITY GRADE"
                  value={
                    aiLoading
                      ? "Analyzing..."
                      : quality
                  }
                />


                <AIBox
                  icon="🎯"
                  title="AI CONFIDENCE"
                  value={
                    aiLoading
                      ? "Analyzing..."
                      : confidence
                  }
                />

              </div>


              {/* =================================================
                  QUALITY WARNING
              ================================================= */}

              {isRotten && (

                <div
                  style={{
                    marginTop: "25px",
                    border:
                      "1px solid #f4b942",
                    background:
                      "#fffaf0",
                    borderRadius: "16px",
                    padding: "22px",
                    textAlign: "center",
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0,
                      color: "#92400e",
                      fontSize: "21px",
                    }}
                  >
                    ⚠️ Quality Warning
                  </h3>


                  <p
                    style={{
                      margin: 0,
                      color: "#78350f",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    The AI analysis indicates
                    that this tomato may be
                    rotten, damaged or
                    unsuitable for sale.
                  </p>

                </div>

              )}

            </section>


            {/* =================================================
                TOMATO IMAGES
            ================================================= */}

            {Array.isArray(
              listing.images
            ) &&
            listing.images.length > 0 && (

              <section
                style={{
                  background: "white",
                  borderRadius: "22px",
                  padding: "30px",
                  marginBottom: "30px",
                  boxShadow:
                    "0 6px 25px rgba(0,0,0,0.05)",
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                    color: "#183b28",
                  }}
                >
                  📷 Tomato Images
                </h2>


                <p
                  style={{
                    color: "#718096",
                    fontSize: "14px",
                  }}
                >
                  Click an image to view
                  it in full size.
                </p>


                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >

                  {listing.images.map(
                    (
                      image,
                      index
                    ) => {

                      const imagePath =
                        String(image)
                          .replace(
                            /\\/g,
                            "/"
                          )
                          .replace(
                            /^\/+/,
                            ""
                          );


                      const imageUrl =
                        `${BACKEND_URL}/${imagePath}`;


                      return (

                        <div
                          key={index}
                          style={{
                            borderRadius:
                              "15px",
                            overflow:
                              "hidden",
                            background:
                              "#f7f7f7",
                            border:
                              "1px solid #e5e7eb",
                          }}
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
                            onError={() => {

                              console.log(
                                "Unable to load image:",
                                imageUrl
                              );

                            }}
                            style={{
                              width:
                                "220px",
                              height:
                                "170px",
                              objectFit:
                                "cover",
                              cursor:
                                "pointer",
                              display:
                                "block",
                            }}
                          />

                        </div>

                      );

                    }
                  )}

                </div>

              </section>

            )}


            {/* =================================================
                LISTING DETAILS
            ================================================= */}

            <section
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "30px",
                boxShadow:
                  "0 6px 25px rgba(0,0,0,0.05)",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: "#183b28",
                }}
              >
                📋 Listing Details
              </h2>


              <InfoItem
                label="Listing ID"
                value={
                  listing._id ||
                  "Not available"
                }
              />


              <div
                style={{
                  marginTop: "18px",
                }}
              >

                <InfoItem
                  label="Days Since Pesticide Spray"
                  value={
                    listing.days_since_spray ??
                    listing.days_since_last_spray ??
                    "Not available"
                  }
                />

              </div>

            </section>


            {/* =================================================
                BUYER FEEDBACK
            ================================================= */}

            <section
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "30px",
                boxShadow:
                  "0 6px 25px rgba(0,0,0,0.05)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >

                <h2
                  style={{
                    margin: 0,
                    color: "#183b28",
                  }}
                >
                  ⚠️ Buyer Feedback
                </h2>


                <button
                  type="button"
                  disabled={
                    feedbackLoading
                  }
                  onClick={() => {

                    loadSkipFeedback(
                      listing._id
                    );

                  }}
                  style={{
                    border:
                      "1px solid #d1d5db",
                    background:
                      "white",
                    borderRadius:
                      "9px",
                    padding:
                      "9px 15px",
                    cursor:
                      feedbackLoading
                        ? "default"
                        : "pointer",
                    fontWeight:
                      "600",
                  }}
                >

                  {feedbackLoading
                    ? "Refreshing..."
                    : "🔄 Refresh"}

                </button>

              </div>


              <p
                style={{
                  color: "#718096",
                  lineHeight: "1.6",
                }}
              >
                Buyers can skip a crop after
                inspecting its image and AI
                analysis. Their feedback
                appears here.
              </p>


              {feedbackLoading ? (

                <div
                  style={{
                    background:
                      "#f8fafc",
                    borderRadius:
                      "12px",
                    padding:
                      "20px",
                  }}
                >

                  Loading buyer
                  feedback...

                </div>

              ) : skipFeedback.length ===
                0 ? (

                <div
                  style={{
                    background:
                      "#f8fafc",
                    borderRadius:
                      "12px",
                    padding:
                      "20px",
                    color:
                      "#64748b",
                  }}
                >

                  No buyers have skipped
                  this crop yet.

                </div>

              ) : (

                <div>

                  <p>

                    <strong>
                      {skipFeedback.length}
                    </strong>{" "}

                    buyer
                    {skipFeedback.length !==
                      1
                      ? "s have"
                      : " has"}{" "}
                    skipped this crop.

                  </p>


                  {skipFeedback.map(
                    (
                      feedback,
                      index
                    ) => (

                      <div
                        key={
                          feedback._id ||
                          index
                        }
                        style={{
                          background:
                            "#fafafa",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius:
                            "14px",
                          padding:
                            "20px",
                          marginTop:
                            "15px",
                        }}
                      >

                        <h3>
                          Buyer Feedback #
                          {index + 1}
                        </h3>


                        <p>
                          <strong>
                            👤 Buyer:
                          </strong>{" "}

                          {feedback.buyer_name ||
                            "Unknown Buyer"}

                        </p>


                        <p>
                          <strong>
                            📧 Email:
                          </strong>{" "}

                          {feedback.buyer_email ||
                            "Not available"}

                        </p>


                        <p>
                          <strong>
                            ⚠️ Reason:
                          </strong>{" "}

                          {feedback.reason ||
                            "Buyer skipped this crop."}

                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* =================================================
                REMOVE CROP
            ================================================= */}

            {listing.status !==
              "Sold" &&
            skipFeedback.length >
              0 && (

              <section
                style={{
                  background: "white",
                  borderRadius: "22px",
                  padding: "30px",
                  marginBottom: "30px",
                  boxShadow:
                    "0 6px 25px rgba(0,0,0,0.05)",
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                    color: "#183b28",
                  }}
                >
                  🗑️ Crop Management
                </h2>


                <p
                  style={{
                    color: "#718096",
                  }}
                >
                  Buyers have skipped this
                  crop. Review their feedback
                  before deciding whether to
                  remove the listing.
                </p>


                <button
                  type="button"
                  disabled={
                    removeLoading
                  }
                  onClick={
                    removeCrop
                  }
                  style={{
                    background:
                      "#dc2626",
                    color:
                      "white",
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    padding:
                      "12px 20px",
                    fontWeight:
                      "600",
                    cursor:
                      removeLoading
                        ? "default"
                        : "pointer",
                  }}
                >

                  {removeLoading
                    ? "Removing..."
                    : "🗑️ Remove This Crop"}

                </button>

              </section>

            )}

          </>

        )}

      </main>

    </div>

  );

}


// =====================================================
// INFORMATION CARD
// =====================================================

function InfoItem({
  label,
  value,
}) {

  return (

    <div
      style={{
        background:
          "#f8faf9",
        borderRadius:
          "12px",
        padding:
          "17px",
        border:
          "1px solid #edf1ee",
      }}
    >

      <div
        style={{
          fontSize:
            "12px",
          color:
            "#718096",
          marginBottom:
            "7px",
          textTransform:
            "uppercase",
          letterSpacing:
            "0.5px",
        }}
      >
        {label}
      </div>


      <div
        style={{
          fontSize:
            "16px",
          fontWeight:
            "600",
          color:
            "#26352c",
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </div>

    </div>

  );

}


// =====================================================
// AI CARD
// =====================================================

function AIBox({
  icon,
  title,
  value,
}) {

  return (

    <div
      style={{
        background:
          "linear-gradient(145deg,#fbfcff,#f7f8fb)",
        border:
          "1px solid #e0e5ec",
        borderRadius:
          "16px",
        padding:
          "24px 15px",
        textAlign:
          "center",
        minHeight:
          "125px",
        display:
          "flex",
        flexDirection:
          "column",
        justifyContent:
          "center",
        boxSizing:
          "border-box",
      }}
    >

      <div
        style={{
          fontSize:
            "30px",
          marginBottom:
            "10px",
        }}
      >
        {icon}
      </div>


      <div
        style={{
          fontSize:
            "13px",
          fontWeight:
            "700",
          color:
            "#40527c",
          letterSpacing:
            "0.4px",
        }}
      >
        {title}
      </div>


      <div
        style={{
          marginTop:
            "12px",
          fontSize:
            "21px",
          fontWeight:
            "700",
          color:
            "#1f2937",
        }}
      >
        {value}
      </div>

    </div>

  );

}


export default MyCrops;