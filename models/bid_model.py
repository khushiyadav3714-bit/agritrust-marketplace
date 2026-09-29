from config.database import db

# Mongo Bids Collection
bids_collection = db["bids"]


def serialize_bid(doc: dict) -> dict:
    """Converts ObjectIds and datetimes to serializable types for JSON responses."""
    if not doc:
        return None
    item = dict(doc)
    if "_id" in item:
        item["_id"] = str(item["_id"])
    if "listing_id" in item:
        item["listing_id"] = str(item["listing_id"])
    if "created_at" in item and hasattr(item["created_at"], "isoformat"):
        item["created_at"] = item["created_at"].isoformat()
    if "accepted_at" in item and hasattr(item["accepted_at"], "isoformat"):
        item["accepted_at"] = item["accepted_at"].isoformat()
    return item
