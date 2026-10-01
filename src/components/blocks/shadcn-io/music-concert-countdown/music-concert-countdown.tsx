"use client"

import NumberFlow from "@number-flow/react"
import { motion, useReducedMotion } from "framer-motion"
import {
  CalendarPlusIcon,
  ClockIcon,
  MapPinIcon,
  MusicIcon,
  TicketIcon,
  UserIcon,
} from "lucide-react"
import { useEffect, useId, useState } from "react"
import { getCountdown } from "./countdown"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EventDetails {
  name: string
  artist: string
  venue: string
  location: string
  date: string
  time: string
  doorsOpen: string
}

const event: EventDetails = {
  name: "Neon Horizons Tour",
  artist: "Luna Vega",
  venue: "The Anthem",
  location: "Washington, DC",
  date: "November 17, 2026",
  time: "8:00 PM EST",
  doorsOpen: "7:00 PM EST",
}

// Same instant as the displayed event date in Washington, DC (EST).
const eventTimestamp = Date.parse("2026-11-17T20:00:00-05:00")

export default function MusicConcertCountdown() {
  const instanceId = useId()
  const reducedMotion = useReducedMotion()
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null)

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      setCountdown(getCountdown(eventTimestamp, now))
      if (now >= eventTimestamp) clearInterval(interval)
    }
    const interval = setInterval(update, 1000)
    const firstUpdate = setTimeout(update, 0)
    return () => {
      clearTimeout(firstUpdate)
      clearInterval(interval)
    }
  }, [])

  const ended = countdown !== null && Object.values(countdown).every(value => value === 0)

  return (
    <section lang="en" className="mx-auto w-full max-w-2xl p-4">
      <motion.div
        className="overflow-hidden rounded-lg border bg-card"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="border-b px-4 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MusicIcon className="size-4 text-muted-foreground" />
              <span className="font-medium text-sm">{event.name}</span>
            </div>
            <Badge variant="secondary" className="font-normal text-xs">
              {ended ? "Started" : "Upcoming"}
            </Badge>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <UserIcon className="size-3 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{event.artist}</span>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          className="border-b px-4 py-6"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          <div role="timer" aria-label="Time until concert" aria-live="off" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                { value: (countdown?.days ?? 0), label: "Days" },
                { value: (countdown?.hours ?? 0), label: "Hours" },
                {
                  value: (countdown?.minutes ?? 0),
                  label: "Minutes",
                },
                {
                  value: (countdown?.seconds ?? 0),
                  label: "Seconds",
                },
              ] as const
            ).map(unit => (
              <div key={unit.label} className="text-center">
                <div className="rounded-md bg-muted/50 px-2 py-3">
                  <span className="font-semibold text-2xl tabular-nums">
                    {countdown === null ? "—" : <NumberFlow value={unit.value} locales="en-US" animated={!reducedMotion} />}
                  </span>
                </div>
                <span className="mt-1.5 block text-muted-foreground text-xs">{unit.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event details */}
        <motion.div
          className="space-y-2.5 border-b px-4 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2.5">
            <MapPinIcon className="size-3.5 text-muted-foreground" />
            <div>
              <span className="text-sm">{event.venue}</span>
              <span className="ml-1.5 text-muted-foreground text-xs">{event.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ClockIcon className="size-3.5 text-muted-foreground" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span>{event.date}</span>
              <span className="text-muted-foreground text-xs">&middot;</span>
              <span>{event.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground text-xs">Doors open at {event.doorsOpen}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap items-center gap-2 px-4 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        >
          <Button disabled aria-describedby={`${instanceId}-preview-note`} size="sm" className="h-8 flex-1 gap-1.5 text-xs">
            <TicketIcon className="size-3" />
            Get Tickets
          </Button>
          <Button disabled aria-describedby={`${instanceId}-preview-note`} variant="outline" size="sm" className="h-8 flex-1 gap-1.5 text-xs">
            <CalendarPlusIcon className="size-3" />
            Add to Calendar
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="border-t px-4 py-2.5"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
        >
          <p id={`${instanceId}-preview-note`} className="mb-2 text-center text-xs text-muted-foreground">
            Preview only. Ticket purchase and calendar are not connected.
          </p>
          <p className="text-center text-muted-foreground text-xs">
            Limited availability &middot; VIP packages from $149
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
