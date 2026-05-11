from pydantic import BaseModel
from typing import Literal

SpiceTipo = Literal[
    "Herbácea",
    "Floral",
    "Cítrica",
    "Aromática",
    "Terrosa",
    "Leñosa",
    "Picante",
    "Especiada",
    "Dulce",
    "Mezcla",
]


class Spice(BaseModel):
    id: int
    nombre: str
    descripcion: str
    tipo: SpiceTipo
    rareza: int   # 1–5
    precio: float
    emoji: str
    disponible: int = 1  # 1 = sí, 0 = no
    stock: int = 10

    class Config:
        from_attributes = True
