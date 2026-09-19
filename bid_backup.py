from fastapi import APIRouter, Form
from datetime import datetime
from bson import ObjectId

from models.bid_model import bids_collection
from models.vegetable_model import vegetables_collection


router = APIRouter()


# ============================================================
# PLACE A BID
# ============================================================

@router.post("/bid/{listing_id}")
def place_bid(
    listing_id: str,
    buyer_name: str = Form(...),
    buyer_email: str = Form(...),
    bid_price: float = Form(...),
    quantity: float = Form(...)
):

    # --------------------------------------------------------
    # 1. Validate listing ID
    # --------------------------------------------------------

    try:
        listing_object_id = ObjectId(listing_id)

    except Exception:
        return {
            "success": False,
            "message": "Invalid listing ID."
        }


    # --------------------------------------------------------
    # 2. Find the vegetable listing
    # --------------------------------------------------------

    listing = vegetables_collection.find_one(
        {
            "_id": listing_object_id
        }
    )

    if not listing:
        return {
            "success": False,
            "message": "Listing not found."
        }


    # --------------------------------------------------------
    # 3. Validate bid price
    # --------------------------------------------------------

    if bid_price <= 0:
        return {
            "success": False,
            "message": "Bid price must be greater than zero."
        }


    # --------------------------------------------------------
    # 4. Validate quantity
    # --------------------------------------------------------

    if quantity <= 0:
        return {
            "success": False,
            "message": "Quantity must be greater than zero."
        }


    # --------------------------------------------------------
    # 5. Check available quantity
    # --------------------------------------------------------

    available_quantity = listing.get("quantity", 0)

    try:
        available_quantity = float(available_quantity)
    except Exception:
        available_quantity = 0


    if quantity > available_quantity:
        return {
            "success": False,
            "message": (
                f"Only {available_quantity} kg is available."
            )
        }


    # --------------------------------------------------------
    # 6. Create bid
    # --------------------------------------------------------

    bid_data = {
        "listing_id": listing_object_id,
        "buyer_name": buyer_name,
        "buyer_email": buyer_email,
        "bid_price": bid_price,
        "quantity": quantity,
        "status": "Pending",
        "created_at": datetime.utcnow()
    }


    # --------------------------------------------------------
    # 7. Save bid to MongoDB
    # --------------------------------------------------------

    result = bids_collection.insert_one(
        bid_data
    )


    # --------------------------------------------------------
    # 8. Return response
    # --------------------------------------------------------

    return {
        "success": True,
        "message": "Bid placed successfully.",
        "bid_id": str(result.inserted_id),
        "listing_id": listing_id,
        "buyer_name": buyer_name,
        "bid_price": bid_price,
        "quantity": quantity,
        "status": "Pending"
    }


# ============================================================
# GET ALL BIDS FOR A LISTING
# ============================================================

@router.get("/bids/{listing_id}")
def get_listing_bids(
    listing_id: str
):

    # --------------------------------------------------------
    # 1. Validate listing ID
    # --------------------------------------------------------

    try:
        listing_object_id = ObjectId(listing_id)

    except Exception:
        return {
            "success": False,
            "message": "Invalid listing ID."
        }


    # --------------------------------------------------------
    # 2. Check listing exists
    # --------------------------------------------------------

    listing = vegetables_collection.find_one(
        {
            "_id": listing_object_id
        }
    )

    if not listing:
        return {
            "success": False,
            "message": "Listing not found."
        }


    # --------------------------------------------------------
    # 3. Get all bids
    # --------------------------------------------------------

    bids = list(
        bids_collection.find(
            {
                "listing_id": listing_object_id
            }
        ).sort(
            "bid_price",
            -1
        )
    )


    # --------------------------------------------------------
    # 4. Convert MongoDB IDs to strings
    # --------------------------------------------------------

    for bid in bids:

        bid["_id"] = str(
            bid["_id"]
        )

        bid["listing_id"] = str(
            bid["listing_id"]
        )


        # Convert datetime so it can be returned as JSON
        if "created_at" in bid:
            bid["created_at"] = bid["created_at"].isoformat()


        if "accepted_at" in bid:
            bid["accepted_at"] = bid["accepted_at"].isoformat()


    # --------------------------------------------------------
    # 5. Return bids
    # --------------------------------------------------------

    return {
        "success": True,
        "listing_id": listing_id,
        "count": len(bids),
        "bids": bids
    }


