#!/bin/sh
set -e

# Increase file limits if allowed
ulimit -n 65535 2>/dev/null || true

echo "=== Starting Synthesis Service ==="
echo "Platform PORT = ${PORT:-not set}"

# Configure Supabase PostgreSQL
export SYNTHESIS_DATABASE_URL="${SYNTHESIS_DATABASE_URL:-postgresql+psycopg://user:REDACTED@host:5432/dbname}"
echo "SYNTHESIS_DATABASE_URL configured for Supabase PostgreSQL."

echo "Starting FastAPI backend on 127.0.0.1:8001..."
cd /app
uvicorn app.main:app --app-dir /app/backend --host 127.0.0.1 --port 8001 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Waiting for backend to be ready on port 8001..."
MAX_WAIT=30
i=0
while [ $i -lt $MAX_WAIT ]; do
    if python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8001/health/ready')" 2>/dev/null; then
        echo "Backend is ready!"
        break
    fi
    i=$((i + 1))
    sleep 1
done

if [ $i -eq $MAX_WAIT ]; then
    echo "WARNING: Backend did not respond within ${MAX_WAIT}s, continuing anyway..."
fi

NEXT_PORT="${PORT:-8000}"
echo "Starting Next.js standalone server on port ${NEXT_PORT}..."
cd /app/frontend
export PORT="$NEXT_PORT"
export HOSTNAME="0.0.0.0"
exec node server.js
