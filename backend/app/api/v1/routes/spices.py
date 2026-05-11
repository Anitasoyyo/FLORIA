from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.spice import Spice as SpiceModel
from app.schemas.spice import Spice

router = APIRouter()


@router.get("/spices", response_model=list[Spice])
def get_spices(db: Session = Depends(get_db)) -> list[Spice]:
    return db.query(SpiceModel).all()


@router.get("/spices/search", response_model=list[Spice])
def search_spices(
    q: str = Query(default="", description="Nombre o fragmento a buscar"),
    db: Session = Depends(get_db),
) -> list[Spice]:
    query = q.strip().lower()
    if not query:
        return db.query(SpiceModel).all()
    # SQLite's LIKE is case-insensitive only for ASCII — Python's lower() handles Unicode (Á→á, etc.)
    all_spices = db.query(SpiceModel).all()
    return [s for s in all_spices if query in s.nombre.lower()]
