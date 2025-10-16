"use client";

import { ICONS } from "@/constants/icons";
import { NavItem } from "@/types/type";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { ICONS, IconKey } from "";

// type NavItem = { name: string; href?: string; icon: IconKey };

export default function ClientLayouts({
  navLinks,
  width = 240,
  children,
}: {
  navLinks: NavItem;
  width?: number;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="relative min-h-screen bg-neutral-50 text-neutral-900">
      <aside
        className="fixed left-0 top-0 z-40 h-screen border-r border-black/10 bg-white"
        style={{ width }}
      >
        <div className="flex items-center gap-2 border-b border-black/10 p-4">
          <span className="h-2 w-2 rounded-full bg-primary-800" />
          <h3 className="text-sm font-semibold">Navigation</h3>
        </div>

        <nav className="h-[calc(100vh-56px)] overflow-y-auto p-3">
          <ul className="space-y-2">
            {navLinks.map(({ name, href, icon }) => {
              const Icon = ICONS[icon];
              const active = href ? pathname === href : false;
              const Wrapper = href ? Link : "button";
              const wrapperProps = href ? { href } : {};
              return (
                <li key={name}>
                  <Wrapper
                    {...(wrapperProps as any)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors
                    ${
                      active
                        ? "bg-primary-600 text-white"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon
                      className={`text-[18px] ${
                        active
                          ? "text-white"
                          : "text-neutral-500 group-hover:text-neutral-700"
                      }`}
                    />
                    <span className="truncate">{name}</span>
                  </Wrapper>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div style={{ marginLeft: width }} className="min-h-screen p-4">
        {children}
      </div>
    </main>
  );
}
