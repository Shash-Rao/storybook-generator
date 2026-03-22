from flask import Flask, send_from_directory
from flask_cors import CORS

from routes.story_routes import story_bp
from routes.health_routes import health_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(story_bp)
    app.register_blueprint(health_bp)

    @app.route("/images/<filename>")
    def serve_image(filename):
        return send_from_directory("storybook_outputs", filename)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)