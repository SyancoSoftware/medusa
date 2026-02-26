import { format, formatDistance, sub } from "date-fns"
import { enUS, es } from "date-fns/locale"
import i18next from "i18next"

const DATE_FNS_LOCALES = {
  en: enUS,
  es,
} as const

function getLocale() {
  const language = (i18next.resolvedLanguage || i18next.language || "en")
    .toLowerCase()
    .split("-")[0]

  return DATE_FNS_LOCALES[language as keyof typeof DATE_FNS_LOCALES] || enUS
}

export function getRelativeDate(date: string | Date): string {
  const now = new Date()

  return formatDistance(sub(new Date(date), { minutes: 0 }), now, {
    addSuffix: true,
    locale: getLocale(),
  })
}

export const getFullDate = ({
  date,
  includeTime = false,
}: {
  date: string | Date
  includeTime?: boolean
}) => {
  const ensuredDate = new Date(date)

  if (isNaN(ensuredDate.getTime())) {
    return ""
  }

  const timeFormat = includeTime ? "p" : ""

  return format(ensuredDate, `PP ${timeFormat}`, {
    locale: getLocale(),
  })
}
