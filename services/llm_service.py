import os
from google import genai
from google.genai import types

def _init_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY environment variable")

    return genai.Client(api_key=api_key)

client = _init_client()

MODEL_NAME = "gemini-3-flash-preview"

def clean_output(text: str) -> str:
    text = text.strip()

    if text.startswith("```"):
        text = text.strip("`")
        text = text.replace("json", "", 1).strip()

    return text

def call_llm(prompt: str) -> str:
    """
    Calls Gemini model and returns raw text output.
    """

    response = client.models.generate_content(
        model = MODEL_NAME,
        contents = prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
            top_p=0.9,
            max_output_tokens=4096,
        ),
    )

    if not response or not response.text:
        raise Exception("Empty response from Gemini")

    raw = response.text
    return clean_output(raw)


# character = "a shy dragon"
# setting = "a snowy mountain village"
# event = "learns to make friends"

# result = call_llm(f"""
# You are generating a structured children's storybook.

# Before writing the pages, internally plan a brief outline with a clear beginning, middle, and end. Then write the pages based on that plan. Do not output the outline.

# Create a story using the following inputs:
# - Main character: {character}
# - Setting: {setting}
# - Starting event: {event}

# Requirements:
# 1. The story must be divided into exactly 10 pages.
# 2. Each page must contain exactly ONE sentence.
# 3. The story should follow a clear beginning, middle, and end.
# 4. Keep all characters and their physical traits STRICTLY consistent throughout the story.
# 5. Maintain a consistent tone and narrative style.

# Character Profiles (VERY IMPORTANT FOR IMAGE CONSISTENCY):
# - Create a profile for ALL characters.
# - Each profile MUST include:
#   - name
#   - a short, vivid physical description
#   - relative size description (e.g., "child-sized", "very small, about the size of a dog", "taller than other characters")
#   - default outfit (what they wear consistently across all pages)
#   - 2–3 distinctive visual features that NEVER change (e.g., "always has golden eyes", "always wears a red scarf")

# - Ensure clear relative scale relationships between characters (e.g., "Character A is half the height of Character B").

# Illustration Style:
# - Define a single, consistent illustration style for the entire book.
# - Keep it short and visually descriptive (e.g., "soft watercolor children's book illustration with warm lighting").

# Scene Descriptions (CRITICAL FOR IMAGE GENERATION):
# For EACH page, generate a highly detailed visual scene description.

# Each scene description MUST:
# - Be a single detailed paragraph optimized for text-to-image generation
# - Explicitly name all visible characters (no pronouns alone)
# - Include full character descriptions (not just names)
# - Reinforce consistent clothing and features
# - Clearly describe:
#   - what each character is doing
#   - where they are positioned relative to each other
#   - the environment and lighting

# Scale Consistency Rules:
# - Always reinforce relative size relationships between characters
# - Use interaction cues (e.g., standing next to, holding hands, flying above shoulder height)
# - Avoid ambiguous scale descriptions

# Do NOT reference "page numbers" or "text" in the scene description.

# Output format (STRICT JSON):
# {{
#   "title": "...",
#   "style": "...",
#   "characters": [
#     {{
#       "name": "...",
#       "description": "...",
#       "relative_size": "...",
#       "outfit": "...",
#       "distinctive_features": ["...", "..."]
#     }}
#   ],
#   "pages": [
#     {{
#       "page_number": 1,
#       "text": "...",
#       "scene_description": "..."
#     }}
#   ]
# }}
# """)

# print(result)

# print()