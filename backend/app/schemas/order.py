from pydantic import BaseModel
from datetime import datetime
from typing import Literal


OrderStatus = Literal["pendiente", "confirmado", "enviado", "entregado"]


class OrderItemIn(BaseModel):
    spice_id: int
    qty: int


class OrderIn(BaseModel):
    items: list[OrderItemIn]


class OrderItemOut(BaseModel):
    spice_id: int
    spice_nombre: str
    spice_emoji: str
    qty: int
    precio_unitario: float

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    status: OrderStatus
    total: float
    created_at: datetime
    items: list[OrderItemOut]

    class Config:
        from_attributes = True
