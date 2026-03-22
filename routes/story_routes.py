from flask import Blueprint, request, jsonify
from services.story_service import generate_story

story_bp = Blueprint("story", __name__)

@story_bp.route("/generate-story", methods=["POST"])
def generate_story_route():
    data = request.json
    character = data.get("character")
    setting = data.get("setting")
    event = data.get("event")

    if not character:
        return jsonify({"error": "Missing character"}), 400

    try:
        story = generate_story(character, setting, event)
        return jsonify(story.model_dump())

    except Exception as e:
        return jsonify({"error": str(e)}), 500