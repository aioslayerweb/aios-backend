def execute_action(user_id: str, user_email: str, action: str):
    if action == "do_nothing":
        return {"status": "skipped"}

    # 🚫 simple spam protection
    if not user_email:
        return {"status": "no_email"}

    if action == "send_email_winback":
        send_email(
            user_email,
            "We miss you at AIOS",
            "Come back and see what's new!"
        )

    elif action == "send_email_engagement":
        send_email(
            user_email,
            "AIOS insights for you",
            "You're becoming an active user!"
        )

    return {"status": "executed", "action": action}
