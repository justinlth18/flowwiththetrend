"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/art";
import { navItems } from "@/lib/content";

export function Burger({
  open,
  onClick,
  className = "",
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`burger ${className}`.trim()}
      aria-expanded={open}
      aria-controls="studio-menu"
      onClick={onClick}
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      <span className="burger-lines" data-open={open ? "true" : "false"}>
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();

  return (
    <div className="nav-list" id="studio-menu">
      {navItems.map((item) => {
        const active = item.href === "/work" ? path.startsWith("/work") : path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "nav-link is-active" : "nav-link"}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            <span className="nav-ico">
              <NavIcon name={item.icon} />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
