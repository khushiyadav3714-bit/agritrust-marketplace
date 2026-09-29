import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "agritrust")

if not MONGODB_URI or MONGODB_URI.strip() == "" or "your_mongodb_atlas_connection_string" in MONGODB_URI:
    error_msg = (
        "\n============================================================\n"
        "ERROR: MONGODB_URI is missing or unconfigured.\n"
        "Please create a .env file based on .env.example and set\n"
        "MONGODB_URI to a valid MongoDB connection string.\n"
        "============================================================\n"
    )
    sys.stderr.write(error_msg)
    raise RuntimeError("MONGODB_URI environment variable is missing or invalid.")

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGODB_DB_NAME]
except Exception as e:
    sys.stderr.write(f"Failed to initialize PyMongo MongoClient: {e}\n")
    raise e
