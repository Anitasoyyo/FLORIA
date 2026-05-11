from app.db.database import SessionLocal
from app.models.spice import Spice

_STOP_WORDS = {
    'que', 'hay', 'tiene', 'tienen', 'teneis', 'tenemos', 'una', 'uno',
    'las', 'los', 'del', 'para', 'con', 'por', 'como', 'algo', 'alguna',
    'vuestra', 'vuestro', 'disponible', 'stock', 'catalogo', 'producto',
    'especia', 'especias', 'esta', 'este', 'esa', 'ese', 'hola', 'buenas',
    'gracias', 'existe', 'vende', 'venden', 'quiero', 'saber', 'puedes',
    'favor', 'teneis', 'podeis', 'tienes', 'decir', 'decirme',
}


def build_inventory_context() -> str:
    """Inventario completo para el system prompt."""
    db = SessionLocal()
    try:
        spices = db.query(Spice).all()
        if not spices:
            return ""
        lines = ["INVENTARIO COMPLETO DE FLORIA SPICES (esta es la lista ENTERA, no hay más productos):"]
        for s in spices:
            estado = "disponible" if s.disponible else "AGOTADA"
            lines.append(
                f"- {s.emoji} {s.nombre} | Tipo: {s.tipo} | "
                f"Rareza: {'★' * s.rareza} | Precio: {s.precio}€ | {estado}"
            )
        return "\n".join(lines)
    finally:
        db.close()


# Palabras que indican que el usuario pregunta por un producto concreto
_INVENTORY_TRIGGERS = {
    'tienen', 'tenéis', 'teneis', 'hay', 'existe', 'disponible',
    'vendéis', 'vendeis', 'venden', 'comprar', 'precio', 'stock',
    'tienes', 'tienen', 'conseguir', 'encontrar',
}


def inventory_fact_check(message: str) -> str:
    """
    Solo se activa cuando el usuario pregunta por un producto concreto.
    Extrae el sustantivo buscado y verifica si existe en el catálogo.
    """
    msg_lower = message.lower()

    # No activar si el usuario no está preguntando por productos
    if not any(trigger in msg_lower for trigger in _INVENTORY_TRIGGERS):
        return ""

    db = SessionLocal()
    try:
        all_spices = db.query(Spice).all()

        # Palabras candidatas: >3 chars, no stop words, no triggers
        skip = _STOP_WORDS | _INVENTORY_TRIGGERS
        words = [
            w.strip('¿?¡!.,;:\'"')
            for w in msg_lower.split()
            if len(w.strip('¿?¡!.,;:\'"')) > 3
            and w.strip('¿?¡!.,;:\'"') not in skip
        ]

        if not words:
            return ""

        results = []
        for word in set(words):
            matches = [s for s in all_spices if word in s.nombre.lower()]
            if matches:
                names = ', '.join(
                    f"{s.nombre} ({'disponible' if s.disponible else 'AGOTADA'})"
                    for s in matches
                )
                results.append(f"'{word}' → encontrado en catálogo: {names}")
            else:
                results.append(f"'{word}' → NO existe en nuestro catálogo")

        if not results:
            return ""

        return (
            "\n\n[VERIFICACIÓN DE INVENTARIO — respeta estos hechos exactos:\n"
            + "\n".join(f"  • {r}" for r in results)
            + "\n]"
        )
    finally:
        db.close()
