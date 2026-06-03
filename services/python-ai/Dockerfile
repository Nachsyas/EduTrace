FROM python:3.10-slim

WORKDIR /app

# Install build dependencies and clean up package manager caches to keep image size small
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies file
COPY requirements.txt .

# Install dependencies. We pull the CPU-only variant of PyTorch to optimize the image size
# since VPS environments usually do not require CUDA GPU acceleration.
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy the remaining service codebase
COPY . .

# Set default ports and runtime environment variables
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Expose Python AI port
EXPOSE 8000

# Start FastAPI application
CMD ["python", "main.py"]
