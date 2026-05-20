import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildReadingRoutineMessages } from "@/lib/ai/reading-routine-prompt";
import { addBookFormSchema } from "@/lib/validations/add-book-form";
import { readingRoutineSchema } from "@/lib/validations/reading-routine";

export const maxDuration = 60;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Cuerpo JSON inválido" },
      { status: 400 }
    );
  }

  const input = addBookFormSchema.safeParse(body);
  if (!input.success) {
    const first = input.error.flatten();
    const msg =
      first.formErrors.join("; ") ||
      Object.entries(first.fieldErrors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
        .join("; ") ||
      "Datos del formulario inválidos";

    return NextResponse.json({ message: msg }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    const message =
      process.env.NODE_ENV === "development"
        ? "OPENAI_API_KEY no está configurada en el servidor"
        : "Servicio temporalmente no disponible";
    return NextResponse.json({ message }, { status: 500 });
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const client = new OpenAI({ apiKey });
    const { system, user } = buildReadingRoutineMessages(input.data);

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    if (!raw.trim()) {
      return NextResponse.json(
        { message: "El modelo devolvió una respuesta vacía" },
        { status: 502 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { message: "El modelo devolvió JSON inválido" },
        { status: 502 }
      );
    }

    const validated = readingRoutineSchema.safeParse(parsedJson);
    if (!validated.success) {
      return NextResponse.json(
        {
          message: "La respuesta del modelo no cumple el formato esperado",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ routine: validated.data });
  } catch (err: unknown) {
    const fallback =
      err instanceof Error ? err.message : "Error llamando al proveedor IA";
    if (process.env.NODE_ENV === "development") {
      console.error("[reading-routine]", err);
    }
    return NextResponse.json({ message: fallback }, { status: 502 });
  }
}
