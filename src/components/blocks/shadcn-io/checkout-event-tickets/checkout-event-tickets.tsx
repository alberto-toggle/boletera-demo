"use client"

import { CalendarIcon, MapPinIcon, MinusIcon, PlusIcon, TicketIcon, UserIcon } from "lucide-react"
import { useId, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface TicketType {
  id: string
  name: string
  price: number
  description: string
}

const event = {
  name: "Synthesis Music Festival 2026",
  date: "Sat, Jun 14, 2026 · 6:00 PM",
  venue: "Riverside Amphitheatre, Austin, TX",
}

const ticketTypes: TicketType[] = [
  {
    id: "general",
    name: "General Admission",
    price: 75,
    description: "Standing area access, food court",
  },
  {
    id: "vip",
    name: "VIP",
    price: 150,
    description: "Reserved seating, lounge access, complimentary drinks",
  },
  {
    id: "premium",
    name: "Premium",
    price: 275,
    description: "Front row, backstage meet & greet, premium bar",
  },
]

export default function CheckoutEventTickets() {
  const instanceId = useId()
  const [selectedType, setSelectedType] = useState("vip")
  const [quantity, setQuantity] = useState(2)
  const [attendees, setAttendees] = useState<string[]>(["", ""])

  const selected = ticketTypes.find(t => t.id === selectedType)!
  const subtotal = selected.price * quantity
  const serviceFee = Math.round(subtotal * 0.08)
  const total = subtotal + serviceFee

  const updateQuantity = (delta: number) => {
    const next = Math.max(1, Math.min(10, quantity + delta))
    setQuantity(next)
    setAttendees(prev => {
      if (next > prev.length) {
        return [...prev, ...Array(next - prev.length).fill("")]
      }
      return prev.slice(0, next)
    })
  }

  const updateAttendee = (index: number, value: string) => {
    setAttendees(prev => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  return (
    <section lang="en" className="mx-auto w-full max-w-2xl p-4">
      <div className="overflow-hidden rounded-lg border bg-card">
        {/* Event header */}
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <TicketIcon className="size-4 text-muted-foreground" />
            <span className="font-medium text-sm">Event Tickets</span>
          </div>
        </div>

        {/* Event details */}
        <div className="border-b px-4 py-3">
          <p className="font-medium text-sm">{event.name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <CalendarIcon className="size-3" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <MapPinIcon className="size-3" />
              {event.venue}
            </span>
          </div>
        </div>

        {/* Ticket type selector */}
        <div className="border-b px-4 py-3">
          <span className="font-medium text-muted-foreground text-xs">Ticket type</span>
          <div role="group" aria-label="Ticket type" className="mt-2 space-y-2">
            {ticketTypes.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                aria-pressed={selectedType === type.id}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selectedType === type.id ? "bg-muted/50 ring-1 ring-border" : "hover:bg-muted/30"
                }`}
              >
                <div
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    selectedType === type.id ? "border-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {selectedType === type.id && (
                    <span className="size-2 rounded-full bg-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm">{type.name}</span>
                  <p className="text-muted-foreground text-xs">{type.description}</p>
                </div>
                <span className="shrink-0 font-semibold text-sm tabular-nums">${type.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-medium text-muted-foreground text-xs">Quantity</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0"
              onClick={() => updateQuantity(-1)}
              disabled={quantity <= 1}
              aria-label="Remove ticket"
            >
              <MinusIcon className="size-3" />
            </Button>
            <span className="w-8 text-center font-medium text-sm tabular-nums">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0"
              onClick={() => updateQuantity(1)}
              disabled={quantity >= 10}
              aria-label="Add ticket"
            >
              <PlusIcon className="size-3" />
            </Button>
          </div>
        </div>

        {/* Seat selection placeholder */}
        <div className="border-b px-4 py-3">
          <span className="font-medium text-muted-foreground text-xs">Seat selection</span>
          <div className="mt-2 flex items-center justify-center rounded-md bg-muted/50 px-4 py-6">
            <p className="text-muted-foreground text-xs">
              Seat map will be displayed here based on availability
            </p>
          </div>
        </div>

        {/* Attendee names */}
        <div className="border-b px-4 py-3">
          <span className="font-medium text-muted-foreground text-xs">Attendee details</span>
          <div className="mt-2 space-y-2">
            {attendees.map((name, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <UserIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <Input
                  aria-label={`Attendee ${i + 1} full name`}
                  autoComplete="off"
                  value={name}
                  onChange={e => updateAttendee(i, e.target.value)}
                  placeholder={`Attendee ${i + 1} full name`}
                  className="h-8 min-w-0 flex-1 basis-36 text-sm"
                />
                <Badge variant="secondary" className="shrink-0 font-normal text-xs">
                  {selected.name}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="border-b px-4 py-3">
          <span className="font-medium text-muted-foreground text-xs">Order summary</span>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {quantity} x {selected.name}
              </span>
              <span className="text-sm tabular-nums">${subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Service fee</span>
              <span className="text-sm tabular-nums">${serviceFee}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Total</span>
              <span className="font-semibold text-sm tabular-nums">${total}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 py-3">
          <Button className="w-full" size="sm" disabled aria-describedby={`${instanceId}-preview-note`}>
            Complete purchase
          </Button>
          <p id={`${instanceId}-preview-note`} className="mt-2 text-center text-xs text-muted-foreground">
            Preview only. Checkout is not connected.
          </p>
        </div>
      </div>
    </section>
  )
}
