import { createDataTableFilterHelper } from "@medusajs/ui"
import { subDays, subMonths } from "date-fns"
import { useMemo } from "react"

import { getFullDate } from "../../lib/utils/date-utils"

const filterHelper = createDataTableFilterHelper<any>()

const useDateFilterOptions = () => {
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  return useMemo(() => {
    return [
      {
        label: "Hoy",
        value: {
          $gte: today.toISOString(),
        },
      },
      {
        label: "Ultimos 7 dias",
        value: {
          $gte: subDays(today, 7).toISOString(), // 7 days ago
        },
      },
      {
        label: "Ultimos 30 dias",
        value: {
          $gte: subDays(today, 30).toISOString(), // 30 days ago
        },
      },
      {
        label: "Ultimos 90 dias",
        value: {
          $gte: subDays(today, 90).toISOString(), // 90 days ago
        },
      },
      {
        label: "Ultimos 12 meses",
        value: {
          $gte: subMonths(today, 12).toISOString(), // 12 months ago
        },
      },
    ]
  }, [today])
}

export const useDataTableDateFilters = (disableRangeOption?: boolean) => {
  const dateFilterOptions = useDateFilterOptions()

  const rangeOptions = useMemo(() => {
    if (disableRangeOption) {
      return {
        disableRangeOption: true,
      }
    }

    return {
      rangeOptionStartLabel: "Inicio",
      rangeOptionEndLabel: "Fin",
      rangeOptionLabel: "Personalizado",
      options: dateFilterOptions,
    }
  }, [disableRangeOption, dateFilterOptions])

  return useMemo(() => {
    return [
      filterHelper.accessor("created_at", {
        type: "date",
        label: "Fecha de creación",
        format: "date",
        formatDateValue: (date) => getFullDate({ date }),
        options: dateFilterOptions,
        ...rangeOptions,
      }),
      filterHelper.accessor("updated_at", {
        type: "date",
        label: "Fecha de actualización",
        format: "date",
        formatDateValue: (date) => getFullDate({ date }),
        options: dateFilterOptions,
        ...rangeOptions,
      }),
    ]
  }, [dateFilterOptions, getFullDate, rangeOptions])
}
