"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import StatusItem from "./status";
import { ticketLifecycle } from "@/constants/constant";
import { Istatus } from "@/types/type";
import { BiCheck } from "react-icons/bi";

type Props = {
  activeIndex?: number;
  activeName?: string;
  className?: string;
  showDot?: boolean;
  trackHeightPx?: number; // thickness of the track
};

export default function TicketLifecycleStepper({
  activeIndex,
  activeName,
  className = "",
  showDot = true,
  trackHeightPx = 2,
}: Props) {
  const steps = ticketLifecycle;

  const resolvedIndex = useMemo(() => {
    if (typeof activeIndex === "number") {
      return Math.max(0, Math.min(steps.length - 1, activeIndex));
    }
    const idx = steps.findIndex(
      (s) => s.name.toLowerCase() === (activeName ?? "").toLowerCase()
    );
    return Math.max(0, idx);
  }, [activeIndex, activeName, steps]);

  const progressPct = steps.length > 1 ? resolvedIndex / (steps.length - 1) : 1;

  // Refs
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstMarkerRef = useRef<HTMLDivElement>(null);
  const lastMarkerRef = useRef<HTMLDivElement>(null);

  const [track, setTrack] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const scroller = scrollerRef.current;
      const first = firstMarkerRef.current;
      const last = lastMarkerRef.current;
      if (!scroller || !first || !last) return;

      const sRect = scroller.getBoundingClientRect();
      const fRect = first.getBoundingClientRect();
      const lRect = last.getBoundingClientRect();

      // computed styles for border widths (we want INSIDE edges)
      const fStyle = getComputedStyle(first);
      const lStyle = getComputedStyle(last);
      const fBorderRight = parseFloat(fStyle.borderRightWidth || "0");
      const lBorderLeft = parseFloat(lStyle.borderLeftWidth || "0");

      // Inside-right of first & inside-left of last in viewport coords
      const startX = fRect.right - fBorderRight;
      const endX = lRect.left + lBorderLeft;

      // Convert to scroller-local coords (account for scrollLeft)
      let left = startX - sRect.left + scroller.scrollLeft;
      let width = Math.max(0, endX - startX);

      // Clamp so we never overflow the scroll content
      const maxWidth = Math.max(0, scroller.scrollWidth - left);
      if (width > maxWidth) width = maxWidth;
      if (left < 0) {
        width = Math.max(0, width + left);
        left = 0;
      }

      setTrack({ left, width });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (scrollerRef.current) ro.observe(scrollerRef.current);

    // Re-measure on scroll (horizontal)
    const onScroll = () => measure();
    scrollerRef.current?.addEventListener("scroll", onScroll, {
      passive: true,
    });
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      scrollerRef.current?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className={`w-full ${className}`} aria-label="Ticket lifecycle">
      {/* Scroll container holds BOTH the track and the steps */}
      <div ref={scrollerRef} className="relative overflow-x-auto pb-4">
        {/* Track (absolute within scroller; never overflows) */}
        <div
          className="absolute top-6 rounded bg-silver-light"
          style={{
            left: track.left,
            width: track.width,
            height: trackHeightPx,
          }}
          aria-hidden
        />
        <div
          className="absolute top-6 rounded bg-primary-500 transition-[width] duration-300"
          style={{
            left: track.left,
            width: `${track.width * progressPct}px`,
            height: trackHeightPx,
          }}
          aria-hidden
        />

        {/* Steps row */}
        <ol className="relative z-[1] flex items-start gap-4 pt-4" role="list">
          {steps.map((step, i) => {
            const isDone = i < resolvedIndex;
            const isCurrent = i === resolvedIndex;

            return (
              <li
                key={step.name}
                className="flex min-w-max flex-col items-center gap-2"
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Marker (circle) */}
                <div
                  ref={
                    i === 0
                      ? firstMarkerRef
                      : i === steps.length - 1
                      ? lastMarkerRef
                      : undefined
                  }
                  className={[
                    "h-4 w-4 rounded-full border-2 bg-white",
                    isDone || isCurrent
                      ? "border-primary-500"
                      : "border-silver-light",
                  ].join(" ")}
                >
                  {
                    isDone || isCurrent ? (
                      <BiCheck size={12} className="text-primary-500" />
                    ) : null /* filled circle if done */
                  }
                </div>
                {/* Pill */}
                <StatusItem
                  status={step.status as Istatus}
                  name={step.name}
                  dot={showDot}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
