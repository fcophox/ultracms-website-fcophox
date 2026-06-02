"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsHovering(false);
  }, [pathname]);

  useEffect(() => {
    // Only run on desktop devices where cursor is relevant
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering an element with data-custom-cursor
      if (target.closest("[data-custom-cursor='true']")) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-custom-cursor='true']")) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <AnimatePresence>
      {isHovering && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center"
          style={{
            x: position.x - 32, // Offset by half the width/height to center
            y: position.y - 32,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] backdrop-blur-sm">
            <ArrowUpRight size={24} strokeWidth={2.5} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
