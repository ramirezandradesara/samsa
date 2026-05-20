"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ReadingRoutineView } from "@/components/reading-routine-view";
import { buttonVariants } from "@/components/ui/button";
import {
  getReadingRoutineById,
  loadReadingRoutinesFromLocalStorage,
} from "@/lib/storage/reading-routine-local";
import { cn } from "@/lib/utils";

function formatSavedMeta(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function RoutineDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const snapshot = useMemo(() => {
    if (id) {
      return getReadingRoutineById(id) ?? null;
    }
    return loadReadingRoutinesFromLocalStorage()[0] ?? null;
  }, [id]);

  if (!snapshot) {
    const headline = id
      ? "No encontramos esa rutina en este dispositivo."
      : "Todavía no generaste ninguna rutina.";

    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 py-14 text-body text-muted-foreground">
        <p>{headline}</p>
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "default", className: "w-fit" })
          )}
          href="/routine-form"
        >
          Ir al formulario
        </Link>
      </div>
    );
  }

  const metaLine = `${snapshot.formSnapshot.author} · generada ${formatSavedMeta(snapshot.generatedAt)}`;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 py-10">
      <ReadingRoutineView routine={snapshot.routine} metaLine={metaLine} />

      <div className="flex flex-wrap gap-3">
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "default", className: "w-fit" })
          )}
          href="/routine-form"
        >
          Nueva rutina
        </Link>
      </div>
    </div>
  );
}

export function RoutineDetailClient() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto py-14 text-muted-foreground">Cargando tu rutina…</p>
      }
    >
      <RoutineDetailInner />
    </Suspense>
  );
}
