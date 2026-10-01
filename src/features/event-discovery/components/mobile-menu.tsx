"use client";

import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";

export function MobileMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      const menu = menuRef.current;
      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      ) {
        menu.open = false;
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false;
  }

  return (
    <details
      ref={menuRef}
      className="mobile-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuRef.current?.open) {
          event.preventDefault();
          closeMenu();
          menuRef.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label="Menú principal">
        <Menu size={22} aria-hidden="true" />
      </summary>
      <nav aria-label="Navegación móvil">
        <a href="#agenda" onClick={closeMenu}>
          Agenda de eventos
        </a>
        <a href="#experiencia" onClick={closeMenu}>
          La experiencia
        </a>
        <a href="#ayuda" onClick={closeMenu}>
          Ayuda
        </a>
      </nav>
    </details>
  );
}
