import { saveReadingRoutineToLocalStorage } from "@/lib/storage/reading-routine-local";
import type { SavedReadingRoutinePayload } from "@/lib/validations/saved-reading-routine";

/**
 * Punto único para persistencia: más adelante reemplazar el cuerpo por `fetch`/Server Action contra DB,
 * manteniendo el mismo contrato (`SavedReadingRoutinePayload`).
 */
export async function persistReadingRoutineDraft(
  payload: SavedReadingRoutinePayload
): Promise<void> {
  saveReadingRoutineToLocalStorage(payload);
  await Promise.resolve();
}
