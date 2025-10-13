"use client";

import React from "react";

type IOSpinnerProps = {
  size?: number; // overall size in px
  color?: string; // spoke color
  speedMs?: number; // full cycle duration
  className?: string; // optional wrapper classes
};

export const IOSpinner: React.FC<IOSpinnerProps> = ({
  size = 28,
  color = "#3b82f6", // default: Tailwind's blue-500
  speedMs = 1200,
  className = "",
}) => {
  // tweak these to taste; proportional to size
  const thickness = Math.max(2, Math.round(size * 0.05));
  const length = Math.max(6, Math.round(size * 0.34));
  const spokes = 12;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    >
      {/* 12 spokes */}
      {Array.from({ length: spokes }).map((_, i) => (
        <span
          key={i}
          className="ios-spinner-spoke"
          style={{
            width: thickness,
            height: length,
            backgroundColor: color,
            borderRadius: thickness / 2,
            position: "absolute",
            left: size / 2 - thickness / 2,
            top: size / 2 - length,
            transformOrigin: `${thickness / 2}px ${length}px`,
            transform: `rotate(${(360 / spokes) * i}deg)`,
            animationDelay: `${-(speedMs / spokes) * i}ms`,
            opacity: 0.25,
          }}
        />
      ))}

      {/* scoped styles */}
      <style>{`
        @keyframes ios-spinner-fade {
          0%, 39%, 100% { opacity: 0.25; }
          40%          { opacity: 1; }
        }
        .ios-spinner-spoke {
          animation: ios-spinner-fade var(--ios-speed, 1200ms) linear infinite;
        }
      `}</style>

      {/* set speed via CSS var so animation picks it up */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          ["--ios-speed" as any]: `${speedMs}ms`,
        }}
      />
    </div>
  );
};
