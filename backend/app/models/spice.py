from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base


class Spice(Base):
    __tablename__ = "spices"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, index=True)
    descripcion = Column(String, nullable=False)
    tipo = Column(String, nullable=False)
    rareza = Column(Integer, nullable=False)
    precio = Column(Float, nullable=False)
    emoji = Column(String, nullable=False)
    disponible = Column(Integer, default=1)  # 1 = sí, 0 = no
    stock = Column(Integer, default=10)
