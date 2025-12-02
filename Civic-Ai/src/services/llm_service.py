import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
from PIL import Image
import io

API_KEY = os.getenv("GEMINI_API_KEY")

class LLMService:
    def __init__(self):
        try:
            if "AIzaSy" not in API_KEY:
                print("⚠️ CRITICAL: Missing Gemini API Key")
                self.model = None
            else:
                genai.configure(api_key=API_KEY)
                
                self.model = genai.GenerativeModel('gemini-2.0-flash')
                print("✅ Gemini AI Connected")
                
        except Exception as e:
            print(f"❌ Gemini Config Error: {e}")
            self.model = None

    def validate_image(self, image_bytes):
        """
        Checks if the image is valid (not black/blur/irrelevant).
        """
        if not self.model:
            return True, "AI Validator skipped"

        try:
            image = Image.open(io.BytesIO(image_bytes))

            prompt = """
            You are a strict Civic Issue Validator. Analyze this image.
            
            Does this image show a **significant** civic problem?
            
            Valid Issues (YES):
            1. Garbage Dumps / Overflowing Bins (Must be a significant pile, not just 1 wrapper).
            2. Potholes / Broken Roads (Must be clearly visible).
            3. Broken Streetlights / Dangerous Wiring.
            4. Fallen Trees blocking paths (Just grass or standing trees are NOT issues).
            5. Water Leakage / Floods.
            6. Dead Animals.

            Invalid Issues (NO):
            - Just grass, plants, or a garden.
            - A single piece of paper or small litter on grass.
            - Normal roads with no damage.
            - Dark/Black images.
            - Selfies or random objects.

            Return response strictly in this format:
            VERDICT: [YES/NO]
            REASON: [Short explanation]
            """

            response = self.model.generate_content([prompt, image])
            text = response.text.strip()
            
            print(f"🔍 Gemini Validation: {text}")

            if "VERDICT: NO" in text:
                reason = text.split("REASON:")[1].strip() if "REASON:" in text else "Image does not show a significant civic issue."
                return False, reason
            
            return True, "Valid"

        except Exception as e:
            print(f"❌ Image Validation Error: {e}")
            return True, "Validation skipped due to error"

    def generate_letter(self, issue_type, department, address):
        if not self.model:
            print("❌ LLM skipped: Model not loaded.")
            return f"Subject: Issue regarding {issue_type}", "Automatic generation failed."

        prompt = f"""
        You are a helpful citizen writing a formal complaint to the {department}.
        
        Details:
        - Issue: {issue_type}
        - Location: {address}

        Task:
        Write a professional complaint letter body (under 60 words).
        Be direct and polite.
        
        Format your response exactly like this:
        Subject: [Write a strong subject line here]
        [Write the body paragraph here]
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text
            
            if "Subject:" in text:
                parts = text.split("Subject:")
                content = parts[1].strip()
                if "\n" in content:
                    subject_line, body_text = content.split("\n", 1)
                    return subject_line.strip(), body_text.strip()
            
            return f"Complaint regarding {issue_type}", text
            
        except Exception as e:
            print(f"❌ LLM Generation Error: {e}")
            return f"Urgent: {issue_type} Reported", "Could not generate letter."

llm_engine = LLMService()