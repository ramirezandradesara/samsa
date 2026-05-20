import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-4 py-24 text-center">
      <p className="text-heading-sm font-semibold text-foreground md:text-heading">
        Samsa
      </p>
      <p className="max-w-sm text-muted-foreground">
        Generá una rutina de lectura con IA a partir del formulario.
      </p>
      <Link
        className={cn(
          buttonVariants({
            variant: "default",
            size: "lg",
            className: "inline-flex no-underline",
          })
        )}
        href="/routine-form"
      >
        Ir al formulario
      </Link>
    </div>
  );
}
