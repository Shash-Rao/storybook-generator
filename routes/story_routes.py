from flask import Blueprint, request, jsonify
from services.story_service import generate_story
from services.image_service import generate_story_images

story_bp = Blueprint("story", __name__)

@story_bp.route("/generate-story", methods=["POST"])
def generate_story_route():
    data = request.json
    character = data.get("prompt")
    setting = data.get("setting")
    event = data.get("event")

    if not character:
        return jsonify({"error": "Missing prompt"}), 400

    try:
        story = generate_story(character, setting, event)
        story_dict = story.model_dump()
        story_json = jsonify(story_dict)
        
        generate_story_images(story_dict)

        return story_json

    except Exception as e:
        return jsonify({"error": str(e)}), 500