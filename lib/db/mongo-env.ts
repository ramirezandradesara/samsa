/** Nombre DB en Atlas / local; configurable por si compartís cluster entre apps. */
export function getMongoDbName(): string {
  return process.env.MONGODB_DB_NAME?.trim() || 'samsa'
}

/** Colección de borradores de rutina de lectura. */
export function getReadingRoutinesCollectionName(): string {
  return (
    process.env.MONGODB_READING_ROUTINES_COLLECTION?.trim() ||
    'reading_routines'
  )
}
