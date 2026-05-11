from typing import Literal
from pydantic import BaseModel


class StoryCard(BaseModel):
    id: int
    tag: str
    title: str
    content: str
    icon: str
    position: Literal["left", "right"]
