"use client"

import NumberFlow from "@number-flow/react"
import { motion, useReducedMotion } from "framer-motion"
import { CalendarIcon, MapPinIcon, MinusIcon, MusicIcon, PlusIcon, TicketIcon } from "lucide-react"
import { useId, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SeatCategory {
  id: string
  name: string
  price: number
  available: number
  description: string
}

const seatCategories: SeatCategory[] = [
  {
    id: "vip",
    name: "VIP",
    price: 250,
    available: 12,
    description: "Front row, backstage access",
  },
  {
    id: "premium",
    name: "Premium",
    price: 150,
    available: 48,
    description: "Rows 2-5, priority entry",
  },
  {
    id: "standard",
    name: "Standard",
    price: 85,
    available: 234,
    description: "General seating, rows 6-20",
  },
  {
    id: "balcony",
    name: "Balcony",
    price: 55,
    available: 156,
    description: "Upper level, great acoustics",
  },
]

const eventDetails = {
  artist: "Aurora & The Northern Lights",
  tour: "Ethereal Horizons World Tour",
  venue: "The Paramount Theatre",
  city: "Seattle, WA",
  date: "Sat, Jun 14, 2026",
  doors: "7:00 PM",
  showtime: "8:30 PM",
}

const serviceFeeRate = 0.12

export default function MusicConcertTickets() {
  const instanceId = useId()
  const reducedMotion = useReducedMotion()
  const [selectedCategory, setSelectedCategory] = useState("premium")
  const [quantity, setQuantity] = useState(2)

  const category = seatCategories.find(c => c.id === selectedCategory)
  const subtotal = (category?.price ?? 0) * quantity
  const serviceFee = Math.round(subtotal * serviceFeeRate * 100) / 100
  const total = subtotal + serviceFee

  return (
    <section lang="en" className="mx-auto w-full max-w-2xl p-4">
      <motion.div
        className="overflow-hidden rounded-lg border bg-card"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Event Header */}
        <motion.div
          className="border-b px-4 py-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <MusicIcon className="size-4 text-muted-foreground" />
            <span className="font-medium text-sm">{eventDetails.artist}</span>
            <Badge variant="secondary" className="font-normal text-xs">
              On Sale
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground text-sm">{eventDetails.tour}</p>
        </motion.div>

        {/* Venue & Date */}
        <motion.div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <MapPinIcon className="size-3" />
            <span>
              {eventDetails.venue}, {eventDetails.city}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">&middot;</span>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <CalendarIcon className="size-3" />
            <span>{eventDetails.date}</span>
          </div>
          <span className="text-muted-foreground text-xs">&middot;</span>
          <span className="text-muted-foreground text-xs">Doors {eventDetails.doors}</span>
        </motion.div>

        {/* Seat Category Selector */}
        <motion.div
          className="border-b px-4 py-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
        >
          <div className="mb-2.5 flex items-center gap-2">
            <TicketIcon className="size-3.5 text-muted-foreground" />
            <span className="font-medium text-xs">Select Category</span>
          </div>
          <div role="group" aria-label="Seat category" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {seatCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className={`rounded-md border px-3 py-2.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selectedCategory === cat.id
                    ? "border-foreground ring-2 ring-foreground"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <span className="font-semibold text-sm tabular-nums">${cat.price}</span>
                </div>
                <p className="mt-0.5 text-muted-foreground text-xs">{cat.description}</p>
                <p className="mt-1 text-muted-foreground text-xs">{cat.available} remaining</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div
          className="flex items-center justify-between border-b px-4 py-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        >
          <span className="font-medium text-muted-foreground text-xs">Quantity</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              aria-label="Remove ticket"
              disabled={quantity <= 1}
            >
              <MinusIcon className="size-3" />
            </Button>
            <span className="w-8 text-center font-semibold text-sm tabular-nums">
              <NumberFlow locales="en-US" animated={!reducedMotion} value={quantity} />
            </span>
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0"
              onClick={() => setQuantity(q => Math.min(10, q + 1))}
              aria-label="Add ticket"
              disabled={quantity >= 10}
            >
              <PlusIcon className="size-3" />
            </Button>
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          className="border-b px-4 py-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>
                {category?.name} x {quantity}
              </span>
              <span className="tabular-nums">
                $<NumberFlow locales="en-US" animated={!reducedMotion} value={subtotal} />
              </span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Service fee</span>
              <span className="tabular-nums">
                $<NumberFlow locales="en-US" animated={!reducedMotion} value={serviceFee} />
              </span>
            </div>
            <div className="border-t pt-1.5" />
            <div className="flex items-baseline justify-between">
              <span className="font-medium text-sm">Total</span>
              <span className="font-semibold text-2xl tabular-nums">
                <NumberFlow locales="en-US" animated={!reducedMotion} value={total} prefix="$" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="border-b px-4 py-3"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        >
          <Button size="sm" className="h-8 w-full text-xs" disabled aria-describedby={`${instanceId}-preview-note`}>
            Buy Tickets
          </Button>
          <p id={`${instanceId}-preview-note`} className="mt-2 text-center text-xs text-muted-foreground">
            Preview only. Checkout is not connected.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="px-4 py-2.5"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
        >
          <p className="text-center text-muted-foreground text-xs">
            All sales final &middot; Mobile tickets only &middot; Show {eventDetails.showtime}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
