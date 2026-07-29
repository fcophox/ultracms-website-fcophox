"use client";

import { useEffect, useState } from "react";
import { Inbox, Archive, MoreHorizontal, Loader2, Trash2, Eye, X } from "lucide-react";
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
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
      .neq("message_type", "resource_unlock")
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

  const openDrawer = (message: ContactMessage) => {
    setActiveMessage(message);
  };

  const closeDrawer = () => {
    setActiveMessage(null);
  };

  const promptDelete = (id: string) => {
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", messageToDelete);
      
    if (!error) {
      fetchMessages(); // Refresh the list
    } else {
      console.error("Error deleting message:", error);
    }
    setDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setMessageToDelete(null);
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openDrawer(client)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent hover:border-border/40 transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleArchive(client.id, client.is_archived)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent hover:border-border/40 transition-colors"
                          title={client.is_archived ? "Desarchivar" : "Archivar"}
                        >
                          {client.is_archived ? <Inbox className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                        </button>
                        {client.is_archived && (
                          <button 
                            onClick={() => promptDelete(client.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                            title="Eliminar para siempre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/50 backdrop-blur-md transition-all duration-300">
          <div className="bg-surface border border-border/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="space-y-2">
              <h3 className="text-[16px] font-bold text-foreground">
                ¿Eliminar permanentemente?
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Esta acción no se puede deshacer. El contacto se eliminará de forma definitiva de tu base de datos.
              </p>
            </div>
            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-muted-foreground hover:text-foreground hover:bg-surface border border-border/40 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Eliminar para siempre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {activeMessage && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          {/* Backdrop with blur */}
          <div 
            onClick={closeDrawer}
            className="absolute inset-0 bg-background/40 backdrop-blur-[2px] transition-opacity duration-300 animate-fade-in"
          />
          
          {/* Drawer content sliding from right */}
          <div className="relative w-full max-w-lg h-full bg-surface border-l border-border/50 shadow-2xl flex flex-col z-10 transition-transform duration-300 animate-slide-in-right">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-background border border-border/50 text-muted-foreground">
                  {getSubjectText(activeMessage.message_type)}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {formatDate(activeMessage.created_at)}
                </span>
              </div>
              <button 
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Client Info */}
              <div className="space-y-1">
                <span className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold">Cliente</span>
                <h2 className="text-2xl font-bold text-foreground">{activeMessage.name}</h2>
                <a 
                  href={`mailto:${activeMessage.email}`} 
                  className="text-[14px] text-primary hover:underline block"
                >
                  {activeMessage.email}
                </a>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <span className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold">Estado</span>
                <div className="flex items-center gap-2 text-[13px] text-foreground font-medium">
                  {activeMessage.status === 'new' ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span>Nuevo Mensaje</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                      <span>{activeMessage.status}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2 pt-2">
                <span className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold">Mensaje</span>
                <div className="bg-background/60 border border-border/40 rounded-xl p-5 text-[14px] text-foreground leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message || "Este mensaje no contiene cuerpo de texto."}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-border/40 bg-surface/30 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  handleArchive(activeMessage.id, activeMessage.is_archived);
                  closeDrawer();
                }}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-muted/10 transition-colors border border-border/40 text-foreground flex items-center gap-2"
              >
                {activeMessage.is_archived ? <Inbox className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                {activeMessage.is_archived ? "Desarchivar" : "Archivar contacto"}
              </button>
              
              {activeMessage.is_archived && (
                <button
                  onClick={() => {
                    promptDelete(activeMessage.id);
                    closeDrawer();
                  }}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar permanentemente
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Local styles for sliding animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
