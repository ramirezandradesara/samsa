import type { ReadingDayKey } from "@/constants/reading-days";
import type { AddBookFormInput } from "@/lib/validations/add-book-form";

/** Contenedor Tailwind para `<select>` con altura uniforme */
export const ADD_BOOK_SELECT_WRAPPER_CLASSNAME =
  "relative flex w-full items-center rounded-lg border border-input bg-transparent dark:bg-input/30 [&>select]:h-11 [&>select]:pr-10";

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
