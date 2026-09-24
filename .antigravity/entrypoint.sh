#!/usr/bin/env bash
set -e

echo "=== Initializing JeevanPath in Antigravity Sandbox ==="

# 1. Install Node.js dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing Node.js packages..."
  npm install --prefer-offline --no-audit
fi

# 2. Check build and lint
echo "Verifying TypeScript and build integrity..."
npm run lint

# 3. Setup Python virtual environment if needed
if [ -f "backend/requirements.txt" ]; then
  echo "Setting up Python FastAPI backend..."
  python3 -m venv .venv || true
  if [ -d ".venv" ]; then
    source .venv/bin/activate
    pip install -q -r backend/requirements.txt || true
  fi
fi

echo "=== JeevanPath environment is ready for Antigravity Agent ==="
exec npm run dev
