from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def farmer_root():
    return {
        "status": "success",
        "message": "Farmer router operational"
    }
