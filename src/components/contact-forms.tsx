"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Mail, MessageSquare, Send, Globe, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

function TypewriterEffect({ text }: { text: string }) {
  const [phase, setPhase] = useState<'thinking' | 'typing' | 'done'>('thinking');
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const thinkingTimeout = setTimeout(() => {
      setPhase('typing');
    }, 1500);
    return () => clearTimeout(thinkingTimeout);
  }, []);

  useEffect(() => {
    if (phase === 'typing') {
      let i = 0;
      setDisplayedText('');
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          setPhase('done');
          clearInterval(typingInterval);
        }
      }, 25);
      return () => clearInterval(typingInterval);
    }
  }, [phase, text]);

  if (phase === 'thinking') {
    return (
      <div className="flex gap-1 items-center h-5">
        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  return (
    <span className="text-sm text-foreground font-medium">
      {displayedText}
      {phase === 'typing' && <span className="inline-block w-1 h-3.5 ml-[2px] bg-primary animate-pulse align-middle" />}
    </span>
  );
}

export function MessageForm() {
  const t = useTranslations('ContactForms');
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          messageType: "message",
          message: formData.message,
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-in fade-in zoom-in duration-500 w-full bg-surface/30 border border-border/20 rounded-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('msgSentTitle')}</h3>
        <p className="text-muted-foreground text-sm max-w-[300px]">{t('msgSentDesc')}</p>
        <button onClick={() => setIsSuccess(false)} className="mt-4 text-sm font-medium text-primary hover:underline transition-colors">
          {t('sendAnotherMsg')}
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblName')}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('placeholderName')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblEmail')}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('placeholderEmail')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">{t('lblMsg')}</label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('placeholderMsg')}
            rows={6}
            className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>
      </div>

      <button disabled={isLoading || !formData.name || !formData.email || !formData.message} className="w-full bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-border/20 mt-4">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('btnSend')} <Send className="w-5 h-5" /></>}
      </button>

      <div className="flex items-center gap-4 bg-surface/50 p-4 rounded-2xl border border-border/10 mt-2">
        <div className="relative shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border/20">
            <Image src="/brand/francisco-avatar.png?v=2" alt="Francisco" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111113] z-10 flex items-center justify-center">
            <div className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
        <div className="flex-1 min-h-[20px]">
          <TypewriterEffect key={t('msgFooter')} text={t('msgFooter')} />
        </div>
      </div>
    </form>
  );
}

