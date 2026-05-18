"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUpRight, ChevronDown, Clock } from "lucide-react";
import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import {
  ADD_BOOK_FORM_DEFAULT_VALUES,
  ADD_BOOK_INITIAL_READING_DAYS,
  ADD_BOOK_SELECT_WRAPPER_CLASSNAME,
} from "@/constants/add-book-form";
import { DAY_KEYS, DAY_LABELS, type ReadingDayKey } from "@/constants/reading-days";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type AddBookFormInput,
  addBookFormSchema,
  type AddBookFormValues,
} from "@/lib/validations/add-book-form";
import { cn } from "@/lib/utils";

export type { AddBookFormInput, AddBookFormValues } from "@/lib/validations/add-book-form";

function selectClass(invalid?: boolean) {
  return cn(
    "w-full appearance-none rounded-lg border-0 bg-transparent px-3 text-sm text-foreground outline-none",
    "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    invalid && "text-destructive"
  );
}

export function AddBookForm() {
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

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) => {
        console.info("Datos del libro", data);
      })}
      className="mx-auto flex w-full max-w-lg flex-col gap-8 pb-28 pt-10"
    >
      <header className="space-y-2">
        <h1 className="text-heading-sm font-semibold tracking-tight text-foreground md:text-heading">
          Agregar un libro
        </h1>
        <p className="max-w-md text-body leading-body text-muted-foreground">
          La IA va a generar tu guía de lectura con estos datos.
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
          <Label htmlFor="objective" className="text-muted-foreground">
            ¿Qué querés sacar de este libro?
          </Label>
          <div className={ADD_BOOK_SELECT_WRAPPER_CLASSNAME}>
            <select id="objective" className={selectClass()} {...register("objective")}>
              <option value="">Seleccioná un objetivo</option>
              <option value="conceptos-clave">Entender los conceptos clave</option>
              <option value="aplicar-vida">Aplicarlo en mi día a día</option>
              <option value="resumen">Sacar conclusiones/resumen útil</option>
              <option value="critica">Contrastar opiniones críticas</option>
              <option value="estudio">Preparación para examen o estudio profundo</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
          <p className="text-caption leading-caption text-muted-foreground">
            La IA ajusta el tipo de preguntas según tu objetivo.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="questionEveryPages" className="text-muted-foreground">
            ¿Cada cuántas páginas querés una pregunta?
          </Label>
          <div className={ADD_BOOK_SELECT_WRAPPER_CLASSNAME}>
            <select
              id="questionEveryPages"
              className={selectClass()}
              {...register("questionEveryPages")}
            >
              <option value="">Seleccioná un intervalo</option>
              <option value="10">Cada 10 páginas</option>
              <option value="20">Cada 20 páginas</option>
              <option value="30">Cada 30 páginas</option>
              <option value="50">Cada 50 páginas</option>
              <option value="cap">Al finalizar cada capítulo</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
        </div>
      </SectionCard>

      <footer className="sticky bottom-0 z-10 grid gap-5 border-border border-t bg-background/80 px-2 py-5 backdrop-blur-md supports-backdrop-filter:bg-background/65 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
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
          className="order-2 h-11 w-full gap-2 rounded-xl border-primary-foreground/25 bg-muted/40 hover:bg-muted sm:order-0 sm:ml-auto sm:w-auto sm:justify-self-end"
        >
          Generar guía
          <ArrowUpRight className="size-4" aria-hidden />
        </Button>
      </footer>
    </form>
  );
}
