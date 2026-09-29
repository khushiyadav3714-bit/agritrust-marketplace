import secrets
import bcrypt
from datetime import datetime
from config.database import db

# Mongo Users Collection
users_collection = db["users"]


def hash_password(password: str) -> str:
    """Hashes plain text password using bcrypt."""
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain text password against stored bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def generate_token() -> str:
    """Generates a secure random access token."""
    return secrets.token_hex(32)


def serialize_user(user: dict) -> dict:
    """Converts ObjectId to string and strips sensitive password field."""
    if not user:
        return None
    user_dict = dict(user)
    if "_id" in user_dict:
        user_dict["_id"] = str(user_dict["_id"])
    user_dict.pop("password", None)
    return user_dict
