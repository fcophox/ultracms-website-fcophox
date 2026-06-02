"use client";

import { useEffect, useState } from "react";
import { Inbox, Archive, MoreHorizontal, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message_type: string;
  message: string;
  status: string;
  is_archived: boolean;
  created_at: string;
}

export default function ClientsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inbox" | "archived">("inbox");
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    setIsLoading(true);
    const isArchived = activeTab === "archived";
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("is_archived", isArchived)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const handleArchive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_archived: !currentStatus })
      .eq("id", id);
      
    if (!error) {
      fetchMessages(); // Refresh the list
    } else {
      console.error("Error updating archive status:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getSubjectText = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'AGENDAR REUNIÓN';
      case 'consulting':
        return 'CONSULTORÍA UX';
      default:
        return 'MENSAJE';
    }
  };

  return (
    <div className="px-12 pb-20 pt-10 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Gestor de Clientes</h1>
          <p className="text-sm text-muted-foreground">Administra los mensajes y solicitudes de tus clientes.</p>
        </div>
        
        {/* Toggle */}
        <div className="flex items-center bg-surface border border-border/40 rounded-full p-1">
          <button 
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "inbox" 
                ? "bg-background border border-border/50 text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Inbox className="w-4 h-4" />
            Contactos
          </button>
          <button 
            onClick={() => setActiveTab("archived")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "archived" 
                ? "bg-background border border-border/50 text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Archive className="w-4 h-4" />
            Archivados
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface/20 border border-border/40 rounded-xl overflow-hidden flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
            <p className="text-sm">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Inbox className="w-12 h-12 mb-4 opacity-20" />
            <p>No hay mensajes {activeTab === "archived" ? "archivados" : "nuevos"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-transparent border-b border-border/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Asunto</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-[13px]">
                {messages.map((client) => (
                  <tr key={client.id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(client.created_at)}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{client.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-surface border border-border/50 text-muted-foreground">
                        {getSubjectText(client.message_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {client.status === 'new' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        )}
                        {client.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleArchive(client.id, client.is_archived)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent hover:border-border/40 transition-colors ml-auto opacity-0 group-hover:opacity-100"
                        title={client.is_archived ? "Desarchivar" : "Archivar"}
                      >
                        {client.is_archived ? <Inbox className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
