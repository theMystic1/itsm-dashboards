"use client";

import Text from "@/components/ui/text";
import { useMemo, useState, useEffect } from "react";

const notiPref = [
  {
    name: "Email Notifications",
    details: "Ticket updates, status changes, etc.",
    isOn: false,
  },
  {
    name: "Push Notifications (Mobile App)",
    details: "For urgent alerts or SLA nearing breach",
    isOn: false,
  },
  {
    name: "In-App Notifications",
    details: "Visible in the bell icon menu",
    isOn: false,
  },
];

const makeToggle = (len: number, initial?: boolean[]) =>
  Object.fromEntries(
    Array.from({ length: len }, (_, i) => [i, initial?.[i] ?? false])
  ) as Record<number, boolean>;

const NotificationPreference = () => {
  // (optional) seed from notiPref defaults
  const seed = useMemo(() => notiPref.map((n) => n.isOn), []);
  const [toggle, setToggle] = useState<Record<number, boolean>>(
    makeToggle(notiPref.length, seed)
  );

  const handleToggle = (i: number) =>
    setToggle((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <section className="flex flex-col gap-6">
      {notiPref.map((pref, i) => (
        <div
          key={i}
          className="border-b border-b-gray-200 w-full flex items-center justify-between gap-3 py-3"
        >
          <div>
            <Text.Paragraph className="text-base font-semibold">
              {pref.name}
            </Text.Paragraph>
            <Text.Paragraph className="text-sm">{pref.details}</Text.Paragraph>
          </div>

          {/* use state-backed value + index-based toggle */}
          <ToggleBtn
            toggle={!!toggle[i]}
            onClick={() => handleToggle(i)}
            emergency={pref.name.includes("SLA")}
          />
        </div>
      ))}
    </section>
  );
};

export default NotificationPreference;

type ToggleBtnProps = {
  toggle: boolean;
  onClick: () => void;
  emergency?: boolean;
};

export const ToggleBtn = ({ toggle, onClick, emergency }: ToggleBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={toggle}
      className={`relative h-5 min-w-8 rounded-4xl flex items-center transition-colors duration-300 ease-in-out cursor-pointer
        ${
          !toggle ? "bg-gray-100" : emergency ? "bg-red-500" : "bg-primary-700"
        }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out
          ${!toggle ? "translate-x-0" : "translate-x-3.5"}`}
      />
    </button>
  );
};
