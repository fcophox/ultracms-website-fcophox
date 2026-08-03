"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ExternalLink,
  LogOut,
  Search,
  Plus,
  ChevronDown,
  ChevronsUpDown,
  Home as HomeIcon,
  FileText,
  Briefcase,
  Sliders,
  Users,
  Calendar as CalendarIcon,
  Folder,
  Image as ImageIcon
} from "lucide-react";
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
  const [userName, setUserName] = useState<string>("Francisco");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [counts, setCounts] = useState<{
    articles: number;
    caseStudies: number;
    services: number;
    clients: number;
  }>({
    articles: 0,
    caseStudies: 0,
    services: 0,
    clients: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user.email) {
          const namePart = user.email.split("@")[0];
          setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      }
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchCounts = async () => {
      const getCount = async (table: string, filter?: (query: any) => any) => {
        let q = supabase.from(table).select("*", { count: "exact", head: true });
        if (filter) q = filter(q);
        const { count, error } = await q;
        return error ? 0 : (count ?? 0);
      };

      const [articles, caseStudies, services, clients] = await Promise.all([
        getCount("articles"),
        getCount("case_studies"),
        getCount("services"),
        getCount("contact_messages", q => q.neq("message_type", "resource_unlock")),
      ]);

      setCounts({ articles, caseStudies, services, clients });
    };

    fetchCounts();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const userInitials = userName
    ? userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "FR";

  const workspaceNav = [
    { name: "Artículos", href: "/dashboard/articles", icon: FileText, countKey: "articles" as const },
    { name: "Casos de Estudio", href: "/dashboard/case-studies", icon: Briefcase, countKey: "caseStudies" as const },
    { name: "Servicios", href: "/dashboard/services", icon: Sliders, countKey: "services" as const },
    { name: "Clientes", href: "/dashboard/clients", icon: Users, countKey: "clients" as const },
  ];

  const addonsNav = [
    { name: "Calendario", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Recursos", href: "/dashboard/resources", icon: Folder },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: ImageIcon },
  ];

  const filteredWorkspaceNav = workspaceNav.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAddonsNav = addonsNav.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] h-full bg-background border-r border-border/50 flex flex-col justify-between">
        
        <div className="flex flex-col flex-1 overflow-y-auto py-6">
          {/* Studio Header Selector */}
          <div className="px-6 mb-5">
            <button className="w-full flex items-center justify-between p-1.5 -ml-1.5 rounded-lg hover:bg-muted/10 transition-colors text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <span className="text-[12px] font-bold text-primary">F</span>
                </div>
                <span className="font-semibold text-[15px] tracking-tight text-foreground">FcoPhox Studio</span>
              </div>
              <ChevronDown size={16} className="text-muted" />
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 mb-5">
            <div className="relative flex items-center bg-background/50 border border-border/40 rounded-xl px-3 py-2 focus-within:border-foreground/30 transition-colors">
              <Search size={15} className="text-muted/80 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-transparent border-0 p-0 text-[14px] placeholder-muted focus:ring-0 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Main Navigation (Home) */}
          <div className="px-2 mb-6">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-surface/50 text-foreground shadow-sm border border-border/40"
                  : "text-muted hover:text-foreground hover:bg-muted/10"
              }`}
            >
              <HomeIcon size={17} />
              Home
            </Link>
          </div>

          {/* Workspaces / CMS Sections */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="px-6 py-1.5 text-[12px] font-bold tracking-wider text-muted/70 uppercase mb-2">
                Workspaces
              </div>

              <nav className="px-2 space-y-0.5">
                {filteredWorkspaceNav.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
                  const count = item.countKey ? counts[item.countKey] : null;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors ${
                        isActive
                          ? "bg-surface/50 text-foreground border border-border/40 shadow-sm"
                          : "text-muted hover:text-foreground hover:bg-muted/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent size={17} className={isActive ? "text-primary" : "text-muted/80"} />
                        <span>{item.name}</span>
                      </div>
                      {count !== null && (
                        <span className="text-[12px] text-muted/80 font-semibold px-2 py-0.2">
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Complementos Section */}
            {(filteredAddonsNav.length > 0 || searchQuery === "") && (
              <div>
                <div className="px-6 py-1.5 text-[12px] font-bold tracking-wider text-muted/70 uppercase mb-2">
                  Complementos
                </div>

                <nav className="px-2 space-y-0.5">
                  {filteredAddonsNav.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors ${
                          isActive
                            ? "bg-surface/50 text-foreground border border-border/40 shadow-sm"
                            : "text-muted hover:text-foreground hover:bg-muted/10"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent size={17} className={isActive ? "text-primary" : "text-muted/80"} />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Footer User Profile Card */}
        <div className="p-4 border-t border-border/40 bg-background">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-muted/10 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[14.5px] border border-primary/30 shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[14px] font-semibold text-foreground truncate">
                    {userName}
                  </span>
                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-md uppercase shrink-0">
                    Admin
                  </span>
                </div>
                <span className="text-[12px] text-muted truncate block mt-0.5">
                  {userEmail || "fcophox@studio.com"}
                </span>
              </div>
              <ChevronsUpDown size={16} className="text-muted/80 shrink-0" />
            </button>
            
            {/* Popover User Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface border border-border rounded-xl shadow-lg p-1.5 space-y-0.5 z-[110]">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-foreground/80 hover:text-foreground hover:bg-muted/10 transition-colors"
                >
                  <ExternalLink size={15} className="text-muted" />
                  Ver sitio web
                </a>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
                >
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
