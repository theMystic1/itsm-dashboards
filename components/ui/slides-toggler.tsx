"use client";

import React from "react";
import { useSyncedSlide } from "./toggle-slide";

type Props = { slides: string[]; paramKey: string };

const SlideToggler = ({ slides, paramKey }: Props) => {
  const { activeSlide, setSlide } = useSyncedSlide(slides, slides[0], paramKey);

  // console.log(key);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  const activeIndex = React.useMemo(
    () => Math.max(0, slides.indexOf(activeSlide)),
    [activeSlide, slides]
  );

  const updateIndicator = React.useCallback(() => {
    const container = containerRef.current;
    const btn = btnRefs.current[activeIndex];
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const left = btnRect.left - containerRect.left + container.scrollLeft;
    const width = btnRect.width;

    setIndicator({ left, width });
  }, [activeIndex]);

  React.useEffect(() => {
    updateIndicator();
  }, [updateIndicator, activeIndex, slides]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const ro = new ResizeObserver(() => updateIndicator());
    if (containerRef.current) ro.observe(containerRef.current);
    btnRefs.current.forEach((el) => el && ro.observe(el));

    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    const id = requestAnimationFrame(updateIndicator);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(id);
    };
  }, [updateIndicator, slides]);

  return (
    <div
      ref={containerRef}
      className="relative h-10 bg-primary-500/10 rounded-lg flex items-center gap-2 px-2 overflow-hidden"
    >
      <div
        className="absolute top-1 bottom-1 rounded-md bg-primary-600 transition-all duration-300 ease-out"
        style={{
          left: indicator.left,
          width: indicator.width,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          willChange: "left, width",
        }}
      />

      {slides.map((slide, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={slide + i}
            ref={(el) => {
              btnRefs.current[i] = el;
            }} // <-- returns void
            onClick={() => setSlide(slide)}
            className={`relative z-10 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200
              ${
                active
                  ? "text-white"
                  : "text-primary-700 hover:text-primary-800"
              }`}
          >
            {slide}
          </button>
        );
      })}
    </div>
  );
};

export default SlideToggler;
