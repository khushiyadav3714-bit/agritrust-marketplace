import React, { useEffect, useState } from "react";

function MarketPrices() {

  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH LIVE TOMATO MARKET PRICE
  // =====================================================

  useEffect(() => {

    const fetchMarketPrice = async () => {

      try {

        setLoading(true);
        setError("");


        const response = await fetch(
          "http://127.0.0.1:8000/market/market-price"
        );


        const data = await response.json();


        console.log(
          "MARKET PRICE RESPONSE:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.detail ||
            data.message ||
            "Unable to fetch market price."
          );

        }


        // -------------------------------------------------
        // Backend says price unavailable
        // -------------------------------------------------

        if (data.success === false) {

          throw new Error(
            data.message ||
            "Market price is currently unavailable."
          );

        }


        setMarket(data);

      }


      catch (err) {

        console.error(
          "Market price error:",
          err
        );


        setError(
          err.message ||
          "Unable to connect to market server."
        );

      }


      finally {

        setLoading(false);

      }

    };


    fetchMarketPrice();

  }, []);


  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  const goToDashboard = () => {

    window.location.href = "/dashboard";

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="market-page">

        <button
          onClick={goToDashboard}
        >
          ← Dashboard
        </button>


        <div className="market-header">

          <h1>
            📊 Live Market Prices
          </h1>

          <p>
            Current tomato market information
            from Bengaluru APMC.
          </p>

        </div>


        <div className="market-card">

          <p>
            🔄 Loading current tomato market price...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="market-page">

        <button
          onClick={goToDashboard}
        >
          ← Dashboard
        </button>


        <div className="market-header">

          <h1>
            📊 Live Market Prices
          </h1>

          <p>
            Current tomato market information
            from Bengaluru APMC.
          </p>

        </div>


        <div className="error-message">

          ⚠️ {error}

        </div>

      </div>

    );

  }


  // =====================================================
  // NO MARKET DATA
  // =====================================================

  if (!market) {

    return (

      <div className="market-page">

        <button
          onClick={goToDashboard}
        >
          ← Dashboard
        </button>


        <div className="market-header">

          <h1>
            📊 Live Market Prices
          </h1>

        </div>


        <div className="error-message">

          ⚠️ Market price is currently unavailable.

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN MARKET PAGE
  // =====================================================

  return (

    <div className="market-page">


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        onClick={goToDashboard}
      >
        ← Dashboard
      </button>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="market-header">

        <h1>
          📊 Live Market Prices
        </h1>

        <p>
          Current tomato market information
          from Bengaluru APMC.
        </p>

      </div>


      {/* =================================================
          TOMATO MARKET CARD
      ================================================= */}

      <div className="market-card">


        <div className="market-icon">
          🍅
        </div>


        <h2>
          {market.commodity || "Tomato"}
        </h2>


        <p className="market-name">

          {market.market ||
            "Bengaluru APMC - Binny Mill (FF&V)"}

        </p>


        {/* =================================================
            CURRENT PRICE
        ================================================= */}

        <div className="market-price">

          ₹{market.market_price}

          <span>
            /kg
          </span>

        </div>


        {/* =================================================
            PRICE UNIT
        ================================================= */}

        <p>

          Price Unit:{" "}

          {market.market_price_unit ||
            "Rs/kg"}

        </p>


        {/* =================================================
            SOURCE
        ================================================= */}

        <p className="market-source">

          🌐{" "}

          {market.source ||
            "AGMARKNET - Bengaluru APMC"}

        </p>

      </div>


      {/* =================================================
          TRANSPARENCY SECTION
      ================================================= */}

      <div className="market-info">

        <h2>
          🔍 Transparent Market Information
        </h2>


        <p>

          The displayed price is the current
          market reference price fetched from
          AGMARKNET for Bengaluru APMC.

        </p>


        <p>

          This market price is shown directly
          without reducing it based on AI
          freshness score or pesticide risk.

        </p>


        <p>

          Farmers can use this reference price
          to compare buyer bids and make an
          informed selling decision.

        </p>

      </div>


      {/* =================================================
          FARMER TRANSPARENCY NOTE
      ================================================= */}

      <div className="market-note">

        <h3>
          🤝 Fair Pricing
        </h3>


        <p>

          AgriTrust provides the market reference
          price transparently so that farmers and
          buyers can compare offers fairly.

        </p>

      </div>

    </div>

  );

}


export default MarketPrices;