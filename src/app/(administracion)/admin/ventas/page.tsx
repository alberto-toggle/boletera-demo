import { SalesView } from "@/features/admin/sales/sales-view";
export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ evento?: string | string[] }>;
}) {
  const { evento } = await searchParams;
  const eventId = typeof evento === "string" ? evento : "all";
  return <SalesView key={eventId} initialEvent={eventId} />;
}
