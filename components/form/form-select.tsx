import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from "react-hook-form";

const FORM_SELECT_TRIGGER =
  "h-11 w-full min-w-0 justify-between [&_[data-slot=select-value]>span]:line-clamp-2";

type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> = {
  name: FieldPath<TFieldValues>;
  label: string;
  control: Control<TFieldValues, TContext, TTransformedValues>;
  options: ReadonlyArray<FormSelectOption>;
  placeholder?: string;
  description?: string;
  required?: boolean;
};

function FormSelect<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  control,
  options,
  placeholder,
  description,
  required,
}: FormSelectProps<TFieldValues, TContext, TTransformedValues>) {
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
          <Select
            items={options}
            value={field.value === "" ? null : field.value}
            onValueChange={(v) => field.onChange(v ?? "")}
          >
            <SelectTrigger
              id={name}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
              className={FORM_SELECT_TRIGGER}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value: optionValue, label: optionLabel }) => (
                <SelectItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default FormSelect;
