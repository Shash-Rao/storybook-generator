from models.schema import Story
from services.prompt_builder import build_prompt
from services.llm_service import call_llm
from utils.retry import validate_and_parse

def generate_story(user_input: str):
    prompt = build_prompt(user_input)
    
    num_retry = 3
    for _ in range(num_retry):
        try:
            raw = call_llm(prompt)
            story = validate_and_parse(raw, Story)
            return story

        except Exception:
            continue

    raise Exception("Failed to generate valid story")