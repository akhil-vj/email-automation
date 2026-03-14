FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .

# Install dependencies with binary wheels only
RUN pip install --upgrade pip && \
    pip install --prefer-binary -r requirements.txt

# Copy backend code
COPY backend/ ./backend

# Set working directory to backend
WORKDIR /app/backend

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
