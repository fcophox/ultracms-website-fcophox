"use client";

import { useState, useEffect } from "react";
import { Save, Calendar as CalendarIcon, Clock, Info, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const SETTINGS_ID = "00000000-0000-0000-0000-000000000000";

const dayIndices: Record<string, number> = {
  "DOMINGO": 0,
  "LUNES": 1,
  "MARTES": 2,
  "MIÉRCOLES": 3,
  "JUEVES": 4,
  "VIERNES": 5,
  "SÁBADO": 6,
};

export default function CalendarPage() {
  const [activeDay, setActiveDay] = useState("LUNES");
  const [restrictedDays, setRestrictedDays] = useState<number[]>([]);
  const [dailyRestrictions, setDailyRestrictions] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const supabase = createClient();

  const days = [
    { id: "LUNES", name: "LUNES" },
    { id: "MARTES", name: "MARTES" },
    { id: "MIÉRCOLES", name: "MIÉRCOLES" },
    { id: "JUEVES", name: "JUEVES" },
    { id: "VIERNES", name: "VIERNES" },
    { id: "SÁBADO", name: "SÁBADO" },
    { id: "DOMINGO", name: "DOMINGO" },
  ];

  const timeBlocks = [
    "18:30 - 18:45 hrs", "18:45 - 19:00 hrs", "19:00 - 19:15 hrs", "19:15 - 19:30 hrs",
    "19:30 - 19:45 hrs", "19:45 - 20:00 hrs", "20:00 - 20:15 hrs", "20:15 - 20:30 hrs",
    "20:30 - 20:45 hrs", "20:45 - 21:00 hrs"
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("availability_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching settings:", error);
    } else if (data) {
      setRestrictedDays(data.restricted_days || []);
      setDailyRestrictions(data.daily_slot_restrictions || {});
    }
    setIsLoading(false);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    const { error } = await supabase
      .from("availability_settings")
      .upsert({
        id: SETTINGS_ID,
        restricted_days: restrictedDays,
        daily_slot_restrictions: dailyRestrictions,
        updated_at: new Date().toISOString(),
      });

    setIsSaving(false);
    if (!error) {
      setSaveMessage("Guardado");
      setTimeout(() => setSaveMessage(""), 2000);
    } else {
      console.error("Error saving settings:", error);
      setSaveMessage("Error");
    }
  };

  // derived state for active day
  const activeDayIndex = dayIndices[activeDay];
  const isFullDayBlocked = restrictedDays.includes(activeDayIndex);
  const blockedBlocks = dailyRestrictions[activeDayIndex] || [];

  const handleFullDayToggle = () => {
    if (isFullDayBlocked) {
      setRestrictedDays(restrictedDays.filter(d => d !== activeDayIndex));
    } else {
      setRestrictedDays([...restrictedDays, activeDayIndex]);
    }
  };

  const toggleBlock = (block: string) => {
    const newBlocks = blockedBlocks.includes(block)
      ? blockedBlocks.filter(b => b !== block)
      : [...blockedBlocks, block];
      
    setDailyRestrictions({
      ...dailyRestrictions,
      [activeDayIndex]: newBlocks
    });
  };

  if (isLoading) {
    return (
      <div className="px-12 pb-20 pt-10 flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
        <p className="text-muted-foreground text-sm">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="px-12 pb-20 pt-10 flex flex-col max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Gestión Diaria de Calendario</h1>
          <p className="text-sm text-muted-foreground">Personaliza la disponibilidad bloqueando días completos o rangos específicos para cada día de la semana.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage === 'Error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {saveMessage}
            </span>
          )}
          <button 
            onClick={saveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Guardando..." : "Guardar Configuración"}
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-1 bg-surface/40 border border-border/30 p-1.5 rounded-full mb-6 overflow-x-auto scrollbar-hide">
        {days.map((day) => {
          const isActive = activeDay === day.id;
          const isDayRestricted = restrictedDays.includes(dayIndices[day.id]);
          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-bold tracking-wider transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-indigo-500 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface/50'
                }
              `}
            >
              {day.name}
              {isDayRestricted && (
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-red-500/80'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Configuration Card */}
      <div className="bg-surface/20 border border-border/40 rounded-xl overflow-hidden mb-6">
        {/* Card Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface border border-border/50 flex items-center justify-center shadow-sm">
              <CalendarIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">{activeDay}</h2>
              <p className="text-sm text-muted-foreground">Configuración específica para este día</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Bloquear día completo</span>
            <button 
              onClick={handleFullDayToggle}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${isFullDayBlocked ? 'bg-red-500' : 'bg-surface border border-border/60'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${isFullDayBlocked ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-border/40" />

        {/* Blocks Management */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-[15px] font-bold text-foreground">Gestión de bloques horarios</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            Haz clic en el bloque para desactivarlo. Los bloques seleccionados en <span className="text-red-400 font-medium">rojo</span> no estarán disponibles para agendar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {timeBlocks.map((block, i) => {
              const isBlocked = blockedBlocks.includes(block);
              const isEffectivelyBlocked = isFullDayBlocked || isBlocked;
              
              return (
                <button
                  key={i}
                  onClick={() => toggleBlock(block)}
                  disabled={isFullDayBlocked}
                  className={`
                    relative px-4 py-4 rounded-xl text-[13px] font-medium transition-all flex items-center justify-center
                    ${isFullDayBlocked 
                      ? 'bg-red-950/10 border border-red-950/30 text-red-900/60 cursor-not-allowed'
                      : isBlocked 
                        ? 'bg-red-950/20 border border-red-500/30 text-red-200/90' 
                        : 'bg-surface/30 border border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
                    }
                  `}
                >
                  {block}
                  {isEffectivelyBlocked && (
                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isFullDayBlocked ? 'bg-red-900/60' : 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-surface/20 border border-border/40 rounded-xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-foreground mb-1">Información sobre la sincronización</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estas configuraciones sobrescriben los valores globales. Los cambios realizados aquí se verán reflejados en el formulario de contacto para cualquier usuario que seleccione una fecha que corresponda a este día de la semana.
          </p>
        </div>
      </div>
    </div>
  );
}
