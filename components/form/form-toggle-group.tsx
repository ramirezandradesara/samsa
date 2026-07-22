import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import type {
  Control,
  FieldPath,
  FieldValues,
  UseFormTrigger,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'

type FormToggleGroupOption = {
  value: string
  label: string
}

type FormToggleGroupProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> = {
  name: FieldPath<TFieldValues>
  label: string
  control: Control<TFieldValues, TContext, TTransformedValues>
  options: ReadonlyArray<FormToggleGroupOption>
  description?: string
  required?: boolean
  trigger?: UseFormTrigger<TFieldValues>
}

function FormToggleGroup<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  control,
  options,
  description,
  required,
  trigger,
}: FormToggleGroupProps<TFieldValues, TContext, TTransformedValues>) {
  const labelId = `${name}-label`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected: string[] = field.value ?? []

        function toggle(value: string) {
          const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value]
          field.onChange(next)
          void trigger?.(name)
        }

        return (
          <div className="space-y-2">
            <Label id={labelId} className="text-muted-foreground">
              {label}
              {required && (
                <>
                  {' '}
                  <span className="text-destructive">*</span>
                </>
              )}
            </Label>
            <div
              role="group"
              aria-labelledby={labelId}
              className="flex flex-wrap gap-2"
            >
              {options.map(({ value, label: optionLabel }) => {
                const isSelected = selected.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggle(value)}
                    className={cn(
                      'min-w-11 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                      isSelected
                        ? 'bg-sky-blue text-white hover:bg-ocean-blue'
                        : 'border border-input bg-muted/40 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {optionLabel}
                  </button>
                )
              })}
            </div>
            {description && (
              <p className="text-caption leading-caption text-muted-foreground">
                {description}
              </p>
            )}
            {fieldState.invalid && fieldState.error?.message && (
              <p className="text-caption text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}

export default FormToggleGroup
