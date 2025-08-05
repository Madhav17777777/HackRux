import os
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyBA-aIfbwOgC2embwi2Xrqk0sqhhAuuLFE"
genai.configure(api_key=GEMINI_API_KEY)

MONGO_URI = os.getenv("MONGO_URI")