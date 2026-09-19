import React, { useEffect, useState } from "react";

function BuyerBids() {

  const [listingId, setListingId] = useState("");
  const [bids, setBids] = useState([]);

  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =====================================================
  // FARMER ACCESS
  // =====================================================

  const [isFarmer, setIsFarmer] = useState(false);


  // =====================================================
  // GET FARMER + TOMATO LISTING ID
  // =====================================================

  useEffect(() => {

    const savedFarmer =
      localStorage.getItem("agritrust_farmer");

    const savedUser =
      localStorage.getItem("agritrust_user");

    let farmerFound = false;


    // =================================================
    // CHECK FARMER ACCOUNT
    // =================================================

    try {

      if (savedFarmer) {

        const farmer =
          JSON.parse(savedFarmer);

        if (farmer.role === "farmer") {

          farmerFound = true;

        }

      }


      // =================================================
      // ALSO CHECK CURRENT USER
      // =================================================

      if (!farmerFound && savedUser) {

        const user =
          JSON.parse(savedUser);

        if (user.role === "farmer") {

          farmerFound = true;

        }

      }

    } catch (error) {

      console.error(
        "Unable to verify farmer login:",
        error
      );

    }


    // =================================================
    // SAVE FARMER ACCESS STATUS
    // =================================================

    setIsFarmer(
      farmerFound
    );


    // =================================================
    // STOP IF NOT FARMER
    // =================================================

    if (!farmerFound) {

      return;

    }


    // =================================================
    // GET TOMATO LISTING ID
    // =================================================

    const savedListingId =
      localStorage.getItem(
        "tomatoListingId"
      );


    if (savedListingId) {

      setListingId(
        savedListingId
      );

      fetchBids(
        savedListingId
      );

    }

  }, []);


  // =====================================================
  // GET BUYER BIDS
  // =====================================================

  const fetchBids = async (id) => {

    if (!id) {

      return;

    }


    setLoading(
      true
    );

    setError("");


    try {

      const response = await fetch(
        `http://127.0.0.1:8000/bid/bids/${id}`
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          "Unable to fetch bids."
        );

      }


      if (!data.success) {

        throw new Error(
          data.message ||
          "Unable to fetch bids."
        );

      }


      setBids(
        data.bids || []
      );


    } catch (err) {

      console.error(
        "Bid loading error:",
        err
      );


      setError(
        err.message ||
        "Unable to connect to the server."
      );


    } finally {

      setLoading(
        false
      );

    }

  };


  // =====================================================
  // ACCEPT BID
  // =====================================================

  const acceptBid = async (bidId) => {

    setAccepting(
      bidId
    );

    setError("");
    setMessage("");


    try {

      const response = await fetch(
        `http://127.0.0.1:8000/bid/bids/${bidId}/accept`,
        {
          method: "PUT",
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          data.message ||
          "Unable to accept bid."
        );

      }


      if (!data.success) {

        throw new Error(
          data.message ||
          "Unable to accept bid."
        );

      }


      setMessage(
        "✅ Bid accepted successfully. Other pending bids have been rejected."
      );


      // =================================================
      // REFRESH BIDS
      // =================================================

      fetchBids(
        listingId
      );


    } catch (err) {

      console.error(
        "Accept bid error:",
        err
      );


      setError(
        err.message ||
        "Unable to accept the bid."
      );


    } finally {

      setAccepting(
        null
      );

    }

  };


  // =====================================================
  // FIND ACCEPTED BID
  // =====================================================

  const acceptedBid =
    bids.find(
      (bid) =>
        bid.status === "Accepted"
    );


  // =====================================================
  // FARMER ACCESS CHECK
  // =====================================================

  if (!isFarmer) {

    return (

      <div
        style={{
          textAlign: "center",
          padding: "60px",
        }}
      >

        <h1>
          🔒 Farmer Access Only
        </h1>


        <p>
          Only the farmer who created the
          tomato listing can view and
          manage buyer bids.
        </p>


        <button
          onClick={() => {

            window.location.href =
              "/login";

          }}
        >
          Go to Login
        </button>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="buyer-bids-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="buyer-bids-header">

        <button
          className="back-btn"
          onClick={() => {

            window.location.href =
              "/dashboard";

          }}
        >
          ← Dashboard
        </button>


        <div>

          <h1>
            🤝 Tomato Buyer Bids
          </h1>


          <p>
            View and manage bids received
            for your tomato crop.
          </p>

        </div>

      </header>


      {/* =================================================
          LISTING ID
      ================================================= */}

      {!listingId && (

        <div className="bid-card">

          <h2>
            🍅 Tomato Listing
          </h2>


          <p>
            No tomato listing has been
            selected yet.
          </p>


          <p className="bid-help-text">

            Your tomato listing ID will be
            connected automatically when the
            crop listing feature is completed.

          </p>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="bid-card">

          <h2>
            Loading bids...
          </h2>


          <p>
            Please wait while we fetch the
            latest tomato buyer bids.
          </p>

        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="bid-error">

          ⚠️ {error}

        </div>

      )}


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (

        <div className="bid-success">

          {message}

        </div>

      )}


      {/* =================================================
          ACCEPTED BID
      ================================================= */}

      {acceptedBid && (

        <div className="accepted-bid-card">

          <h2>
            ✅ Accepted Tomato Bid
          </h2>


          <div className="accepted-details">

            <p>

              <strong>
                Buyer:
              </strong>{" "}

              {acceptedBid.buyer_name}

            </p>


            <p>

              <strong>
                Bid Price:
              </strong>{" "}

              ₹{acceptedBid.bid_price}/kg

            </p>


            <p>

              <strong>
                Quantity:
              </strong>{" "}

              {acceptedBid.quantity} kg

            </p>


            <p>

              <strong>
                Status:
              </strong>{" "}

              Accepted

            </p>

          </div>


          <div className="sold-message">

            🍅 Your tomato listing has been
            marked as <strong>SOLD</strong>.

          </div>

        </div>

      )}


      {/* =================================================
          NO BIDS
      ================================================= */}

      {listingId &&
        !loading &&
        bids.length === 0 && (

        <div className="bid-card">

          <h2>
            No Buyer Bids Yet
          </h2>


          <p>
            Buyers have not placed any bids
            for this tomato listing yet.
          </p>

        </div>

      )}


      {/* =================================================
          BIDS
      ================================================= */}

      {bids.length > 0 && (

        <div className="bids-container">


          <div className="bids-title">

            <h2>
              🍅 Tomato Bids
            </h2>


            <span>

              {bids.length} bid
              {bids.length !== 1
                ? "s"
                : ""}

            </span>

          </div>


          {bids.map(
            (bid, index) => (

            <div
              className="bid-card"
              key={bid._id}
            >


              {/* =========================================
                  BID HEADER
              ========================================= */}

              <div className="bid-header">

                <div>

                  <h3>
                    👤 {bid.buyer_name}
                  </h3>


                  <p>
                    Bid #{index + 1}
                  </p>

                </div>


                <div
                  className={
                    `bid-status ${
                      bid.status.toLowerCase()
                    }`
                  }
                >

                  {bid.status}

                </div>

              </div>


              {/* =========================================
                  BID DETAILS
              ========================================= */}

              <div className="bid-details">


                <div className="bid-detail">

                  <span>
                    Bid Price
                  </span>


                  <strong>
                    ₹{bid.bid_price}/kg
                  </strong>

                </div>


                <div className="bid-detail">

                  <span>
                    Quantity
                  </span>


                  <strong>
                    {bid.quantity} kg
                  </strong>

                </div>


                <div className="bid-detail">

                  <span>
                    Buyer Email
                  </span>


                  <strong>
                    {bid.buyer_email}
                  </strong>

                </div>


                <div className="bid-detail">

                  <span>
                    Bid Status
                  </span>


                  <strong>
                    {bid.status}
                  </strong>

                </div>


              </div>


              {/* =========================================
                  ACCEPT BUTTON
              ========================================= */}

              {bid.status === "Pending" && (

                <button
                  className="accept-bid-btn"

                  onClick={() =>
                    acceptBid(
                      bid._id
                    )
                  }

                  disabled={
                    accepting === bid._id ||
                    !!acceptedBid
                  }
                >

                  {accepting === bid._id
                    ? "Accepting..."
                    : "✅ Accept Bid"
                  }

                </button>

              )}


              {/* =========================================
                  ACCEPTED
              ========================================= */}

              {bid.status === "Accepted" && (

                <div className="accepted-label">

                  ✅ This bid was accepted

                </div>

              )}


              {/* =========================================
                  REJECTED
              ========================================= */}

              {bid.status === "Rejected" && (

                <div className="rejected-label">

                  ❌ This bid was rejected

                </div>

              )}

            </div>

          ))}

        </div>

      )}


      {/* =================================================
          TRANSPARENCY MESSAGE
      ================================================= */}

      <div className="transparency-card">

        <h2>
          🔐 Transparent Bidding
        </h2>


        <p>
          All buyer bids are displayed clearly
          so the farmer can compare offers before
          accepting a bid.
        </p>


        <p>
          Once a bid is accepted, the selected
          bid is marked as accepted and other
          pending bids are automatically rejected.
        </p>

      </div>


    </div>

  );

}

export default BuyerBids;