"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, ArrowRight } from "lucide-react";
import { useBuyerAccounts } from "./demo/account-bridge";
import { SaleTicketDesigns } from "./components/sale-ticket-designs";
import {
  SellerEventDetail,
  EventInformationButton,
} from "./components/event-information";
import { SellerShell } from "./components/seller-shell";
import { SellerLogin } from "./components/login";
import { SellerEvents } from "./components/event-list";
import { SellerSelection } from "./components/seat-selection";
import { SaleCheckout } from "./components/sale-checkout";
import { SalesList } from "./components/sales-list";
import { SaleReceipt } from "./components/sale-receipt";
import {
  interruptTerminal,
  act,
  reserve,
  signIn,
  signOut,
  tick,
  useSeller,
} from "./demo/store";
import { events, seller, venues } from "./demo/fixtures";
import { availableVenue } from "./model";
export function SellerApp({ path = [] }: { path?: string[] }) {
  const state = useSeller();
  const accounts = useBuyerAccounts();
  const router = useRouter();
  const viewedSaleId = path[0] === "venta" ? (path[1] ?? "") : "";
  useEffect(() => () => interruptTerminal(viewedSaleId), [viewedSaleId]);
  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  if (!state.signedIn)
    return (
      <SellerLogin
        email={seller.email}
        password={seller.password}
        onLogin={() => {
          signIn();
          router.replace("/operacion/vendedor");
        }}
      />
    );
  const event = events.find((e) => e.id === path[1]);
  const sale = state.sales.find(
    (s) => s.id === path[1] && s.sellerId === seller.id,
  );
  const saleEvent = events.find((e) => e.id === sale?.eventId);
  let content;
  if (!path.length)
    content = (
      <SellerEvents
        events={events}
        availability={Object.fromEntries(
          events.map((e) => [
            e.id,
            availableVenue(venues[e.id], state.sales, e.id).seats.filter(
              (s) => !s.occupied,
            ).length,
          ]),
        )}
      />
    );
  else if (path[0] === "ventas" && path.length === 1)
    content = (
      <SalesList
        sales={state.sales.filter((s) => s.sellerId === seller.id)}
        events={events}
      />
    );
  else if (path[0] === "evento" && event && path.length === 2)
    content = (
      <SellerEventDetail
        event={event}
        venue={availableVenue(venues[event.id], state.sales, event.id)}
      />
    );
  else if (
    path[0] === "evento" &&
    event &&
    path[2] === "lugares" &&
    path.length === 3
  )
    content = (
      <SellerSelection
        information={
          <EventInformationButton event={event} venue={venues[event.id]} />
        }
        key={event.id}
        event={event}
        venue={availableVenue(venues[event.id], state.sales, event.id)}
        onReserve={(ids) => {
          const id = reserve(event.id, ids);
          if (id) router.push(`/operacion/vendedor/venta/${id}`);
          else
            window.alert(
              "La selección ya no está disponible. Revisa tus lugares.",
            );
        }}
      />
    );
  else if (path[0] === "venta" && sale && saleEvent && path.length === 2) {
    if (sale.status === "confirmed")
      content = (
        <SaleReceipt
          information={
            <EventInformationButton
              event={saleEvent}
              venue={venues[saleEvent.id]}
            />
          }
          key={sale.id}
          sale={sale}
          event={saleEvent}
          tickets={
            <SaleTicketDesigns
              sale={sale}
              event={saleEvent}
              venue={venues[sale.eventId]}
            />
          }
        />
      );
    else if (sale.status === "expired" || sale.status === "cancelled")
      content = (
        <main className="seller-main seller-result">
          <Clock3 size={48} />
          <p className="seller-eyebrow">{sale.id}</p>
          <h1>
            {sale.status === "expired"
              ? "El apartado terminó."
              : "Operación cancelada."}
          </h1>
          <p>
            Los lugares se liberaron. No se emitieron boletos ni se registró un
            cobro.
          </p>
          <Link
            className="seller-primary"
            href={`/operacion/vendedor/evento/${sale.eventId}`}
          >
            Elegir lugares nuevamente <ArrowRight size={17} />
          </Link>
          <Link href="/operacion/vendedor/ventas">Volver a mis ventas</Link>
        </main>
      );
    else
      content = (
        <SaleCheckout
          information={
            <EventInformationButton
              event={saleEvent}
              venue={venues[saleEvent.id]}
            />
          }
          accounts={accounts}
          key={sale.id}
          sale={sale}
          event={saleEvent}
          onAction={(action) => act(sale.id, action)}
        />
      );
  } else
    content = (
      <main className="seller-main seller-result">
        <h1>Operación no encontrada</h1>
        <p>
          Este enlace no corresponde a una operación de esta sesión de
          demostración.
        </p>
        <Link href="/operacion/vendedor">Volver a eventos</Link>
      </main>
    );
  return (
    <SellerShell
      name={seller.name}
      location={seller.location}
      active={path[0] === "ventas" || path[0] === "venta" ? "sales" : "sell"}
      onLogout={() => {
        signOut();
        router.replace("/operacion/vendedor");
      }}
    >
      {content}
    </SellerShell>
  );
}
