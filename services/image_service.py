import os
import shutil
import time
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed

from google import genai
from google.genai import types

from services.prompt_builder import build_character_prompt, build_page_prompt

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-2.5-flash-image"
OUTPUT_DIR = "storybook_outputs"
MAX_WORKERS = 4
RETRIES = 3

shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def _init_client():
    if not API_KEY:
        raise ValueError("Set GEMINI_API_KEY environment variable")
    return genai.Client(api_key=API_KEY)

client = _init_client()

def save_image_bytes(image_bytes: bytes, filename: str):
    with open(filename, "wb") as f:
        f.write(image_bytes)


def extract_first_image_bytes(resp) -> bytes:
    for cand in resp.candidates:
        for part in cand.content.parts:
            if getattr(part, "inline_data", None) and part.inline_data.data:
                return part.inline_data.data
    raise RuntimeError("No image returned from model")


def retry(func, retries=RETRIES):
    for attempt in range(retries):
        try:
            return func()
        except Exception as e:
            if attempt == retries - 1:
                raise
            wait = 2 ** attempt
            print(f"Retrying in {wait}s due to error: {e}")
            time.sleep(wait)

def generate_character_images(client: genai.Client, characters: List[Dict], style: str):
    image_paths = {}

    for char in characters:
        prompt = build_character_prompt(char, style)

        print(f"Generating character: {char['name']}")

        def call():
            return client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

        resp = retry(call)

        img_bytes = extract_first_image_bytes(resp)
        filename = os.path.join(OUTPUT_DIR, f"{char['name'].lower()}.png")
        save_image_bytes(img_bytes, filename)

        image_paths[char["name"]] = filename

    return image_paths

def generate_single_page(client, page, style, character_images, characters):
    prompt = build_page_prompt(page["scene_description"], page["characters_present"], style, characters)

    parts = [types.Part(text=prompt)]

    for path in character_images.values():
        filename = os.path.basename(path)
        if filename in page["characters_present"]:
            with open(path, "rb") as f:
                parts.append(types.Part.from_bytes(data=f.read(), mime_type="image/png"))

    def call():
        return client.models.generate_content(
            model=MODEL_NAME,
            contents=types.Content(role="user", parts=parts),
        )

    resp = retry(call)

    img_bytes = extract_first_image_bytes(resp)
    filename = os.path.join(OUTPUT_DIR, f"page_{page['page_number']}.png")
    save_image_bytes(img_bytes, filename)

    return page["page_number"]

def generate_page_images_parallel(client, pages, style, character_images, characters):
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(generate_single_page, client, page, style, character_images, characters)
            for page in pages
        ]

        for future in as_completed(futures):
            try:
                page_num = future.result()
                print(f"Finished page {page_num}")
            except Exception as e:
                print(f"Error generating page: {e}")

def generate_story_images(story_data):
    characters = story_data["characters"]
    pages = story_data["pages"]
    style = "Soft watercolor texture, soft edges, pastel palette, gentle lighting, fairytale"

    character_images = generate_character_images(client, characters, style)
    generate_page_images_parallel(client, pages, style, character_images, characters)

    return 