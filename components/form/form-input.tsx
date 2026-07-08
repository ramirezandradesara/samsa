import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ComponentProps } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type FormInputProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> = {
  name: FieldPath<TFieldValues>;
  label: string;
  control: Control<TFieldValues, TContext, TTransformedValues>;
  description?: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number" | "time";
  min?: number;
  inputMode?: ComponentProps<"input">["inputMode"];
  step?: number;
};

function FormInput<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  control,
  description,
  placeholder,
  required,
  type = "text",
  min,
  inputMode,
  step,
}: FormInputProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name} className="text-muted-foreground">
            {label}
            {required && (
              <>
                {" "}
                <span className="text-destructive">*</span>
              </>
            )}
          </Label>
          <Input
            {...field}
            id={name}
            className="h-11"
            aria-invalid={fieldState.invalid}
            {...(placeholder ? { placeholder } : {})}
            autoComplete="off"
            type={type}
            min={min}
            inputMode={inputMode}
            step={step}
          />
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
      )}
    />
  );
}

export default FormInput;
