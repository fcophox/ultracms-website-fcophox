"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldAlert, KeyRound, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { createClient } from "@/utils/supabase/client";
import { sendGAEvent } from "@next/third-parties/google";

// SHA-256 hash of "8291"
const CODE_HASH = "1c753160f146c373c539040c119db2a019d58f51f226f1e009763326e8a7c302";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function ResourcesHero({ onUnlock }: { onUnlock?: () => void }) {
  const t = useTranslations('ResourcesPage');
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }

    // Check if already unlocked
    if (typeof window !== "undefined" && localStorage.getItem("resources_unlocked") === "true") {
      setStatus("success");
      // Give a small delay so other elements have time to register listeners
      setTimeout(() => {
        window.dispatchEvent(new Event("resources-unlock"));
        if (onUnlock) onUnlock();
      }, 100);
    }
  }, [onUnlock]);

  const handleChange = (value: string, index: number) => {
    // Only accept numeric inputs
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Keep only the last character
    setCode(newCode);

    // Auto-focus next input if value was typed
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    // Reset status when user starts editing again
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);

    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < 4; i++) {
        newCode[i] = pastedData[i] || "";
      }
      setCode(newCode);

      // Focus last filled input or the first empty one
      const focusIndex = Math.min(pastedData.length, 3);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 4) return;

    setLoading(true);
    setStatus("idle");

    try {
      const hashed = await sha256(fullCode);
      if (hashed === CODE_HASH) {
        // Log to Supabase database
        const supabase = createClient();
        await supabase
          .from("contact_messages")
          .insert([
            {
              name: "Resource Unlock",
              email: "unlock@fcophox.com",
              message_type: "resource_unlock",
              message: "Acceso concedido a recursos",
              status: "new",
              is_archived: false
            }
          ]);

        sendGAEvent("event", "resource_unlock");

        setStatus("success");
        localStorage.setItem("resources_unlocked", "true");
        window.dispatchEvent(new Event("resources-unlock"));
        if (onUnlock) {
          setTimeout(() => {
            onUnlock();
          }, 1200); // Small delay so the success animation finishes nicely
        }
      } else {
        setStatus("error");
        // Clear code on error and focus first input
        setCode(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[70vh] flex flex-col justify-center relative z-10 py-12">
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        {/* Top Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors font-sans">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backHome')}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <KeyRound className="w-4 h-4" />
              Recursos Exclusivos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-tight mb-6">
              Desbloquea el
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-light">
                contenido especial
              </span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mb-8 leading-relaxed">
              Ingresa el código de acceso de 4 dígitos para acceder a todos nuestros recursos exclusivos para community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-sm text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>¿No tienes un código de acceso? Ponte en contacto para obtener uno.</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Code completion Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md bg-surface/40 backdrop-blur-xl border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-xl font-medium text-foreground mb-2">Código de acceso</h2>
              <p className="text-sm text-muted mb-8">Por favor, escribe el código de 4 dígitos para continuar.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between gap-2 sm:gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="w-12 h-12 min-[360px]:w-14 min-[360px]:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-center text-2xl sm:text-3xl font-semibold bg-surface border-2 border-border/60 focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl transition-all duration-200 outline-none text-foreground"
                      disabled={loading || status === "success"}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-rose-500 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
                    >
                      <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                      <span>Código incorrecto. Inténtalo de nuevo.</span>
                    </motion.div>
                  )}

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-emerald-500 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20"
                    >
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>Acceso concedido. ¡Redirigiendo a descargas!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || code.some((d) => d === "") || status === "success"}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base font-medium transition-all duration-200 border ${status === "success"
                    ? "bg-emerald-600 border-emerald-500 text-white cursor-default"
                    : "bg-primary border-primary/30 hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-40 disabled:hover:bg-primary disabled:cursor-not-allowed"
                    }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verificando...
                    </>
                  ) : status === "success" ? (
                    <>
                      <Check className="w-5 h-5" />
                      Verificado con éxito
                    </>
                  ) : (
                    <>
                      Verificar Código
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Ambient glass glow */}
            <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-50%] left-[-50%] w-[100%] h-[100%] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </section>
  );
}
