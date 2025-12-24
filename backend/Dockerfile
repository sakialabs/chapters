FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml ./

# Install dependencies directly with pip
RUN pip install --no-cache-dir \
    fastapi==0.115.14 \
    uvicorn[standard]==0.34.3 \
    sqlalchemy==2.0.45 \
    alembic==1.17.2 \
    psycopg2-binary==2.9.11 \
    pgvector==0.3.6 \
    redis==5.3.1 \
    rq==2.6.1 \
    python-jose[cryptography]==3.5.0 \
    passlib[bcrypt]==1.7.4 \
    python-multipart==0.0.20 \
    pydantic[email]==2.12.5 \
    pydantic-settings==2.12.0 \
    openai==1.109.1 \
    boto3==1.42.15 \
    sentry-sdk[fastapi]==2.48.0

# Copy application code
COPY . .

# Make startup script executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose port
EXPOSE 8000

# Run the startup script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
