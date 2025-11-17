"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export function DateRangeMultipleMonthPicker({dateRange, setDateRange}: {
  dateRange: DateRange | undefined,
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
  function handleSelect(e: DateRange | undefined) {
    console.log(e)
    setDateRange(e)
  }

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={handleSelect}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  )
}
