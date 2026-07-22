'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ReadingRoutineView } from '@/components/reading-routine-view'
import { buttonVariants } from '@/components/ui/button'
import {
  savedReadingRoutinePayloadSchema,
  type SavedReadingRoutinePayload,
} from '@/lib/validations/saved-reading-routine'
import { cn } from '@/lib/utils'

function formatSavedMeta(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function NeedsIdFallback() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-14 text-body text-muted-foreground">
      <p>
        Esta vista necesita el parámetro{' '}
        <code className="text-foreground">?id=…</code> del enlace que aparece
        después de generar la guía.
      </p>
      <Link
        className={cn(
          buttonVariants({
            variant: 'outline',
            size: 'default',
            className: 'w-fit',
          })
        )}
        href="/routine-form"
      >
        Ir al formulario
      </Link>
    </div>
  )
}

function RoutineDetailLoaded({ routineId }: { routineId: string }) {
  const [snapshot, setSnapshot] = useState<
    SavedReadingRoutinePayload | null | undefined
  >(undefined)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(
          `/api/routines/${encodeURIComponent(routineId)}`,
          { method: 'GET' }
        )
        const raw: unknown = await res.json().catch(() => undefined)

        if (res.ok && raw && typeof raw === 'object') {
          const validated = savedReadingRoutinePayloadSchema.safeParse(raw)
          if (validated.success && !cancelled) {
            setSnapshot(validated.data)
            return
          }
        }
      } catch {
        //
      }

      if (!cancelled) {
        setSnapshot(null)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [routineId])

  if (snapshot === undefined) {
    return (
      <p className="mx-auto py-14 text-muted-foreground">Cargando tu rutina…</p>
    )
  }

  if (!snapshot) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 py-14 text-body text-muted-foreground">
        <p>No encontramos esa rutina en la base de datos.</p>
        <Link
          className={cn(
            buttonVariants({
              variant: 'outline',
              size: 'default',
              className: 'w-fit',
            })
          )}
          href="/routine-form"
        >
          Ir al formulario
        </Link>
      </div>
    )
  }

  const metaLine = `${snapshot.formSnapshot.author} · generada ${formatSavedMeta(snapshot.generatedAt)}`

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 py-10">
      <ReadingRoutineView routine={snapshot.routine} metaLine={metaLine} />

      <div className="flex flex-wrap gap-3">
        <Link
          className={cn(
            buttonVariants({
              variant: 'outline',
              size: 'default',
              className: 'w-fit',
            })
          )}
          href="/routine-form"
        >
          Nueva rutina
        </Link>
      </div>
    </div>
  )
}

function RoutineDetailBootstrap() {
  const rawId = useSearchParams().get('id')
  const routineId = rawId?.trim() ?? ''

  if (!routineId) {
    return <NeedsIdFallback />
  }

  return <RoutineDetailLoaded key={routineId} routineId={routineId} />
}

export function RoutineDetailClient() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto py-14 text-muted-foreground">
          Cargando tu rutina…
        </p>
      }
    >
      <RoutineDetailBootstrap />
    </Suspense>
  )
}
