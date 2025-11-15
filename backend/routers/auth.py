from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
from backend.auth_config import SECRET_KEY, GOOGLE_CLIENT_ID, ALLOWED_ADMINS


router = APIRouter()

class GoogleAuth(BaseModel):
    id_token: str


@router.post("/auth/google")
def auth_google(payload: GoogleAuth):
    try:
        data = id_token.verify_oauth2_token(
            payload.id_token, requests.Request(), GOOGLE_CLIENT_ID
        )

        # 🔥 DEBUG PRINTS (add these)
        print("🔍 FULL GOOGLE PAYLOAD:", data)
        print("📧 EMAIL RETURNED:", data.get("email"))
        print("👑 ALLOWED_ADMINS LIST:", ALLOWED_ADMINS)

        email = data.get("email")
        if email not in ALLOWED_ADMINS:
            raise HTTPException(status_code=403, detail="Not an admin")

        jwt_token = jwt.encode({"email": email}, SECRET_KEY, algorithm="HS256")

        return {"token": jwt_token, "email": email}

    except Exception as e:
        print("Google Auth Error:", e)
        raise HTTPException(status_code=401, detail="Invalid Google token")
