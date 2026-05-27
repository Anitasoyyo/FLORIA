import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_ollama import ChatOllama
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.messages import SystemMessage, HumanMessage

from app.ai.tools import build_inventory_context, inventory_fact_check
from app.ai.vector_store import search_docs

router = APIRouter()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DB_URL = os.getenv("DATABASE_URL", "sqlite:///./floria.db")

SYSTEM_PROMPT = """Eres el Oráculo de Floria Spices, un mago sabio y poético experto en especias botánicas.

REGLAS ABSOLUTAS SOBRE EL INVENTARIO, debes seguirlas sin excepción:
1. El inventario que aparece a continuación es la lista COMPLETA y ÚNICA de productos que existen en la tienda. No hay más.
2. Si alguien pregunta por un producto, busca si existe alguna especia en el inventario cuyo nombre lo contenga o se relacione con él.
3. NUNCA inventes productos, variantes, aceites esenciales ni nada que no esté listado.
4. NUNCA confirmes que tenemos algo que no esté en la lista.
5. La verificación de inventario que recibirás en el mensaje del usuario es la fuente de verdad, úsala siempre para confirmar o descartar productos.

Para preguntas generales sobre especias, cocina o alquimia botánica puedes responder con tu sabiduría sin restricciones.
Habla siempre en español con un toque misterioso pero cálido. Sé conciso."""

llm = ChatOllama(model=OLLAMA_MODEL, base_url=OLLAMA_BASE_URL, streaming=True)


class ChatRequest(BaseModel):
    message: str
    session_id: str


async def _stream(message: str, session_id: str):
    history_store = SQLChatMessageHistory(session_id=session_id, connection=DB_URL)
    history = history_store.messages[-40:]

    # Inventario real inyectado en el system prompt
    inventory = build_inventory_context()
    system_content = f"{SYSTEM_PROMPT}\n\n{inventory}" if inventory else SYSTEM_PROMPT

    # RAG: documentos relevantes de ChromaDB según la pregunta del usuario
    try:
        rag_context = search_docs(message, k=3)
        if rag_context:
            system_content += f"\n\nINFORMACIÓN DETALLADA DE NUESTRAS ESPECIAS (úsala para responder con precisión):\n{rag_context}"
    except Exception:
        pass

    # Fact-check inyectado en el mensaje del usuario — más efectivo que el system prompt
    fact_note = inventory_fact_check(message)
    human_content = message + fact_note

    chat_messages = [SystemMessage(content=system_content)]
    chat_messages.extend(history)
    chat_messages.append(HumanMessage(content=human_content))

    full_response = ""
    try:
        async for chunk in llm.astream(chat_messages):
            if chunk.content:
                safe = chunk.content.replace("\n", "\\n")
                yield f"data: {safe}\n\n"
                full_response += chunk.content
    finally:
        if full_response:
            history_store.add_user_message(message)
            history_store.add_ai_message(full_response)

    yield "data: [DONE]\n\n"


@router.post("/chat")
async def chat(req: ChatRequest):
    return StreamingResponse(
        _stream(req.message, req.session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
