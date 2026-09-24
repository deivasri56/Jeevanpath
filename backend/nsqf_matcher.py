"""
backend/nsqf_matcher.py
=======================
Rule-based NSQF job matcher for JeevanPath.

Scoring breakdown (max 100 pts):
  Education match  : +30 pts
  Interest match   : +40 pts
  Mobility match   : +20 pts
  Preference match : +10 pts

Supports Tamil / Hindi / English variations for education normalization:
  10th / SSLC / matric / பத்தாம் / 10वीं / दसवीं → class_10
  8th  / 8-ஆம் / 8वीं                            → class_8
  5th  / 5-ஆம் / 5वीं                            → class_5
  No school / illiterate / அனக்ஷர / अनपढ़         → basic_literacy
"""

import os
import json
from typing import List, Dict, Any, Optional

# ---------------------------------------------------------------------------
# 1. Load NSQF role catalogue once at module import time
# ---------------------------------------------------------------------------
_CATALOGUE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),  # project root
    "data", "nsqf_roles.json"
)

def _load_catalogue() -> List[Dict[str, Any]]:
    """Load nsqf_roles.json from project root /data/ directory."""
    try:
        with open(_CATALOGUE_PATH, encoding="utf-8") as f:
            data = json.load(f)
        return data.get("jobs", [])
    except FileNotFoundError:
        # Graceful fallback – return empty list; tests can monkey-patch
        return []

NSQF_JOBS: List[Dict[str, Any]] = _load_catalogue()

# ---------------------------------------------------------------------------
# 2. Education normalisation (handles Tamil / Hindi / English variations)
# ---------------------------------------------------------------------------

# Order matters – more-specific patterns first
_EDU_NORMALISE_RULES = [
    # class_10
    (["10th", "10 th", "class 10", "class10", "sslc", "matric", "matriculation",
      "10वीं", "दसवीं", "10 वीं", "कक्षा 10", "10-ஆம்", "10 ஆம்", "பத்தாம்",
      "10ஆம் வகுப்பு", "10ம் வகுப்பு", "10ம்", "10th pass", "hslc"], "class_10"),
    # class_12
    (["12th", "12 th", "class 12", "class12", "hsc", "intermediate", "plus two",
      "+2", "12वीं", "बारहवीं", "12-ஆம்", "12ஆம் வகுப்பு"], "class_12"),
    # class_8
    (["8th", "class 8", "8वीं", "8 वीं", "आठवीं", "8-ஆம்", "எட்டாம்", "8ஆம்"], "class_8"),
    # class_5
    (["5th", "class 5", "5वीं", "5 वीं", "पाँचवीं", "5-ஆம்", "ஐந்தாம்", "5ஆம்"], "class_5"),
    # basic_literacy
    (["no school", "illiterate", "not literate", "no education", "never went",
      "not studied", "பள்ளி செல்லவில்லை", "படிக்கவில்லை", "அனக்ஷர",
      "अनपढ़", "निरक्षर", "स्कूल नहीं"], "basic_literacy"),
]

_EDU_ORDER = ["basic_literacy", "class_5", "class_8", "class_10", "class_12"]


def normalise_education(raw: str) -> str:
    """
    Convert a free-form education string (any language) to a canonical level.
    Returns one of: basic_literacy | class_5 | class_8 | class_10 | class_12
    Defaults to 'class_8' when nothing matches (conservative assumption).
    """
    if not raw:
        return "class_8"
    lower = raw.lower().strip()
    for keywords, level in _EDU_NORMALISE_RULES:
        if any(kw in lower for kw in keywords):
            return level
    return "class_8"  # default


def _edu_level_index(level: str) -> int:
    try:
        return _EDU_ORDER.index(level)
    except ValueError:
        return 1  # class_5 index


# ---------------------------------------------------------------------------
# 3. Mobility normalisation
# ---------------------------------------------------------------------------

_MOBILITY_KEYWORDS = {
    "willing_to_travel": [
        "travel", "relocate", "move", "any place", "anywhere",
        "வெளியூர்", "இடம்பெயர", "எங்கும்", "எங்கு வேண்டுமானாலும்",
        "कहीं भी", "दूसरी जगह", "स्थानांतरण",
    ],
    "stay_local": [
        "local", "near home", "same village", "same town", "won't travel",
        "நாட்டில்", "ஊரில்", "அருகில்", "வெளியூர் போக மாட்டேன்",
        "यहीं", "घर के पास", "गांव में", "बाहर नहीं जाएंगे",
    ],
}


