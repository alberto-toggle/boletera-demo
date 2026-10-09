import { InventoryView } from "@/features/admin/inventory/inventory-view";
export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <InventoryView eventId={eventId} />;
}