# ============================================================
# ACCEPT A BID
# ============================================================

@router.put("/bids/{bid_id}/accept")
def accept_bid(
    bid_id: str
):

    # --------------------------------------------------------
    # 1. Validate bid ID
    # --------------------------------------------------------

    try:
        bid_object_id = ObjectId(bid_id)

    except Exception:
        return {
            "success": False,
            "message": "Invalid bid ID."
        }


    # --------------------------------------------------------
    # 2. Find the bid
    # --------------------------------------------------------

    bid = bids_collection.find_one(
        {
            "_id": bid_object_id
        }
    )

    if not bid:
        return {
            "success": False,
            "message": "Bid not found."
        }


    # --------------------------------------------------------
    # 3. Check bid status
    # --------------------------------------------------------

    if bid.get("status") != "Pending":

        return {
            "success": False,
            "message": "This bid has already been processed."
        }


    # --------------------------------------------------------
    # 4. Accept selected bid
    # --------------------------------------------------------

    bids_collection.update_one(

        {
            "_id": bid_object_id
        },

        {
            "$set": {
                "status": "Accepted",
                "accepted_at": datetime.utcnow()
            }
        }
    )


    # --------------------------------------------------------
    # 5. Reject all other pending bids
    # --------------------------------------------------------

    bids_collection.update_many(

        {
            "listing_id": bid["listing_id"],
            "_id": {
                "$ne": bid_object_id
            },
            "status": "Pending"
        },

        {
            "$set": {
                "status": "Rejected"
            }
        }
    )


    # --------------------------------------------------------
    # 6. Mark vegetable listing as SOLD
    # --------------------------------------------------------

    vegetables_collection.update_one(

        {
            "_id": bid["listing_id"]
        },

        {
            "$set": {
                "status": "Sold",
                "accepted_bid_id": bid_object_id
            }
        }
    )


    # --------------------------------------------------------
    # 7. Return response
    # --------------------------------------------------------

    return {

        "success": True,

        "message": "Bid accepted successfully.",

        "bid_id": bid_id,

        "listing_id": str(
            bid["listing_id"]
        ),

        "buyer_name": bid["buyer_name"],

        "buyer_email": bid.get(
            "buyer_email",
            ""
        ),

        "bid_price": bid["bid_price"],

        "quantity": bid["quantity"],

        "status": "Accepted",

        "listing_status": "Sold"
    }












    from fastapi import APIRouter, Form
from datetime import datetime
from bson import ObjectId

from models.bid_model import bids_collection
from models.vegetable_model import vegetables_collection


router = APIRouter()


# ============================================================
# PLACE A BID
# ============================================================

