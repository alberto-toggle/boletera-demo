import { getEventExperience } from "../event-experience/fixtures";
import "../event-experience/experience.css";
import { notFound } from "next/navigation";
import { demoEvents } from "../event-discovery/fixtures";
import type { DemoDirection } from "../event-discovery/model";
import { BookingFlow } from "./components/booking-flow";
import "./booking.css";
export function EventPage({
  eventId,
  direction,
}: {
  eventId: string;
  direction: DemoDirection;
}) {
  const event = demoEvents.find((event) => event.id === eventId);
  if (!event) notFound();
  return (
    <BookingFlow
      key={event.id}
      event={event}
      direction={direction}
      experience={getEventExperience(event)}
    />
  );
}
