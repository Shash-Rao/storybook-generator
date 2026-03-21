from pydantic import BaseModel
from typing import List

class Page(BaseModel):
    page_number: int
    text: str
    scene_description: str

class Character(BaseModel):
    name: str
    description: str

class Story(BaseModel):
    title: str
    style: str
    characters: List[Character]
    pages: List[Page]