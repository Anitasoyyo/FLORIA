from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.db.database import get_db
from app.models.order import Order, OrderItem
from app.models.spice import Spice as SpiceModel
from app.schemas.order import OrderIn, OrderOut
from app.api.v1.routes.auth import get_current_user

router = APIRouter()


@router.get("/orders", response_model=list[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> list[Order]:
    return (
        db.query(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.spice))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(
    payload: OrderIn,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> Order:
    if not payload.items:
        raise HTTPException(status_code=400, detail="El pedido no puede estar vacío")

    spice_map: dict[int, SpiceModel] = {}
    for item in payload.items:
        spice = db.query(SpiceModel).filter(SpiceModel.id == item.spice_id).first()
        if not spice:
            raise HTTPException(status_code=404, detail=f"Especia {item.spice_id} no encontrada")
        if spice.stock < item.qty:
            raise HTTPException(
                status_code=409,
                detail=f"Stock insuficiente para '{spice.nombre}' (disponible: {spice.stock})",
            )
        spice_map[item.spice_id] = spice

    total = sum(spice_map[i.spice_id].precio * i.qty for i in payload.items)
    order = Order(user_id=current_user.id, status="pendiente", total=total)
    db.add(order)
    db.flush()

    for item in payload.items:
        spice = spice_map[item.spice_id]
        db.add(OrderItem(
            order_id=order.id,
            spice_id=item.spice_id,
            qty=item.qty,
            precio_unitario=spice.precio,
        ))
        spice.stock -= item.qty

    db.commit()
    return (
        db.query(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.spice))
        .filter(Order.id == order.id)
        .one()
    )
