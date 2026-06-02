"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeShortcut() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [theme, setTheme]);

  return null;
}
