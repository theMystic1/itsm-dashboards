"use client";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";

type RightSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string; // px or e.g. "28rem"
  children: React.ReactNode;
  showBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
};

export function RightSheet({
  open,
  onClose,
  title,
  width,
  children,
  showBackdrop = true,
  closeOnBackdrop = true,
  className = "",
}: RightSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(
    document.activeElement as HTMLElement
  );

  // Body scroll lock
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // ESC to close + restore focus
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Initial focus inside sheet & restore on close
  useEffect(() => {
    if (open) {
      // Try focus on first focusable
      requestAnimationFrame(() => {
        const node = sheetRef.current;
        const first = node?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (first ?? node)?.focus();
      });
    } else {
      triggerRef.current?.focus?.();
    }
  }, [open]);

  // Close on backdrop click
  const onBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnBackdrop) return;
    // Only close if the click is directly on the backdrop (not on children)
    if (e.target === e.currentTarget) onClose();
  };

  // Variants for slide in/out

  const sheet: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "tween", duration: 0.28 } },
    exit: { x: "100%", transition: { type: "tween", duration: 0.22 } },
  };

  const W = typeof width === "number" ? `${width}px` : width;

  // Portal root
  const portalRoot = typeof window !== "undefined" ? document.body : null;
  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div aria-live="assertive">
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.18 } }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              onMouseDown={onBackdropClick}
            />
          )}

          {/* Sheet */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title || "Panel"}
            className={`fixed top-0 right-0 h-[100dvh] z-[9999] bg-white  shadow-2xl outline-none ${className}`}
            style={{ width: "75%", maxWidth: "100vw" }}
            variants={sheet}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={sheetRef as any}
            tabIndex={-1}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between gap-2 p-4 border-b border-neutral-200/70 dark:border-neutral-800">
              <h2 className="text-base font-semibold text-gray-400 ">
                {title ?? "Panel"}
              </h2>
              <button onClick={onClose} className="">
                <IoCloseCircle size={28} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-auto h-[calc(100dvh-56px)]">
              {children}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    portalRoot
  );
}
