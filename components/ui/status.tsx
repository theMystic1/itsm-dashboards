"use client";

import { StatusType } from "@/types/type";
import Text from "./text";

const StatusItem = ({
  status = "waiting",
  name,
  dot,
  icon,
  iconComponent,
}: StatusType) => {
  const colors = `
  ${
    status === "open"
      ? "bg-silver-light text-silver-dark"
      : status === "danger"
      ? "bg-red-light text-red-dark"
      : status === "progress"
      ? "bg-yellow-light text-yellow-dark"
      : status === "resolved"
      ? "bg-green-light text-green-dark"
      : status === "waiting"
      ? "bg-auto-mid text-yellow-dark"
      : "bg-silver-light text-silver-dark"
  }`;

  const dotColor = `
  ${
    status === "open"
      ? "bg-silver-dark"
      : status === "danger"
      ? "bg-red-dark"
      : status === "progress"
      ? "bg-yellow-dark"
      : status === "resolved"
      ? "bg-green-dark"
      : status === "waiting"
      ? "bg-yellow-dark"
      : "bg-silver-dark"
  }`;

  const dangerPulse = status === "danger" ? "danger-pulse" : "";

  return (
    <div
      className={`relative flex items-center justify-center gap-2 ${colors} px-8 py-2 rounded-full min-w-28 ${dangerPulse}`}
    >
      {dot ? (
        <div className={`${dotColor} h-2 min-w-2 rounded-full`} />
      ) : icon ? (
        iconComponent
      ) : null}
      <Text.SmallText>{name}</Text.SmallText>

      {/* Smooth pulsing red border for danger */}
      <style jsx>{`
        .danger-pulse {
          position: relative; /* anchor pseudo-element */
          transition: background-color 300ms ease, color 300ms ease;
        }
        .danger-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px; /* pill */
          box-shadow: inset 0 0 0 2px rgba(239, 68, 68, 1); /* red-500 */
          opacity: 0.2;
          pointer-events: none;
          animation: pulseBorder 1.2s ease-in-out infinite alternate;
        }

        @keyframes pulseBorder {
          0% {
            opacity: 0.18;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            opacity: 0.18;
          }
        }

        /* Respect reduced motion: keep a steady border */
        @media (prefers-reduced-motion: reduce) {
          .danger-pulse::after {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default StatusItem;