def normalise_mobility(raw: str) -> str:
    """Returns 'willing_to_travel' | 'stay_local' | 'unknown'."""
    if not raw:
        return "unknown"
    lower = raw.lower()
    for mob, kws in _MOBILITY_KEYWORDS.items():
        if any(k in lower for k in kws):
            return mob
    return "unknown"


# ---------------------------------------------------------------------------
# 4. Core scoring engine
# ---------------------------------------------------------------------------

def _score_education(job: Dict, user_edu_level: str) -> int:
    """
    +30 if user meets preferred education requirement
    +20 if user meets minimum education requirement
    +0  if user does not meet minimum
    """
    user_idx = _edu_level_index(user_edu_level)
    min_idx = _edu_level_index(job.get("min_education", "class_5"))
    pref_idx = _edu_level_index(job.get("preferred_education", "class_8"))

    if user_idx >= pref_idx:
        return 30
    elif user_idx >= min_idx:
        return 20
    else:
        return 0


def _score_interest(job: Dict, interests_text: str) -> int:
    """
    Keyword-overlap scoring (0-40 pts).
    +40 if 3+ keywords match, +25 if 1-2 match, +0 otherwise.
    """
    if not interests_text:
        return 0
    lower = interests_text.lower()
    keywords = [kw.lower() for kw in job.get("interest_keywords", [])]
    hits = sum(1 for kw in keywords if kw in lower)
    if hits >= 3:
        return 40
    elif hits >= 1:
        return 25
    return 0


def _score_mobility(job: Dict, user_mobility: str) -> int:
    """
    +20  if user is willing to travel and job requires medium/high mobility
    +20  if user wants to stay local and job requires low mobility
    +10  if mobility is unknown (neutral)
    +0   if clear mismatch
    """
    job_mobility = job.get("mobility_required", "low")  # low | medium | high
    if user_mobility == "unknown":
        return 10  # neutral
    if user_mobility == "stay_local" and job_mobility == "low":
        return 20
    if user_mobility == "willing_to_travel" and job_mobility in ("medium", "high"):
        return 20
    if user_mobility == "willing_to_travel" and job_mobility == "low":
        return 15  # still fine – low-mobility job, traveller → minor penalty
    return 0


def _score_preference(job: Dict, preferences_text: str) -> int:
    """
    Lightweight preference scoring (0-10 pts).
    Checks free-text for preference signals like 'self_employment', gender, etc.
    """
    if not preferences_text:
        return 5  # neutral bonus
    lower = preferences_text.lower()
    score = 0

    # Self-employment preference
    if job.get("self_employment") and any(
        kw in lower
        for kw in ["own business", "self", "independent", "சுயதொழில்", "खुद का काम"]
    ):
        score += 5

    # Salaried preference
    if not job.get("self_employment") and any(
        kw in lower for kw in ["salary", "company", "job", "நிறுவனம்", "कंपनी"]
    ):
        score += 5

    # Women-only roles
    gender_pref = job.get("gender_preference", "any")
    if gender_pref == "female" and any(
        kw in lower for kw in ["woman", "women", "female", "பெண்", "महिला"]
    ):
        score += 5
    elif gender_pref == "male" and any(
        kw in lower for kw in ["man", "male", "ஆண்", "पुरुष"]
    ):
        score += 5

    return min(score, 10)


# ---------------------------------------------------------------------------
# 5. Skill gap computation
# ---------------------------------------------------------------------------

def _compute_skill_gaps(job: Dict, interests_text: str, edu_level: str) -> List[str]:
    """
    Returns a list of human-readable skill gap strings for the given job.
    Only returns gaps that are likely (not already covered by the user's profile).
    """
    gaps: List[str] = []
    keywords = [kw.lower() for kw in job.get("interest_keywords", [])]
    lower_interests = (interests_text or "").lower()

    # Interest-based gaps
    interest_hits = sum(1 for kw in keywords if kw in lower_interests)
    if interest_hits == 0:
        gaps.extend(job.get("skill_gap_indicators", [])[:3])  # top 3 gaps
    elif interest_hits < 3:
        gaps.extend(job.get("skill_gap_indicators", [])[:2])  # top 2 gaps

    # Education-based gaps
    user_idx = _edu_level_index(edu_level)
    pref_idx = _edu_level_index(job.get("preferred_education", "class_8"))
    if user_idx < pref_idx:
        gaps.insert(
            0,
            f"Preferred education: {job.get('preferred_education', '').replace('_', ' ').title()} "
            f"(you have: {edu_level.replace('_', ' ').title()})"
        )

    return gaps[:4]  # cap at 4 gaps per job


