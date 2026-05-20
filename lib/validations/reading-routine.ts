import * as z from "zod";

export const weeklySessionSchema = z.object({
  /** Etiqueta del día que lee el usuario (p. ej. Lun, Mié). */
  dayLabel: z.string().min(1),
  suggestedPages: z.number().finite().nonnegative(),
  note: z.string().optional(),
});

export const reflectionCheckpointSchema = z.object({
  afterPage: z.number().int().positive(),
  questions: z.array(z.string()).min(1).max(5),
});

/**
 * Contrato estable de rutina entre API y cliente (y futura DB).
 */
export const readingRoutineSchema = z.object({
  bookTitleEcho: z.string().min(1),
  summary: z.string().min(1),
  pagesPerCalendarDayApprox: z.number().finite().positive(),
  pagesPerEffectiveReadingDayApprox: z.number().finite().positive(),
  weeklySessions: z.array(weeklySessionSchema).min(1),
  checkpoints: z.array(reflectionCheckpointSchema).min(1),
  motivationalClosing: z.string().min(1),
  reminderAlignment: z.string().min(1),
});

export type ReadingRoutine = z.infer<typeof readingRoutineSchema>;

export const apiReadingRoutineResponseSchema = z.object({
  routine: readingRoutineSchema,
});

export type ApiReadingRoutineResponse = z.infer<typeof apiReadingRoutineResponseSchema>;
