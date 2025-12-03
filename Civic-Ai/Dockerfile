# 1. Use an official lightweight Python image
FROM python:3.10-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Install system dependencies required for OpenCV (cv2)
# --- FIX: Changed 'libgl1-mesa-glx' to 'libgl1' ---
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy requirements
COPY requirements.txt .

# --- OPTIMIZATION START ---
# A. Install the Lightweight CPU version of PyTorch first (Small download)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# B. Then install the rest of the libraries (fastapi, etc.)
# We increase timeout just in case, but it should be fast now.
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt
# --- OPTIMIZATION END ---

# 5. Copy the entire project into the container
COPY . .

# 6. Set the Python Path so it finds your 'src' modules
ENV PYTHONPATH=/app/src

# 7. Create the upload directory
RUN mkdir -p static/uploads

# 8. Expose the port the app runs on
EXPOSE 7860

# 9. Command to run the application
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "7860"]