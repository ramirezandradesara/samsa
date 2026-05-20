import * as z from "zod";
import { addBookFormSchema } from "@/lib/validations/add-book-form";
import { readingRoutineSchema } from "@/lib/validations/reading-routine";

export const savedReadingRoutinePayloadSchema = z.object({
  id: z.string(),
  generatedAt: z.string(),
  formSnapshot: addBookFormSchema,
  routine: readingRoutineSchema,
});

export type SavedReadingRoutinePayload = z.infer<
  typeof savedReadingRoutinePayloadSchema
>;
