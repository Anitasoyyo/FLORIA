/** Parsea la respuesta sin explotar si el body está vacío o no es JSON */
export async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text()
  if (!text.trim()) return null
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

/** Convierte cualquier error en un mensaje entendible para el usuario */
export function friendlyError(err: unknown): string {
  if (err instanceof TypeError) {
    return 'No se pudo conectar al servidor. ¿Está corriendo el backend?'
  }
  if (err instanceof Error) {
    const msg = err.message
    if (msg.toLowerCase().includes('json') || msg.toLowerCase().includes('unexpected')) {
      return 'Respuesta inesperada del servidor. Intentá de nuevo.'
    }
    return msg
  }
  return 'Algo salió mal. Intentá de nuevo.'
}

/**
 * Extrae un mensaje legible de datos ya parseados de FastAPI.
 * Llámalo DESPUÉS de safeJson() para no consumir el body dos veces.
 */
export function extractErrorMessage(
  status: number,
  data: { detail?: unknown } | null,
): string {
  if (!data) {
    return `Error ${status} — verificá que el backend esté corriendo y con las dependencias instaladas.`
  }

  // FastAPI 422: detail es array de errores de validación Pydantic
  if (Array.isArray(data.detail)) {
    const first = data.detail[0]
    const msg = typeof first === 'object' && first !== null ? first.msg : String(first)
    return translateDetail(msg ?? 'Datos inválidos. Revisá el formulario.')
  }

  if (typeof data.detail === 'string') {
    return translateDetail(data.detail)
  }

  return `Error ${status}. Intentá de nuevo.`
}

function translateDetail(detail: string): string {
  if (detail.includes('ya está registrado'))
    return 'Este email ya tiene una cuenta. ¿Querés iniciar sesión?'
  if (detail.includes('incorrectos'))
    return 'Email o contraseña incorrectos. Revisá tus datos.'
  if (detail.includes('Token'))
    return 'Tu sesión expiró. Volvé a iniciar sesión.'
  if (detail.includes('valid email') || detail.includes('not a valid'))
    return 'El email no tiene un formato válido.'
  if (detail.includes('short') || detail.includes('least'))
    return 'La contraseña es demasiado corta.'
  return detail
}
