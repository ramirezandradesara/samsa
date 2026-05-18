import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card/40 p-5 shadow-subtle-3 backdrop-blur-sm">
      <h2 className="text-caption font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
