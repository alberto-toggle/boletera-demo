"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import OriginalTicket from "./admit-one-ticket.source.js";

export interface AdmitOneTicketProps {
  name: string;
  presenter: string;
  event: string;
  venue: string;
  dates: string;
  stubText: string;
  watermark: string;
  width?: number;
  tilt?: false | { maxTilt?: number; scale?: number; glare?: number };
  className?: string;
}

// The supplied export is bundled JavaScript. Keep its public boundary typed.
const Ticket = OriginalTicket as ComponentType<AdmitOneTicketProps>;

export function AdmitOneTicket({ width = 741, ...props }: AdmitOneTicketProps) {
  const container = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setAvailableWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ticketWidth = Math.min(width, availableWidth || width);
  return (
    <div ref={container} className="w-full" style={{ maxWidth: width, aspectRatio: "741 / 425" }}>
      {availableWidth > 0 && <Ticket {...props} width={ticketWidth} />}
    </div>
  );
}

export default AdmitOneTicket;
