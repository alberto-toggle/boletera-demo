import { EventFormView } from "@/features/admin/events/event-form";
export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <EventFormView eventId={eventId} />;
}
