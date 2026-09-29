import os
import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, status
from bson import ObjectId

from models.vegetable_model import vegetables_collection, serialize_vegetable

router = APIRouter()

# Ensure uploads directory exists
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# CREATE TOMATO LISTING
# ============================================================

@router.post("/tomato")
async def create_tomato_listing(
    farmer_name: str = Form("Farmer"),
    farmer_email: str = Form(""),
    quantity: float = Form(...),
    unit: str = Form("kg"),
    days_since_spray: int = Form(0),
    location: str = Form(""),
    freshness_score: Optional[float] = Form(None),
    quality_badge: Optional[str] = Form(None),
    pesticide_risk: Optional[str] = Form(None),
    image1: UploadFile = File(...)
):
    """Creates a new tomato crop listing with image upload and optional AI scores."""
    if quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than zero."
        )

    # Save uploaded image file
    ext = os.path.splitext(image1.filename)[1] or ".jpg"
    unique_filename = f"tomato_{uuid.uuid4().hex[:10]}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        content = await image1.read()
        with open(saved_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save image file: {str(e)}"
        )

    relative_image_path = f"uploads/{unique_filename}"
    default_market_price = 35.0
    recommended_price = round(default_market_price * 1.1, 2)

    # Determine default AI freshness if not provided
    calculated_freshness = freshness_score
    if calculated_freshness is None:
        if days_since_spray >= 7:
            calculated_freshness = 94.5
        elif days_since_spray >= 3:
            calculated_freshness = 85.0
        else:
            calculated_freshness = 72.0

    calculated_risk = pesticide_risk
    if not calculated_risk:
        if days_since_spray >= 7:
            calculated_risk = "Low Risk"
        elif days_since_spray >= 3:
            calculated_risk = "Medium Risk"
        else:
            calculated_risk = "High Risk"

    calculated_badge = quality_badge
    if not calculated_badge:
        if calculated_freshness >= 90 and calculated_risk == "Low Risk":
            calculated_badge = "Grade A Premium"
        elif calculated_freshness >= 80:
            calculated_badge = "Grade B Standard"
        else:
            calculated_badge = "Grade C Low Freshness"

    listing_doc = {
        "farmer_name": farmer_name.strip(),
        "farmer_email": farmer_email.strip().lower(),
        "vegetable_name": "Tomato",
        "quantity": float(quantity),
        "unit": unit,
        "days_since_spray": int(days_since_spray),
        "location": location.strip() or "Bengaluru, KA",
        "image1": relative_image_path,
        "image": relative_image_path,
        "market_price": default_market_price,
        "recommended_price": recommended_price,
        "price_per_kg": recommended_price,
        "freshness_score": float(calculated_freshness),
        "quality_badge": calculated_badge,
        "pesticide_risk": calculated_risk,
        "status": "Available",
        "created_at": datetime.utcnow()
    }

    result = vegetables_collection.insert_one(listing_doc)
    listing_doc["_id"] = result.inserted_id

    serialized = serialize_vegetable(listing_doc)
    serialized["success"] = True
    serialized["message"] = "Tomato listing created successfully."
    serialized["listing_id"] = str(result.inserted_id)

    return serialized


# ============================================================
# GET ALL TOMATO LISTINGS
# ============================================================

@router.get("/tomatoes")
def get_all_tomatoes():
    """Returns all available tomato crop listings."""
    listings = list(
        vegetables_collection.find().sort("created_at", -1)
    )

    serialized_list = [serialize_vegetable(item) for item in listings]

    return {
        "success": True,
        "tomatoes": serialized_list
    }


# ============================================================
# GET FARMER RANKINGS BASED ON AI FRESHNESS SCORE
# ============================================================

@router.get("/farmer-rankings")
def get_farmer_rankings():
    """Calculates and returns farmer rankings based on AI freshness score."""
    listings = list(vegetables_collection.find())

    farmer_map = {}
    for item in listings:
        email = item.get("farmer_email", "unknown@farmer.com").strip().lower()
        name = item.get("farmer_name", "Farmer").strip()
        location = item.get("location", "Karnataka").strip() or "Karnataka"

        freshness = item.get("freshness_score")
        if freshness is None or not isinstance(freshness, (int, float)):
            days = item.get("days_since_spray", 7)
            if days >= 7:
                freshness = 94.5
            elif days >= 3:
                freshness = 85.0
            else:
                freshness = 70.0

        if email not in farmer_map:
            farmer_map[email] = {
                "farmer_name": name,
                "farmer_email": email,
                "location": location,
                "total_crops": 0,
                "freshness_scores": [],
                "grade_a_count": 0
            }

        farmer_map[email]["total_crops"] += 1
        farmer_map[email]["freshness_scores"].append(float(freshness))
        if float(freshness) >= 90:
            farmer_map[email]["grade_a_count"] += 1

    rankings = []
    for email, info in farmer_map.items():
        avg_score = round(sum(info["freshness_scores"]) / len(info["freshness_scores"]), 1)
        rankings.append({
            "farmer_name": info["farmer_name"],
            "farmer_email": info["farmer_email"],
            "location": info["location"],
            "total_crops": info["total_crops"],
            "avg_freshness_score": avg_score,
            "grade_a_count": info["grade_a_count"]
        })

    # Sort descending by average freshness score
    rankings.sort(key=lambda x: x["avg_freshness_score"], reverse=True)

    # Assign rank positions & badges
    for idx, f in enumerate(rankings):
        f["rank"] = idx + 1
        if idx == 0:
            f["badge_key"] = "top_quality_badge"
            f["badge_default"] = "🏆 #1 Top Quality Farmer"
        elif idx == 1:
            f["badge_key"] = "grade_a_badge"
            f["badge_default"] = "🥈 #2 Grade A Producer"
        elif idx == 2:
            f["badge_key"] = "premium_badge"
            f["badge_default"] = "🥉 #3 Premium Grower"
        else:
            f["badge_key"] = "top_rated_badge"
            f["badge_default"] = "⭐ Top Rated Farmer"

    return {
        "success": True,
        "rankings": rankings
    }


# ============================================================
# GET FARMER'S CROPS
# ============================================================

@router.get("/my-crops/{farmer_email}")
def get_my_crops(farmer_email: str):
    """Returns crop listings for a specific farmer by email."""
    email = farmer_email.strip().lower()

    listings = list(
        vegetables_collection.find({"farmer_email": email}).sort("created_at", -1)
    )

    serialized_list = [serialize_vegetable(item) for item in listings]

    return {
        "success": True,
        "tomatoes": serialized_list,
        "crops": serialized_list
    }


# ============================================================
# GET SINGLE LISTING BY ID
# ============================================================

@router.get("/{listing_id}")
def get_listing_by_id(listing_id: str):
    """Returns a single crop listing by ID."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid listing ID format."
        )

    listing = vegetables_collection.find_one({"_id": obj_id})

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    serialized = serialize_vegetable(listing)
    serialized["success"] = True

    return serialized
