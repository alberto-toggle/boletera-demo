// Adapted from UI TripleD theater-ticket-shadcnui. See ../README.md.
"use client";

import type { DiscoveryEvent } from "./model";
import { formatEventDate, formatEventTime } from "./model";
import type { DemoTicket } from "./model";
import { TicketQr } from "./ticket-qr";
import { Badge } from "@/components/ui/badge";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, MapPin, Star, Ticket } from "lucide-react";

export function EventTicket({
  event,
  ticket,
}: {
  event: DiscoveryEvent;
  ticket: DemoTicket;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="issued-ticket flex w-full items-center justify-center py-3">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        className="group relative flex w-full max-w-3xl flex-col lg:flex-row overflow-hidden rounded-xl bg-card border border-border shadow-2xl"
        role="article"
        aria-label="Boleto de demostración"
      >
        {/* Main Ticket Section */}
        <div className="relative min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-card z-0" />

          {/* Background Texture */}

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex justify-between items-start">
              <Badge
                variant="outline"
                className="border-primary/50 text-primary bg-primary/10"
              >
                <Star className="w-3 h-3 mr-1 fill-current" /> BOLETO DEMO
              </Badge>
              <Ticket className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <motion.h2
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-card-foreground tracking-wide"
                initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {event.title}
              </motion.h2>
              <p className="text-muted-foreground text-sm tracking-widest uppercase">
                {event.venue}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Fecha
                </p>
                <p className="text-card-foreground font-medium flex items-center">
                  <Calendar className="w-3 h-3 mr-2 text-primary" />
                  {formatEventDate(event.startsAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Hora
                </p>
                <p className="text-card-foreground font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-2 text-primary" />
                  {formatEventTime(event.startsAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Lugar
                </p>
                <p className="text-card-foreground font-medium flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-primary" />
                  {ticket.seatLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rip Line (Desktop) */}
        <div className="relative hidden w-8 shrink-0 flex-col items-center justify-center bg-card lg:flex">
          <div className="absolute -top-3 w-6 h-6 rounded-full bg-background z-20 border-b border-border" />
          <div className="h-full border-l-2 border-dashed border-border mx-auto" />
          <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-background z-20 border-t border-border" />
        </div>

        {/* Rip Line (Mobile) */}
        <div className="relative flex h-8 w-full items-center justify-center bg-card lg:hidden">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-background z-20 border-r border-border" />
          <div className="w-full border-t-2 border-dashed border-border my-auto" />
          <div className="absolute -right-3 h-6 w-6 rounded-full bg-background z-20 border-l border-border" />
        </div>

        {/* Ticket Stub */}
        <motion.div
          className="relative w-full lg:w-48 lg:shrink-0 bg-muted/50 p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-border"
          whileHover={reducedMotion ? undefined : { x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-xs font-medium mb-3">
            BOLETERA · SIN VALIDEZ
          </span>
          <TicketQr ticket={ticket} />
        </motion.div>
      </motion.div>
    </div>
  );
}
