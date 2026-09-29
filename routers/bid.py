from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Form, HTTPException, status, Request
from bson import ObjectId

from models.bid_model import bids_collection, serialize_bid
from models.vegetable_model import vegetables_collection

router = APIRouter()


# ============================================================
# HELPER FUNCTIONS
# ============================================================

async def place_bid_internal(
    listing_id: str,
    buyer_name: Optional[str] = None,
    buyer_email: Optional[str] = None,
    bid_price: Optional[float] = None,
    quantity: Optional[float] = None,
    request: Request = None
):
    # Fallback to JSON body if Form fields are missing
    if (buyer_name is None or buyer_email is None or bid_price is None or quantity is None) and request:
        try:
            body = await request.json()
            buyer_name = buyer_name or body.get("buyer_name", "Buyer")
            buyer_email = buyer_email or body.get("buyer_email", "")
            bid_price = bid_price if bid_price is not None else body.get("bid_price")
            quantity = quantity if quantity is not None else body.get("quantity")
        except Exception:
            pass

    try:
        listing_obj_id = ObjectId(listing_id)
    except Exception:
        return {"success": False, "message": "Invalid listing ID."}

    listing = vegetables_collection.find_one({"_id": listing_obj_id})
    if not listing:
        return {"success": False, "message": "Listing not found."}

    try:
        bid_price = float(bid_price)
        quantity = float(quantity)
    except Exception:
        return {"success": False, "message": "Bid price and quantity must be valid numbers."}

    if bid_price <= 0:
        return {"success": False, "message": "Bid price must be greater than zero."}

    if quantity <= 0:
        return {"success": False, "message": "Quantity must be greater than zero."}

    available_qty = float(listing.get("quantity", 0))
    if quantity > available_qty:
        return {"success": False, "message": f"Only {available_qty} kg is available."}

    bid_data = {
        "listing_id": listing_obj_id,
        "buyer_name": (buyer_name or "Buyer").strip(),
        "buyer_email": (buyer_email or "").strip().lower(),
        "bid_price": bid_price,
        "quantity": quantity,
        "status": "Pending",
        "created_at": datetime.utcnow()
    }

    result = bids_collection.insert_one(bid_data)
    bid_data["_id"] = result.inserted_id

    serialized = serialize_bid(bid_data)
    serialized["success"] = True
    serialized["message"] = "Bid placed successfully."
    serialized["bid_id"] = str(result.inserted_id)

    return serialized


def get_listing_bids_internal(listing_id: str):
    try:
        listing_obj_id = ObjectId(listing_id)
    except Exception:
        return {"success": False, "message": "Invalid listing ID.", "bids": []}

    bids = list(
        bids_collection.find({"listing_id": listing_obj_id}).sort("bid_price", -1)
    )

    serialized_bids = [serialize_bid(b) for b in bids]

    return {
        "success": True,
        "listing_id": listing_id,
        "count": len(serialized_bids),
        "bids": serialized_bids
    }


def accept_bid_internal(bid_id: str):
    try:
        bid_obj_id = ObjectId(bid_id)
    except Exception:
        return {"success": False, "message": "Invalid bid ID."}

    bid = bids_collection.find_one({"_id": bid_obj_id})
    if not bid:
        return {"success": False, "message": "Bid not found."}

    now = datetime.utcnow()

    # Update bid status to Accepted
    bids_collection.update_one(
        {"_id": bid_obj_id},
        {"$set": {"status": "Accepted", "accepted_at": now}}
    )

    # Update listing status to Accepted
    listing_id = bid.get("listing_id")
    if listing_id:
        vegetables_collection.update_one(
            {"_id": listing_id},
            {"$set": {"status": "Accepted", "accepted_bid_id": str(bid_obj_id)}}
        )

    return {
        "success": True,
        "message": "Bid accepted successfully.",
        "bid_id": bid_id,
        "status": "Accepted"
    }


# ============================================================
# ENDPOINTS
# ============================================================

@router.post("/bid/{listing_id}")
async def place_bid_route(
    listing_id: str,
    buyer_name: Optional[str] = Form(None),
    buyer_email: Optional[str] = Form(None),
    bid_price: Optional[float] = Form(None),
    quantity: Optional[float] = Form(None),
    request: Request = None
):
    return await place_bid_internal(
        listing_id, buyer_name, buyer_email, bid_price, quantity, request
    )


@router.post("/{listing_id}")
async def place_bid_route_alt(
    listing_id: str,
    buyer_name: Optional[str] = Form(None),
    buyer_email: Optional[str] = Form(None),
    bid_price: Optional[float] = Form(None),
    quantity: Optional[float] = Form(None),
    request: Request = None
):
    return await place_bid_internal(
        listing_id, buyer_name, buyer_email, bid_price, quantity, request
    )


@router.get("/bids/{listing_id}")
def get_bids_route(listing_id: str):
    return get_listing_bids_internal(listing_id)


@router.put("/bids/{bid_id}/accept")
def accept_bid_route(bid_id: str):
    return accept_bid_internal(bid_id)


@router.get("/my-bids/{buyer_email}")
def get_my_bids_route(buyer_email: str):
    email = buyer_email.strip().lower()
    bids = list(
        bids_collection.find({"buyer_email": email}).sort("created_at", -1)
    )

    serialized_bids = []
    for bid in bids:
        s_bid = serialize_bid(bid)
        listing_id = bid.get("listing_id")
        if listing_id:
            listing = vegetables_collection.find_one({"_id": listing_id})
            if listing:
                s_bid["crop_name"] = listing.get("vegetable_name", "Tomato")
                s_bid["location"] = listing.get("location", "")
                s_bid["image"] = listing.get("image1") or listing.get("image")
                s_bid["farmer_name"] = listing.get("farmer_name", "")
        serialized_bids.append(s_bid)

    return {
        "success": True,
        "buyer_email": email,
        "count": len(serialized_bids),
        "bids": serialized_bids
    }


@router.post("/skip/{listing_id}")
@router.post("/skip-feedback/{listing_id}")
def skip_listing_route(listing_id: str):
    return {
        "success": True,
        "message": "Listing skipped successfully.",
        "listing_id": listing_id
    }
