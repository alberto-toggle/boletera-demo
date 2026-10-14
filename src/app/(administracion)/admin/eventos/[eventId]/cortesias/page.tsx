import { CourtesiesView } from "@/features/admin/courtesies/courtesies-view";
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <CourtesiesView eventId={eventId} />;
}
