import { EventDetail } from "@/features/admin/events/event-detail";
export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <EventDetail eventId={eventId} />;
}