# ---------------------------------------------------------------------------
# 6. Public API
# ---------------------------------------------------------------------------

def compute_match_score(
    job: Dict[str, Any],
    education: str,
    interests: str,
    mobility: Optional[str] = None,
    preferences: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Compute match score and skill gaps for a single job.

    Args:
        job         : A job dict from nsqf_roles.json
        education   : Raw education string from user profile (any language)
        interests   : Raw interests string from user profile (any language)
        mobility    : Optional raw mobility preference string
        preferences : Optional raw preference string (self-employment, gender, etc.)

    Returns:
        {
          "id"           : job id,
          "qp_code"      : QP code,
          "title_en"     : English title,
          "title_ta"     : Tamil title,
          "title_hi"     : Hindi title,
          "nsqf_level"   : int,
          "sector"       : sector name,
          "match_score"  : int (0-100),
          "score_breakdown": {...},
          "skill_gaps"   : [str, ...],
          "wage_range_inr": [min, max],
          "training_duration_days": int,
          "qp_competencies": [str, ...],
          "govt_scheme"  : str,
        }
    """
    edu_level = normalise_education(education)
    mob = normalise_mobility(mobility or "")
    prefs = preferences or ""

    edu_pts = _score_education(job, edu_level)
    int_pts = _score_interest(job, interests)
    mob_pts = _score_mobility(job, mob)
    pref_pts = _score_preference(job, prefs)

    total = edu_pts + int_pts + mob_pts + pref_pts

    return {
        "id": job["id"],
        "qp_code": job.get("qp_code", ""),
        "title_en": job.get("title_en", ""),
        "title_ta": job.get("title_ta", ""),
        "title_hi": job.get("title_hi", ""),
        "nsqf_level": job.get("nsqf_level", 2),
        "sector": job.get("sector", ""),
        "match_score": min(total, 100),
        "score_breakdown": {
            "education": edu_pts,
            "interest": int_pts,
            "mobility": mob_pts,
            "preference": pref_pts,
        },
        "skill_gaps": _compute_skill_gaps(job, interests, edu_level),
        "wage_range_inr": job.get("wage_range_inr", [0, 0]),
        "training_duration_days": job.get("training_duration_days", 30),
        "qp_competencies": job.get("competencies", []),
        "govt_scheme": job.get("related_govt_scheme", "PMKVY 3.0"),
        "certification_body": job.get("certification_body", "NSDC"),
        "self_employment": job.get("self_employment", False),
    }


def recommend_top_jobs(
    education: str,
    interests: str,
    mobility: Optional[str] = None,
    preferences: Optional[str] = None,
    top_n: int = 3,
    jobs: Optional[List[Dict]] = None,
) -> List[Dict[str, Any]]:
    """
    Score all NSQF jobs against the user profile and return the top N matches.

    Args:
        education   : Raw education text (any language)
        interests   : Raw interests text (any language)
        mobility    : Optional mobility preference text
        preferences : Optional preference text
        top_n       : Number of top results to return (default 3)
        jobs        : Optional override of the job catalogue (for testing)

    Returns:
        List of scored job dicts sorted by match_score descending, limited to top_n.
    """
    catalogue = jobs if jobs is not None else NSQF_JOBS
    scored = [
        compute_match_score(job, education, interests, mobility, preferences)
        for job in catalogue
    ]
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:top_n]


# ---------------------------------------------------------------------------
# 7. Quick smoke-test (python -m backend.nsqf_matcher)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    results = recommend_top_jobs(
        education="SSLC pass",
        interests="மின்சாரம் வேலை, wiring, lights",
        mobility="local only",
        top_n=3,
    )
    for r in results:
        print(
            f"[{r['match_score']:>3}] {r['id']:30s}  "
            f"gaps={r['skill_gaps']}"
        )
