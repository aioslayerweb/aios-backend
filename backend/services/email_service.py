import os
import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

resend.api_key = RESEND_API_KEY


def send_email(to_email: str, subject: str, content: str):
    """
    Sends email via Resend
    """

    try:
        response = resend.Emails.send({
            "from": "AIOS <onboarding@resend.dev>",
            "to": to_email,
            "subject": subject,
            "html": content,
        })

        print("Email sent:", response)
        return {"status": "sent", "response": response}

    except Exception as e:
        print("Email error:", e)
        return {"status": "error", "error": str(e)}
