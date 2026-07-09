FROM python:3.11-slim

WORKDIR /service/app

# system dependencies needed for some Python packages (psycopg2, build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
# Place requirements.txt in the current WORKDIR (/service/app)
COPY requirements.txt /service/app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /service

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Use $PORT when provided by host (Render, Heroku etc.)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
