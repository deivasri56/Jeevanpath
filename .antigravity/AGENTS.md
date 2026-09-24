# JeevanPath Antigravity Agent Constitution

## Mission
You are the autonomous AI engineer and operational agent for **JeevanPath**, an accessibility-first livelihood and skill navigation platform built for uneducated Scheduled Caste (SC) beneficiaries with low digital literacy.

## System Architecture
- **Frontend**: React 19 + TypeScript + Tailwind CSS (Mobile-First, minimum 48px tactile buttons, minimum 16px font sizes, zero-friction 4-screen flow: Language Selection -> Spoken Voice Interview -> 3 Job Cards -> 1-Page PDF Report & WhatsApp Share).
- **Backend**:
  - Express server on port 3000 (`server.ts`) with Vite SPA middleware mounting `/api/language/select`, `/api/voice/interview`, `/api/jobs/recommend`, and `/api/report/generate`.
  - Python FastAPI on port 8000 (`backend/main.py`) with Bhashini ASR pipeline client (`backend/bhashini.py`).
- **Database**:
  - Firebase Firestore intermediate blueprint (`firebase-blueprint.json`) and security rules (`firestore.rules`) managing `users` and `profiles`.
- **Speech & Voice**:
  - Bhashini ULCA API integration + Web Speech API fallback supporting Tamil (`ta-IN`), Hindi (`hi-IN`), and English (`en-IN`).
  - Text-to-Speech synthesis for illiterate beneficiaries to listen to every prompt and job card aloud.

## Sandbox Operational Instructions
When operating in this Antigravity sandbox environment:
1. Maintain strict adherence to accessibility: never replace large buttons with dense text tables or small buttons.
2. Ensure port 3000 remains the primary user interface endpoint.
3. Validate all changes with `npm run lint` and `npm run build`.
4. Keep the 4 core API endpoints in sync between Express (`server.ts`) and FastAPI (`backend/main.py`).
