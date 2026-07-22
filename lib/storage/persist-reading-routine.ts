import type { SavedReadingRoutinePayload } from '@/lib/validations/saved-reading-routine'

/**
 * Guarda la rutina en MongoDB vía Route Handler (`POST /api/routines`).
 */
export async function persistReadingRoutineDraft(
  payload: SavedReadingRoutinePayload
): Promise<void> {
  const res = await fetch('/api/routines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (res.ok) {
    return
  }

  let message = 'No se pudo guardar la rutina.'
  try {
    const raw: unknown = await res.json()
    if (
      raw &&
      typeof raw === 'object' &&
      'message' in raw &&
      typeof (raw as { message: unknown }).message === 'string'
    ) {
      message = (raw as { message: string }).message
    }
  } catch {
    //
  }

  throw new Error(message)
}
