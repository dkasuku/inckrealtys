"""Reset only the admin user password from environment variables.

Use this in production (e.g. Railway shell) when you want to change the
admin password without re-running the full seed.py and touching properties,
sections or blog posts.

Usage:  python reset_admin.py
"""

from app import create_app
from extensions import db
from models import AdminUser


def reset_admin():
    app = create_app()
    with app.app_context():
        email = app.config["ADMIN_EMAIL"].lower()
        password = app.config["ADMIN_PASSWORD"]

        if not password or len(password) < 6:
            print("ERROR: ADMIN_PASSWORD is missing or too short.")
            return

        user = AdminUser.query.filter_by(email=email).first()
        if not user:
            user = AdminUser(email=email, name="Administrator")
            db.session.add(user)
            print(f"· admin created: {email}")
        else:
            print(f"· admin updated: {email}")

        user.set_password(password)
        db.session.commit()
        print("Admin password reset complete.")


if __name__ == "__main__":
    reset_admin()
