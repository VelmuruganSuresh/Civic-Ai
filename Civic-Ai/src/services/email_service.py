import requests
import os
from dotenv import load_dotenv
import secrets

load_dotenv()

# Retrieve keys from environment variables (or Hugging Face Secrets)
BREVO_API_KEY = os.getenv("BREVO_API_KEY") 
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

class EmailService:
    def generate_token(self):
        return secrets.token_urlsafe(32)

    # Keep this if you implement verification later, otherwise it does nothing for now
    async def send_verification_email(self, email, token):
        print("Verification email skipped (Using Brevo for Resolution only)")
        return True

    async def send_resolution_email(self, email, username, title, body, dept, address):
        url = "https://api.brevo.com/v3/smtp/email"
        
        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }

        # --- PROFESSIONAL HTML TEMPLATE ---
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #10B981;">Complaint Resolved ✅</h2>
            <p>Dear <strong>{username}</strong>,</p>
            
            <p>We are pleased to inform you that the civic complaint you registered has been successfully resolved by the <strong>{dept}</strong>.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h3 style="color: #333;">Reference: Official Complaint Letter</h3>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; font-size: 14px; color: #555; border: 1px solid #eee;">
                <p style="margin: 5px 0;"><strong>To:</strong> The Commissioner, {dept}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> {address}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> {title}</p>
                <p style="margin: 15px 0 5px 0;"><strong>Body:</strong></p>
                <p style="margin: 0; line-height: 1.5;">{body}</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #888;">Thank you for being a responsible citizen and helping us keep the city clean and safe.</p>
            <p style="font-size: 12px; color: #888;">- Civic AI Team</p>
        </div>
        """

        payload = {
            "sender": {"name": "Civic AI Team", "email": SENDER_EMAIL},
            "to": [{"email": email, "name": username}],
            "subject": f"Resolved: {title}",
            "htmlContent": html_content 
        }

        try:
            # Send using standard HTTP POST (Works on Hugging Face)
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 201:
                print(f"✅ Email Sent Successfully to {email}")
                return True
            else:
                print(f"❌ Brevo Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Email Connection Error: {e}")
            return False

email_engine = EmailService()