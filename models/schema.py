from pydantic import BaseModel
from typing import List

class Page(BaseModel):
    page_number: int
    text: str
    scene_description: str
    characters_present: List[str]

class Character(BaseModel):
    name: str
    description: str
    relative_size: str  # e.g. "child-sized", "dog-sized", "taller than others"
    outfit: str  # default consistent clothing
    distinctive_features: List[str]  # invariant visual anchors

class Story(BaseModel):
    title: str
    characters: List[Character]
    pages: List[Page]