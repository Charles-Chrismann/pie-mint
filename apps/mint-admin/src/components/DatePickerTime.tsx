"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { uuid } from "@/lib/utils"

export function DatePickerTime({
  date,
  setDate,
}: {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}) {
  const [open, setOpen] = React.useState(false)
  const dateId = React.useRef(uuid())
  const timeId = React.useRef(uuid())

  const timeValue = React.useMemo(() => {
    if (!date) return "10:30:00"
    return date.toTimeString().slice(0, 8) // HH:mm:ss
  }, [date])

  return (
    <FieldGroup className="w-full flex-row">
      <Field>
        <FieldLabel htmlFor={dateId.current}>Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={dateId.current}
              className="w-32 justify-between font-normal"
            >
              {date ? format(date, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(selectedDate) => {
                if (!selectedDate) return

                // 🔥 conserver l'heure existante
                if (date) {
                  selectedDate.setHours(
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds()
                  )
                }

                setDate(selectedDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field>
        <FieldLabel htmlFor={timeId.current}>Time</FieldLabel>
        <Input
          type="time"
          id={timeId.current}
          step="1"
          value={timeValue}
          onChange={(e) => {
            if (!date) return

            const [h, m, s] = e.target.value.split(":").map(Number)

            const newDate = new Date(date)
            newDate.setHours(h, m, s || 0)

            setDate(newDate)
          }}
          className="bg-background appearance-none
            [&::-webkit-calendar-picker-indicator]:hidden
            [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
