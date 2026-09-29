from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config.database import db

from routers.auth import router as auth_router
from routers.farmer import router as farmer_router
from routers.prediction import router as prediction_router
from routers.vegetable import router as vegetable_router
from routers.bid import router as bid_router
from routers.market import router as market_router


print("MAIN.PY LOADED")


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="AgriTrust AI API",
    description="AI-powered agriculture platform",
    version="1.0.0"
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name ="uploads"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# AUTH ROUTES
# =========================================================

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# FARMER ROUTES
# =========================================================

app.include_router(
    farmer_router,
    prefix="/farmer",
    tags=["Farmer"]
)


# =========================================================
# AI PREDICTION ROUTES
# =========================================================
# IMPORTANT:
# prediction.py already has prefix="/ai"
# Therefore DO NOT add prefix="/ai" here.

app.include_router(
    prediction_router
)


# =========================================================
# VEGETABLE ROUTES
# =========================================================

app.include_router(
    vegetable_router,
    prefix="/vegetable",
    tags=["Vegetable"]
)


# =========================================================
# BID ROUTES
# =========================================================

app.include_router(
    bid_router,
    prefix="/bid",
    tags=["Bidding"]
)


# =========================================================
# MARKET ROUTES
# =========================================================

app.include_router(
    market_router,
    prefix="/market",
    tags=["Market"]
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "AgriTrust AI Backend is running",
        "status": "success"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/db")
def db_health():
    try:
        if db is not None:
            db.command("ping")
            return {
                "status": "healthy",
                "database": "connected",
                "db_name": getattr(db, "name", "unknown")
            }
        else:
            return {
                "status": "unhealthy",
                "database": "not configured"
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }