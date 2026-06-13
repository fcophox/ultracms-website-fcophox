"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ExternalLink, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { name: "Home", href: "/dashboard" },
    { name: "Articles", href: "/dashboard/articles" },
    { name: "Casos de Estudio", href: "/dashboard/case-studies" },
    { name: "Servicios", href: "/dashboard/services" },
    { name: "Clientes", href: "/dashboard/clients" },
    { name: "Calendario", href: "/dashboard/calendar" },
    { name: "Recursos", href: "/dashboard/resources" },
  ];

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard Settings";
    if (path === "/dashboard/articles") return "Articles";
    if (path === "/dashboard/case-studies") return "Case Studies";
    if (path === "/dashboard/services") return "Services";
    if (path === "/dashboard/clients") return "Clients";
    if (path === "/dashboard/calendar") return "Calendar";
    if (path === "/dashboard/resources") return "Recursos";
    return "";
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] h-full bg-surface border-r border-border/50 flex flex-col">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-medium text-lg tracking-tight text-foreground">FcoPhox</span>
            <span className="text-muted text-sm">CMS</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-surface/50 text-foreground"
                    : "text-muted hover:text-foreground hover:bg-muted/10"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 space-y-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-muted/10 transition-colors text-[13px] font-medium text-muted hover:text-red-400"
          >
            Cerrar sesión
            <LogOut size={14} />
          </button>
          
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface/50 hover:bg-muted/20 transition-colors text-[13px] font-medium text-foreground/80"
          >
            Ver sitio web
            <ExternalLink size={14} className="text-muted/80" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header removed per user request */}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
