import os
import requests
import base64
import json
import time
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        # --- MODEL PRIORITY ---
        # Tries experimental/pro models first, falls back to stable 1.5-flash
        self.model_priority = [
            "gemini-2.5-pro",       
            "gemini-2.5-flash",    
            "gemini-2.0-flash-exp", 
            "gemini-1.5-flash"      
        ]
        
        if not self.api_key:
            print("⚠️ CRITICAL: GEMINI_API_KEY is missing!")
        else:
            print(f"✅ LLM Service Ready (Mode: Direct API | Models: {len(self.model_priority)} in rotation)")

    def _call_gemini(self, payload, task_name="Task"):
        """
        Helper to call Google API with fallback logic.
        """
        if not self.api_key: return None
        
        params = {"key": self.api_key}
        headers = {"Content-Type": "application/json"}
        
        for model_name in self.model_priority:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            
            for attempt in range(1): 
                try:
                    response = requests.post(
                        url, 
                        params=params, 
                        headers=headers, 
                        data=json.dumps(payload),
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ Success using {model_name}")
                        return response.json()
                    
                    # If 404 (Not Found) or 429 (Limit Exceeded), switch model
                    if response.status_code in [404, 429, 503]:
                        print(f"⚠️ {model_name} failed ({response.status_code}). Switching...")
                        break 
                    
                    print(f"❌ API Error {response.status_code}: {response.text}")
                    return None 
                    
                except Exception as e:
                    print(f"❌ Connection Error with {model_name}: {e}")
                    break 
        
        print(f"❌ All models failed for {task_name}.")
        return None

    def validate_image(self, image_bytes):
        """
        Uses Gemini to check if the image is a valid civic issue.
        """
        try:
            b64_image = base64.b64encode(image_bytes).decode('utf-8')
            
            prompt = """
            You are a strict Civic Issue Validator. Analyze this image.
            Does this image show a **significant** civic problem?
            
            Valid Issues (YES):
            - Garbage Dumps, Potholes, Broken Lights, Fallen Trees, Water Leakage, Dead Animals.

            Invalid Issues (NO):
            - Grass/Plants, Single wrapper, Normal roads, Dark images, Selfies, People.

            Return strictly:
            VERDICT: [YES/NO]
            REASON: [Short explanation]
            """

            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": b64_image}}
                    ]
                }]
            }

            data = self._call_gemini(payload, task_name="Validation")
            
            if not data:
                return True, "Skipped (All Models Failed)"

            try:
                text = data['candidates'][0]['content']['parts'][0]['text'].strip()
                print(f"🔍 AI Verdict: {text}")
                
                if "VERDICT: NO" in text:
                    reason = text.split("REASON:")[1].strip() if "REASON:" in text else "Invalid."
                    return False, reason
                return True, "Valid"
            except (KeyError, IndexError):
                return True, "Valid"

        except Exception as e:
            print(f"❌ Validation Crash: {e}")
            return True, "Skipped"

    def generate_letter(self, issue, dept, addr):
        """
        Generates a PROFESSIONAL formal letter TEMPLATE (No AI).
        """
        try:
            # SAFETY CHECK: Ensure variables are strings
            issue = str(issue) if issue else "Civic Issue"
            dept = str(dept) if dept else "Civic Authority"
            addr = str(addr) if addr else "Unknown Location"

            # Create a shorter address for the Subject line to keep it clean
            addr_short = addr.split(',')[0] if ',' in addr else addr[:20]

            # 1. Professional Subject Line
            subject = f"URGENT: {issue} Report at {addr_short}..."

            # 2. Professional Body Construction
            body = (
                f"To the Commissioner,\n"
                f"{dept}.\n\n"
                f"Subject: Formal complaint regarding {issue}.\n\n"
                f"Respected Sir/Madam,\n\n"
                f"I am writing to formally bring to your immediate attention a critical civic issue regarding "
                f"{issue} observed at the following location:\n\n"
                f"📍 {addr}\n\n"
                "This condition poses a significant inconvenience to the residents and a potential safety hazard to the public. "
                "The current state of infrastructure requires urgent maintenance to prevent accidents and ensure community well-being.\n\n"
                "I respectfully request the concerned authorities to inspect the site and initiate necessary "
                "remedial action at the earliest convenience.\n\n"
                "Expecting a prompt resolution.\n\n"
            )

            print(f"✅ Letter Generated via Template for {issue}")
            return subject, body

        except Exception as e:
            print(f"❌ Template Error: {e}")
            return f"Complaint: {issue}", "Could not generate letter."

llm_engine = LLMService()