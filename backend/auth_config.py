import os

SECRET_KEY = os.getenv("SECRET_KEY")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Render stores this as comma-separated string
admins = os.getenv("ALLOWED_ADMINS", "")
ALLOWED_ADMINS = {email.strip() for email in admins.split(",") if email.strip()}
