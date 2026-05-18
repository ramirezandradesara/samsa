import * as z from "zod";
import { DAY_KEYS } from "@/constants/reading-days";

const dayKeySchema = z.enum(DAY_KEYS);

const positivePages = z
  .string()
  .trim()
  .min(1, "Completá las páginas")
  .refine((s) => /^\d+$/.test(s), {
    message: "Usá solo números enteros",
  })
  .transform((s) => Number.parseInt(s, 10))
  .refine((n) => n > 0, { message: "Ingresá una cantidad mayor a cero" });

const positiveDays = z
  .string()
  .trim()
  .min(1, "Completá los días")
  .refine((s) => /^\d+$/.test(s), {
    message: "Usá solo números enteros",
  })
  .transform((s) => Number.parseInt(s, 10))
  .refine((n) => n > 0, { message: "Ingresá al menos un día" });

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
