import { notFound } from "next/navigation";
import { AccountPage } from "@/features/account/components/account-page";
import "@/features/booking/booking.css";
export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
 const { path = [] } = await params;
 if (!(path.length === 0 || (path.length === 1 && ["perfil", "pasados", "metodos-de-pago"].includes(path[0])) || (path.length === 2 && path[0] === "boletos"))) notFound();
 return <AccountPage direction="inmersiva" path={path} />;
}
