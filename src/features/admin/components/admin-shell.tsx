"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Asterisk,
  LayoutDashboard,
  CalendarDays,
  Ticket,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ChevronRight,
  CircleHelp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../demo/provider";
import {
  useInternalAccess,
  InternalSignOut,
} from "@/features/internal-access/access";
import { AdminDialog } from "./controls";
const navigation = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/ventas", label: "Ventas", icon: Ticket },
  { href: "/admin/asistencia", label: "Asistencia", icon: CheckCircle2 },
];
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const access = useInternalAccess();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [help, setHelp] = useState(false);
  const { ready, notice, clearNotice } = useAdmin();
  const current =
    navigation.find(
      (item) => item.href !== "/admin" && pathname.startsWith(item.href),
    ) ?? navigation[0];
  return (
    <div
      className={`admin-theme admin-shell ${collapsed ? "admin-collapsed" : ""}`}
    >
      <a className="admin-skip-link" href="#admin-content">
        Ir al contenido
      </a>
      <aside className="admin-sidebar">
        <Link
          href="/admin"
          className="admin-brand"
          aria-label="Boletera, resumen"
        >
          <Asterisk size={30} strokeWidth={1.7} />
          <span>
            boletera<span className="admin-brand-dot">.</span>
          </span>
        </Link>
        <div className="admin-workspace">
          <span className="admin-workspace-icon">
            <ShieldCheck size={17} />
          </span>
          <div>
            <strong>Administración</strong>
            <small>Gestión de eventos</small>
          </div>
        </div>
        <p className="admin-nav-label">ESPACIO DE TRABAJO</p>
        <nav aria-label="Administración">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={current.href === href ? "page" : undefined}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{label}</span>
              {current.href === href && <i />}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" title="Ver propuestas">
            <ArrowUpRight size={17} />
            <span>Ver propuestas</span>
          </Link>
          <button
            type="button"
            onClick={() => setHelp(true)}
            title="Acerca del panel"
          >
            <CircleHelp size={17} />
            <span>Acerca del panel</span>
          </button>
          <InternalSignOut />
          <div className="admin-profile">
            <span className="admin-avatar">{access.name.split(" ").map(n=>n[0]).join("")}</span>
            <div>
              <strong>{access.name}</strong>
              <small>
                {access.canEdit ? "Administradora" : "Solo consulta"}
              </small>
            </div>
          </div>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="admin-desktop-toggle"
              aria-label={
                collapsed ? "Expandir navegación" : "Contraer navegación"
              }
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="admin-mobile-toggle"
              aria-label="Abrir navegación"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </Button>
            <span className="admin-breadcrumb-parent">Administración</span>
            <ChevronRight size={13} />
            <span>{current.label}</span>
          </div>
          <div>
            <span className="admin-demo-label">Entorno de demostración</span>
            <span
              className="admin-avatar admin-avatar-small"
              aria-label={access.name}
            >
              {access.name.split(" ").map(n=>n[0]).join("")}
            </span>
          </div>
        </header>
        <main id="admin-content" className="admin-content">
          {ready ? (
            children
          ) : (
            <div className="admin-loading" role="status">
              <span />
              Preparando tu espacio de trabajo…
            </div>
          )}
        </main>
        <footer className="admin-footer">
          <span>Boletera · Administración</span>
          <span>Datos de ejemplo · Sin operaciones reales</span>
        </footer>
      </div>
      {notice && (
        <div className="admin-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button type="button" aria-label="Cerrar aviso" onClick={clearNotice}>
            <X size={16} />
          </button>
        </div>
      )}
      <AdminDialog
        open={mobile}
        onOpenChange={setMobile}
        title="Administración"
      >
        <nav className="admin-mobile-nav" aria-label="Navegación móvil">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobile(false)}>
              <Icon size={18} />
              {label}
              <ChevronRight size={16} />
            </Link>
          ))}
          <InternalSignOut />
          <Link href="/">
            Volver a las propuestas
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </AdminDialog>
      <AdminDialog
        open={help}
        onOpenChange={setHelp}
        title="Tu centro de operaciones"
        description="Una propuesta de administración para Boletera."
      >
        <p>
          Consulta resultados, prepara eventos y revisa las ventas de ambos
          canales.
        </p>
        <div className="admin-note">
          Esta demo utiliza información ficticia. Los cambios de eventos se
          conservan en este navegador y no modifican el catálogo público ni
          realizan cobros.
        </div>
        <Button onClick={() => setHelp(false)}>Entendido</Button>
      </AdminDialog>
    </div>
  );
}
