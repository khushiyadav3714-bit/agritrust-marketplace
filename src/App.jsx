import React, { useEffect, useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import Crops from "./pages/Crops";
import MarketPrices from "./pages/MarketPrices";
import BuyerBids from "./pages/BuyerBids";
import MyCrops from "./pages/MyCrops";
import BuyerDashboard from "./pages/BuyerDashboard";
import AvailableCrops from "./pages/AvailableCrops";
import PlaceBid from "./pages/PlaceBid";
import MyBids from "./pages/MyBids";

import { LanguageProvider } from "./context/LanguageContext";

// Default demo profiles so the user NEVER gets blocked or asked to re-register
export const DEFAULT_FARMER = {
  name: "Ramesh Kumar (Farmer)",
  email: "ramesh.farmer@agritrust.com",
  role: "farmer",
  location: "Bengaluru Rural, KA",
  phone: "9876543210"
};

export const DEFAULT_BUYER = {
  name: "Suresh Agro Traders (Buyer)",
  email: "suresh.buyer@agritrust.com",
  role: "buyer",
  location: "Binny Mill APMC Yard, Bengaluru",
  phone: "9123456789"
};

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Ensure active user session exists to prevent registration blocking
    const savedUser = localStorage.getItem("agritrust_user");
    if (!savedUser) {
      localStorage.setItem("agritrust_user", JSON.stringify(DEFAULT_FARMER));
      localStorage.setItem("agritrust_farmer", JSON.stringify(DEFAULT_FARMER));
    }
  }, []);

  const path = currentPath;

  // Navigation handlers
  if (path === "/register") {
    return <Register />;
  }

  if (path === "/login") {
    return <Login />;
  }

  // Root "/" defaults to Buyer Dashboard or Farmer Dashboard seamlessly based on user role
  if (path === "/" || path === "/dashboard" || path === "/farmer-dashboard") {
    const savedUser = localStorage.getItem("agritrust_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "buyer") return <BuyerDashboard />;
      } catch (e) {}
    }
    return <FarmerDashboard />;
  }

  if (path === "/crops" || path === "/ai-prediction") {
    return <Crops />;
  }

  if (path === "/market-prices") {
    return <MarketPrices />;
  }

  if (path === "/buyer-bids") {
    return <BuyerBids />;
  }

  if (path === "/my-crops") {
    return <MyCrops />;
  }

  if (path === "/buyer-dashboard") {
    return <BuyerDashboard />;
  }

  if (path === "/my-bids") {
    return <MyBids />;
  }

  if (path === "/available-crops") {
    return <AvailableCrops />;
  }

  if (path === "/place-bid") {
    return <PlaceBid />;
  }

  // Fallback to Farmer Dashboard
  return <FarmerDashboard />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}