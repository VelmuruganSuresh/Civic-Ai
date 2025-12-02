from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import secrets
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_USERNAME"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

class EmailService:
    def generate_token(self):
        return secrets.token_urlsafe(32)


    async def send_resolution_email(self, email: EmailStr, username: str, title: str, body: str, dept: str, address: str):
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #10B981;">Complaint Resolved ✅</h2>
            <p>Dear <strong>{username}</strong>,</p>
            
            <p>We are pleased to inform you that the civic complaint you registered has been successfully resolved by the <strong>{dept}</strong>.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <h3 style="color: #333;">Reference: Official Complaint Letter</h3>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; font-size: 14px; color: #555;">
                <p><strong>To:</strong> The Commissioner, {dept}</p>
                <p><strong>Location:</strong> {address}</p>
                <p><strong>Subject:</strong> {title}</p>
                <p><strong>Body:</strong><br>{body}</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #888;">Thank you for being a responsible citizen.</p>
            <p style="font-size: 12px; color: #888;">- Civic AI Team</p>
        </div>
        """

        message = MessageSchema(
            subject=f"Resolved: {title}",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        return True

email_engine = EmailService()