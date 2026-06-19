"use client";

import { useEffect, useRef } from "react";

export function ScrollProgressLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    function update() {
      const rect = container!.getBoundingClientRect();
      const windowH = window.innerHeight;
      const triggerPoint = windowH * 0.45;

      const top = rect.top;
      const height = rect.height;

      if (top >= triggerPoint) {
        line!.style.height = "0px";
      } else if (top + height <= triggerPoint) {
        line!.style.height = `${height}px`;
      } else {
        line!.style.height = `${triggerPoint - top}px`;
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute left-[20px] top-2 bottom-2">
      <div className="absolute inset-0 w-px bg-border/50" />
      <div
        ref={lineRef}
        className="absolute top-0 left-0 w-px bg-primary transition-[height] duration-100 ease-out"
        style={{ height: 0 }}
      />
    </div>
  );
}
