"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "max-w-2xl",
}: ModalProps) {
  // mount flag to avoid SSR "document is not defined" issues
  const [mounted, setMounted] = React.useState(false);
  const portalElRef = React.useRef<HTMLElement | null>(null);
  const prevOverflowRef = React.useRef<string>("");

  React.useEffect(() => {
    setMounted(true);
    // create/find a portal container
    const existing = document.getElementById("modal-root");
    if (existing) {
      portalElRef.current = existing;
    } else {
      const el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
      portalElRef.current = el;
    }
    return () => {
      setMounted(false);
      // don't remove #modal-root if you created it? (optional)
      // leave it for reuse; if you want to remove, uncomment next lines:
      // if (portalElRef.current?.id === "modal-root" && portalElRef.current.childElementCount === 0) {
      //   portalElRef.current.remove();
      // }
    };
  }, []);

  // lock/unlock body scroll when open
  React.useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflowRef.current || "";
    }
    return () => {
      document.body.style.overflow = prevOverflowRef.current || "";
    };
  }, [isOpen, mounted]);

  // close on ESC
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!mounted || !portalElRef.current) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] bg-black"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            key="modal"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center px-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
          >
            <div
              className={`relative w-full ${maxWidth} max-h-[600px] md:max-h-[700px] overflow-y-auto scrollbar-hide   rounded-lg bg-white shadow-lg p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute right-4 top-3 text-gray-500 transition hover:text-black"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>

              {/* Title */}
              {title && (
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  {title}
                </h2>
              )}

              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, portalElRef.current);
}
