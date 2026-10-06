"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Ticket,
  Send,
  Check,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Brand,
  ProposalSwitcher,
} from "@/features/event-discovery/components/chrome";
import {
  formatEventDate,
  formatEventTime,
  formatPrice,
  type DemoDirection,
} from "@/features/event-discovery/model";
import { createDemoVenue } from "@/features/booking/fixtures";
import type { Buyer } from "@/features/booking/model";
import { TicketDesignGallery } from "@/features/booking/components/ticket-design-gallery";
import { useAccount, updateAccount, signIn } from "../store";
import {
  canTransfer,
  pendingTransfer,
  resolveTransfer,
  type AccountOrder,
  type AccountState,
} from "../model";
import { PaymentMethods } from "./payment-methods";
import { AccountMenu } from "./account-menu";
import { AccountAccess } from "./account-access";
import { useAccountClock } from "../use-account-clock";
import { TransferDialog } from "./transfer-dialog";
export function AccountPage({
  direction,
  path = [],
}: {
  direction: DemoDirection;
  path?: string[];
}) {
  const { state, user, ready } = useAccount();
  const base = `/demo-${direction}/cuenta`;
  const profile = path[0] === "perfil";
  const past = path[0] === "pasados";
  const order =
    path[0] === "boletos"
      ? state.orders.find(
          (o) =>
            o.id === path[1] &&
            (o.buyer.email === state.session ||
              o.tickets.some((t) => t.ownerEmail === state.session) ||
              state.transfers.some(
                (t) =>
                  t.orderId === o.id &&
                  (t.from === state.session || t.to === state.session),
              )),
        )
      : undefined;
  return (
    <div
      className={`discovery booking account-page ${direction === "institucional" ? "institutional" : direction}`}
    >
      <header className="account-header">
        <Link href={`/demo-${direction}`} aria-label="Boletera, inicio">
          <Brand />
        </Link>
        <Link href={`/demo-${direction}#agenda`} className="account-agenda">
          Explorar eventos <ArrowUpRight size={16} />
        </Link>
        <AccountMenu />
      </header>
      <main className="account-main">
        {!ready ? (
          <p role="status">Cargando tu cuenta…</p>
        ) : !user ? (
          <AccountAccess />
        ) : path[0] === "metodos-de-pago" ? (
          <PaymentMethods key={user.email} base={base} />
        ) : profile ? (
          <Profile key={user.email} user={user} base={base} />
        ) : path[0] === "boletos" ? (
          order ? (
            <OrderDetail
              key={`${order.id}-${user.email}`}
              order={order}
              state={state}
              direction={direction}
              base={base}
            />
          ) : (
            <div className="account-empty">
              <h1>No encontramos esta compra en tu cuenta</h1>
              <Link className="demo-button" href={base}>
                Ir a mis boletos
              </Link>
            </div>
          )
        ) : (
          <Orders state={state} base={base} past={past} name={user.name} />
        )}
      </main>
      <footer className="account-footer">
        Demostración · Sin cobros, envíos ni accesos reales
      </footer>
      <ProposalSwitcher active={direction} />
    </div>
  );
}
function Orders({
  state,
  base,
  past,
  name,
}: {
  state: AccountState;
  base: string;
  past: boolean;
  name: string;
}) {
  const now = useAccountClock();
  const orders = state.orders
    .filter(
      (o) =>
        (o.buyer.email === state.session ||
          o.tickets.some((t) => t.ownerEmail === state.session) ||
          state.transfers.some(
            (t) => t.orderId === o.id && t.from === state.session,
          )) &&
        Date.parse(o.event.startsAt) < now === past,
    )
    .sort(
      (a, b) =>
        (Date.parse(a.event.startsAt) - Date.parse(b.event.startsAt)) *
        (past ? -1 : 1),
    );
  const incoming = state.transfers.filter(
    (t) => t.to === state.session && t.status === "pending",
  );
  return (
    <>
      <div className="account-heading">
        <p className="eyebrow">HOLA, {name.split(" ")[0]}</p>
        <h1>Mis boletos</h1>
        <p>Todo listo para tu próximo encuentro.</p>
      </div>
      <nav className="account-tabs" aria-label="Mis boletos">
        <Link href={base} aria-current={!past ? "page" : undefined}>
          Próximos eventos
        </Link>
        <Link href={`${base}/pasados`} aria-current={past ? "page" : undefined}>
          Eventos pasados
        </Link>
      </nav>
      {!past &&
        incoming.map((t) => {
          const order = state.orders.find((o) => o.id === t.orderId);
          return order ? (
            <div className="account-invitation" key={t.id}>
              <Send size={22} />
              <div>
                <strong>
                  Tienes {t.ticketIds.length}{" "}
                  {t.ticketIds.length === 1
                    ? "boleto por recibir"
                    : "boletos por recibir"}
                </strong>
                <p>
                  {order.event.title} · De{" "}
                  {state.users.find((u) => u.email === t.from)?.name ?? t.from}
                </p>
              </div>
              <Link
                href={`${base}/boletos/${order.id}`}
                className="demo-button"
              >
                Ver transferencia <ArrowUpRight size={17} />
              </Link>
            </div>
          ) : null;
        })}
      <div className={`account-orders${past ? " account-history" : ""}`}>
        {orders.map((order, index) => {
          const owned = order.tickets.filter(
            (t) => t.ownerEmail === state.session,
          );
          const year = new Date(order.event.startsAt).getFullYear();
          return (
            <div key={order.id}>
              {past &&
                (index === 0 ||
                  new Date(orders[index - 1].event.startsAt).getFullYear() !==
                    year) && <h2 className="account-year">{year}</h2>}
              <article className="account-order-card">
                <div className="account-order-photo">
                  <Image
                    src={order.event.image}
                    alt={order.event.imageAlt}
                    fill
                    sizes="(max-width: 700px) 90vw, 380px"
                    style={{
                      objectFit: "cover",
                      objectPosition: order.event.imagePosition,
                    }}
                  />
                </div>
                <div className="account-order-copy">
                  <p className="eyebrow">
                    {past
                      ? "EN TU HISTORIAL"
                      : index === 0
                        ? "TU PRÓXIMO EVENTO"
                        : "PRÓXIMAMENTE"}
                  </p>
                  <h2>{order.event.title}</h2>
                  <p>
                    {formatEventDate(order.event.startsAt)} ·{" "}
                    {formatEventTime(order.event.startsAt)} h
                  </p>
                  <p>{order.event.venue}</p>
                  <span className="account-ticket-count">
                    <Ticket size={17} />
                    {owned.length}{" "}
                    {owned.length === 1
                      ? "boleto en tu cuenta"
                      : "boletos en tu cuenta"}
                  </span>
                  <Link
                    href={`${base}/boletos/${order.id}`}
                    className="demo-button"
                  >
                    {past ? "Ver detalles de la compra" : "Ver boletos"}
                    <ArrowUpRight size={18} />
                  </Link>
                  <small>Compra {order.id}</small>
                </div>
              </article>
            </div>
          );
        })}
        {!orders.length && (
          <div className="account-empty">
            <Ticket size={34} />
            <h2>
              {past
                ? "Tus recuerdos empiezan aquí"
                : "Tu próximo encuentro te espera"}
            </h2>
            <p>
              {past
                ? "Aquí encontrarás tus eventos anteriores."
                : "Cuando compres o aceptes un boleto, aparecerá aquí."}
            </p>
            {!past && (
              <Link
                className="demo-button"
                href={`${base.replace(/\/cuenta$/, "")}#agenda`}
              >
                Explorar eventos <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
function OrderDetail({
  order,
  state,
  direction,
  base,
}: {
  order: AccountOrder;
  state: AccountState;
  direction: DemoDirection;
  base: string;
}) {
  const [transferOpen, setTransferOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const now = useAccountClock();
  const past = Date.parse(order.event.startsAt) < now;
  const isBuyer = order.buyer.email === state.session;
  const owned = order.tickets.filter((t) => t.ownerEmail === state.session);
  const transfers = state.transfers.filter(
    (t) =>
      t.orderId === order.id &&
      (t.from === state.session || t.to === state.session),
  );
  const available = owned.filter(
    (t) => t.status === "valid" && !pendingTransfer(state, t.id) && !past,
  );
  const displayed = order.tickets.filter(
    (t) =>
      isBuyer ||
      t.ownerEmail === state.session ||
      transfers.some((x) => x.ticketIds.includes(t.id)),
  );
  function resolve(id: string, action: "accept" | "cancel") {
    try {
      updateAccount((s) =>
        resolveTransfer(
          s,
          id,
          action,
          Date.now(),
          () => `DEMO-${crypto.randomUUID().toUpperCase()}`,
        ),
      );
      setError("");
      setNotice(
        action === "accept"
          ? "Los boletos ya están en tu cuenta con nuevos códigos de acceso."
          : "Transferencia cancelada. Conservas tus boletos.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo actualizar la transferencia.",
      );
    }
  }
  const viewer =
    state.users.find((u) => u.email === state.session) ?? order.buyer;
  return (
    <>
      <Link className="account-back" href={`${base}${past ? "/pasados" : ""}`}>
        <ArrowLeft size={17} />
        {past ? "Eventos pasados" : "Mis boletos"}
      </Link>
      <div className="account-event-heading">
        <div className="account-event-photo">
          <Image
            src={order.event.image}
            alt={order.event.imageAlt}
            fill
            sizes="180px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="eyebrow">
            {past ? "EVENTO FINALIZADO" : "TU EXPERIENCIA"}
          </p>
          <h1>{order.event.title}</h1>
          <p>
            {formatEventDate(order.event.startsAt)} ·{" "}
            {formatEventTime(order.event.startsAt)} h
          </p>
          <p>
            <MapPin size={16} />
            {order.event.venue}
          </p>
        </div>
      </div>
      <div className="account-ticket-toolbar">
        <h2>{past ? "Boletos de esta compra" : "Tus accesos"}</h2>
        {order.tickets.some((t) => canTransfer(state, order, t, now)) && (
          <Button className="demo-button" onClick={() => setTransferOpen(true)}>
            <Send size={17} />
            Transferir boletos
          </Button>
        )}
      </div>
      {notice && (
        <p className="account-notice" role="status">
          <Check size={18} />
          {notice}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {transfers.map((t) => (
        <div className="account-transfer-row" key={t.id}>
          <div>
            <strong>
              {t.status === "pending"
                ? "Pendiente de aceptación"
                : t.status === "accepted"
                  ? "Transferencia aceptada"
                  : "Transferencia cancelada"}
            </strong>
            <p>
              {t.ticketIds.length} boleto(s) ·{" "}
              {t.from === state.session
                ? `Para ${t.recipientName} · ${t.to}`
                : `De ${state.users.find((u) => u.email === t.from)?.name ?? t.from}`}
            </p>
          </div>
          {t.status === "pending" &&
            (t.from === state.session ? (
              <Button variant="outline" onClick={() => resolve(t.id, "cancel")}>
                Cancelar transferencia
              </Button>
            ) : !past ? (
              <Button
                className="demo-button"
                onClick={() => resolve(t.id, "accept")}
              >
                Aceptar boletos
              </Button>
            ) : (
              <span>El evento ya finalizó</span>
            ))}
        </div>
      ))}
      <div className="account-seat-list">
        {displayed
          .filter(
            (t) =>
              past ||
              t.ownerEmail !== state.session ||
              t.status === "used" ||
              pendingTransfer(state, t.id),
          )
          .map((t) => (
            <div key={t.id}>
              <Ticket size={19} />
              <div>
                <strong>{t.seatLabel}</strong>
                <small>
                  {t.ownerEmail !== state.session
                    ? "En otra cuenta"
                    : pendingTransfer(state, t.id)
                      ? "Transferencia pendiente"
                      : t.status === "used"
                        ? "Utilizado · Acceso registrado"
                        : past
                          ? "Sin registro de acceso"
                          : "Disponible en tu cuenta"}
                </small>
              </div>
            </div>
          ))}
      </div>
      {available.length > 0 && (
        <TicketDesignGallery
          compact
          key={`${state.session}-${available.map((t) => t.accessId).join()}`}
          event={order.event}
          venue={createDemoVenue(order.event)}
          direction={direction}
          order={{
            ...order,
            buyer: viewer,
            tickets: available.map((t) => ({
              id: t.accessId,
              seatId: t.seatId,
              seatLabel: t.seatLabel,
              status: "valid",
            })),
          }}
        />
      )}
      <details className="account-purchase-details">
        <summary>
          {isBuyer ? "Detalles de la compra" : "Información del evento"}
        </summary>
        <dl>
          <div>
            <dt>Recinto</dt>
            <dd>
              {order.event.venue} · {order.event.city}
            </dd>
          </div>
          {isBuyer && (
            <>
              <div>
                <dt>Folio</dt>
                <dd>{order.id}</dd>
              </div>
              <div>
                <dt>Compra confirmada</dt>
                <dd>{formatEventDate(order.purchasedAt)}</dd>
              </div>
              <div>
                <dt>Total pagado</dt>
                <dd>
                  {formatPrice({
                    amountMinor: order.amountMinor,
                    currency: "MXN",
                  })}{" "}
                  MXN
                </dd>
              </div>
            </>
          )}
        </dl>
      </details>
      {transfers.some(
        (t) => t.status === "pending" && t.from === state.session,
      ) && (
        <details className="account-demo-tools">
          <summary>Probar la recepción en otra cuenta</summary>
          <p>
            Esta demo no envía correos. Cambia a la cuenta destinataria para
            aceptar los boletos.
          </p>
          {transfers
            .filter((t) => t.status === "pending" && t.from === state.session)
            .map((t) => (
              <Button
                key={t.id}
                variant="outline"
                onClick={() =>
                  signIn(
                    state.users.find((u) => u.email === t.to) ?? {
                      ...viewer,
                      name: t.recipientName,
                      email: t.to,
                      verifiedContact: t.to,
                      phone: "",
                    },
                  )
                }
              >
                Entrar como {t.recipientName}
              </Button>
            ))}
        </details>
      )}
      {transferOpen && (
        <TransferDialog
          order={order}
          onClose={() => setTransferOpen(false)}
          onDone={() => {
            setTransferOpen(false);
            setNotice(
              "Transferencia pendiente de aceptación. Puedes seguir su estado aquí.",
            );
          }}
        />
      )}
    </>
  );
}
function Profile({ user, base }: { user: Buyer; base: string }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [notice, setNotice] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateAccount((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.email === user.email
          ? { ...u, name: name.trim(), phone: phone.trim() }
          : u,
      ),
    }));
    setNotice("Tus datos se guardaron.");
  }
  return (
    <>
      <Link className="account-back" href={base}>
        <ArrowLeft size={17} />
        Mis boletos
      </Link>
      <div className="account-heading">
        <p className="eyebrow">TU CUENTA</p>
        <h1>Mis datos</h1>
      </div>
      <form className="account-profile" onSubmit={submit}>
        <div>
          <Label htmlFor="profile-name">Nombre completo</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="profile-email">Correo de la cuenta</Label>
          <Input id="profile-email" value={user.email} readOnly type="email" />
        </div>
        <div>
          <Label htmlFor="profile-phone">Teléfono de contacto</Label>
          <Input
            id="profile-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            pattern="[+0-9 ()-]{10,18}"
            autoComplete="tel"
          />
        </div>
        <Button type="submit" className="demo-button">
          Guardar cambios
        </Button>
        {notice && <p role="status">{notice}</p>}
      </form>
    </>
  );
}
