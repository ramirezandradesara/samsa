import * as z from "zod";
import { DAY_KEYS } from "@/constants/reading-days";

const dayKeySchema = z.enum(DAY_KEYS);

/**
 * Campos que en el navegador vienen como string pero al serializar JSON
 * suelen llegar como number (valor ya transformado del resolver).
 */
function positiveIntegerSchema(options: {
  emptyMessage: string;
  digitMessage: string;
  positiveMessage: string;
}) {
  return z
    .preprocess((val): string => {
      if (val === undefined || val === null) {
        return "";
      }
      if (typeof val === "number" && Number.isFinite(val)) {
        return String(Math.trunc(val));
      }
      if (typeof val === "string") {
        return val.trim();
      }
      return "";
    }, z.string())
    .pipe(
      z
        .string()
        .min(1, options.emptyMessage)
        .regex(/^\d+$/, options.digitMessage)
        .transform((s) => Number.parseInt(s, 10))
        .refine((n) => n > 0, { message: options.positiveMessage })
    );
}

const positivePages = positiveIntegerSchema({
  emptyMessage: "Completá las páginas",
  digitMessage: "Usá solo números enteros",
  positiveMessage: "Ingresá una cantidad mayor a cero",
});

const positiveDays = positiveIntegerSchema({
  emptyMessage: "Completá los días",
  digitMessage: "Usá solo números enteros",
  positiveMessage: "Ingresá al menos un día",
});

export const addBookFormSchema = z.object({
  title: z.string().min(1, "Completá el título"),
  author: z.string().min(1, "Completá el autor"),
  pages: positivePages,
  daysToFinish: positiveDays,
  readingDays: z.array(dayKeySchema).min(1, "Elegí al menos un día de lectura"),
  reminderTime: z.string(),
  objective: z.string().optional(),
  questionEveryPages: z.string().optional(),
});

export type AddBookFormInput = z.input<typeof addBookFormSchema>;
export type AddBookFormValues = z.output<typeof addBookFormSchema>;