@router.post("/bid/{listing_id}")
def place_bid(
    listing_id: str,
    buyer_name: str = Form(...),
    buyer_email: str = Form(...),
    bid_price: float = Form(...),
    quantity: float = Form(...)
):

    # --------------------------------------------------------
    # 1. Validate listing ID
    # --------------------------------------------------------

    try:
        listing_object_id = ObjectId(listing_id)

    except Exception:
        return {
            "success": False,
            "message": "Invalid listing ID."
        }


    # --------------------------------------------------------
    # 2. Find the vegetable listing
    # --------------------------------------------------------

    listing = vegetables_collection.find_one(
        {
            "_id": listing_object_id
        }
    )

    if not listing:
        return {
            "success": False,
            "message": "Listing not found."
        }


    # --------------------------------------------------------
    # 3. Prevent bidding on sold listing
    # --------------------------------------------------------

    if listing.get("status") == "Sold":

        return {
            "success": False,
            "message": "This crop has already been sold."
        }


    # --------------------------------------------------------
    # 4. Validate bid price
    # --------------------------------------------------------

    if bid_price <= 0:

        return {
            "success": False,
            "message": "Bid price must be greater than zero."
        }


    # --------------------------------------------------------
    # 5. Validate quantity
    # --------------------------------------------------------

    if quantity <= 0:

        return {
            "success": False,
            "message": "Quantity must be greater than zero."
        }


    # --------------------------------------------------------
    # 6. Check available quantity
    # --------------------------------------------------------

    available_quantity = listing.get(
        "quantity",
        0
    )

    try:

        available_quantity = float(
            available_quantity
        )

    except Exception:

        available_quantity = 0


    if quantity > available_quantity:

        return {
            "success": False,
            "message": (
                f"Only {available_quantity} kg is available."
            )
        }


    # --------------------------------------------------------
    # 7. Create bid
    # --------------------------------------------------------

    bid_data = {

        "listing_id": listing_object_id,

        "buyer_name": buyer_name,

        "buyer_email": buyer_email,

        "bid_price": bid_price,

        "quantity": quantity,

        "status": "Pending",

        "created_at": datetime.utcnow()

    }


    # --------------------------------------------------------
    # 8. Save bid to MongoDB
    # --------------------------------------------------------

    result = bids_collection.insert_one(
        bid_data
    )


    # --------------------------------------------------------
    # 9. Return response
    # --------------------------------------------------------

    return {

        "success": True,

        "message": "Bid placed successfully.",

        "bid_id": str(
            result.inserted_id
        ),

        "listing_id": listing_id,

        "buyer_name": buyer_name,

        "buyer_email": buyer_email,

        "bid_price": bid_price,

        "quantity": quantity,

        "status": "Pending"

    }


# ============================================================
# GET ALL BIDS FOR A FARMER'S LISTING
# ============================================================

@router.get("/bids/{listing_id}")
def get_listing_bids(
    listing_id: str
):

    # --------------------------------------------------------
    # 1. Validate listing ID
    # --------------------------------------------------------

    try:

        listing_object_id = ObjectId(
            listing_id
        )

    except Exception:

        return {
            "success": False,
            "message": "Invalid listing ID."
        }


    # --------------------------------------------------------
    # 2. Check listing exists
    # --------------------------------------------------------

    listing = vegetables_collection.find_one(
        {
            "_id": listing_object_id
        }
    )

    if not listing:

        return {
            "success": False,
            "message": "Listing not found."
        }


    # --------------------------------------------------------
    # 3. Get all bids
    # --------------------------------------------------------

    bids = list(

        bids_collection.find(
            {
                "listing_id": listing_object_id
            }
        ).sort(
            "bid_price",
            -1
        )

    )


    # --------------------------------------------------------
    # 4. Convert MongoDB values
    # --------------------------------------------------------

    for bid in bids:

        bid["_id"] = str(
            bid["_id"]
        )

        bid["listing_id"] = str(
            bid["listing_id"]
        )

        if "created_at" in bid:

            bid["created_at"] = (
                bid["created_at"].isoformat()
            )

        if "accepted_at" in bid:

            bid["accepted_at"] = (
                bid["accepted_at"].isoformat()
            )


    # --------------------------------------------------------
    # 5. Return bids
    # --------------------------------------------------------

    return {

        "success": True,

        "listing_id": listing_id,

        "count": len(bids),

        "bids": bids

    }


# ============================================================
# GET BIDS PLACED BY A BUYER
# ============================================================

