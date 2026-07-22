'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Resolver } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import {
  ADD_BOOK_FORM_DEFAULT_VALUES,
  ADD_BOOK_OBJECTIVE_OPTIONS,
  ADD_BOOK_QUESTION_INTERVAL_OPTIONS,
} from '@/constants/add-book-form'
import { DAY_KEYS, DAY_LABELS } from '@/constants/reading-days'
import { SectionCard } from '@/components/section-card'
import { createClientRoutineId } from '@/lib/storage/client-id'
import { persistReadingRoutineDraft } from '@/lib/storage/persist-reading-routine'
import {
  type AddBookFormInput,
  addBookFormSchema,
  type AddBookFormValues,
} from '@/lib/validations/add-book-form'
import { apiReadingRoutineResponseSchema } from '@/lib/validations/reading-routine'
import FormInput from './form/form-input'
import FormSelect from './form/form-select'
import FormToggleGroup from './form/form-toggle-group'
import FormFooter from './form/form-footer'
import FormHeader from './form/form-header'

export type {
  AddBookFormInput,
  AddBookFormValues,
} from '@/lib/validations/add-book-form'
export type { ReadingRoutine } from '@/lib/validations/reading-routine'

export function AddBookForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { control, handleSubmit, trigger } = useForm<
    AddBookFormInput,
    unknown,
    AddBookFormValues
  >({
    resolver: zodResolver(addBookFormSchema) as Resolver<
      AddBookFormInput,
      unknown,
      AddBookFormValues
    >,
    defaultValues: ADD_BOOK_FORM_DEFAULT_VALUES,
  })

  async function submitToApi(data: AddBookFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/reading-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      let payload: unknown
      try {
        payload = await res.json()
      } catch {
        setSubmitError('Respuesta ilegible del servidor.')
        return
      }

      if (!res.ok || !payload || typeof payload !== 'object') {
        const msg =
          payload &&
          typeof payload === 'object' &&
          'message' in payload &&
          typeof (payload as { message: unknown }).message === 'string'
            ? (payload as { message: string }).message
            : 'No se pudo generar la rutina.'
        setSubmitError(msg)
        return
      }

      const parsed = apiReadingRoutineResponseSchema.safeParse(payload)
      if (!parsed.success) {
        setSubmitError('Respuesta corrupta desde el servidor.')
        return
      }

      const draftId = createClientRoutineId()
      await persistReadingRoutineDraft({
        id: draftId,
        generatedAt: new Date().toISOString(),
        formSnapshot: data,
        routine: parsed.data.routine,
      })
      router.push(`/routine?id=${encodeURIComponent(draftId)}`)
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : 'Error de red. Probá de nuevo.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submitToApi)}
      className="mx-auto flex w-full max-w-lg flex-col gap-8 pb-28 pt-10"
    >
      <FormHeader
        title="Agregar un libro"
        description="La IA va a generar tu guía de lectura con estos datos."
      />

      <SectionCard title="Sobre el libro">
        <FormInput
          name="title"
          label="Título"
          control={control}
          placeholder="Ej: Hábitos Atómicos"
          required
        />
        <FormInput
          name="author"
          label="Autor"
          control={control}
          placeholder="Ej: James Clear"
          required
        />
        <FormInput
          name="pages"
          label="Cantidad de páginas"
          control={control}
          placeholder="Ej: 320"
          required
          type="number"
          min={1}
          inputMode="numeric"
        />
      </SectionCard>

      <SectionCard title="Plan de lectura">
        <FormInput
          name="daysToFinish"
          label="¿En cuántos días querés terminarlo?"
          control={control}
          placeholder="Ej: 30"
          required
          type="number"
          min={1}
          inputMode="numeric"
          description="Con este dato la app calcula cuántas páginas leer por día."
        />

        <FormToggleGroup
          name="readingDays"
          label="¿Qué días de la semana vas a leer?"
          control={control}
          trigger={trigger}
          options={DAY_KEYS.map((key) => ({
            value: key,
            label: DAY_LABELS[key],
          }))}
        />
        <FormInput
          name="reminderTime"
          label="Hora del recordatorio"
          control={control}
          type="time"
          step={60}
          required
        />
      </SectionCard>

      <SectionCard title="Guía de preguntas">
        <FormSelect
          name="objective"
          label="¿Qué querés sacar de este libro?"
          control={control}
          options={ADD_BOOK_OBJECTIVE_OPTIONS}
          placeholder="Seleccioná un objetivo"
          description="La IA ajusta el tipo de preguntas según tu objetivo."
        />
        <FormSelect
          name="questionEveryPages"
          label="¿Cada cuántas páginas querés una pregunta?"
          control={control}
          options={ADD_BOOK_QUESTION_INTERVAL_OPTIONS}
          placeholder="Seleccioná un intervalo"
        />
      </SectionCard>

      {submitError && (
        <p className="text-caption text-destructive" role="alert">
          {submitError}
        </p>
      )}

      <FormFooter isSubmitting={isSubmitting} />
    </form>
  )
}
