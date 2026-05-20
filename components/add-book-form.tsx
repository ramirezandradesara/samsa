"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUpRight, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ADD_BOOK_FORM_DEFAULT_VALUES,
  ADD_BOOK_INITIAL_READING_DAYS,
  ADD_BOOK_OBJECTIVE_OPTIONS,
  ADD_BOOK_QUESTION_INTERVAL_OPTIONS,
} from "@/constants/add-book-form";
import { DAY_KEYS, DAY_LABELS, type ReadingDayKey } from "@/constants/reading-days";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientRoutineId } from "@/lib/storage/client-id";
import { persistReadingRoutineDraft } from "@/lib/storage/persist-reading-routine";
import {
  type AddBookFormInput,
  addBookFormSchema,
  type AddBookFormValues,
} from "@/lib/validations/add-book-form";
import {
  apiReadingRoutineResponseSchema,
} from "@/lib/validations/reading-routine";
import { cn } from "@/lib/utils";

export type { AddBookFormInput, AddBookFormValues } from "@/lib/validations/add-book-form";
export type { ReadingRoutine } from "@/lib/validations/reading-routine";

const BOOK_SELECT_TRIGGER =
  "h-11 w-full min-w-0 justify-between [&_[data-slot=select-value]>span]:line-clamp-2";

