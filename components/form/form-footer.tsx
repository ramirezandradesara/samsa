import { ArrowDown, ArrowUpRight, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { scrollSmooth } from '@/helpers/scrollSmooth'

type FormFooterProps = {
  isSubmitting: boolean
  submitLabel?: string
  submittingLabel?: string
}

function FormFooter({
  isSubmitting,
  submitLabel = 'Generar guía',
  submittingLabel = 'Generando…',
}: FormFooterProps) {
  return (
    <footer className="sticky bottom-0 z-10 grid gap-5 border-border border-t bg-background/80 px-2 py-5 backdrop-blur-md supports-backdrop-filter:bg-background/65 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
      <p className="order-3 text-caption leading-caption text-muted-foreground sm:order-0 sm:justify-self-start">
        Los campos con <span className="text-destructive">*</span> son
        obligatorios
      </p>

      <div className="order-1 flex justify-center sm:order-0">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="rounded-full border-dashed shadow-sm"
          onClick={scrollSmooth}
          aria-label="Seguir navegando hacia abajo"
        >
          <ArrowDown className="size-5 text-muted-foreground" />
        </Button>
      </div>

      <Button
        type="submit"
        variant="outline"
        size="lg"
        disabled={isSubmitting}
        className="order-2 h-11 w-full gap-2 rounded-xl border-primary-foreground/25 bg-muted/40 hover:bg-muted disabled:opacity-70 sm:order-0 sm:ml-auto sm:w-auto sm:justify-self-end"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {submittingLabel}
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </>
        )}
      </Button>
    </footer>
  )
}

export default FormFooter
