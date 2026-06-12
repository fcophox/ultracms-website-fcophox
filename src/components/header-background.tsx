"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export function HeaderBackground() {
  const pathname = usePathname();

  // Exclude the home page (which has the Hero), dashboard pages, and login page
  const isHome = pathname === "/";
  const isDashboard = pathname?.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  if (isHome || isDashboard || isLogin) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 right-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
      <Image
        src="/brand/background-page.png"
        alt="Page Header Background"
        fill
        priority
        className="object-cover object-top opacity-80 dark:opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}
