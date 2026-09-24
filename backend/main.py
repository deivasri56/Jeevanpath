"""
JeevanPath Backend Service (FastAPI)
Simple, lightweight backend for uneducated SC beneficiaries.
Endpoints:
1. POST /api/language/select
2. POST /api/voice/interview
3. GET /api/jobs/recommend
4. POST /api/report/generate
"""
import os
import uuid
import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.bhashini import transcribe_audio_bhashini
from backend.nsqf_matcher import recommend_top_jobs, normalise_education, normalise_mobility

app = FastAPI(
    title="JeevanPath API",
    description="Livelihood & Skill Navigator for SC Beneficiaries",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database collections (synced with Firebase Firestore schema)
# Collection "users": {uid, phone, language, created_at}
# Collection "profiles": {user_id, transcript, education, current_work, interests, selected_jobs, pdf_url}
USERS_DB: dict = {}
PROFILES_DB: dict = {}

# --- Pydantic Request Models ---
class LanguageSelectRequest(BaseModel):
    uid: Optional[str] = None
    language: str  # tamil | hindi | english
    phone: Optional[str] = None

class VoiceInterviewRequest(BaseModel):
    uid: Optional[str] = None
    language: str  # tamil | hindi | english
    audio_base64: Optional[str] = None
    audio_text: Optional[str] = None

class ReportGenerateRequest(BaseModel):
    uid: str
    phone: Optional[str] = None
    language: str
    selected_jobs: List[str]

# --- Simple NLP Rule-based Entity Extraction ---
def extract_profile_entities(transcript: str, language: str):
    lower = (transcript or "").lower()

    # Education extraction
    education = "10th Pass"
    if any(k in lower for k in ["10th", "10-ஆம்", "10वीं", "दसवीं", "பத்தாம்"]):
        education = "10-ஆம் வகுப்பு (10th Pass)" if language == "tamil" else "10वीं पास (10th Pass)" if language == "hindi" else "10th Pass"
    elif any(k in lower for k in ["8th", "8-ஆம்", "8वीं", "எட்டாம்"]):
        education = "8-ஆம் வகுப்பு (8th Pass)" if language == "tamil" else "8वीं पास (8th Pass)" if language == "hindi" else "8th Pass"
    elif any(k in lower for k in ["no school", "படிப்பு இல்லை", "अनपढ़"]):
        education = "அடிப்படை எழுத்தறிவு (பள்ளி செல்லவில்லை)" if language == "tamil" else "बुनियादी साक्षर" if language == "hindi" else "Basic Literacy"

    # Current work extraction
    current_work = "Agricultural Laborer"
    if any(k in lower for k in ["farm", "வயல்", "விவசாய", "खेत", "खेती", "உழவு"]):
        current_work = "விவசாயக் கூலி / பண்ணை வேலை" if language == "tamil" else "कृषि मजदूर / खेत का काम" if language == "hindi" else "Agricultural / Farm Laborer"
    elif any(k in lower for k in ["daily", "கூலி", "मजदूर", "मजदूरी", "தினக்கூலி"]):
        current_work = "தினக்கூலி தொழிலாளி" if language == "tamil" else "दैनिक दिहाड़ी मजदूर" if language == "hindi" else "Daily Wage Worker"
    elif any(k in lower for k in ["tailor", "தையல்", "सिलाई"]):
        current_work = "தையல் உதவியாளர்" if language == "tamil" else "सिलाई सहायक" if language == "hindi" else "Tailoring Assistant"

    # Interests extraction
    interests = "Electrical Wiring & Repair"
    if any(k in lower for k in ["electr", "மின்சார", "மின்சாரம்", "बिजली", "वायरिंग"]):
        interests = "மின்சார வேலை மற்றும் வயரிங் (Electrician)" if language == "tamil" else "बिजली मिस्त्री एवं वायरिंग (Electrician)" if language == "hindi" else "Electrical Wiring & Repair"
    elif any(k in lower for k in ["tailor", "தையல்", "துணி", "सिलाई"]):
        interests = "தையல் மற்றும் ஆடை வடிவமைப்பு (Tailoring)" if language == "tamil" else "सिलाई एवं परिधान निर्माण (Tailoring)" if language == "hindi" else "Tailoring & Garments"
    elif any(k in lower for k in ["plumb", "குழாய்", "பைப்", "नल", "प्लंबर"]):
        interests = "குழாய் பழுது மற்றும் பிளம்பிங் (Plumbing)" if language == "tamil" else "प्लंबर एवं पाइप फिटिंग (Plumbing)" if language == "hindi" else "Plumbing & Water Systems"

    return {
        "education": education,
        "current_work": current_work,
        "interests": interests
    }

# --- 1. POST /api/language/select ---
@app.post("/api/language/select")
def select_language(req: LanguageSelectRequest):
    user_id = req.uid or f"jp_sc_{uuid.uuid4().hex[:8]}"
    user_doc = {
        "uid": user_id,
        "phone": req.phone or "",
        "language": req.language.lower(),
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    USERS_DB[user_id] = user_doc

    return {
        "status": "success",
        "message": "Language saved successfully",
        "user": user_doc
    }

# --- 2. POST /api/voice/interview ---
@app.post("/api/voice/interview")
def voice_interview(req: VoiceInterviewRequest):
    user_id = req.uid or f"jp_sc_{uuid.uuid4().hex[:8]}"

    # Use client provided transcript or process base64 via Bhashini ASR
    if req.audio_text:
        transcript = req.audio_text
    elif req.audio_base64:
        bhashini_res = transcribe_audio_bhashini(req.audio_base64, req.language)
        transcript = bhashini_res.get("transcript", "")
    else:
        # Default placeholder transcript
        bhashini_res = transcribe_audio_bhashini("", req.language)
        transcript = bhashini_res.get("transcript", "")

    # Extract entities
    entities = extract_profile_entities(transcript, req.language)

    profile_doc = {
        "user_id": user_id,
        "transcript": transcript,
        "education": entities["education"],
        "current_work": entities["current_work"],
        "interests": entities["interests"],
        "selected_jobs": [],
        "pdf_url": None
    }
    PROFILES_DB[user_id] = profile_doc

    return {
        "status": "success",
        "user_id": user_id,
        "transcript": transcript,
        "education": entities["education"],
        "current_work": entities["current_work"],
        "interests": entities["interests"]
    }

# --- 3. GET /api/jobs/recommend ---
@app.get("/api/jobs/recommend")
def recommend_jobs(
    uid: Optional[str] = None,
    lang: str = "tamil",
    mobility: Optional[str] = None,
    preferences: Optional[str] = None,
):
    """
    Returns top 3 NSQF job matches with match_score and skill_gaps[].

    Query params:
      uid         – user id (optional); pulls education + interests from PROFILES_DB
      lang        – response language hint (tamil | hindi | english)
      mobility    – free-text mobility preference (e.g. 'local only', 'willing to travel')
      preferences – free-text other preferences (e.g. 'self employment', 'women only')
    """
    profile = PROFILES_DB.get(uid) if uid else None

    education = profile.get("education", "") if profile else ""
    interests = profile.get("interests", "") if profile else ""

    # Use NSQF rule-based scorer
    top_jobs = recommend_top_jobs(
        education=education,
        interests=interests,
        mobility=mobility,
        preferences=preferences,
        top_n=3,
    )

    # Select localised title based on lang
    lang_key = lang if lang in ("tamil", "hindi") else "english"
    title_field = {"tamil": "title_ta", "hindi": "title_hi", "english": "title_en"}.get(lang_key, "title_en")

    response_jobs = []
    for job in top_jobs:
        response_jobs.append({
            "id": job["id"],
            "qp_code": job["qp_code"],
            "title": job.get(title_field, job["title_en"]),
            "title_en": job["title_en"],
            "nsqf_level": job["nsqf_level"],
            "sector": job["sector"],
            "match_score": job["match_score"],
            "score_breakdown": job["score_breakdown"],
            "skill_gaps": job["skill_gaps"],
            "wage_range_inr": job["wage_range_inr"],
            "training_duration_days": job["training_duration_days"],
            "qp_competencies": job["qp_competencies"],
            "govt_scheme": job["govt_scheme"],
            "certification_body": job["certification_body"],
            "self_employment": job["self_employment"],
        })

    return {
        "status": "success",
        "language": lang,
        "education_normalised": normalise_education(education),
        "mobility_normalised": normalise_mobility(mobility or ""),
        "recommended_jobs": response_jobs,
        "total": len(response_jobs),
    }

# --- 4. POST /api/report/generate ---
@app.post("/api/report/generate")
def generate_report(req: ReportGenerateRequest):
    pdf_url = f"/reports/JeevanPath_Report_{req.uid}.pdf"

    if req.uid in PROFILES_DB:
        PROFILES_DB[req.uid]["selected_jobs"] = req.selected_jobs
        PROFILES_DB[req.uid]["pdf_url"] = pdf_url

    whatsapp_msg = (
        f"JeevanPath Livelihood Report for Beneficiary {req.uid}. "
        f"Selected jobs: {', '.join(req.selected_jobs)}. "
        f"Helpline: 1800-425-2424. Report: {pdf_url}"
    )
    whatsapp_link = f"https://api.whatsapp.com/send?text={whatsapp_msg}"

    return {
        "status": "success",
        "pdf_url": pdf_url,
        "whatsapp_link": whatsapp_link,
        "beneficiary_id": req.uid,
        "selected_jobs": req.selected_jobs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
