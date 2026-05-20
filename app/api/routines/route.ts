import { MongoServerError } from "mongodb";
import { NextResponse } from "next/server";
import { getReadingRoutinesCollection } from "@/lib/db/mongodb-client";
import { savedReadingRoutinePayloadSchema } from "@/lib/validations/saved-reading-routine";

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  if (!process.env.MONGODB_URI?.trim()) {
    return NextResponse.json(
      {
        message: isDev
          ? "MONGODB_URI no está configurada en el servidor"
          : "Servicio temporalmente no disponible",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Cuerpo JSON inválido" },
      { status: 400 }
    );
  }

  const parsed = savedReadingRoutinePayloadSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const msg =
      flat.formErrors.join("; ") ||
      Object.entries(flat.fieldErrors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
        .join("; ") ||
      "Datos guardados inválidos";
    return NextResponse.json({ message: msg }, { status: 400 });
  }

  const payload = parsed.data;

  try {
    const collection = await getReadingRoutinesCollection();
    await collection.insertOne({
      _id: payload.id,
      generatedAt: new Date(payload.generatedAt),
      formSnapshot: payload.formSnapshot,
      routine: payload.routine,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: unknown) {
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }
    if (isDev) {
      console.error("[api/routines POST]", error);
    }
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo guardar la rutina en la base.";
    return NextResponse.json(
      {
        message: isDev ? message : "Error al persistir datos",
      },
      { status: 502 }
    );
  }
}
