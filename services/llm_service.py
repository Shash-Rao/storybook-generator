import os
from google import genai
from google.genai import types

def _init_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY environment variable")

    return genai.Client(api_key=api_key)

client = _init_client()

MODEL_NAME = "gemini-flash-latest"

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