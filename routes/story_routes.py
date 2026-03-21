from flask import Blueprint, request, jsonify
from services.story_service import generate_story

story_bp = Blueprint("story", __name__)

@story_bp.route("/generate-story", methods=["POST"])
def generate_story_route():
    data = request.json
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400

    try:
        story = generate_story(prompt)
        return jsonify(story.dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500