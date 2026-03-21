def build_prompt(character: str, setting: str, event: str) -> str:
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
4. Keep all characters and their physical traits consistent throughout the story.
5. Maintain a consistent tone and narrative style.
Additionally:
- Create a character profile for ALL characters in the story.
  - Each profile must include:
    - name
    - a short, vivid physical description (this will be used for image generation)
- Define a single, consistent illustration style for the entire book.
  - This should be a short phrase (e.g., "soft watercolor children's book illustration")
- For EACH page, generate a highly detailed visual scene description for image generation.
  - This must clearly describe:
    - which characters are present (using their names)
    - what they are doing
    - the environment/setting
  - Always include full character descriptions when relevant (not pronouns alone).
  - Ensure each scene description is visually specific and consistent with the story and character profiles.Write it as as a single, detailed paragraph optimized for text-to-image generation.
  - Do NOT reference "page numbers" or "text" in the description.
Output format (STRICT JSON):
{{
  "title": "...",
  "style": "...",
  "characters": [
    {{
      "name": "...",
      "description": "..."
    }}
  ],
  "pages": [
    {{
      "page_number": 1,
      "text": "...",
      "scene_description": "..."
    }}
  ]
}}
"""