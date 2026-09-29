from config.database import db

# Mongo Vegetables Collection
vegetables_collection = db["vegetables"]


def serialize_vegetable(doc: dict) -> dict:
    """Converts ObjectId to string for JSON responses."""
    if not doc:
        return None
    item = dict(doc)
    if "_id" in item:
        item["_id"] = str(item["_id"])
    return item
