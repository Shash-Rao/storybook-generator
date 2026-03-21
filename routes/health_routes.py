from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)

@health_bp.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "service": "storybook-api"
    })

@health_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy"
    })