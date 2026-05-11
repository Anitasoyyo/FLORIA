from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import text
import os

from app.db.database import Base, engine, SessionLocal
from app.models import user as _user_model        # noqa: F401 — registra el modelo
from app.models import spice as _spice_model      # noqa: F401 — registra el modelo
from app.models import order as _order_model      # noqa: F401 — registra el modelo
from app.api.v1.routes import story, spices, auth, chat, orders

load_dotenv()

Base.metadata.create_all(bind=engine)


def _run_migrations() -> None:
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE spices ADD COLUMN stock INTEGER DEFAULT 10"))
            conn.commit()
        except Exception:
            pass  # columna ya existe


_run_migrations()

# Seed de especias — solo si la tabla está vacía
def _seed_spices() -> None:
    from app.models.spice import Spice

    db = SessionLocal()
    try:
        existing_ids = {row.id for row in db.query(Spice.id).all()}
        seeds = [
            Spice(id=1,  nombre="Albahaca de Cristal",        descripcion="Sus hojas son translúcidas y saben a frescura pura.",                              tipo="Herbácea",  rareza=3, precio=12.90, emoji="🌿", stock=12),
            Spice(id=2,  nombre="Anís Estrellado del Alba",    descripcion="Recolectado justo cuando sale el sol en el invernadero.",                           tipo="Dulce",     rareza=4, precio=18.50, emoji="⭐", stock=7),
            Spice(id=3,  nombre="Cilantro de los Vientos",     descripcion="Un sabor cítrico que parece flotar en el paladar.",                                 tipo="Cítrica",   rareza=2, precio=9.90,  emoji="🍃", stock=20),
            Spice(id=4,  nombre="Eneldo de Bruma",             descripcion="Ideal para pescados mágicos, crece en la zona más húmeda.",                         tipo="Aromática", rareza=3, precio=14.50, emoji="🌾", stock=12),
            Spice(id=5,  nombre="Canela de Corteza Celestial", descripcion="Una variedad que brilla en la oscuridad.",                                           tipo="Dulce",     rareza=5, precio=32.00, emoji="✨", stock=3),
            Spice(id=6,  nombre="Cúrcuma de Ámbar",            descripcion="Deja un rastro dorado metálico en las comidas.",                                    tipo="Terrosa",   rareza=4, precio=15.90, emoji="🌕", stock=7),
            Spice(id=7,  nombre="Cardamomo de Jade",           descripcion="Una de las dos variedades reinas de Floria. Verde y floral.",                       tipo="Floral",    rareza=4, precio=24.90, emoji="💚", stock=7),
            Spice(id=8,  nombre="Cardamomo de Obsidiana",      descripcion="La variedad negra, reina oscura de Floria. Intensa y profunda.",                    tipo="Especiada", rareza=5, precio=34.90, emoji="🖤", stock=3),
            Spice(id=9,  nombre="Clavo de Esencia Profunda",   descripcion="Tan potente que una sola pizca cambia el color del plato.",                         tipo="Picante",   rareza=4, precio=19.90, emoji="🔴", stock=7),
            Spice(id=10, nombre="Comino de Tierra Firme",      descripcion="Cultivado en las raíces del gran árbol del invernadero.",                            tipo="Terrosa",   rareza=2, precio=8.90,  emoji="🌰", stock=20),
            Spice(id=11, nombre="Orégano Silvestre de Floria", descripcion="Secado al aire de los ventiladores de madera del laboratorio.",                      tipo="Herbácea",  rareza=3, precio=11.90, emoji="🌱", stock=12),
            Spice(id=12, nombre="Cinco Secretos Orientales",   descripcion="Nuestra versión de las cinco especias chinas. Un equilibrio perfecto.",              tipo="Mezcla",    rareza=4, precio=22.90, emoji="🔮", stock=7),
            Spice(id=13, nombre="Curry de Solsticio",          descripcion="Una mezcla de 12 especias que cambia de color al cocinarla.",                        tipo="Mezcla",    rareza=5, precio=38.00, emoji="🌈", stock=3),
            Spice(id=14, nombre="Especias del Sol Naciente",   descripcion="Selección japonesa estilo Shichimi Togarashi con un toque de Floria.",               tipo="Mezcla",    rareza=4, precio=26.90, emoji="🌅", stock=7),
            Spice(id=15, nombre="Dúo de Cítricos Etéreos",    descripcion="Polvo fino de corteza de limón y naranja cultivados en altura.",                     tipo="Cítrica",   rareza=3, precio=16.90, emoji="🍋", stock=12),
            Spice(id=16, nombre="Romero de Roca Antigua",      descripcion="Crece entre piedras milenarias, su aroma perdura días en el ambiente.",              tipo="Leñosa",    rareza=3, precio=13.90, emoji="🪨", stock=12),
            Spice(id=17, nombre="Tomillo de Raíces Negras",    descripcion="Sus raíces oscuras le dan un toque ahumado imposible de imitar.",                    tipo="Leñosa",    rareza=4, precio=21.90, emoji="🌑", stock=7),
            Spice(id=18, nombre="Nuez Moscada del Crepúsculo", descripcion="Rallada al atardecer, libera aromas que solo existen en ese instante.",              tipo="Leñosa",    rareza=5, precio=36.00, emoji="🌫️", stock=3),
            Spice(id=19, nombre="Menta de Hielo Eterno",       descripcion="Sus hojas mantienen el frío incluso en verano. Refrescante al extremo.",             tipo="Herbácea",  rareza=3, precio=10.90, emoji="🧊", stock=12),
            Spice(id=20, nombre="Salvia de los Ancianos",      descripcion="Usada en rituales de memoria. Un sabor que evoca recuerdos lejanos.",                tipo="Herbácea",  rareza=4, precio=17.90, emoji="🔮", stock=7),
            Spice(id=21, nombre="Mejorana de los Sueños",      descripcion="Se añade a infusiones nocturnas. Dicen que hace soñar en colores.",                 tipo="Herbácea",  rareza=3, precio=12.50, emoji="🌙", stock=12),
        ]
        new = [s for s in seeds if s.id not in existing_ids]
        if new:
            db.add_all(new)
            db.commit()
    finally:
        db.close()

_seed_spices()

app = FastAPI(
    title="Floria Spices API",
    version="1.0.0",
    description="API for Floria Spices landing page",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(story.router,  prefix="/api/v1", tags=["story"])
app.include_router(spices.router, prefix="/api/v1", tags=["spices"])
app.include_router(auth.router,   prefix="/api/v1", tags=["auth"])
app.include_router(chat.router,   prefix="/api/v1", tags=["chat"])
app.include_router(orders.router, prefix="/api/v1", tags=["orders"])


@app.get("/api/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "floria-spices-api"}
