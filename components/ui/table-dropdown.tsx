// components/ui/DropdownMenu.tsx
"use client";

import * as RM from "@radix-ui/react-dropdown-menu";
import * as React from "react";

export type MenuItem =
  | {
      key: string;
      type?: "item";
      label: React.ReactNode;
      icon?: React.ReactNode;
      onSelect?: () => void;
      disabled?: boolean;
      hidden?: boolean;
      danger?: boolean; // red text
      className?: string;
    }
  | { key: string; type: "separator"; hidden?: boolean };

export type DropdownMenuProps = {
  trigger: React.ReactNode; // e.g. a button
  items: MenuItem[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string; // extra classes for <Content>
};

export default function DropdownMenu({
  trigger,
  items,
  side = "bottom",
  align = "end",
  sideOffset = 6,
  className = "",
}: DropdownMenuProps) {
  return (
    <RM.Root>
      <RM.Trigger asChild>{trigger}</RM.Trigger>

      <RM.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={`min-w-[180px] bg-white shadow-md rounded-lg p-2 z-50 ${className}`}
      >
        {items.map((it) => {
          if (it.hidden) return null;

          if (it.type === "separator") {
            return (
              <RM.Separator key={it.key} className="my-1 h-px bg-gray-200" />
            );
          }

          const danger = it.danger
            ? "text-red-600 hover:bg-red-50"
            : "hover:bg-gray-100";
          const disabled = it.disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer";

          return (
            <RM.Item
              key={it.key}
              className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${danger} ${disabled} ${
                it.className ?? ""
              }`}
              onSelect={(e) => {
                if (it.disabled) {
                  e.preventDefault();
                  return;
                }
                // Radix fires onSelect even for keyboard; prevent default
                e.preventDefault();
                it.onSelect?.();
              }}
            >
              {it.icon}
              <span className="leading-none">{it.label}</span>
            </RM.Item>
          );
        })}
      </RM.Content>
    </RM.Root>
  );
}
