import type { ReadingDayKey } from "@/constants/reading-days";
import type { AddBookFormInput } from "@/lib/validations/add-book-form";

export const ADD_BOOK_OBJECTIVE_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
}> = [
  { value: "conceptos-clave", label: "Entender los conceptos clave" },
  { value: "aplicar-vida", label: "Aplicarlo en mi día a día" },
  { value: "resumen", label: "Sacar conclusiones/resumen útil" },
  { value: "critica", label: "Contrastar opiniones críticas" },
  { value: "estudio", label: "Preparación para examen o estudio profundo" },
  { value: "disfrute", label: "Disfrutar la historia" },
];

export const ADD_BOOK_QUESTION_INTERVAL_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
}> = [
  { value: "5", label: "Cada 5 páginas" },
  { value: "10", label: "Cada 10 páginas" },
  { value: "20", label: "Cada 20 páginas" },
  { value: "30", label: "Cada 30 páginas" },
  { value: "50", label: "Cada 50 páginas" },
  { value: "cap", label: "Al finalizar cada capítulo" },
  { value: "finish", label: "Al finalizar el libro/cuento" },
];

export const ADD_BOOK_DEFAULT_REMINDER_TIME = "21:00";

export const ADD_BOOK_INITIAL_READING_DAYS: ReadingDayKey[] = [
  "lun",
  "mar",
  "mie",
  "jue",
  "vie",
];

export const ADD_BOOK_FORM_DEFAULT_VALUES: AddBookFormInput = {
  title: "",
  author: "",
  pages: "",
  daysToFinish: "",
  readingDays: [...ADD_BOOK_INITIAL_READING_DAYS],
  reminderTime: ADD_BOOK_DEFAULT_REMINDER_TIME,
  objective: "",
  questionEveryPages: "",
};
