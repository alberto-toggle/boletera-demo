"use client"

import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  RepeatIcon,
  UsersIcon,
  VideoIcon,
  XIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type RsvpStatus = "accepted" | "declined" | "tentative" | null

interface Attendee {
  id: string
  name: string
  initials: string
  status: "accepted" | "declined" | "tentative" | "pending"
}

interface EventDetail {
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  conferenceUrl: string
  description: string
  organizer: string
  recurrence: string
  attendees: Attendee[]
}

const statusDot: Record<string, string> = {
  accepted: "bg-emerald-500",
  declined: "bg-red-500",
  tentative: "bg-amber-500",
  pending: "bg-muted-foreground/40",
}

const event: EventDetail = {
  title: "Q1 Product Strategy Review",
  date: "Wednesday, March 18, 2026",
  startTime: "2:00 PM",
  endTime: "3:30 PM",
  location: "Board Room 3A, Floor 12",
  conferenceUrl: "https://meet.google.com/abc-defg-hij",
  description:
    "Review Q1 product performance metrics, discuss roadmap adjustments for Q2, and align on feature prioritization. Please review the pre-read deck shared in the #product channel before the meeting.",
  organizer: "Alex Rivera",
  recurrence: "None",
  attendees: [
    { id: "1", name: "Alex Rivera", initials: "AR", status: "accepted" },
    { id: "2", name: "Jordan Lee", initials: "JL", status: "accepted" },
    { id: "3", name: "Priya Sharma", initials: "PS", status: "tentative" },
    { id: "4", name: "Marcus Chen", initials: "MC", status: "accepted" },
    { id: "5", name: "Sophia Nguyen", initials: "SN", status: "pending" },
    { id: "6", name: "David Kim", initials: "DK", status: "declined" },
  ],
}

export default function CalendarEventDetails() {
  const [rsvp, setRsvp] = useState<RsvpStatus>("accepted")
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  const accepted = event.attendees.filter(a => a.status === "accepted").length
  const total = event.attendees.length

  const copyLink = async () => {
    setCopyError(null)
    setCopied(false)
    try {
      await navigator.clipboard.writeText(event.conferenceUrl)
      setCopied(true)
    } catch {
      setCopyError("Could not copy the link. Select the meeting URL and copy it manually.")
    }
  }

  return (
    <section lang="en" className="mx-auto w-full max-w-2xl p-4">
      <div className="overflow-hidden rounded-lg border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <span className="font-medium text-sm">Event Details</span>
          </div>
          <Button disabled title="Editing is not connected in this preview" variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
            <PencilIcon className="size-3" />
            Edit
          </Button>
        </div>

        {/* Title and time */}
        <div className="border-b px-4 py-3">
          <h2 className="font-medium text-sm">{event.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <CalendarIcon className="size-3" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <ClockIcon className="size-3" />
              {event.startTime} - {event.endTime}
            </span>
            {event.recurrence !== "None" && (
              <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <RepeatIcon className="size-3" />
                {event.recurrence}
              </span>
            )}
          </div>
        </div>

        {/* Location and conference */}
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-1.5">
              <MapPinIcon className="size-3 shrink-0 text-muted-foreground" />
              <span className="text-sm">{event.location}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <VideoIcon className="size-3 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 break-all font-mono text-muted-foreground text-xs">
              {event.conferenceUrl}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 shrink-0 gap-1 px-2 text-xs"
              onClick={copyLink}
            >
              {copied ? (
                <>
                  <CheckIcon className="size-3" />
                  Copied
                </>
              ) : (
                <>
                  <LinkIcon className="size-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <p role="status" className="px-4 text-xs text-muted-foreground">
          {copyError ?? (copied ? "Meeting link copied." : "")}
        </p>

        {/* Description */}
        <div className="border-b px-4 py-3">
          <span className="mb-1.5 block font-medium text-muted-foreground text-xs">
            Description
          </span>
          <p className="text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Attendees */}
        <div className="border-b px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
              <UsersIcon className="size-3" />
              Attendees
            </span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {accepted}/{total} accepted
            </span>
          </div>
          <div className="space-y-0">
            {event.attendees.map((attendee, index) => (
              <div
                key={attendee.id}
                className={`flex flex-wrap items-center gap-2.5 py-2 ${
                  index < event.attendees.length - 1 ? "border-b" : ""
                }`}
              >
                <Avatar size="sm">
                  <AvatarFallback className="text-xs">{attendee.initials}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm">{attendee.name}</span>
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span className={`size-1.5 rounded-full ${statusDot[attendee.status]}`} />
                  {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                </span>
                {attendee.name === event.organizer && (
                  <Badge variant="secondary" className="font-normal text-xs">
                    Organizer
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RSVP actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="text-muted-foreground text-xs">Your response</span>
          <div role="group" aria-label="Your response" className="flex flex-wrap items-center gap-1.5">
            <Button
              variant={rsvp === "accepted" ? "default" : "outline"}
              size="sm"
              className="h-7 gap-1 text-xs"
              aria-pressed={rsvp === "accepted"}
              onClick={() => setRsvp("accepted")}
            >
              <CheckIcon className="size-3" />
              Accept
            </Button>
            <Button
              variant={rsvp === "tentative" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              aria-pressed={rsvp === "tentative"}
              onClick={() => setRsvp("tentative")}
            >
              Maybe
            </Button>
            <Button
              variant={rsvp === "declined" ? "default" : "outline"}
              size="sm"
              className="h-7 gap-1 text-xs"
              aria-pressed={rsvp === "declined"}
              onClick={() => setRsvp("declined")}
            >
              <XIcon className="size-3" />
              Decline
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
