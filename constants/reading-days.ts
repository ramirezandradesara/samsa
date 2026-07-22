export const DAY_KEYS = [
  'lun',
  'mar',
  'mie',
  'jue',
  'vie',
  'sab',
  'dom',
] as const

export type ReadingDayKey = (typeof DAY_KEYS)[number]

export const DAY_LABELS: Record<ReadingDayKey, string> = {
  lun: 'Lun',
  mar: 'Mar',
  mie: 'Mié',
  jue: 'Jue',
  vie: 'Vie',
  sab: 'Sáb',
  dom: 'Dom',
}
