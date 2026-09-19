import React, { useEffect, useState } from "react";

function MyBids() {
  const [buyer, setBuyer] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = "http://127.0.0.1:8000";

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
        fetchMyBids(user.email);
      }
    } catch (err) {
      console.error(
        "Unable to read buyer login:",
        err
      );

      setError(
        "Unable to read buyer login."
      );
    }
  }, []);

  // =====================================================
  // FETCH MY BIDS
  // =====================================================

  const fetchMyBids = async (email) => {
    if (!email) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/bid/my-bids/${encodeURIComponent(
          email
        )}`
      );

      const data = await response.json();

      console.log(
        "My bids response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to fetch your bids."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to fetch your bids."
        );
      }

      setBids(
        Array.isArray(data.bids)
          ? data.bids
          : []
      );
    } catch (err) {
      console.error(
        "My bids error:",
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
  // REFRESH
  // =====================================================

  const refreshBids = () => {
    if (buyer?.email) {
      fetchMyBids(buyer.email);
    }
  };

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const totalBids = bids.length;

  const pendingBids =
    bids.filter(
      (bid) =>
        String(bid.status || "Pending")
          .toLowerCase() === "pending"
    ).length;

  const acceptedBids =
    bids.filter(
      (bid) =>
        String(bid.status || "")
          .toLowerCase() === "accepted"
    ).length;

  const rejectedBids =
    bids.filter(
      (bid) =>
        String(bid.status || "")
          .toLowerCase() === "rejected"
    ).length;

  // =====================================================
  // BUYER ACCESS
  // =====================================================

  if (!buyer) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7faf7",
          padding: "60px 20px",
          textAlign: "center",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            🔒
          </div>

          <h1>
            Buyer Access Only
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: "25px",
            }}
          >
            Please login as a buyer to
            view your bids.
          </p>

          <button
            onClick={() => {
              window.location.href =
                "/login";
            }}
            style={{
              padding:
                "12px 25px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              background:
                "#2e7d32",
              color: "white",
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
        background: "#f7faf7",
        padding: "30px 20px 60px",
        fontFamily:
          "Arial, sans-serif",
        color: "#222",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
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
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "30px",
          }}
        >

          <div>
            <button
              onClick={() => {
                window.location.href =
                  "/buyer-dashboard";
              }}
              style={{
                padding:
                  "9px 16px",
                border:
                  "1px solid #ddd",
                borderRadius: "9px",
                background:
                  "#ffffff",
                cursor: "pointer",
                marginBottom:
                  "18px",
              }}
            >
              ← Dashboard
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "16px",
                  background:
                    "#e8f5e9",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize: "28px",
                }}
              >
                💰
              </div>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "34px",
                  }}
                >
                  My Bids
                </h1>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#777",
                  }}
                >
                  Track your tomato
                  bidding activity
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={refreshBids}
            disabled={loading}
            style={{
              padding:
                "11px 18px",
              border:
                "1px solid #ddd",
              borderRadius: "10px",
              background:
                "#ffffff",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Refreshing..."
              : "🔄 Refresh"}
          </button>

        </div>


        {/* =================================================
            BUYER INFORMATION
        ================================================= */}

        <div
          style={{
            background:
              "#ffffff",
            borderRadius: "18px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.06)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            👤 Buyer Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "15px",
            }}
          >

            <div
              style={{
                padding: "15px",
                background:
                  "#f8faf8",
                borderRadius: "12px",
              }}
            >
              <small
                style={{
                  color: "#777",
                }}
              >
                NAME
              </small>

              <div
                style={{
                  fontWeight:
                    "bold",
                  marginTop: "5px",
                }}
              >
                {buyer.name ||
                  "Buyer"}
              </div>
            </div>

            <div
              style={{
                padding: "15px",
                background:
                  "#f8faf8",
                borderRadius: "12px",
              }}
            >
              <small
                style={{
                  color: "#777",
                }}
              >
                EMAIL
              </small>

              <div
                style={{
                  fontWeight:
                    "bold",
                  marginTop: "5px",
                }}
              >
                {buyer.email ||
                  "Not available"}
              </div>
            </div>

          </div>
        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        {!loading &&
          !error &&
          bids.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "18px",
                marginBottom: "30px",
              }}
            >

              {/* TOTAL */}

              <div
                style={{
                  background:
                    "#ffffff",
                  borderRadius:
                    "16px",
                  padding: "22px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "26px",
                  }}
                >
                  📋
                </div>

                <small
                  style={{
                    color: "#777",
                  }}
                >
                  TOTAL BIDS
                </small>

                <h2
                  style={{
                    margin:
                      "8px 0 0",
                  }}
                >
                  {totalBids}
                </h2>
              </div>


              {/* PENDING */}

              <div
                style={{
                  background:
                    "#ffffff",
                  borderRadius:
                    "16px",
                  padding: "22px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "26px",
                  }}
                >
                  ⏳
                </div>

                <small
                  style={{
                    color: "#777",
                  }}
                >
                  PENDING
                </small>

                <h2
                  style={{
                    margin:
                      "8px 0 0",
                  }}
                >
                  {pendingBids}
                </h2>
              </div>


              {/* ACCEPTED */}

              <div
                style={{
                  background:
                    "#ffffff",
                  borderRadius:
                    "16px",
                  padding: "22px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "26px",
                  }}
                >
                  ✅
                </div>

                <small
                  style={{
                    color: "#777",
                  }}
                >
                  ACCEPTED
                </small>

                <h2
                  style={{
                    margin:
                      "8px 0 0",
                  }}
                >
                  {acceptedBids}
                </h2>
              </div>


              {/* REJECTED */}

              <div
                style={{
                  background:
                    "#ffffff",
                  borderRadius:
                    "16px",
                  padding: "22px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "26px",
                  }}
                >
                  ❌
                </div>

                <small
                  style={{
                    color: "#777",
                  }}
                >
                  REJECTED
                </small>

                <h2
                  style={{
                    margin:
                      "8px 0 0",
                  }}
                >
                  {rejectedBids}
                </h2>
              </div>

            </div>
          )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            style={{
              background:
                "#fff4f4",
              border:
                "1px solid #f0b5b5",
              borderRadius:
                "14px",
              padding: "20px",
              marginBottom:
                "25px",
            }}
          >
            ⚠️ {error}
          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            style={{
              background:
                "#ffffff",
              borderRadius:
                "18px",
              padding: "50px",
              textAlign:
                "center",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
              }}
            >
              🔄
            </div>

            <h2>
              Loading Your Bids
            </h2>

            <p
              style={{
                color: "#777",
              }}
            >
              Please wait while we
              fetch your bidding
              history.
            </p>
          </div>
        )}


        {/* =================================================
            NO BIDS
        ================================================= */}

        {!loading &&
          !error &&
          bids.length === 0 && (
            <div
              style={{
                background:
                  "#ffffff",
                borderRadius:
                  "20px",
                padding: "55px 30px",
                textAlign:
                  "center",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize:
                    "55px",
                }}
              >
                📭
              </div>

              <h2>
                No Bids Yet
              </h2>

              <p
                style={{
                  color: "#777",
                  maxWidth:
                    "500px",
                  margin:
                    "0 auto 25px",
                }}
              >
                You have not placed
                any bids on farmer
                crops yet.
              </p>

              <button
                onClick={() => {
                  window.location.href =
                    "/available-crops";
                }}
                style={{
                  padding:
                    "12px 22px",
                  border: "none",
                  borderRadius:
                    "10px",
                  background:
                    "#2e7d32",
                  color: "white",
                  fontWeight:
                    "bold",
                  cursor:
                    "pointer",
                }}
              >
                🌾 View Available
                Crops
              </button>
            </div>
          )}


        {/* =================================================
            BIDDING HISTORY
        ================================================= */}

        {!loading &&
          bids.length > 0 && (
            <div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "18px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    🍅 Your Bidding
                    History
                  </h2>

                  <p
                    style={{
                      color:
                        "#777",
                      margin:
                        "5px 0 0",
                    }}
                  >
                    Track all your
                    offers and their
                    current status.
                  </p>
                </div>
              </div>


              {/* =================================================
                  BID CARDS
              ================================================= */}

              {bids.map(
                (bid, index) => {

                  const status =
                    bid.status ||
                    "Pending";

                  const statusLower =
                    String(
                      status
                    ).toLowerCase();

                  const isAccepted =
                    statusLower ===
                    "accepted";

                  const isRejected =
                    statusLower ===
                    "rejected";

                  const isPending =
                    statusLower ===
                    "pending";

                  const totalValue =
                    Number(
                      bid.bid_price ||
                        0
                    ) *
                    Number(
                      bid.quantity ||
                        0
                    );

                  return (
                    <div
                      key={
                        bid._id ||
                        index
                      }
                      style={{
                        background:
                          "#ffffff",
                        borderRadius:
                          "18px",
                        padding:
                          "25px",
                        marginBottom:
                          "20px",
                        boxShadow:
                          "0 5px 20px rgba(0,0,0,0.06)",
                      }}
                    >

                      {/* BID HEADER */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          flexWrap:
                            "wrap",
                          gap: "12px",
                          marginBottom:
                            "20px",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                "28px",
                            }}
                          >
                            🍅
                          </span>

                          <div>
                            <h3
                              style={{
                                margin:
                                  0,
                              }}
                            >
                              {bid.crop_name ||
                                "Tomato"}
                            </h3>

                            <small
                              style={{
                                color:
                                  "#777",
                              }}
                            >
                              Bid #
                              {index +
                                1}
                            </small>
                          </div>
                        </div>


                        {/* STATUS BADGE */}

                        <span
                          style={{
                            padding:
                              "8px 14px",
                            borderRadius:
                              "20px",
                            fontWeight:
                              "bold",
                            fontSize:
                              "14px",
                            background:
                              isAccepted
                                ? "#e8f5e9"
                                : isRejected
                                ? "#ffebee"
                                : "#fff8e1",
                            color:
                              isAccepted
                                ? "#2e7d32"
                                : isRejected
                                ? "#c62828"
                                : "#f57f17",
                          }}
                        >
                          {isAccepted &&
                            "✅ Accepted"}

                          {isRejected &&
                            "❌ Rejected"}

                          {isPending &&
                            "⏳ Pending"}

                          {!isAccepted &&
                            !isRejected &&
                            !isPending &&
                            status}
                        </span>

                      </div>


                      {/* BID DETAILS */}

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(190px, 1fr))",
                          gap: "15px",
                        }}
                      >

                        <div
                          style={{
                            padding:
                              "17px",
                            background:
                              "#f8faf8",
                            borderRadius:
                              "12px",
                          }}
                        >
                          <small
                            style={{
                              color:
                                "#777",
                            }}
                          >
                            FARMER
                          </small>

                          <div
                            style={{
                              fontWeight:
                                "bold",
                              marginTop:
                                "6px",
                            }}
                          >
                            👨‍🌾{" "}
                            {bid.farmer_name ||
                              "Not available"}
                          </div>
                        </div>


                        <div
                          style={{
                            padding:
                              "17px",
                            background:
                              "#f8faf8",
                            borderRadius:
                              "12px",
                          }}
                        >
                          <small
                            style={{
                              color:
                                "#777",
                            }}
                          >
                            BID PRICE
                          </small>

                          <div
                            style={{
                              fontWeight:
                                "bold",
                              fontSize:
                                "19px",
                              marginTop:
                                "6px",
                            }}
                          >
                            ₹
                            {Number(
                              bid.bid_price ||
                                0
                            ).toFixed(
                              2
                            )}
                            /kg
                          </div>
                        </div>


                        <div
                          style={{
                            padding:
                              "17px",
                            background:
                              "#f8faf8",
                            borderRadius:
                              "12px",
                          }}
                        >
                          <small
                            style={{
                              color:
                                "#777",
                            }}
                          >
                            QUANTITY
                          </small>

                          <div
                            style={{
                              fontWeight:
                                "bold",
                              fontSize:
                                "19px",
                              marginTop:
                                "6px",
                            }}
                          >
                            {bid.quantity ||
                              0}{" "}
                            kg
                          </div>
                        </div>


                        <div
                          style={{
                            padding:
                              "17px",
                            background:
                              "#f8faf8",
                            borderRadius:
                              "12px",
                          }}
                        >
                          <small
                            style={{
                              color:
                                "#777",
                            }}
                          >
                            TOTAL VALUE
                          </small>

                          <div
                            style={{
                              fontWeight:
                                "bold",
                              fontSize:
                                "19px",
                              marginTop:
                                "6px",
                            }}
                          >
                            ₹
                            {totalValue.toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </div>

                      </div>


                      {/* CROP STATUS */}

                      {bid.listing_status && (
                        <div
                          style={{
                            marginTop:
                              "18px",
                            padding:
                              "14px 16px",
                            background:
                              "#f7f9f7",
                            borderRadius:
                              "10px",
                          }}
                        >
                          <strong>
                            🌾 Crop
                            Listing:
                          </strong>{" "}
                          {
                            bid.listing_status
                          }
                        </div>
                      )}


                      {/* STATUS MESSAGE */}

                      <div
                        style={{
                          marginTop:
                            "18px",
                          padding:
                            "16px",
                          borderRadius:
                            "12px",
                          background:
                            isAccepted
                              ? "#e8f5e9"
                              : isRejected
                              ? "#ffebee"
                              : "#fff8e1",
                        }}
                      >

                        {isAccepted && (
                          <>
                            <strong>
                              🎉 Bid
                              Accepted
                            </strong>

                            <p
                              style={{
                                margin:
                                  "6px 0 0",
                              }}
                            >
                              Your bid has
                              been accepted
                              by the
                              farmer.
                            </p>
                          </>
                        )}

                        {isRejected && (
                          <>
                            <strong>
                              ❌ Bid
                              Rejected
                            </strong>

                            <p
                              style={{
                                margin:
                                  "6px 0 0",
                              }}
                            >
                              Your bid was
                              rejected by
                              the farmer.
                            </p>
                          </>
                        )}

                        {isPending && (
                          <>
                            <strong>
                              ⏳ Awaiting
                              Farmer
                            </strong>

                            <p
                              style={{
                                margin:
                                  "6px 0 0",
                              }}
                            >
                              Your bid is
                              waiting for
                              the farmer's
                              response.
                            </p>
                          </>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}


        {/* =================================================
            FOOTER INFORMATION
        ================================================= */}

        {!loading &&
          bids.length > 0 && (
            <div
              style={{
                marginTop:
                  "30px",
                background:
                  "#ffffff",
                borderRadius:
                  "18px",
                padding: "25px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.05)",
              }}
            >

              <h3>
                🤝 Transparent Bidding
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                Your bids are recorded in
                the AgriTrust marketplace.
                You can monitor the status
                of each offer and see when
                a farmer accepts or rejects
                your bid.
              </p>

            </div>
          )}

      </div>
    </div>
  );
}

export default MyBids;