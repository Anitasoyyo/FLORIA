from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.spice import Spice


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String, nullable=False, default="pendiente")
    total = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    spice_id = Column(Integer, ForeignKey("spices.id"), nullable=False)
    qty = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    spice = relationship("Spice")

    @property
    def spice_nombre(self) -> str:
        return self.spice.nombre

    @property
    def spice_emoji(self) -> str:
        return self.spice.emoji
