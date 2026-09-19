import React, { useEffect, useState } from "react";

function PlaceBid() {
  const [bidPrice, setBidPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [market, setMarket] = useState(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // OTHER BUYERS' BIDS
  // =====================================================

  const [otherBids, setOtherBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState("");

  const buyer = JSON.parse(
    localStorage.getItem("agritrust_user") || "null"
  );

  const BACKEND_URL = "http://127.0.0.1:8000";

  // =====================================================
  // GET LISTING ID
  // =====================================================

  const listingId =
    localStorage.getItem("tomatoListingId");

  // =====================================================
  // FETCH LIVE MARKET PRICE
  // =====================================================

  useEffect(() => {
    const fetchMarketPrice = async () => {
      try {
        setMarketLoading(true);
        setMarketError("");

        const response = await fetch(
          `${BACKEND_URL}/market/market-price`
        );

        const data = await response.json();

        console.log(
          "PLACE BID MARKET RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.message ||
              "Unable to fetch market price."
          );
        }

        if (data.success === false) {
          throw new Error(
            data.message ||
              "Market price is currently unavailable."
          );
        }

        setMarket(data);
      } catch (err) {
        console.error(
          "Market price error:",
          err
        );

        setMarketError(
          err.message ||
            "Unable to connect to market server."
        );
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarketPrice();

    const interval = setInterval(
      fetchMarketPrice,
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // FETCH OTHER BUYERS' BIDS
  // =====================================================

  useEffect(() => {
    const fetchOtherBids = async () => {
      if (!listingId) {
        setBidsLoading(false);
        setBidsError(
          "Tomato listing ID is not available."
        );
        return;
      }

      try {
        setBidsLoading(true);
        setBidsError("");

        const response = await fetch(
          `${BACKEND_URL}/bid/bids/${listingId}`
        );

        const data = await response.json();

        console.log(
          "OTHER BUYERS' BIDS RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.message ||
              "Unable to fetch buyer bids."
          );
        }

        if (data.success === false) {
          throw new Error(
            data.message ||
              "Unable to fetch buyer bids."
          );
        }

        /*
         * We only need the bid prices.
         *
         * The backend already sorts bids
         * from highest to lowest.
         */
        setOtherBids(
          Array.isArray(data.bids)
            ? data.bids
            : []
        );
      } catch (err) {
        console.error(
          "Other bids error:",
          err
        );

        setBidsError(
          err.message ||
            "Unable to load other buyers' bids."
        );
      } finally {
        setBidsLoading(false);
      }
    };

    fetchOtherBids();

    /*
     * Refresh the bids every 30 seconds
     * so newly submitted bids can appear.
     */
    const interval = setInterval(
      fetchOtherBids,
      30 * 1000
    );

    return () => clearInterval(interval);
  }, [listingId]);

  // =====================================================
  // HANDLE BID SUBMISSION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!buyer || buyer.role !== "buyer") {
      setError("Please login as a buyer.");
      return;
    }

    if (!bidPrice || !quantity) {
      setError(
        "Please enter bid price and quantity."
      );
      return;
    }

    if (
      Number(bidPrice) <= 0 ||
      Number(quantity) <= 0
    ) {
      setError(
        "Bid price and quantity must be greater than zero."
      );
      return;
    }

    setLoading(true);

    try {
      const currentListingId =
        localStorage.getItem(
          "tomatoListingId"
        );

      if (!currentListingId) {
        throw new Error(
          "Tomato listing ID is not available yet."
        );
      }

      const formData = new FormData();

      formData.append(
        "buyer_name",
        buyer.name || "Buyer"
      );

      formData.append(
        "buyer_email",
        buyer.email || ""
      );

      formData.append(
        "bid_price",
        Number(bidPrice)
      );

      formData.append(
        "quantity",
        Number(quantity)
      );

      const response = await fetch(
        `${BACKEND_URL}/bid/bid/${currentListingId}`,
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
            "Unable to place bid."
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message ||
            "Unable to place bid."
        );
      }

      setMessage(
        "Your bid has been placed successfully!"
      );

      setBidPrice("");
      setQuantity("");

      /*
       * Immediately refresh the bid list
       * after successfully placing a bid.
       */
      try {
        const bidsResponse =
          await fetch(
            `${BACKEND_URL}/bid/bids/${currentListingId}`
          );

        const bidsData =
          await bidsResponse.json();

        if (
          bidsResponse.ok &&
          bidsData.success !== false &&
          Array.isArray(bidsData.bids)
        ) {
          setOtherBids(
            bidsData.bids
          );
        }
      } catch (refreshError) {
        console.error(
          "Unable to refresh bids:",
          refreshError
        );
      }
    } catch (err) {
      console.error(
        "Bid submission error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the bidding server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const goToAvailableCrops = () => {
    window.location.href =
      "/available-crops";
  };

  // =====================================================
  // MARKET PRICE
  // =====================================================

  const marketPrice =
    market?.market_price !==
      undefined &&
    market?.market_price !== null
      ? Number(
          market.market_price
        )
      : null;

  // =====================================================
  // BID DIFFERENCE
  // =====================================================

  const bidDifference =
    bidPrice &&
    marketPrice !== null
      ? Number(bidPrice) -
        marketPrice
      : null;

  // =====================================================
  // TOTAL VALUE
  // =====================================================

  const totalBidValue =
    bidPrice && quantity
      ? Number(bidPrice) *
        Number(quantity)
      : 0;

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4f8f3 0%, #ffffff 45%)",
        padding:
          "30px 20px 60px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "25px",
          }}
        >
          <button
            type="button"
            onClick={
              goToAvailableCrops
            }
            style={{
              border: "none",
              background:
                "#ffffff",
              padding:
                "11px 18px",
              borderRadius:
                "10px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            ← Available Crops
          </button>

          <div
            style={{
              fontSize: "14px",
              color: "#667",
              fontWeight: "600",
            }}
          >
            AgriTrust Marketplace
          </div>
        </div>

        {/* =================================================
            HERO HEADER
        ================================================= */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #ffffff, #eef7ed)",
            borderRadius: "24px",
            padding:
              "32px 30px",
            boxShadow:
              "0 10px 35px rgba(0,0,0,0.08)",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius:
                  "18px",
                background:
                  "#e7f5e4",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "32px",
                flexShrink: 0,
              }}
            >
              🍅
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(28px, 5vw, 40px)",
                  color: "#1f3d25",
                }}
              >
                Place Your Bid
              </h1>

              <p
                style={{
                  margin:
                    "8px 0 0",
                  color: "#657267",
                  fontSize: "16px",
                }}
              >
                Make a transparent offer
                for the farmer's tomato crop.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            MARKET + BUYER CARDS
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >

          {/* MARKET CARD */}

          <div
            style={{
              background:
                "#ffffff",
              borderRadius:
                "20px",
              padding: "24px",
              boxShadow:
                "0 7px 25px rgba(0,0,0,0.07)",
              border:
                "1px solid #e6ece5",
            }}
          >
            <div
              style={{
                fontSize:
                  "14px",
                color:
                  "#6a766c",
                fontWeight:
                  "700",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.5px",
              }}
            >
              📊 Market Reference
            </div>

            <h2
              style={{
                margin:
                  "12px 0 6px",
                color:
                  "#1d4025",
                fontSize:
                  "30px",
              }}
            >
              {marketLoading
                ? "Loading..."
                : marketPrice !==
                  null
                ? `₹${marketPrice.toFixed(
                    2
                  )}`
                : "Unavailable"}
            </h2>

            <p
              style={{
                margin:
                  "0 0 12px",
                color:
                  "#68736a",
              }}
            >
              per kg
            </p>

            <div
              style={{
                fontSize:
                  "14px",
                lineHeight:
                  "1.7",
              }}
            >
              <div>
                <strong>
                  Market:
                </strong>{" "}
                {market?.market ||
                  "Bengaluru APMC - Binny Mill (FF&V)"}
              </div>

              {!marketLoading &&
                market && (
                  <>
                    <div>
                      <strong>
                        Unit:
                      </strong>{" "}
                      {market.market_price_unit ||
                        "Rs/kg"}
                    </div>

                    <div>
                      <strong>
                        Source:
                      </strong>{" "}
                      {market.source ||
                        "AGMARKNET - Bengaluru APMC"}
                    </div>
                  </>
                )}
            </div>

            {marketError && (
              <div
                style={{
                  marginTop:
                    "15px",
                  padding:
                    "12px",
                  borderRadius:
                    "10px",
                  background:
                    "#fff4df",
                  color:
                    "#8a5a00",
                  fontSize:
                    "14px",
                }}
              >
                ⚠️ {marketError}
              </div>
            )}
          </div>

          {/* BUYER CARD */}

          <div
            style={{
              background:
                "#ffffff",
              borderRadius:
                "20px",
              padding: "24px",
              boxShadow:
                "0 7px 25px rgba(0,0,0,0.07)",
              border:
                "1px solid #e6ece5",
            }}
          >
            <div
              style={{
                fontSize:
                  "14px",
                color:
                  "#6a766c",
                fontWeight:
                  "700",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.5px",
              }}
            >
              👤 Buyer
            </div>

            <h2
              style={{
                margin:
                  "12px 0 8px",
                color:
                  "#1d4025",
              }}
            >
              {buyer?.name ||
                "Buyer"}
            </h2>

            <p
              style={{
                margin:
                  "0 0 7px",
                color:
                  "#68736a",
                wordBreak:
                  "break-word",
              }}
            >
              📧{" "}
              {buyer?.email ||
                "Not available"}
            </p>

            <div
              style={{
                display:
                  "inline-block",
                marginTop:
                  "10px",
                padding:
                  "7px 12px",
                borderRadius:
                  "20px",
                background:
                  "#eaf6e7",
                color:
                  "#34723c",
                fontSize:
                  "13px",
                fontWeight:
                  "700",
              }}
            >
              Verified Buyer
            </div>
          </div>
        </div>

        {/* =================================================
            OTHER BUYERS' BIDS
        ================================================= */}

        <div
          style={{
            background:
              "#ffffff",
            borderRadius:
              "20px",
            padding:
              "24px",
            marginBottom:
              "25px",
            boxShadow:
              "0 7px 25px rgba(0,0,0,0.06)",
            border:
              "1px solid #e5ebe4",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "10px",
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin:
                    "0 0 6px",
                  color:
                    "#29482e",
                  fontSize:
                    "24px",
                }}
              >
                👥 Other Buyers' Bids
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "#68736a",
                  fontSize:
                    "14px",
                }}
              >
                See the bid prices already
                submitted for this crop.
              </p>
            </div>

            <div
              style={{
                padding:
                  "7px 12px",
                borderRadius:
                  "20px",
                background:
                  "#eef7ed",
                color:
                  "#34723c",
                fontSize:
                  "13px",
                fontWeight:
                  "700",
              }}
            >
              🔄 Updates automatically
            </div>
          </div>

          {/* LOADING */}

          {bidsLoading && (
            <div
              style={{
                marginTop:
                  "20px",
                padding:
                  "18px",
                borderRadius:
                  "12px",
                background:
                  "#f7faf7",
                color:
                  "#68736a",
                textAlign:
                  "center",
              }}
            >
              Loading other buyers' bids...
            </div>
          )}

          {/* ERROR */}

          {!bidsLoading &&
            bidsError && (
              <div
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "14px",
                  borderRadius:
                    "12px",
                  background:
                    "#fff4f4",
                  color:
                    "#a33b3b",
                  fontSize:
                    "14px",
                }}
              >
                ⚠️ {bidsError}
              </div>
            )}

          {/* NO BIDS */}

          {!bidsLoading &&
            !bidsError &&
            otherBids.length === 0 && (
              <div
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "22px",
                  borderRadius:
                    "14px",
                  background:
                    "#f7faf7",
                  border:
                    "1px dashed #cbd8ca",
                  textAlign:
                    "center",
                  color:
                    "#68736a",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "30px",
                    marginBottom:
                      "8px",
                  }}
                >
                  🤝
                </div>

                <strong
                  style={{
                    color:
                      "#304235",
                  }}
                >
                  No other bids yet
                </strong>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    fontSize:
                      "14px",
                  }}
                >
                  You can be the first buyer
                  to place a bid.
                </p>
              </div>
            )}

          {/* BID LIST */}

          {!bidsLoading &&
            !bidsError &&
            otherBids.length > 0 && (
              <div
                style={{
                  marginTop:
                    "20px",
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap:
                    "12px",
                }}
              >
                {otherBids.map(
                  (bid, index) => (
                    <div
                      key={
                        bid._id ||
                        `${bid.bid_price}-${index}`
                      }
                      style={{
                        padding:
                          "18px",
                        borderRadius:
                          "15px",
                        background:
                          index === 0
                            ? "#eef7ed"
                            : "#f8faf8",
                        border:
                          index === 0
                            ? "1px solid #cde4ca"
                            : "1px solid #e5ebe4",
                        textAlign:
                          "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "24px",
                          marginBottom:
                            "7px",
                        }}
                      >
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : "💰"}
                      </div>

                      <div
                        style={{
                          fontSize:
                            "13px",
                          color:
                            "#718073",
                          marginBottom:
                            "5px",
                          fontWeight:
                            "600",
                        }}
                      >
                        {index === 0
                          ? "Highest Bid"
                          : `Bid ${index + 1}`}
                      </div>

                      <strong
                        style={{
                          fontSize:
                            "24px",
                          color:
                            "#214b29",
                        }}
                      >
                        ₹
                        {Number(
                          bid.bid_price
                        ).toFixed(
                          2
                        )}
                        /kg
                      </strong>
                    </div>
                  )
                )}
              </div>
            )}

          {!bidsLoading &&
            !bidsError &&
            otherBids.length > 0 && (
              <p
                style={{
                  margin:
                    "18px 0 0",
                  color:
                    "#68736a",
                  fontSize:
                    "13px",
                  textAlign:
                    "center",
                }}
              >
                🔒 Buyer identities are hidden.
                Only bid prices are displayed.
              </p>
            )}
        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div
            style={{
              marginBottom:
                "20px",
              padding:
                "18px 20px",
              borderRadius:
                "15px",
              background:
                "#eaf7e8",
              border:
                "1px solid #c9e5c5",
              color:
                "#27652f",
              fontWeight:
                "600",
            }}
          >
            ✅ {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            style={{
              marginBottom:
                "20px",
              padding:
                "18px 20px",
              borderRadius:
                "15px",
              background:
                "#fff0f0",
              border:
                "1px solid #f0caca",
              color:
                "#a33b3b",
              fontWeight:
                "600",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* =================================================
            BID FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          style={{
            background:
              "#ffffff",
            borderRadius:
              "24px",
            padding:
              "30px",
            boxShadow:
              "0 10px 35px rgba(0,0,0,0.08)",
            border:
              "1px solid #e5ebe4",
          }}
        >
          <div
            style={{
              marginBottom:
                "25px",
            }}
          >
            <h2
              style={{
                margin:
                  "0 0 7px",
                color:
                  "#203e26",
                fontSize:
                  "25px",
              }}
            >
              💰 Your Offer
            </h2>

            <p
              style={{
                margin: 0,
                color:
                  "#6b756d",
              }}
            >
              Enter the price and
              quantity you want to offer.
            </p>
          </div>

          {/* =================================================
              INPUT GRID
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >

            {/* BID PRICE */}

            <div>
              <label
                style={{
                  display:
                    "block",
                  fontWeight:
                    "700",
                  color:
                    "#304235",
                  marginBottom:
                    "8px",
                }}
              >
                💵 Bid Price (₹/kg)
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={
                  bidPrice
                }
                onChange={(e) =>
                  setBidPrice(
                    e.target.value
                  )
                }
                placeholder={
                  marketPrice !==
                  null
                    ? `Example: ${Math.ceil(
                        marketPrice +
                          1
                      )}`
                    : "Example: 18"
                }
                required
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "15px",
                  borderRadius:
                    "12px",
                  border:
                    "1px solid #ccd7cc",
                  fontSize:
                    "16px",
                  outline:
                    "none",
                  background:
                    "#fbfdfb",
                }}
              />
            </div>

            {/* QUANTITY */}

            <div>
              <label
                style={{
                  display:
                    "block",
                  fontWeight:
                    "700",
                  color:
                    "#304235",
                  marginBottom:
                    "8px",
                }}
              >
                ⚖️ Quantity (kg)
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  quantity
                }
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                placeholder="Example: 100"
                required
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "15px",
                  borderRadius:
                    "12px",
                  border:
                    "1px solid #ccd7cc",
                  fontSize:
                    "16px",
                  outline:
                    "none",
                  background:
                    "#fbfdfb",
                }}
              />
            </div>
          </div>

          {/* =================================================
              LIVE BID SUMMARY
          ================================================= */}

          {(bidPrice ||
            quantity) && (
            <div
              style={{
                marginTop:
                  "25px",
                padding:
                  "22px",
                borderRadius:
                  "17px",
                background:
                  "linear-gradient(135deg, #f5faf3, #eef7ed)",
                border:
                  "1px solid #dcebd8",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 15px",
                  color:
                    "#274d2c",
                }}
              >
                📋 Bid Summary
              </h3>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    background:
                      "#ffffff",
                    padding:
                      "15px",
                    borderRadius:
                      "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#718073",
                    }}
                  >
                    Your Price
                  </div>

                  <strong
                    style={{
                      fontSize:
                        "21px",
                      color:
                        "#214b29",
                    }}
                  >
                    ₹
                    {bidPrice
                      ? Number(
                          bidPrice
                        ).toFixed(
                          2
                        )
                      : "0.00"}
                    /kg
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "#ffffff",
                    padding:
                      "15px",
                    borderRadius:
                      "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#718073",
                    }}
                  >
                    Quantity
                  </div>

                  <strong
                    style={{
                      fontSize:
                        "21px",
                      color:
                        "#214b29",
                    }}
                  >
                    {quantity ||
                      "0"}{" "}
                    kg
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "#ffffff",
                    padding:
                      "15px",
                    borderRadius:
                      "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#718073",
                    }}
                  >
                    Total Value
                  </div>

                  <strong
                    style={{
                      fontSize:
                        "21px",
                      color:
                        "#214b29",
                    }}
                  >
                    ₹
                    {totalBidValue.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits:
                          2,
                      }
                    )}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              BID VS MARKET
          ================================================= */}

          {bidPrice &&
            marketPrice !==
              null && (
              <div
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "18px",
                  borderRadius:
                    "15px",
                  background:
                    "#fafcfa",
                  border:
                    "1px solid #e4ebe3",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    flexWrap:
                      "wrap",
                    gap: "10px",
                    marginBottom:
                      "12px",
                  }}
                >
                  <strong>
                    📊 Bid Comparison
                  </strong>

                  <span>
                    Market: ₹
                    {marketPrice.toFixed(
                      2
                    )}/kg
                  </span>
                </div>

                <div
                  style={{
                    height:
                      "10px",
                    background:
                      "#e5eae5",
                    borderRadius:
                      "20px",
                    overflow:
                      "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${
                        Math.min(
                          Math.max(
                            (Number(
                              bidPrice
                            ) /
                              marketPrice) *
                              100,
                            0
                          ),
                          150
                        ) / 1.5
                      }%`,
                      height:
                        "100%",
                      background:
                        "#4d8c52",
                      borderRadius:
                        "20px",
                    }}
                  />
                </div>

                <p
                  style={{
                    margin:
                      "12px 0 0",
                    fontWeight:
                      "600",
                  }}
                >
                  {bidDifference >
                    0 && (
                    <>
                      📈 Your bid is ₹
                      {Math.abs(
                        bidDifference
                      ).toFixed(
                        2
                      )}{" "}
                      above the
                      market reference.
                    </>
                  )}

                  {bidDifference <
                    0 && (
                    <>
                      📉 Your bid is ₹
                      {Math.abs(
                        bidDifference
                      ).toFixed(
                        2
                      )}{" "}
                      below the
                      market reference.
                    </>
                  )}

                  {bidDifference ===
                    0 && (
                    <>
                      ⚖️ Your bid matches
                      the market reference
                      price.
                    </>
                  )}
                </p>
              </div>
            )}

          {/* =================================================
              SUBMIT BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop:
                "25px",
              padding:
                "16px",
              border: "none",
              borderRadius:
                "14px",
              background:
                loading
                  ? "#9db39f"
                  : "#3f7d45",
              color:
                "#ffffff",
              fontSize:
                "17px",
              fontWeight:
                "700",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
              boxShadow:
                "0 7px 18px rgba(63,125,69,0.22)",
            }}
          >
            {loading
              ? "Submitting Bid..."
              : "🤝 Submit Bid"}
          </button>
        </form>

        {/* =================================================
            TRANSPARENT BIDDING
        ================================================= */}

        <div
          style={{
            marginTop:
              "25px",
            background:
              "#ffffff",
            borderRadius:
              "20px",
            padding:
              "24px",
            boxShadow:
              "0 7px 25px rgba(0,0,0,0.06)",
            border:
              "1px solid #e5ebe4",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color:
                "#29482e",
            }}
          >
            🔐 Transparent Bidding
          </h3>

          <p
            style={{
              color:
                "#68736a",
              lineHeight:
                "1.7",
            }}
          >
            Your bid will be recorded and
            displayed to the farmer. The
            farmer can compare available
            offers before accepting a bid.
          </p>

          <p
            style={{
              color:
                "#68736a",
              lineHeight:
                "1.7",
              marginBottom: 0,
            }}
          >
            The market reference price is
            fetched from the market-price
            service and is provided only as
            a reference for comparing buyer
            offers.
          </p>
        </div>

      </div>
    </div>
  );
}

export default PlaceBid;