FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies with binary wheels only
RUN pip install --upgrade pip && \
    pip install --prefer-binary -r requirements.txt

# Copy backend code
COPY . .

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
