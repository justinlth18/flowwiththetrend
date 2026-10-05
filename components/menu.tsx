"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon, Spark } from "@/components/art";
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
            <span className="nav-pops" aria-hidden="true">
              <Spark className="nav-pop nav-pop-a" color="#fff200" />
              <Spark className="nav-pop nav-pop-b" color="#ff4fa0" />
              <Spark className="nav-pop nav-pop-c" color="#7fd4ff" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
