import os

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from config import Config
from extensions import db


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    from routes.admin import admin_bp
    from routes.public import public_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    # Fallback static serving of uploads (Next.js normally serves these
    # directly from public/uploads, but this keeps the API self-contained).
    @app.get("/uploads/<path:filename>")
    def uploads(filename):
        return send_from_directory(app.config["UPLOAD_DIR"], filename)

    @app.get("/")
    def index():
        return jsonify({"service": "INCK Realty API", "status": "ok"})

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(413)
    def too_large(_):
        return jsonify({"error": "File too large"}), 413

    with app.app_context():
        app.config["UPLOAD_DIR"].mkdir(parents=True, exist_ok=True)
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=int(os.getenv("PORT", "5000")))