@router.get("/my-bids/{buyer_email}")
def get_my_bids(
    buyer_email: str
):

    # --------------------------------------------------------
    # 1. Validate email
    # --------------------------------------------------------

    if not buyer_email:

        return {

            "success": False,

            "message": "Buyer email is required."

        }


    # --------------------------------------------------------
    # 2. Find buyer's bids
    # --------------------------------------------------------

    bids = list(

        bids_collection.find(
            {
                "buyer_email": buyer_email
            }
        ).sort(
            "created_at",
            -1
        )

    )


    # --------------------------------------------------------
    # 3. Add crop/listing information
    # --------------------------------------------------------

    for bid in bids:

        bid["_id"] = str(
            bid["_id"]
        )

        listing_id = bid.get(
            "listing_id"
        )


        if listing_id:

            listing = vegetables_collection.find_one(
                {
                    "_id": listing_id
                }
            )

            if listing:

                bid["crop_name"] = (
                    listing.get(
                        "crop_name",
                        listing.get(
                            "vegetable",
                            "Tomato"
                        )
                    )
                )

                bid["farmer_name"] = (
                    listing.get(
                        "farmer_name",
                        ""
                    )
                )

                bid["listing_status"] = (
                    listing.get(
                        "status",
                        "Available"
                    )
                )

            else:

                bid["crop_name"] = "Tomato"

                bid["farmer_name"] = ""

                bid["listing_status"] = "Unavailable"


        bid["listing_id"] = str(
            listing_id
        ) if listing_id else ""


        if "created_at" in bid:

            bid["created_at"] = (
                bid["created_at"].isoformat()
            )


        if "accepted_at" in bid:

            bid["accepted_at"] = (
                bid["accepted_at"].isoformat()
            )


    # --------------------------------------------------------
    # 4. Return buyer bids
    # --------------------------------------------------------

    return {

        "success": True,

        "buyer_email": buyer_email,

        "count": len(bids),

        "bids": bids

    }


# ============================================================
# ACCEPT A BID
# ============================================================

@router.put("/bids/{bid_id}/accept")
def accept_bid(
    bid_id: str
):

    # --------------------------------------------------------
    # 1. Validate bid ID
    # --------------------------------------------------------

    try:

        bid_object_id = ObjectId(
            bid_id
        )

    except Exception:

        return {

            "success": False,

            "message": "Invalid bid ID."

        }


    # --------------------------------------------------------
    # 2. Find the bid
    # --------------------------------------------------------

    bid = bids_collection.find_one(
        {
            "_id": bid_object_id
        }
    )

    if not bid:

        return {

            "success": False,

            "message": "Bid not found."

        }


    # --------------------------------------------------------
    # 3. Check bid status
    # --------------------------------------------------------

    if bid.get("status") != "Pending":

        return {

            "success": False,

            "message": "This bid has already been processed."

        }


    # --------------------------------------------------------
    # 4. Accept selected bid
    # --------------------------------------------------------

    bids_collection.update_one(

        {
            "_id": bid_object_id
        },

        {
            "$set": {

                "status": "Accepted",

                "accepted_at": datetime.utcnow()

            }

        }

    )


    # --------------------------------------------------------
    # 5. Reject all other pending bids
    # --------------------------------------------------------

    bids_collection.update_many(

        {

            "listing_id": bid["listing_id"],

            "_id": {
                "$ne": bid_object_id
            },

            "status": "Pending"

        },

        {

            "$set": {

                "status": "Rejected"

            }

        }

    )


    # --------------------------------------------------------
    # 6. Mark vegetable listing as SOLD
    # --------------------------------------------------------

    vegetables_collection.update_one(

        {

            "_id": bid["listing_id"]

        },

        {

            "$set": {

                "status": "Sold",

                "accepted_bid_id": bid_object_id

            }

        }

    )


    # --------------------------------------------------------
    # 7. Return response
    # --------------------------------------------------------

    return {

        "success": True,

        "message": (
            "Bid accepted successfully. "
            "Other pending bids have been rejected."
        ),

        "bid_id": bid_id,

        "listing_id": str(
            bid["listing_id"]
        ),

        "buyer_name": bid["buyer_name"],

        "buyer_email": bid.get(
            "buyer_email",
            ""
        ),

        "bid_price": bid["bid_price"],

        "quantity": bid["quantity"],

        "status": "Accepted",

        "listing_status": "Sold"

    }