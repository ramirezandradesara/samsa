import {
  type SavedReadingRoutinePayload,
  savedReadingRoutinePayloadSchema,
} from "@/lib/validations/saved-reading-routine";

/** Clave versionada para migraciones futuras de formato. */
export const SAMSA_READING_ROUTINES_STORAGE_KEY = "samsa:readingRoutines:v1";

const MAX_STORED_ITEMS = 20;

/** Respaldos en navegador; no usar en servidor. */
export function saveReadingRoutineToLocalStorage(
  payload: SavedReadingRoutinePayload,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const prevRaw = window.localStorage.getItem(
      SAMSA_READING_ROUTINES_STORAGE_KEY,
    );
    const list: SavedReadingRoutinePayload[] = prevRaw
      ? JSON.parse(prevRaw)
      : [];
    list.unshift(payload);
    window.localStorage.setItem(
      SAMSA_READING_ROUTINES_STORAGE_KEY,
      JSON.stringify(list.slice(0, MAX_STORED_ITEMS)),
    );
  } catch {
    window.localStorage.setItem(
      SAMSA_READING_ROUTINES_STORAGE_KEY,
      JSON.stringify([payload]),
    );
  }
}

export function loadReadingRoutinesFromLocalStorage(): SavedReadingRoutinePayload[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const prevRaw = window.localStorage.getItem(
      SAMSA_READING_ROUTINES_STORAGE_KEY,
    );
    if (!prevRaw) {
      return [];
    }
    const list: unknown[] = JSON.parse(prevRaw);
    if (!Array.isArray(list)) {
      return [];
    }
    const out: SavedReadingRoutinePayload[] = [];
    for (const row of list) {
      const p = savedReadingRoutinePayloadSchema.safeParse(row);
      if (p.success) {
        out.push(p.data);
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function getReadingRoutineById(
  id: string,
): SavedReadingRoutinePayload | null {
  return (
    loadReadingRoutinesFromLocalStorage().find((row) => row.id === id) ?? null
  );
}
