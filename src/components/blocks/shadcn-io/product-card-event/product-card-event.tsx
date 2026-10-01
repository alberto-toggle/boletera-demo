"use client"

import { Calendar, Clock, MapPin, Minus, Plus, Ticket, Users } from "lucide-react"
import { useId, useState } from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TicketTier {
  id: string
  name: string
  price: number
  available: number
  description: string
}

interface Product {
  name: string
  artist: string
  image: string
  date: string
  time: string
  venue: string
  city: string
  tiers: TicketTier[]
}

const PRODUCT: Product = {
  name: "Summer Music Festival",
  artist: "Multiple Artists",
  image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
  date: "Aug 15, 2025",
  time: "6:00 PM",
  venue: "Madison Square Garden",
  city: "New York, NY",
  tiers: [
    {
      id: "ga",
      name: "General Admission",
      price: 75,
      available: 250,
      description: "Standing room",
    },
    {
      id: "reserved",
      name: "Reserved Seating",
      price: 125,
      available: 45,
      description: "Assigned seat",
    },
    {
      id: "vip",
      name: "VIP Experience",
      price: 299,
      available: 8,
      description: "Premium view + perks",
    },
  ],
}

export default function ProductCardEvent() {
  const instanceId = useId()
  const [selectedTier, setSelectedTier] = useState(PRODUCT.tiers[0].id)
  const [quantity, setQuantity] = useState(2)

  const currentTier = PRODUCT.tiers.find(t => t.id === selectedTier) || PRODUCT.tiers[0]
  const total = currentTier.price * quantity
  const isLowAvailability = currentTier.available <= 20

  return (
    <section lang="en" className="container mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Product Card</h2>
      </div>

      <div className="mx-auto w-[340px] max-w-full">
        <Card className="gap-0 overflow-hidden py-0">
          <div className="relative h-[160px]">
            <Image
              unoptimized
              alt={PRODUCT.name}
              className="h-full w-full object-cover"
              height={400}
              src={PRODUCT.image}
              width={400}
            />
            <Badge className="absolute top-3 left-3">
              <Ticket className="mr-1 h-3 w-3" />
              On Sale
            </Badge>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold">{PRODUCT.name}</h3>
            <p className="text-sm text-muted-foreground">{PRODUCT.artist}</p>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{PRODUCT.date}</span>
                <Clock className="ml-2 h-3 w-3" />
                <span>{PRODUCT.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {PRODUCT.venue}, {PRODUCT.city}
                </span>
              </div>
            </div>

            {/* Ticket tiers */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">SELECT TICKETS</p>
              <RadioGroup aria-label="Ticket type" onValueChange={setSelectedTier} value={selectedTier}>
                <div className="space-y-2">
                  {PRODUCT.tiers.map(tier => (
                    <div className="flex items-center" key={tier.id}>
                      <RadioGroupItem className="peer sr-only" id={`${instanceId}-${tier.id}`} value={tier.id} />
                      <Label
                        className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border p-3 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-data-checked:border-primary peer-data-checked:ring-1 peer-data-checked:ring-primary"
                        htmlFor={`${instanceId}-${tier.id}`}
                      >
                        <div>
                          <p className="text-sm font-medium">{tier.name}</p>
                          <p className="text-xs text-muted-foreground">{tier.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold tabular-nums">${tier.price}</p>
                          {tier.available <= 20 && (
                            <p className="text-xs text-muted-foreground">{tier.available} left</p>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-2">
                <Button
                  className="h-8 w-8"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  size="icon"
                  variant="outline"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium tabular-nums">{quantity}</span>
                <Button
                  className="h-8 w-8"
                  aria-label="Increase quantity"
                  disabled={quantity >= 8}
                  onClick={() => setQuantity(Math.min(8, quantity + 1))}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {isLowAvailability && (
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Only {currentTier.available} tickets remaining</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2 p-4 pt-0">
            <div className="flex w-full items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold tabular-nums">${total}</span>
            </div>
            <Button className="w-full" disabled aria-describedby={`${instanceId}-preview-note`}>
              <Ticket className="mr-2 h-4 w-4" />
              Get Tickets
            </Button>
            <p id={`${instanceId}-preview-note`} className="text-center text-xs text-muted-foreground">
              Preview only. Checkout is not connected.
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
