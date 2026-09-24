# JeevanPath (ஜீவன்பாத் / जीवनपथ)

A simple, first-time user friendly livelihood and skill navigator designed specifically for uneducated Scheduled Caste (SC) beneficiaries with low digital literacy.

---

## 🌟 Core Design Principles

1. **Language Selection FIRST**: Before any menu or screen is shown, the beneficiary selects their preferred language (Tamil, Hindi, or English).
2. **Voice-First Interface**: Minimal to zero typing required. Spoken voice interview via Bhashini ASR / Web Speech.
3. **Icon-Based Navigation**: High-contrast icons, 48px+ touch targets, and spoken audio readouts.
4. **Maximum 3 Steps to Job Recommendations**: Language → Voice → Job Cards → 1-Page Report.
5. **Foolproof Usability**: Designed for rural users and first-time smartphone users with high contrast, large typography, and zero confusing nested menus.

---

## 📱 4 Screens Flow

| Screen | Module | Features |
|---|---|---|
| **1** | **Language Selection** | Full screen with 3 large buttons: Tamil (with Tamil Nadu map), Hindi (with India map), and English (globe icon). Audio speaker button to listen to options. |
| **2** | **Voice Interview** | Giant 50% screen microphone button, 30-second countdown, speaks freely without interruption, auto-submits or "Done" tap. Real-time NLP extracts education, current work, and interests. Also includes 1-tap sample speech chips for zero-friction testing. |
| **3** | **Job Cards** | Exactly 3 curated job cards (NOT a list). Displays large icons (electrician = lightbulb, tailor = sewing machine, plumber = wrench), color-coded NSQF Level badges (Level 1, 2, 3), star match ratings (⭐⭐⭐ = 75%), 30-sec visual preview modal, and select button. |
| **4** | **Simple Report** | Generates official 1-page PDF. Shows user phone, selected trades, nearest training centre (with coordinator contact & 1800 helpline). Two direct options: "Download PDF" and "Send to WhatsApp". |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS (Mobile-First responsive design, min 48px buttons, min 16px fonts)
- **Backend API**:
  - **Node.js/Express (`server.ts`)**: Integrated fullstack server mounting Vite dev middleware (runs port 3000 in AI Studio)
  - **Python FastAPI (`backend/main.py`)**: Standalone lightweight API with 4 endpoints ready for Cloud Run
- **Database**: Firebase Firestore (`firebase-blueprint.json` & `firestore.rules`) with 2 core collections:
  - `users`: `{ uid, phone, language, created_at }`
  - `profiles`: `{ user_id, transcript, education, current_work, interests, selected_jobs, pdf_url }`
- **Voice & ASR**: Bhashini ASR integration (`backend/bhashini.py` & `src/services/bhashini.ts`) + Web Speech API fallback with Tamil (`ta-IN`), Hindi (`hi-IN`), and English (`en-IN`)
- **PDF Generation**: Lightweight 1-page PDF engine (`jspdf`) with government scheme layout, QR code stamp, and training centre contacts

---

## 🚀 Backend Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/language/select` | Saves user's language preference and mobile phone to `users` collection |
| `POST` | `/api/voice/interview` | Receives audio / spoken text, executes Bhashini ASR, extracts education, work, interests |
| `GET` | `/api/jobs/recommend` | Returns top 3 NSQF-aligned livelihood trades matching profile |
| `POST` | `/api/report/generate` | Generates 1-page PDF report and WhatsApp shareable link |

---

## 💻 Quickstart & Setup Instructions

### 1. Running the Fullstack App in AI Studio / Node

```bash
# Install dependencies
npm install

# Start the full-stack Express + Vite server on port 3000
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### 2. Running the FastAPI Backend (Optional Cloud Run Deployment)

```bash
# Navigate to backend directory or project root
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Firebase Firestore Configuration

1. The Firestore data schema is defined in `firebase-blueprint.json`.
2. Security rules are configured in `firestore.rules`.
3. To deploy rules to your Firebase project:
```bash
firebase deploy --only firestore:rules
```

### 4. Bhashini ASR Configuration

Set the following environment variables in your `.env` or Cloud Run settings:
```env
BHASHINI_USER_ID="your_bhashini_user_id"
BHASHINI_API_KEY="your_bhashini_api_key"
BHASHINI_PIPELINE_ID="your_pipeline_id"
```
*(Note: If Bhashini credentials are not set, the platform automatically utilizes browser-native Web Speech recognition and built-in heuristic NLP parsing without failing).*

### 5. Antigravity Agent & Remote Sandbox Export

The project is fully prepared for Google's **Antigravity** Managed Agent environment (`antigravity-preview-05-2026`) via the Gemini Interactions API:

- **Manifest**: `antigravity.config.json`
- **Agent Instructions**: `.antigravity/AGENTS.md`
- **Sandbox Environment**: `.antigravity/environment.json`
- **Bootstrap Entrypoint**: `.antigravity/entrypoint.sh`
- **Export Script**:
  ```bash
  npm run export:antigravity
  ```

---

## 📄 License & Mission

Dedicated to the economic empowerment of SC community beneficiaries through accessibility-first digital tools.
