from pydantic import BaseModel
from typing import List

class Page(BaseModel):
    text: str
    image_prompt: str

class Story(BaseModel):
    title: str
    pages: List[Page]