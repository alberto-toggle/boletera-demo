import { EventPage } from "@/features/booking/event-page";
export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <EventPage eventId={eventId} direction="institucional" purchase />;
}