export function AddBookForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddBookFormInput, unknown, AddBookFormValues>({
    resolver: zodResolver(addBookFormSchema) as Resolver<
      AddBookFormInput,
      unknown,
      AddBookFormValues
    >,
    defaultValues: ADD_BOOK_FORM_DEFAULT_VALUES,
  });

  const readingDays =
    useWatch({
      control,
      name: "readingDays",
      defaultValue: ADD_BOOK_INITIAL_READING_DAYS,
    }) ?? [];

  function toggleDay(key: ReadingDayKey) {
    const next = readingDays.includes(key)
      ? readingDays.filter((d) => d !== key)
      : [...readingDays, key];
    setValue("readingDays", next, { shouldValidate: true });
  }

  function scrollDown() {
    window.scrollBy({ top: Math.min(window.innerHeight * 0.85, 480), behavior: "smooth" });
  }

  async function submitToApi(data: AddBookFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/reading-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let payload: unknown;
      try {
        payload = await res.json();
      } catch {
        setSubmitError("Respuesta ilegible del servidor.");
        return;
      }

      if (!res.ok || !payload || typeof payload !== "object") {
        const msg =
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof (payload as { message: unknown }).message === "string"
            ? (payload as { message: string }).message
            : "No se pudo generar la rutina.";
        setSubmitError(msg);
        return;
      }

      const parsed = apiReadingRoutineResponseSchema.safeParse(payload);
      if (!parsed.success) {
        setSubmitError("Respuesta corrupta desde el servidor.");
        return;
      }

      const draftId = createClientRoutineId();
      await persistReadingRoutineDraft({
        id: draftId,
        generatedAt: new Date().toISOString(),
        formSnapshot: data,
        routine: parsed.data.routine,
      });
      router.push(`/routine?id=${encodeURIComponent(draftId)}`);
    } catch {
      setSubmitError("Error de red. Probá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submitToApi)}
      className="mx-auto flex w-full max-w-lg flex-col gap-8 pb-28 pt-10"
    >
      <header className="space-y-2">
        <h1 className="text-heading-sm font-semibold tracking-tight text-foreground md:text-heading">
          Agregar un libro
        </h1>
        <p className="max-w-md text-body leading-body text-muted-foreground">
          La IA va a generar tu guía de lectura con estos datos.
        </p>
        <p className="text-caption">
          <Link
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
            href="/routine"
          >
            Ver rutina guardada
          </Link>
        </p>
      </header>

      <SectionCard title="Sobre el libro">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-muted-foreground">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            className="h-11"
            placeholder="Ej: Hábitos Atómicos"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-caption text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="author" className="text-muted-foreground">
            Autor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="author"
            className="h-11"
            placeholder="Ej: James Clear"
            aria-invalid={!!errors.author}
            {...register("author")}
          />
          {errors.author && (
            <p className="text-caption text-destructive">{errors.author.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pages" className="text-muted-foreground">
            Cantidad de páginas <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pages"
            type="number"
            min={1}
            inputMode="numeric"
            className="h-11"
            placeholder="Ej: 320"
            aria-invalid={!!errors.pages}
            {...register("pages")}
          />
          {errors.pages && (
            <p className="text-caption text-destructive">{errors.pages.message}</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Plan de lectura">
        <div className="space-y-2">
          <Label htmlFor="daysToFinish" className="text-muted-foreground">
            ¿En cuántos días querés terminarlo?{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="daysToFinish"
            type="number"
            min={1}
            inputMode="numeric"
            className="h-11"
            placeholder="Ej: 30"
            aria-invalid={!!errors.daysToFinish}
            {...register("daysToFinish")}
          />
          <p className="text-caption leading-caption text-muted-foreground">
            Con este dato la app calcula cuántas páginas leer por día.
          </p>
          {errors.daysToFinish && (
            <p className="text-caption text-destructive">{errors.daysToFinish.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <span className="text-sm leading-none font-medium text-muted-foreground">
            ¿Qué días de la semana vas a leer?
          </span>
          <div className="flex flex-wrap gap-2">
            {DAY_KEYS.map((key) => {
              const selected = readingDays.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDay(key)}
                  className={cn(
                    "min-w-[2.75rem] rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    selected
                      ? "bg-sky-blue text-white hover:bg-ocean-blue"
                      : "border border-input bg-muted/40 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {DAY_LABELS[key]}
                </button>
              );
            })}
          </div>
          {errors.readingDays && (
            <p className="text-caption text-destructive">{errors.readingDays.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminderTime" className="text-muted-foreground">
            Hora del recordatorio
          </Label>
          <div className="relative">
            <Clock
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="reminderTime"
              type="time"
              step={60}
              className="h-11 pr-10"
              {...register("reminderTime")}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Guía de preguntas">
        <div className="space-y-2">
          <Label htmlFor="objective-select" className="text-muted-foreground">
            ¿Qué querés sacar de este libro?
          </Label>
          <Controller
            control={control}
            name="objective"
            render={({ field }) => (
              <Select
                value={field.value === "" ? null : field.value}
                onValueChange={(v) =>
                  field.onChange(v ?? "")
                }
              >
                <SelectTrigger
                  id="objective-select"
                  ref={field.ref}
                  aria-invalid={!!errors.objective}
                  onBlur={field.onBlur}
                  className={BOOK_SELECT_TRIGGER}
                >
                  <SelectValue placeholder="Seleccioná un objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {ADD_BOOK_OBJECTIVE_OPTIONS.map(({ value: optionValue, label }) => (
                    <SelectItem key={optionValue} value={optionValue}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-caption leading-caption text-muted-foreground">
            La IA ajusta el tipo de preguntas según tu objetivo.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="interval-select" className="text-muted-foreground">
            ¿Cada cuántas páginas querés una pregunta?
          </Label>
          <Controller
            control={control}
            name="questionEveryPages"
            render={({ field }) => (
              <Select
                value={field.value === "" ? null : field.value}
                onValueChange={(v) =>
                  field.onChange(v ?? "")
                }
              >
                <SelectTrigger
                  id="interval-select"
                  ref={field.ref}
                  aria-invalid={!!errors.questionEveryPages}
                  onBlur={field.onBlur}
                  className={BOOK_SELECT_TRIGGER}
                >
                  <SelectValue placeholder="Seleccioná un intervalo" />
                </SelectTrigger>
                <SelectContent>
                  {ADD_BOOK_QUESTION_INTERVAL_OPTIONS.map(({ value: optionValue, label }) => (
                    <SelectItem key={optionValue} value={optionValue}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </SectionCard>

      {submitError && (
        <p
          className="text-caption text-destructive"
          role="alert"
        >
          {submitError}
        </p>
      )}


      <footer className="sticky bottom-0 z-10 grid gap-5 border-border border-t bg-background/80 px-2 py-5 backdrop-blur-md supports-[backdrop-filter]:bg-background/65 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
        <p className="order-3 text-caption leading-caption text-muted-foreground sm:order-0 sm:justify-self-start">
          Los campos con <span className="text-destructive">*</span> son obligatorios
        </p>

        <div className="order-1 flex justify-center sm:order-0">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="rounded-full border-dashed shadow-sm"
            onClick={scrollDown}
            aria-label="Seguir navegando hacia abajo"
          >
            <ArrowDown className="size-5 text-muted-foreground" />
          </Button>
        </div>

        <Button
          type="submit"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          className="order-2 h-11 w-full gap-2 rounded-xl border-primary-foreground/25 bg-muted/40 hover:bg-muted disabled:opacity-70 sm:order-0 sm:ml-auto sm:w-auto sm:justify-self-end"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Generando…
            </>
          ) : (
            <>
              Generar guía
              <ArrowUpRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </footer>
    </form>
  );
}
