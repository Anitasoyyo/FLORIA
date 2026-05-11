import os
from pathlib import Path

from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

DOCS_DIR = Path(__file__).parent / "docs"
CHROMA_DIR = Path(os.getenv("CHROMA_DIR", str(Path(__file__).parent / "chroma_db")))
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")


def _get_embeddings() -> OllamaEmbeddings:
    return OllamaEmbeddings(model=EMBED_MODEL, base_url=OLLAMA_BASE_URL)


def _load_docs() -> list[Document]:
    return [
        Document(
            page_content=md_file.read_text(encoding="utf-8"),
            metadata={"spice": md_file.stem},
        )
        for md_file in sorted(DOCS_DIR.glob("*.md"))
    ]


def _build_store() -> Chroma:
    embeddings = _get_embeddings()

    if CHROMA_DIR.exists() and any(CHROMA_DIR.iterdir()):
        return Chroma(persist_directory=str(CHROMA_DIR), embedding_function=embeddings)

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=80)
    chunks = splitter.split_documents(_load_docs())

    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR),
    )


_store: Chroma | None = None


def get_store() -> Chroma:
    global _store
    if _store is None:
        _store = _build_store()
    return _store


def search_docs(query: str, k: int = 3) -> str:
    results = get_store().similarity_search(query, k=k)
    if not results:
        return ""
    return "\n\n---\n\n".join(r.page_content for r in results)
