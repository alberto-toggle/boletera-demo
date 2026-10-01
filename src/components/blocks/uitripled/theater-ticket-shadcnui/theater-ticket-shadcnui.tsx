"use client";

import { Badge } from "@/components/ui/badge";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, MapPin, Star, Ticket } from "lucide-react";

export function TheaterTicket() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-3 sm:p-8">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        className="group relative flex w-full max-w-2xl flex-col lg:flex-row overflow-hidden rounded-xl bg-card border border-border shadow-2xl"
        role="article"
        aria-label="Theater Ticket for The Phantom of the Opera"
      >
        {/* Main Ticket Section */}
        <div className="relative min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-card z-0" />

          {/* Background Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay z-0" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex justify-between items-start">
              <Badge
                variant="outline"
                className="border-primary/50 text-primary bg-primary/10"
              >
                <Star className="w-3 h-3 mr-1 fill-current" /> PREMIERE
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
                THE PHANTOM
                <br />
                <span className="text-primary">OF THE OPERA</span>
              </motion.h2>
              <p className="text-muted-foreground text-sm tracking-widest uppercase">
                Royal Albert Hall
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Date
                </p>
                <p className="text-card-foreground font-medium flex items-center">
                  <Calendar className="w-3 h-3 mr-2 text-primary" />
                  Dec 12
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Time
                </p>
                <p className="text-card-foreground font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-2 text-primary" />
                  19:30
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Seat
                </p>
                <p className="text-card-foreground font-medium flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-primary" />
                  A-24
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
          className="relative w-full lg:w-32 lg:shrink-0 bg-muted/50 p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-border"
          whileHover={reducedMotion ? undefined : { x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Barcode Lines */}
          <div
            className="flex lg:flex-col justify-center space-x-1 lg:space-x-0 lg:space-y-1 h-12 lg:h-24 w-full opacity-70"
            role="img"
            aria-label="Decorative barcode, not a valid ticket"
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`bg-foreground ${i % 3 === 0 || i % 2 === 0 ? "w-1 h-full lg:w-full lg:h-1" : "w-2 h-full lg:w-full lg:h-2"}`}
              />
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground lg:rotate-90 origin-center whitespace-nowrap mt-2 lg:mt-8">
              ADMIT ONE
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
