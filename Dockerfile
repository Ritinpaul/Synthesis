# Stage 1: Build Frontend
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline || npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Production Container (Python 3.11 + Node runtime)
FROM python:3.11-slim-bookworm
WORKDIR /app

# Install Node.js 20 runtime for Next.js standalone
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/pyproject.toml backend/README.md ./backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -e ./backend

COPY backend ./backend

# Copy standalone Next.js server, static assets, and public directory
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Antideploy injects PORT at runtime - do not hardcode it here
ENV HOSTNAME=0.0.0.0

CMD ["/app/entrypoint.sh"]
