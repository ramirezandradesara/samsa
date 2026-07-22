import {
  ADD_BOOK_OBJECTIVE_OPTIONS,
  ADD_BOOK_QUESTION_INTERVAL_OPTIONS,
} from '@/constants/add-book-form'
import { DAY_LABELS, type ReadingDayKey } from '@/constants/reading-days'
import type { AddBookFormValues } from '@/lib/validations/add-book-form'

export function formatReadingDaysLabels(days: ReadingDayKey[]) {
  return days.map((d) => DAY_LABELS[d]).join(', ')
}

function objectiveLabel(code: string | undefined) {
  if (!code?.trim()) {
    return 'No indicado por el usuario; inferí objetivo general tipo comprensión y aplicación práctica moderada.'
  }
  const found = ADD_BOOK_OBJECTIVE_OPTIONS.find((o) => o.value === code)
  return found ? `${found.label} (value=${found.value})` : code
}

function intervalLabel(code: string | undefined) {
  if (!code?.trim()) {
    return 'No indicado por el usuario; usá puntos cada ~25 páginas como default razonable.'
  }
  const found = ADD_BOOK_QUESTION_INTERVAL_OPTIONS.find((o) => o.value === code)
  return found ? `${found.label} (value=${found.value})` : code
}

const JSON_SHAPE = `Respondé únicamente con un objeto JSON válido (sin markdown, sin comentarios) con EXACTAMENTE estas claves y tipos:

{
  "bookTitleEcho": string (repite el título del libro para confirmación),
  "summary": string (2-4 frases en español, tono cercano),
  "pagesPerCalendarDayApprox": number (redondeado; páginas / días del calendario para terminar a tiempo si leyera todos los días),
  "pagesPerEffectiveReadingDayApprox": number (redondeado; páginas a repartir en los días que el usuario marca como de lectura; si no encaja divisor, distribuí con pequeños ajustes y explica en sesiones/notas),
  "weeklySessions": array de objetos {
    "dayLabel": string (una de las etiquetas de días de lectura del usuario),
    "suggestedPages": number entero ≥ 0 (páginas sugeridas ese día esa semana; podés llevar algunos micro ajustes),
    "note": string opcional
  — incluí una entrada por cada día de lectura elegido por el usuario. Si el libro es corto para esos objetivos numéricos, permití 0 algunos días y concentrá en otros,
  },
  "checkpoints": array de al menos 2 objetos {
    "afterPage": number entero (página hasta la cual leyó antes de pausar para reflexionar; respeta el intervalo de preguntas del usuario o el default),
    "questions": array de 1 a 5 strings con preguntas reflexivas en español alineadas al objetivo de lectura
  },
  "motivationalClosing": string (breve, en español),
  "reminderAlignment": string (cómo encaja la hora de recordatorio con la rutina)
}`

/**
 * Genera mensajes para el modelo: sistema (instrucciones + forma JSON) y usuario (contexto estructurado).
 */
export function buildReadingRoutineMessages(values: AddBookFormValues) {
  const readingLabels = formatReadingDaysLabels(values.readingDays)
  const pagesPerCalendarDay = Math.ceil(values.pages / values.daysToFinish)
  const effectiveDaysCount = values.readingDays.length

  const system = [
    'Sos un coach de lectura amable y práctico. Hablar siempre en español argentino neutro (sin despectivo).',
    'Generá una rutina de lectura realista acorde a las restricciones del usuario.',
    'No inventes datos del contenido del libro más allá del título y autor; podés sugerir enfoques genéricos según el objetivo.',
    'Respetá la relación aproximada: total de páginas, plazo en días calendario, y en qué días de semana sí leen.',
    `Referencia númerica (no es obligatorio que tus números finales coincidan al decimal, pero debe ser coherente):`,
    `- total páginas: ${values.pages}`,
    `- terminar en días calendario: ${values.daysToFinish}`,
    `- páginas/día si leyera todos los días: ~${pagesPerCalendarDay}`,
    `- días efectivos marcados (${effectiveDaysCount}): ${readingLabels}`,
    `- orientación muy aproximada páginas/día efectivo (solo guía mental): ~${effectiveDaysCount ? Math.ceil((values.pages * 7) / (values.daysToFinish * effectiveDaysCount)) : pagesPerCalendarDay}`,
    JSON_SHAPE,
  ].join('\n\n')

  const context = {
    book: { title: values.title.trim(), author: values.author.trim() },
    pacing: {
      pages: values.pages,
      finishWithinCalendarDays: values.daysToFinish,
      readingDays: values.readingDays,
      readingDayLabels: readingLabels.split(', '),
      reminderLocalTime: values.reminderTime,
    },
    learning: {
      objective: objectiveLabel(values.objective),
      questionIntervalPreference: intervalLabel(values.questionEveryPages),
    },
  }

  const user = `Contexto JSON del usuario (no lo repitas tal cual en la respuesta; usalo para crear la rutina):\n${JSON.stringify(context)}`

  return { system, user }
}
