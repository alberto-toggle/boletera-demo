"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PanelsTopLeftIcon, ListCollapseIcon, ImagesIcon, ChevronRightIcon, FolderIcon, FolderOpenIcon, CreditCardIcon, HomeIcon, MenuIcon, TicketIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { playgroundBlocks } from "@/lib/playground";

const alphabetical = new Intl.Collator("es", { sensitivity: "base", ignorePunctuation: true });
const homeItem = { icon: HomeIcon, label: "Todos los bloques", href: "/playground" };
const navSections = [...new Set(playgroundBlocks.map((block) => block.category))]
  .sort(alphabetical.compare)
  .map((category) => ({
    category,
    items: playgroundBlocks
      .filter((block) => block.category === category)
      .sort((a, b) => alphabetical.compare(a.title, b.title))
      .map((block) => ({
        icon: block.kind === "navigation" ? MenuIcon : block.kind === "features" ? PanelsTopLeftIcon : block.kind === "gallery" ? ImagesIcon : block.kind === "credit-card" ? CreditCardIcon : block.kind === "virtual-event" ? VideoIcon : TicketIcon,
        label: block.title,
        href: block.href,
      })),
  }));

function NavigationBranch({ category, collapsed, open, onToggle, children }: {
  category: string;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const id = useId();
  const Icon = open ? FolderOpenIcon : FolderIcon;

  return (
    <li>
      <button type="button" onClick={onToggle}
        aria-expanded={open} aria-controls={id} aria-label={category}
        title={collapsed ? category : undefined}
        className={`flex min-h-11 w-full items-center rounded-md py-2 text-left text-sm font-medium hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring ${collapsed ? "justify-center px-4" : "gap-2 px-2"}`}>
        {!collapsed && <ChevronRightIcon aria-hidden="true" className={`size-3.5 shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-90" : ""}`} />}
        <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        {!collapsed && <span className="min-w-0 break-words">{category}</span>}
      </button>
      <ul id={id} hidden={!open}
        className={collapsed ? "space-y-1" : "relative ml-6 space-y-1 border-l border-border pl-3"}>
        {children}
      </ul>
    </li>
  );
}

function NavigationItems({ collapsed = false, pathname, onNavigate }: {
  collapsed?: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => new Set());
  const toggleCategory = (category: string) => {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };
  const renderItem = (item: typeof homeItem) => (
    <Link key={item.href} href={item.href} aria-label={item.label}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={pathname === item.href ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-md px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring ${pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="min-w-0 leading-5">{item.label}</span>}
    </Link>
  );

  return (
    <ul className="space-y-1">
      <li>{renderItem(homeItem)}</li>
      <li>
        <Button type="button" variant="ghost"
          className={`min-h-11 w-full ${collapsed ? "justify-center px-4" : "justify-start gap-2 px-2"}`}
          aria-label="Colapsar todas las secciones"
          title={collapsed ? "Colapsar todas las secciones" : undefined}
          disabled={openCategories.size === 0}
          onClick={() => setOpenCategories(new Set())}>
          <ListCollapseIcon className="size-4 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Colapsar todas</span>}
        </Button>
      </li>
      {navSections.map((section) => (
        <NavigationBranch key={section.category} category={section.category} collapsed={collapsed}
          open={openCategories.has(section.category)} onToggle={() => toggleCategory(section.category)}>
          {section.items.map((item) => (
            <li key={item.href} className={collapsed ? undefined : "relative before:absolute before:-left-3 before:top-5 before:w-3 before:border-t before:border-border"}>
              {renderItem(item)}
            </li>
          ))}
        </NavigationBranch>
      ))}
    </ul>
  );
}

export default function NavbarSidebarToggle({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <div lang="es" className="flex min-h-dvh w-full flex-1 flex-col bg-card">
      <a href="#playground-content" className="sr-only z-50 rounded bg-background p-3 focus:not-sr-only focus:absolute">
        Saltar al contenido
      </a>
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost" size="icon" className="hidden size-8 md:inline-flex"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            aria-expanded={!collapsed} aria-controls="playground-desktop-nav"
          >
            <MenuIcon className="size-4" />
          </Button>
          <Button
            variant="ghost" size="icon" className="size-8 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={mobileOpen} aria-controls="playground-mobile-nav"
          >
            <MenuIcon className="size-4" />
          </Button>
          <Link href="/playground" className="rounded text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
            Boletera / Playground
          </Link>
        </div>
        <Avatar size="sm" aria-label="Boletera">
          <AvatarFallback className="text-[10px]">BO</AvatarFallback>
        </Avatar>
      </header>

      <nav id="playground-mobile-nav" aria-label="Playground móvil" hidden={!mobileOpen} className="border-b bg-muted/30 p-2 md:hidden">
        <NavigationItems pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </nav>

      <div className="flex min-w-0 flex-1">
        <motion.aside className="hidden shrink-0 border-r bg-muted/30 md:block"
          initial={false} animate={{ width: collapsed ? 64 : 256 }}
          transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
        >
          <nav id="playground-desktop-nav" aria-label="Playground" className="sticky top-0 flex max-h-dvh flex-col gap-1 overflow-y-auto p-2">
            <NavigationItems collapsed={collapsed} pathname={pathname} />
          </nav>
        </motion.aside>
        <div id="playground-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
