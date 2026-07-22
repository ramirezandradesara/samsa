import { NextResponse } from 'next/server'
import { getReadingRoutinesCollection } from '@/lib/db/mongodb-client'
import { savedReadingRoutinePayloadSchema } from '@/lib/validations/saved-reading-routine'
function bsonToCandidate(doc: Record<string, unknown>): unknown {
  const _id = doc._id
  const id =
    typeof _id === 'string'
      ? _id
      : _id !== undefined && _id !== null
        ? String(_id)
        : ''

  const ga = doc.generatedAt
  const generatedAt =
    ga instanceof Date ? ga.toISOString() : typeof ga === 'string' ? ga : ''

  return {
    id,
    generatedAt,
    formSnapshot: doc.formSnapshot,
    routine: doc.routine,
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const isDev = process.env.NODE_ENV === 'development'
  if (!process.env.MONGODB_URI?.trim()) {
    return NextResponse.json(
      {
        message: isDev
          ? 'MONGODB_URI no está configurada en el servidor'
          : 'Servicio temporalmente no disponible',
      },
      { status: 503 }
    )
  }

  const params = await context.params
  const rawId = params.id
  if (!rawId?.trim()) {
    return NextResponse.json({ message: 'Falta el id' }, { status: 400 })
  }

  const id = decodeURIComponent(rawId.trim())

  try {
    const collection = await getReadingRoutinesCollection()
    const doc = await collection.findOne({ _id: id })
    if (!doc || typeof doc !== 'object') {
      return NextResponse.json({ message: 'No encontrada' }, { status: 404 })
    }

    const candidate = bsonToCandidate(doc as unknown as Record<string, unknown>)
    const validated = savedReadingRoutinePayloadSchema.safeParse(candidate)

    if (!validated.success) {
      if (isDev) {
        console.error('[api/routines GET] formato inválido', validated.error)
      }
      return NextResponse.json(
        { message: 'Documento corrupto en base de datos' },
        { status: 502 }
      )
    }

    return NextResponse.json(validated.data)
  } catch (error: unknown) {
    if (isDev) {
      console.error('[api/routines/[id] GET]', error)
    }
    return NextResponse.json(
      {
        message:
          isDev && error instanceof Error
            ? error.message
            : 'Error leyendo datos',
      },
      { status: 502 }
    )
  }
}
