import { SectionCard } from "@/components/section-card";
import type { ReadingRoutine } from "@/lib/validations/reading-routine";

type ReadingRoutineViewProps = {
  routine: ReadingRoutine;
  /** Ej. libro + fecha de generación */
  metaLine?: string;
};

export function ReadingRoutineView({
  routine,
  metaLine,
}: ReadingRoutineViewProps) {
  return (
    <SectionCard title="Tu rutina de lectura">
      <div className="space-y-4 text-body leading-body">
        <div>
          <p className="text-heading-sm font-medium text-foreground">
            {routine.bookTitleEcho}
          </p>
          {metaLine ? (
            <p className="text-caption text-muted-foreground">{metaLine}</p>
          ) : null}
        </div>
        <p className="text-muted-foreground">{routine.summary}</p>
        <div className="grid gap-2 text-caption text-muted-foreground sm:grid-cols-2">
          <span>
            ~{routine.pagesPerCalendarDayApprox} pág./día (calendario)
          </span>
          <span>
            ~{routine.pagesPerEffectiveReadingDayApprox} pág./día en tus días de
            lectura
          </span>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Sesiones por semana
          </h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            {routine.weeklySessions.map((s, i) => (
              <li key={`${s.dayLabel}-${i}`}>
                <span className="font-medium text-foreground">{s.dayLabel}</span>
                {": "}
                {s.suggestedPages} págs.
                {s.note ? ` — ${s.note}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Puntos de reflexión
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            {routine.checkpoints.map((c, i) => (
              <li
                key={`checkpoint-${i}`}
                className="border-border border-l-2 pl-3"
              >
                <span className="text-caption font-medium text-foreground">
                  Después de la pág. {c.afterPage}
                </span>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-caption">
                  {c.questions.map((q, j) => (
                    <li key={j}>{q}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-muted-foreground">{routine.motivationalClosing}</p>
        <p className="text-caption italic text-muted-foreground">
          Recordatorio ({routine.reminderAlignment})
        </p>
        <p className="text-caption text-muted-foreground">
          Rutina almacenada en la base de datos.
        </p>
      </div>
    </SectionCard>
  );
}
