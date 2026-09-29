from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from models.user_model import (
    users_collection,
    hash_password,
    verify_password,
    generate_token,
    serialize_user
)

router = APIRouter()


# ============================================================
# PYDANTIC SCHEMAS
# ============================================================

class RegisterSchema(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    location: Optional[str] = ""
    crop: Optional[str] = None
    password: str
    role: Optional[str] = "farmer"


class LoginSchema(BaseModel):
    email: str
    password: str
    role: Optional[str] = None


# ============================================================
# HELPER HANDLERS
# ============================================================

def handle_registration(data: RegisterSchema, role: str):
    email = data.email.strip().lower()

    if not data.name or not email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, email, and password are required."
        )

    # Check for existing user with same email and role
    existing_user = users_collection.find_one(
        {
            "email": email,
            "role": role
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A {role} account with this email already exists."
        )

    hashed_pwd = hash_password(data.password)

    user_doc = {
        "name": data.name.strip(),
        "email": email,
        "phone": (data.phone or "").strip(),
        "location": (data.location or "").strip(),
        "crop": (data.crop or "").strip() if (role == "farmer" and data.crop) else None,
        "password": hashed_pwd,
        "role": role,
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    serialized = serialize_user(user_doc)
    serialized["success"] = True
    serialized["message"] = f"{role.capitalize()} registered successfully."

    return serialized


def handle_login(data: LoginSchema, role: str):
    email = data.email.strip().lower()

    if not email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter email and password."
        )

    # Find user by email and role
    user = users_collection.find_one(
        {
            "email": email,
            "role": role
        }
    )

    # Fallback search by email if role query misses
    if not user:
        user = users_collection.find_one(
            {
                "email": email
            }
        )

    if not user or not verify_password(data.password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    serialized = serialize_user(user)
    serialized["access_token"] = generate_token()
    serialized["token_type"] = "bearer"
    serialized["message"] = "Login successful."

    return serialized


# ============================================================
# ROUTE ENDPOINTS
# ============================================================

@router.post("/farmer/register")
def farmer_register(data: RegisterSchema):
    return handle_registration(data, role="farmer")


@router.post("/buyer/register")
def buyer_register(data: RegisterSchema):
    return handle_registration(data, role="buyer")


@router.post("/farmer/login")
def farmer_login(data: LoginSchema):
    return handle_login(data, role="farmer")


@router.post("/buyer/login")
def buyer_login(data: LoginSchema):
    return handle_login(data, role="buyer")
