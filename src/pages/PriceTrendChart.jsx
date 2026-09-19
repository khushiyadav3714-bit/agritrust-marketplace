import React, { useEffect, useState } from "react";

function PriceTrendChart() {
  const BACKEND_URL = "http://127.0.0.1:8000";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPriceHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${BACKEND_URL}/market/price-history`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.message ||
              "Unable to fetch price history."
          );
        }

        if (!data.success) {
          throw new Error(
            data.message ||
              "Price history is unavailable."
          );
        }

        setHistory(data.history || []);
      } catch (err) {
        console.error(
          "Price history error:",
          err
        );

        setError(
          err.message ||
            "Unable to load price trend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPriceHistory();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.eyebrow}>
          MARKET ANALYTICS
        </div>

        <h2 style={styles.title}>
          📈 Tomato Price Trend
        </h2>

        <div style={styles.loading}>
          Loading price history...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.card}>
        <div style={styles.eyebrow}>
          MARKET ANALYTICS
        </div>

        <h2 style={styles.title}>
          📈 Tomato Price Trend
        </h2>

        <div style={styles.error}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!history.length) {
    return (
      <div style={styles.card}>
        <div style={styles.eyebrow}>
          MARKET ANALYTICS
        </div>

        <h2 style={styles.title}>
          📈 Tomato Price Trend
        </h2>

        <div style={styles.empty}>
          No historical market price data
          available.
        </div>
      </div>
    );
  }

  // =====================================================
  // PREPARE DATA
  // =====================================================

  const prices = history.map((item) =>
    Number(item.price)
  );

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Add some space above/below the line
  const chartMin = Math.max(
    0,
    Math.floor(minPrice - 2)
  );

  const chartMax =
    Math.ceil(maxPrice + 2);

  const chartWidth = 700;
  const chartHeight = 300;

  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 55;

  const graphWidth =
    chartWidth -
    paddingLeft -
    paddingRight;

  const graphHeight =
    chartHeight -
    paddingTop -
    paddingBottom;

  // =====================================================
  // CONVERT PRICE TO Y POSITION
  // =====================================================

  const getY = (price) => {
    if (chartMax === chartMin) {
      return (
        paddingTop +
        graphHeight / 2
      );
    }

    return (
      paddingTop +
      graphHeight -
      ((price - chartMin) /
        (chartMax - chartMin)) *
        graphHeight
    );
  };

  // =====================================================
  // CONVERT INDEX TO X POSITION
  // =====================================================

  const getX = (index) => {
    if (history.length === 1) {
      return (
        paddingLeft +
        graphWidth / 2
      );
    }

    return (
      paddingLeft +
      (index /
        (history.length - 1)) *
        graphWidth
    );
  };

  // =====================================================
  // CREATE LINE
  // =====================================================

  const points = history.map(
    (item, index) => ({
      x: getX(index),
      y: getY(Number(item.price)),
      price: Number(item.price),
      date: item.date,
    })
  );

  const linePoints = points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(" ");

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const parts =
      dateString.split("-");

    if (parts.length !== 3) {
      return dateString;
    }

    return `${parts[2]}/${parts[1]}`;
  };

  // =====================================================
  // MAIN CHART
  // =====================================================

  return (
    <div style={styles.card}>

      <div style={styles.header}>

        <div>
          <div style={styles.eyebrow}>
            MARKET ANALYTICS
          </div>

          <h2 style={styles.title}>
            📈 Tomato Price Trend
          </h2>

          <p style={styles.subtitle}>
            Bengaluru APMC - Binny Mill
            (FF&V)
          </p>
        </div>

        <div style={styles.currentBox}>

          <span>
            Latest Price
          </span>

          <strong>
            ₹
            {history[
              history.length - 1
            ].price.toFixed(2)}
            /kg
          </strong>

        </div>

      </div>

      <div style={styles.chartContainer}>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height="300"
          preserveAspectRatio="none"
        >

          {/* =================================================
              HORIZONTAL GRID LINES
          ================================================= */}

          {[0, 1, 2, 3, 4].map(
            (step) => {

              const price =
                chartMin +
                ((chartMax -
                  chartMin) /
                  4) *
                  step;

              const y =
                getY(price);

              return (
                <g key={step}>

                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={
                      chartWidth -
                      paddingRight
                    }
                    y2={y}
                    stroke="#e6eee8"
                    strokeWidth="1"
                  />

                  <text
                    x={
                      paddingLeft - 10
                    }
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#718078"
                  >
                    ₹
                    {price.toFixed(0)}
                  </text>

                </g>
              );
            }
          )}

          {/* =================================================
              PRICE LINE
          ================================================= */}

          <polyline
            points={linePoints}
            fill="none"
            stroke="#2f7d45"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* =================================================
              DATA POINTS
          ================================================= */}

          {points.map(
            (point, index) => (

              <g key={index}>

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#ffffff"
                  stroke="#2f7d45"
                  strokeWidth="3"
                />

                {/* PRICE ABOVE POINT */}

                <text
                  x={point.x}
                  y={
                    point.y - 12
                  }
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#285e38"
                >
                  ₹
                  {point.price.toFixed(
                    0
                  )}
                </text>

                {/* DATE BELOW */}

                <text
                  x={point.x}
                  y={
                    chartHeight -
                    25
                  }
                  textAnchor="middle"
                  fontSize="10"
                  fill="#718078"
                >
                  {formatDate(
                    point.date
                  )}
                </text>

              </g>
            )
          )}

        </svg>

      </div>

      <div style={styles.footer}>

        <span>
          ● AGMARKNET
        </span>

        <span>
          Historical tomato market
          prices
        </span>

      </div>

    </div>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

  card: {
    background: "#ffffff",
    border: "1px solid #e3ebe5",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow:
      "0 10px 28px rgba(35,70,45,0.06)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  eyebrow: {
    color: "#398452",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.4px",
    marginBottom: "6px",
  },

  title: {
    margin: "0",
    fontSize: "21px",
    color: "#183025",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#718078",
    fontSize: "12px",
  },

  currentBox: {
    background: "#edf8ef",
    borderRadius: "14px",
    padding: "11px 15px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: "115px",
  },

  currentBoxSpan: {
    fontSize: "10px",
    color: "#718078",
  },

  chartContainer: {
    width: "100%",
    overflowX: "auto",
    background: "#fbfdfb",
    borderRadius: "16px",
    padding: "8px",
    boxSizing: "border-box",
  },

  loading: {
    padding: "35px",
    textAlign: "center",
    color: "#718078",
    background: "#f7faf7",
    borderRadius: "14px",
  },

  error: {
    padding: "15px",
    background: "#fff1f1",
    border: "1px solid #f0cccc",
    borderRadius: "12px",
    color: "#a33d3d",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    background: "#f7faf7",
    borderRadius: "14px",
    color: "#718078",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop:
      "1px solid #edf1ee",
    color: "#718078",
    fontSize: "11px",
  },
};

export default PriceTrendChart;