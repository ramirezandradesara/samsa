import type { Collection } from "mongodb";
import type { AddBookFormValues } from "@/lib/validations/add-book-form";
import type { ReadingRoutine } from "@/lib/validations/reading-routine";

/** Documento guardado en Atlas (colección `reading_routines`). */
export type ReadingRoutineMongoDocument = {
  _id: string;
  generatedAt: Date;
  formSnapshot: AddBookFormValues;
  routine: ReadingRoutine;
};

export type ReadingRoutineCollection =
  Collection<ReadingRoutineMongoDocument>;