export function ConsultingForm() {
  const t = useTranslations('ContactForms');
  const [formData, setFormData] = useState({ name: "", email: "", message: "", devTime: "", url: "" });
  const [hasBudget, setHasBudget] = useState(false);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([500, 1500]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    try {
      const composedMessage = `Proyecto: ${formData.message}\n\nTiempo estimado de desarrollo: ${formData.devTime || 'No especificado'}\nURL a consultar: ${formData.url || 'No especificado'}\n¿Presupuesto inicial?: ${hasBudget ? 'Sí ($' + budgetRange[0] + ' - $' + budgetRange[1] + ' USD)' : 'No'}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          messageType: "consulting",
          message: composedMessage,
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "", devTime: "", url: "" });
        setHasBudget(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-in fade-in zoom-in duration-500 w-full bg-surface/30 border border-border/20 rounded-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('consultSentTitle')}</h3>
        <p className="text-muted-foreground text-sm max-w-[300px]">{t('consultSentDesc')}</p>
        <button onClick={() => setIsSuccess(false)} className="mt-4 text-sm font-medium text-primary hover:underline transition-colors">
          {t('sendAnotherConsult')}
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblName')}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('placeholderName')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblEmail')}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('placeholderEmail')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">{t('lblMsg')}</label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('placeholderConsultMsg')}
            rows={5}
            className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblDevTime')}</label>
          <div className="relative">
            <input
              type="text"
              value={formData.devTime}
              onChange={(e) => setFormData({ ...formData, devTime: e.target.value })}
              placeholder={t('placeholderDevTime')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 px-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblUrl')} <span className="text-xs text-muted">{t('lblOptional')}</span></label>
          <div className="relative">
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder={t('placeholderUrl')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 px-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border/20 p-6 rounded-2xl flex flex-col gap-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-foreground font-medium mb-1">{t('budgetTitle')}</h4>
            <p className="text-sm text-muted-foreground">{t('budgetDesc')}</p>
          </div>
          <button 
            type="button"
            onClick={() => setHasBudget(!hasBudget)}
            className={`w-14 h-8 shrink-0 rounded-full transition-colors relative flex items-center px-1 ${hasBudget ? 'bg-primary' : 'bg-surface border border-border/40'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${hasBudget ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {hasBudget && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 pt-4 border-t border-border/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{t('budgetRange')}</span>
              <span className="text-sm font-bold text-primary">${budgetRange[0]} - ${budgetRange[1]} USD</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('budgetNote')}
            </p>
            
            <div className="relative h-2 bg-background border border-border/20 rounded-full mt-4 mb-2">
              <div 
                className="absolute h-full bg-primary rounded-full" 
                style={{ 
                  left: `${((budgetRange[0] - 500) / 9500) * 100}%`, 
                  right: `${100 - ((budgetRange[1] - 500) / 9500) * 100}%` 
                }} 
              />
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={budgetRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), budgetRange[1] - 100);
                  setBudgetRange([val, budgetRange[1]]);
                }}
                className="absolute -top-2 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
              />
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={budgetRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), budgetRange[0] + 100);
                  setBudgetRange([budgetRange[0], val]);
                }}
                className="absolute -top-2 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
              />
            </div>
          </div>
        )}
      </div>

      <button disabled={isLoading || !formData.name || !formData.email || !formData.message} className="w-full bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-border/20 mt-2">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('btnSend')} <Send className="w-5 h-5" /></>}
      </button>

      <div className="flex items-center gap-4 bg-surface/50 p-4 rounded-2xl border border-border/10">
        <div className="relative shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border/20">
            <Image src="/brand/francisco-avatar.png?v=2" alt="Francisco" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111113] z-10 flex items-center justify-center">
            <div className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
        <div className="flex-1 min-h-[20px]">
          <TypewriterEffect key={t('consultFooter')} text={t('consultFooter')} />
        </div>
      </div>
    </form>
  );
}

