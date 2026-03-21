def build_prompt(user_input: str) -> str:
    return f"""
Generate a children's story.

Return ONLY valid JSON:
{{
  "title": "string",
  "pages": [
    {{
      "text": "string",
      "image_prompt": "string"
    }}
  ]
}}

Requirements:
- 5 pages
- short sentences

User input:
{user_input}
"""