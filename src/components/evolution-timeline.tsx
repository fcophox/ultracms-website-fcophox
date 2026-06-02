"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const experiences = [
  {
    id: "head-of-ux",
    title: "Head of UX & UX Manager",
    date: "Abril de 2024 hasta la fecha",
    description:
      "Lidero el área de Experiencia de Usuario, gestionando equipos multidisciplinarios y definiendo la estrategia UX de proyectos digitales a gran escala. Mi enfoque está en potenciar la productividad, garantizar procesos de diseño eficientes y fortalecer la cultura de innovación dentro de la organización, siempre con una visión centrada en el usuario y en la mejora continua.",
    skills: ["Estrategia UX", "Gestión de equipos", "Liderazgo en diseño", "Product Discovery"],
  },
  {
    id: "product-designer",
    title: "Product Designer & UX Strategy",
    date: "Abril de 2021 a enero de 2023",
    description:
      "Colaboré en el diseño de interfaces y flujos de interacción enfocados en la usabilidad y accesibilidad. Contribuí en la creación de sistemas de diseño, asegurando consistencia visual y funcionalidad en productos digitales, además de participar en procesos de testeo con usuarios.",
    skills: ["Sistemas de diseño", "Accesibilidad", "Testeo con usuarios", "Prototipado"],
  },
  {
    id: "ux-ui-designer",
    title: "UX Designer & UI Designer",
    date: "Marzo de 2020 a marzo de 2021",
    description:
      "Colaboré en el diseño de interfaces y flujos de interacción enfocados en la usabilidad y accesibilidad. Contribuí en la creación de sistemas de diseño, asegurando consistencia visual y funcionalidad en productos digitales, además de participar en procesos de testeo con usuarios.",
    skills: ["Diseño de interacción", "Diseño visual", "Validación UX"],
  },
  {
    id: "docente",
    title: "Docente UX/UI & Mentor",
    date: "Marzo de 2019 a diciembre de 2019",
    description:
      "Enseñé a estudiantes de Informática los fundamentos de UX/UI, demostrando los beneficios de comprender la experiencia de usuario y la usabilidad. Hice gran énfasis en la importancia de cómo se sienten los usuarios al interactuar con entornos digitales, guiándolos para integrar una visión centrada en el ser humano dentro del desarrollo de software.",
    skills: ["Mentoría", "Enseñanza", "Evaluación de proyectos"],
  },
  {
    id: "lead-ux",
    title: "Lead UX Designer & UX Manager",
    date: "Marzo de 2018 a febrero de 2020",
    description:
      "Encabecé la planificación y ejecución de proyectos UX, desde la investigación hasta la entrega de productos finales. Coordiné equipos de diseño y desarrollo, asegurando la alineación entre stakeholders, objetivos de negocio y la experiencia del usuario final.",
    skills: ["Coordinación de equipos", "Alineación de negocio", "Investigación UX"],
  },
  {
    id: "director-arte",
    title: "Director de arte & Director de proyectos digitales",
    date: "Septiembre de 2014 a marzo de 2018",
    description:
      "Dirigí equipos creativos en el diseño y ejecución de proyectos digitales, integrando identidad visual con estrategias tecnológicas. Lideré la gestión de proyectos, controlando tiempos, recursos y entregables para asegurar calidad e innovación en cada iniciativa.",
    skills: ["Dirección de arte", "Gestión de proyectos", "Identidad visual"],
  },
  {
    id: "disenador-grafico",
    title: "Diseñador gráfico",
    date: "Junio de 2011 a abril de 2014",
    description:
      "Inicié mi trayectoria profesional en el diseño gráfico, desarrollando identidades visuales, piezas publicitarias y materiales digitales. Esta etapa consolidó mi base creativa, estética y técnica, que luego evolucionó hacia el ámbito de UX y producto digital.",
    skills: ["Diseño gráfico", "Publicidad", "Manejo de identidad"],
  },
];

export function EvolutionTimeline() {
  const [activeId, setActiveId] = useState<string>(experiences[0].id);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px", // Trigger when element is in the middle of viewport
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-24 bg-background border-t border-border/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Evolución a lo largo del tiempo
          </h2>
          <p className="text-lg text-muted max-w-3xl">
            He pasado por diversas etapas, desde el diseño gráfico hasta el liderazgo en UX, siempre
            buscando resolver problemas reales y aportar valor a través del diseño.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24 relative">
          {/* Left Column: Fixed Menu */}
          <div className="hidden md:block w-[350px] shrink-0">
            <div className="sticky top-32 flex flex-col gap-6">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleScrollTo(exp.id)}
                  className={`flex items-center gap-4 text-left transition-all duration-300 ${
                    activeId === exp.id
                      ? "text-foreground font-medium"
                      : "text-muted hover:text-foreground/80"
                  }`}
                >
                  <div className="w-6 flex justify-center shrink-0">
                    {activeId === exp.id ? (
                      <motion.div
                        layoutId="active-indicator"
                        className="h-[2px] w-6 bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    ) : (
                      <div className="h-[4px] w-[4px] rounded-full bg-muted/40" />
                    )}
                  </div>
                  <span className="text-sm md:text-base leading-tight">
                    {exp.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 flex flex-col gap-32 pb-32">
            {experiences.map((exp, index) => (
              <article
                key={exp.id}
                id={exp.id}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className="scroll-mt-48 transition-opacity duration-500"
                style={{ opacity: activeId === exp.id ? 1 : 0.5 }}
              >
                <div className="inline-block px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-xs font-medium tracking-wide mb-6">
                  {exp.date}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-6">
                  {exp.title}
                </h3>
                
                <p className="text-muted leading-relaxed mb-10 text-lg">
                  {exp.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {exp.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-foreground font-medium text-sm">
                      <CheckCircle2 className="text-primary w-5 h-5 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
