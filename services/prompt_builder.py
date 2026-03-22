from typing import List, Dict

def build_story_prompt(character: str, setting: str, event: str) -> str:
    return f"""
You are generating a structured children's storybook.

Before writing the pages, internally plan a brief outline with a clear beginning, middle, and end. Then write the pages based on that plan. Do not output the outline.

Create a story using the following inputs:
- Main character: {character}
- Setting: {setting}
- Starting event: {event}

Requirements:
1. The story must be divided into exactly 10 pages.
2. Each page must contain exactly ONE sentence.
3. The story should follow a clear beginning, middle, and end.
4. Keep all characters and their physical traits STRICTLY consistent throughout the story.
5. Maintain a consistent tone and narrative style.

Character Profiles (VERY IMPORTANT FOR IMAGE CONSISTENCY):
- Create a profile for ALL characters.
- Each profile MUST include:
  - name
  - a short, vivid physical description
  - relative size description (e.g., "child-sized", "very small, about the size of a dog", "taller than other characters")
  - default outfit (what they wear consistently across all pages)
  - 2–3 distinctive visual features that NEVER change (e.g., "always has golden eyes", "always wears a red scarf")

- Ensure clear relative scale relationships between characters (e.g., "Character A is half the height of Character B").
- Ensure each character is visually distinct from all others
- Avoid giving multiple characters similar clothing or silhouettes
- Each character should be easily distinguishable at a glance

Scene Descriptions (CRITICAL FOR IMAGE GENERATION):
For EACH page, generate a highly detailed visual scene description.

Each scene description MUST:
- Be a single detailed paragraph optimized for text-to-image generation
- Explicitly name all visible characters (no pronouns alone)
- Include full character descriptions (not just names)
- Reinforce consistent clothing and features
- Clearly describe:
  - what each character is doing
  - where they are positioned relative to each other
  - the environment and lighting

Scale Consistency Rules:
- Always reinforce relative size relationships between characters
- Use interaction cues (e.g., standing next to, holding hands, flying above shoulder height)
- Avoid ambiguous scale descriptions

Do NOT reference "page numbers" or "text" in the scene description.

Output format (STRICT JSON):
{{
  "title": "...",
  "characters": [
    {{
      "name": "...",
      "description": "...",
      "relative_size": "...",
      "outfit": "...",
      "distinctive_features": ["...", "..."]
    }}
  ],
  "pages": [
    {{
      "page_number": 1,
      "text": "...",
      "scene_description": "..."
      "characters_present": ["...", "..."]
    }}
  ]
}}
"""

def build_character_prompt(character: Dict, style: str) -> str:
    return f"""
A full-body character design of {character['name']}, {character['description']}.

Additional details:
- relative size: {character['relative_size']}
- outfit: {character['outfit']}
- distinctive features: {', '.join(character['distinctive_features'])}

Style: {style}

Requirements:
- centered composition
- pure white background
- no shadows, no environment
- clean silhouette
- facing slightly forward (3/4 view)
- soft watercolor texture
"""

def build_page_prompt(scene: str, characters_present: List[str], style: str, characters: List[Dict]) -> str:
    char_lines = "".join([
        f"- {c['name']}: {c['description']}, wearing {c['outfit']}, features: {', '.join(c['distinctive_features'])}, size: {c['relative_size']}"
        for c in characters if c["name"] in characters_present
    ])

    return f"""
Create a children's book illustration.

Scene:
{scene}

Characters:
{char_lines}

Style:
{style}

Scale Rules:
- maintain consistent relative sizes between characters
- preserve given sizes from the character descriptions

Character Constraints:
- Only include the characters explicitly mentioned
- Each named character must appear exactly once
- Do NOT duplicate or create additional characters with similar appearances
- Do NOT create unnamed background characters unless explicitly described

Composition Guidelines:
- cinematic but simple framing
- soft lighting appropriate to the scene
- expressive characters
- no text

Use the provided reference images to ensure consistency.
"""