export function MeetingForm() {
  const t = useTranslations('ContactForms');
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [restrictedDays, setRestrictedDays] = useState<number[]>([]);
  const [dailyRestrictions, setDailyRestrictions] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const supabase = createClient();

  const allSlots = [
    "18:30 - 18:45 hrs", "18:45 - 19:00 hrs", "19:00 - 19:15 hrs", "19:15 - 19:30 hrs",
    "19:30 - 19:45 hrs", "19:45 - 20:00 hrs", "20:00 - 20:15 hrs", "20:15 - 20:30 hrs",
    "20:30 - 20:45 hrs", "20:45 - 21:00 hrs"
  ];

  useEffect(() => {
    // Inicializar el día seleccionado al día de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("availability_settings")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000000")
        .single();

      if (data && !error) {
        setRestrictedDays(data.restricted_days || []);
        setDailyRestrictions(data.daily_slot_restrictions || {});
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const generateDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const startMonday = new Date(today);
    startMonday.setDate(today.getDate() - distanceToMonday);

    const daysArray = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: string[] = t.raw('days');

    for (let i = 0; i < 14; i++) {
      const date = new Date(startMonday);
      date.setDate(startMonday.getDate() + i);
      const isPast = date < today;
      const dayIndex = date.getDay();
      const isRestricted = restrictedDays.includes(dayIndex);

      daysArray.push({
        jsDate: date,
        dateString: date.getDate().toString(),
        dayHeader: i < 7 ? headers[dayIndex] : '',
        isAvailable: !isPast && !isRestricted,
        dayIndex
      });
    }
    return daysArray;
  };

  const calendarDays = generateDays();

  const getSlotsForSelected = () => {
    if (!selectedDate) return allSlots;
    const dayIndex = selectedDate.getDay();
    const blockedForDay = dailyRestrictions[dayIndex] || [];
    return allSlots.map(slot => ({
      time: slot,
      isAvailable: !blockedForDay.includes(slot)
    }));
  };

  const currentSlots = getSlotsForSelected();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    try {
      const formattedDate = selectedDate.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const composedMessage = `Reunión agendada para:\nFecha: ${formattedDate}\nHora: ${selectedSlot}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          messageType: "meeting",
          message: composedMessage,
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "" });
        setSelectedDate(null);
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-in fade-in zoom-in duration-500 w-full bg-surface/30 border border-border/20 rounded-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('meetSentTitle')}</h3>
        <p className="text-muted-foreground text-sm max-w-[300px]">{t('meetSentDesc')}</p>
        <button onClick={() => setIsSuccess(false)} className="mt-4 text-sm font-medium text-primary hover:underline transition-colors">
          {t('sendAnotherMeet')}
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblName')}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('placeholderName')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">{t('lblEmail')}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('placeholderEmail')}
              className="w-full bg-surface border border-border/20 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-muted-foreground">{t('lblSelectDay')}</label>
        <div className="bg-surface border border-border/20 rounded-2xl p-6 min-h-[160px] relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-surface/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center">
            {calendarDays.map((d, i) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isToday = today.getTime() === d.jsDate.getTime();
              const isSelected = selectedDate?.getTime() === d.jsDate.getTime();

              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  {d.dayHeader && <span className="text-[10px] font-bold text-muted-foreground">{d.dayHeader}</span>}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      disabled={!d.isAvailable}
                      onClick={() => {
                        setSelectedDate(d.jsDate);
                        setSelectedSlot(null);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                        ${isSelected ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' : ''}
                        ${!isSelected && isToday ? 'border border-primary text-primary hover:bg-primary/10' : ''}
                        ${!isSelected && !isToday && d.isAvailable ? 'text-foreground hover:bg-surface border border-transparent hover:border-border/50' : ''}
                        ${!d.isAvailable ? 'text-muted-foreground opacity-10 cursor-not-allowed border-transparent' : ''}
                      `}
                    >
                      {d.dateString}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-muted-foreground">{t('lblSelectTime')}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {selectedDate ? (
            currentSlots.map((slot: any, i) => {
              const isSlotSelected = selectedSlot === slot.time;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedSlot(slot.time)}
                  disabled={!slot.isAvailable}
                  className={`py-3 px-2 rounded-xl text-xs font-medium transition-colors border
                  ${isSlotSelected ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]' : ''}
                  ${!isSlotSelected && slot.isAvailable
                      ? 'bg-surface border-border/10 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      : ''
                    }
                  ${!slot.isAvailable ? 'bg-transparent border-transparent text-muted-foreground opacity-10 cursor-not-allowed' : ''}
                `}
                >
                  {slot.time}
                </button>
              );
            })
          ) : (
            allSlots.map((slot, i) => (
              <button
                key={i}
                type="button"
                disabled
                className="py-3 px-2 rounded-xl text-xs font-medium bg-transparent border border-transparent text-muted-foreground opacity-10 cursor-not-allowed"
              >
                {slot}
              </button>
            ))
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{t('meetNote')}</p>
      </div>

      <button
        disabled={isSubmitting || !formData.name || !formData.email || !selectedDate || !selectedSlot}
        className="w-full bg-surface hover:bg-surface/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-border/20 mt-4"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('btnSend')} <Send className="w-5 h-5" /></>}
      </button>

      <div className="flex items-center gap-4 bg-surface/50 p-4 rounded-2xl border border-border/10 mt-2">
        <div className="relative shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border/20">
            <Image src="/brand/francisco-avatar.png?v=2" alt="Francisco" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111113] z-10 flex items-center justify-center">
            <div className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
        <div className="flex-1 min-h-[20px]">
          <TypewriterEffect key={t('meetFooter')} text={t('meetFooter')} />
        </div>
      </div>
    </form>
  );
}
