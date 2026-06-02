"use client";

import { motion } from "framer-motion";

const areas = [
  {
    num: "01",
    title: "Retail & E-commerce",
    description: "Creación de experiencias de compra fluidas y optimizadas para la conversión, enfocadas en la retención y lealtad del cliente."
  },
  {
    num: "02",
    title: "Fintech & banca",
    description: "Diseño de interfaces financieras seguras, claras y confiables que simplifican la gestión del dinero para los usuarios."
  },
  {
    num: "03",
    title: "Salud & bienestar",
    description: "Soluciones digitales centradas en el paciente, priorizando la accesibilidad y la claridad en la información médica."
  },
  {
    num: "04",
    title: "Educación & tecnología",
    description: "Plataformas de aprendizaje intuitivas que facilitan el acceso al conocimiento y mejoran la experiencia educativa."
  },
  {
    num: "05",
    title: "SaaS & productividad",
    description: "Herramientas eficientes diseñadas para optimizar flujos de trabajo y aumentar la productividad de los equipos."
  },
  {
    num: "06",
    title: "Seguros & asuntos legales",
    description: "Simplificación de procesos complejos a través de diseño claro, generando confianza y transparencia en el usuario."
  }
];

export function AreasColaboracion() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-medium text-foreground text-center mb-16"
        >
          Áreas en las que he colaborado
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <motion.div
              key={area.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col p-8 rounded-3xl border-none bg-surface hover:bg-[#1A1A1E] transition-colors min-h-[280px]"
            >
              <div className="text-sm font-medium text-muted/60 mb-6">
                {area.num}
              </div>
              <h3 className="text-xl md:text-2xl font-normal text-foreground mb-12">
                {area.title}
              </h3>
              <p className="text-muted leading-relaxed mt-auto text-sm md:text-base">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
