"use client"

import { motion, useReducedMotion } from "framer-motion"
import { CalendarIcon, TicketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LinkColumn {
  title: string
  items: { label: string; href: string }[]
}

const linkColumns: LinkColumn[] = [
  {
    title: "Schedule",
    items: [
      { label: "Day 1 Talks", href: "#" },
      { label: "Day 2 Workshops", href: "#" },
      { label: "Day 3 Keynotes", href: "#" },
      { label: "After Parties", href: "#" },
    ],
  },
  {
    title: "Speakers",
    items: [
      { label: "Keynote Speakers", href: "#" },
      { label: "Session Speakers", href: "#" },
      { label: "Panel Discussions", href: "#" },
      { label: "Call for Speakers", href: "#" },
    ],
  },
  {
    title: "Venue",
    items: [
      { label: "Directions", href: "#" },
      { label: "Hotels", href: "#" },
      { label: "Parking", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
]

const sponsors = ["Acme Corp", "TechFlow", "Nexus AI", "BuildKit"]

export default function FooterEvent() {
  const reducedMotion = useReducedMotion()
  return (
    <footer lang="en" className="mx-auto w-full max-w-4xl p-4">
      <motion.div
        className="overflow-hidden rounded-lg border bg-card"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Event name + link columns */}
        <motion.div
          className="grid grid-cols-1 gap-6 border-b px-4 py-4 md:grid-cols-2"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
        >
          {/* Event details */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          >
            <p className="text-balance font-medium text-sm">DevSummit 2026</p>
            <div className="mt-1 flex items-center gap-1.5">
              <CalendarIcon className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground text-xs">
                September 15-17, 2026 &middot; San Francisco, CA
              </span>
            </div>
          </motion.div>

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {linkColumns.map((column, colIndex) => (
              <motion.div
                key={column.title}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.15 + colIndex * 0.05,
                  ease: "easeOut",
                }}
              >
                <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  {column.title}
                </p>
                <ul className="space-y-1.5">
                  {column.items.map(item => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        aria-disabled="true"
                        tabIndex={-1}
                        onClick={event => event.preventDefault()}
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Get Tickets button */}
        <motion.div
          className="flex flex-wrap items-center gap-3 border-b px-4 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        >
          <Button disabled variant="outline" size="sm" className="h-8 gap-1.5 px-4 text-xs">
              <TicketIcon className="size-3.5" />
              Get Tickets
          </Button>
          <span className="text-muted-foreground text-xs">
            Early bird pricing available through August 1
          </span>
        </motion.div>

        {/* Sponsors */}
        <motion.div
          className="flex flex-wrap items-center gap-2 border-b px-4 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22, ease: "easeOut" }}
        >
          <span className="text-muted-foreground text-xs">Sponsored by</span>
          {sponsors.map(sponsor => (
            <span
              key={sponsor}
              className="inline-flex items-center rounded-md bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {sponsor}
            </span>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-xs">
            &copy; 2026 DevSummit. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-disabled="true"
              tabIndex={-1}
              onClick={event => event.preventDefault()}
              className="text-muted-foreground text-xs transition-colors hover:text-foreground"
            >
              Code of Conduct
            </a>
            <a
              href="#"
              aria-disabled="true"
              tabIndex={-1}
              onClick={event => event.preventDefault()}
              className="text-muted-foreground text-xs transition-colors hover:text-foreground"
            >
              Privacy
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
