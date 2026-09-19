import React from "react";
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


function App() {

  const path =
    window.location.pathname;


  // =====================================================
  // REGISTER
  // =====================================================

  if (path === "/register") {

    return <Register />;

  }


  // =====================================================
  // LOGIN
  // =====================================================

  if (
    path === "/" ||
    path === "/login"
  ) {

    return <Login />;

  }


  // =====================================================
  // FARMER DASHBOARD
  // =====================================================

  if (
    path === "/dashboard" ||
    path === "/farmer-dashboard"
  ) {

    return <FarmerDashboard />;

  }


  // =====================================================
  // TOMATO CROP + AI ANALYSIS
  // =====================================================

  if (
    path === "/crops" ||
    path === "/ai-prediction"
  ) {

    return <Crops />;

  }


  // =====================================================
  // LIVE MARKET PRICES
  // =====================================================

  if (path === "/market-prices") {

    return <MarketPrices />;

  }


  // =====================================================
  // FARMER: BUYER BIDS
  // =====================================================

  if (path === "/buyer-bids") {

    return <BuyerBids />;

  }


  // =====================================================
  // FARMER: MY CROPS
  // =====================================================

  if (path === "/my-crops") {

    return <MyCrops />;

  }


  // =====================================================
  // BUYER DASHBOARD
  // =====================================================

  if (path === "/buyer-dashboard") {

    return <BuyerDashboard />;

  }


  // =====================================================
  // BUYER: MY BIDS
  // =====================================================

  if (path === "/my-bids") {

    return <MyBids />;

  }


  // =====================================================
  // AVAILABLE FARMER CROPS
  // =====================================================

  if (path === "/available-crops") {

    return <AvailableCrops />;

  }


  // =====================================================
  // PLACE BID
  // =====================================================

  if (path === "/place-bid") {

    return <PlaceBid />;

  }


  // =====================================================
  // DEFAULT
  // =====================================================

  return <Login />;

}


export default App;