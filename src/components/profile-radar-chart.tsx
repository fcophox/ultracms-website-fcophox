"use client";

import React, { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { subject: 'UX Research', "UX Tradicional": 5, "Frontend Tradicional": 1, "UX Engineer": 4 },
  { subject: 'UX/UI Design', "UX Tradicional": 5, "Frontend Tradicional": 2, "UX Engineer": 4 },
  { subject: 'Product Strategy', "UX Tradicional": 4, "Frontend Tradicional": 2, "UX Engineer": 4 },
  { subject: 'Prototyping', "UX Tradicional": 5, "Frontend Tradicional": 3, "UX Engineer": 4 },
  { subject: 'Frontend / Código', "UX Tradicional": 1, "Frontend Tradicional": 5, "UX Engineer": 4 },
  { subject: 'Design Systems', "UX Tradicional": 3, "Frontend Tradicional": 4, "UX Engineer": 5 },
  { subject: 'Analítica + IA', "UX Tradicional": 2, "Frontend Tradicional": 3, "UX Engineer": 4 },
  { subject: 'MVP + Entrega', "UX Tradicional": 2, "Frontend Tradicional": 4, "UX Engineer": 5 },
  { subject: 'Integración Negocio', "UX Tradicional": 3, "Frontend Tradicional": 2, "UX Engineer": 5 },
];

export function ProfileRadarChart() {
  const [mounted, setMounted] = useState(false);
  const [activeProfiles, setActiveProfiles] = useState<Record<string, boolean>>({
    "UX Tradicional": true,
    "Frontend Tradicional": true,
    "UX Engineer": true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleProfile = (dataKey: string) => {
    setActiveProfiles(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    const order = ["UX Tradicional", "Frontend Tradicional", "UX Engineer"];
    const sortedPayload = [...payload].sort((a: any, b: any) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey));

    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-6">
        {sortedPayload.map((entry: any, index: number) => {
          const isActive = activeProfiles[entry.dataKey];
          return (
            <li
              key={`item-${index}`}
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full border transition-all ${isActive
                ? 'border-border bg-foreground/5 opacity-100'
                : 'border-transparent bg-transparent opacity-40 hover:opacity-70'
                }`}
              onClick={() => toggleProfile(entry.dataKey)}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-foreground select-none">{entry.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        @keyframes radar-pulse {
          0%, 100% { filter: drop-shadow(0 0 2px #60a5fa); }
          50% { filter: drop-shadow(0 0 12px #60a5fa); }
        }
        .ux-engineer-radar,
        .recharts-polygon[stroke="#60a5fa"] {
          animation: radar-pulse 2.5s ease-in-out infinite;
        }
        .recharts-wrapper, 
        .recharts-surface {
          outline: none !important;
        }
      `}</style>
      <div className="w-full bg-background rounded-3xl p-4 md:p-8 pb-4 md:pb-8 flex flex-col items-center">
        <div className="w-full h-[450px] md:h-[550px] flex items-center justify-center focus:outline-none focus-visible:outline-none -mt-4">
          <ResponsiveContainer width="100%" height="100%" className="focus:outline-none focus-visible:outline-none">
            <RadarChart cx="50%" cy="45%" outerRadius="75%" data={data} style={{ outline: 'none' }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />

              <Radar
                name="UX Engineer"
                dataKey="UX Engineer"
                stroke="#60a5fa"
                fill="#60a5fa"
                className="ux-engineer-radar"
                fillOpacity={activeProfiles["UX Engineer"] ? 0.03 : 0}
                strokeWidth={activeProfiles["UX Engineer"] ? 1 : 0}
                strokeOpacity={activeProfiles["UX Engineer"] ? 0.9 : 0}
              />
              <Radar
                name="UX Tradicional"
                dataKey="UX Tradicional"
                stroke="#64748B"
                fill="#64748B"
                fillOpacity={activeProfiles["UX Tradicional"] ? 0.15 : 0}
                strokeOpacity={activeProfiles["UX Tradicional"] ? 1 : 0}
              />
              <Radar
                name="Frontend Tradicional"
                dataKey="Frontend Tradicional"
                stroke="#475569"
                fill="#475569"
                fillOpacity={activeProfiles["Frontend Tradicional"] ? 0.15 : 0}
                strokeOpacity={activeProfiles["Frontend Tradicional"] ? 1 : 0}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend content={renderCustomLegend} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
