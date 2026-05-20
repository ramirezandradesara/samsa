/** Id local no criptográfico (suficiente para borrador en navegador / DB después). */
export function createClientRoutineId(): string {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch {
    // fallback
  }
  return `samsa-draft-${Math.random().toString(36).slice(2, 11)}`;
}
