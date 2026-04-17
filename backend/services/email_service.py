import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")


FROM_EMAIL = os.getenv("FROM_EMAIL", "AIOS <onboarding@resend.dev>")


def send_email(to_email: str, subject: str, html: str):

    try:
        response = resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html
        })

        return {
            "status": "sent",
            "provider": "resend",
            "response": response
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
