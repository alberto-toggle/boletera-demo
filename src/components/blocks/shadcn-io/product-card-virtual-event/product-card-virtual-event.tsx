"use client"

import { Calendar, CalendarPlus, Clock, Globe, Monitor, Radio, Users, Video } from "lucide-react"
import { useId, useState } from "react"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

interface Speaker {
  name: string
  role: string
  avatar: string
}

interface TicketTier {
  id: string
  name: string
  price: number
  features: string[]
}

interface Product {
  title: string
  category: string
  image: string
  isLive: boolean
  date: string
  time: string
  timezone: string
  duration: string
  platform: string
  speakers: Speaker[]
  attendees: number
  maxAttendees: number
  tiers: TicketTier[]
}

const PRODUCT: Product = {
  title: "Design Systems at Scale: Building for the Future",
  category: "Design Conference",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
  isLive: true,
  date: "January 18, 2025",
  time: "10:00 AM",
  timezone: "PST",
  duration: "3 hours",
  platform: "Zoom Webinar",
  speakers: [
    {
      name: "Sarah Chen",
      role: "Design Lead, Figma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    {
      name: "Marcus Johnson",
      role: "VP Design, Stripe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
    {
      name: "Elena Rodriguez",
      role: "Design Systems, Airbnb",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    },
  ],
  attendees: 847,
  maxAttendees: 1000,
  tiers: [
    { id: "free", name: "Free", price: 0, features: ["Live access", "Q&A participation"] },
    {
      id: "standard",
      name: "Standard",
      price: 49,
      features: ["Live access", "Q&A participation", "Recording access", "Slides PDF"],
    },
    {
      id: "vip",
      name: "VIP",
      price: 149,
      features: [
        "Live access",
        "Q&A participation",
        "Recording access",
        "Slides PDF",
        "1-on-1 speaker session",
        "Certificate",
      ],
    },
  ],
}

export default function ProductCardVirtualEvent() {
  const instanceId = useId()
  const [selectedTier, setSelectedTier] = useState(PRODUCT.tiers[1].id)

  const tier = PRODUCT.tiers.find(t => t.id === selectedTier) || PRODUCT.tiers[1]
  const spotsLeft = PRODUCT.maxAttendees - PRODUCT.attendees
  const almostFull = spotsLeft < 100

  return (
    <section lang="en" className="container mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Product Card</h2>
      </div>

      <div className="mx-auto w-[360px] max-w-full">
        <Card className="gap-0 overflow-hidden py-0">
          <div className="relative h-[140px]">
            <Image
              unoptimized
              alt={PRODUCT.title}
              className="h-full w-full object-cover"
              height={400}
              src={PRODUCT.image}
              width={400}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge>{PRODUCT.category}</Badge>
              {PRODUCT.isLive && (
                <Badge className="gap-1" variant="secondary">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Live
                </Badge>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-semibold text-white line-clamp-2">{PRODUCT.title}</h3>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Date, time, platform */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{PRODUCT.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {PRODUCT.time} {PRODUCT.timezone}
                </span>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{PRODUCT.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>{PRODUCT.platform}</span>
              </div>
            </div>

            {/* Speakers */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">SPEAKERS</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {PRODUCT.speakers.map(speaker => (
                    <Avatar className="h-8 w-8 border-2 border-background" key={speaker.name}>
                      <AvatarImage src={speaker.avatar} alt={speaker.name} />
                      <AvatarFallback>{speaker.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium">
                    {PRODUCT.speakers.map(s => s.name.split(" ")[0]).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +{PRODUCT.speakers.length} speakers
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="mt-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">{PRODUCT.attendees.toLocaleString("en-US")}</span>
                <span className="text-muted-foreground"> registered</span>
              </span>
              {almostFull && (
                <Badge className="text-xs text-destructive" variant="outline">
                  {spotsLeft} spots left
                </Badge>
              )}
            </div>

            <Separator className="my-4" />

            {/* Ticket tiers */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">SELECT TICKET</Label>
              <RadioGroup
                aria-label="Ticket type"
                className="mt-2 space-y-2"
                onValueChange={setSelectedTier}
                value={selectedTier}
              >
                {PRODUCT.tiers.map(t => (
                  <Label
                    className={`flex cursor-pointer items-start justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                      selectedTier === t.id ? "border-primary bg-muted/50" : ""
                    }`}
                    htmlFor={`${instanceId}-${t.id}`}
                    key={t.id}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem className="mt-0.5" id={`${instanceId}-${t.id}`} value={t.id} />
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.features.slice(0, 2).join(" • ")}
                          {t.features.length > 2 && ` +${t.features.length - 2} more`}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold tabular-nums">
                      {t.price === 0 ? "Free" : `$${t.price}`}
                    </p>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 p-4 pt-0">
            <Button className="w-full" disabled aria-describedby={`${instanceId}-preview-note`}>
              <Monitor className="mr-2 h-4 w-4" />
              {tier.price === 0 ? "Register Free" : `Register - $${tier.price}`}
            </Button>
            <Button className="w-full" variant="outline" disabled aria-describedby={`${instanceId}-preview-note`}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <p id={`${instanceId}-preview-note`} className="text-center text-xs text-muted-foreground">
              Preview only. Registration and calendar are not connected.
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
