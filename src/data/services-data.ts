export interface ServiceRoadmapItem {
  milestone: string;
  percentage: string;
  description: string;
}

export interface ServicePlanItem {
  name: string;
  subtitle: string;
  includes: string[];
  idealFor: string;
}

export interface AudienceCard {
  title: string;
  description: string;
  image: string;
}

export interface ServiceDetail {
  title: string;
  shortDesc: string;
  longDesc: string;
  forWho: string;
  whoShouldHire: string;
  valueProp: string;
  whyNeed: string;
  whatYouGet: string;
  audienceCards: AudienceCard[];
  roadmap: ServiceRoadmapItem[];
  plans: ServicePlanItem[];
  conditions: string[];
  imageUrl: string;
  badge: string;
}

export const servicesData: Record<string, { es: ServiceDetail; en: ServiceDetail }> = {
  "ux-strategy": {
    es: {
      title: "Investigación y Estrategia UX",
      shortDesc: "Entendimiento profundo del usuario y negocio para definir el rumbo del producto, mapear flujos de interacción y asegurar la viabilidad del concepto.",
      longDesc: "Este servicio ayuda a descubrir, ordenar y validar las necesidades reales de los usuarios, del negocio y del producto antes de invertir tiempo y recursos en diseño o desarrollo. A través de investigación, análisis de contexto, revisión de datos, entrevistas, benchmarks y definición estratégica, se construye una base sólida para tomar mejores decisiones. El objetivo es reducir la incertidumbre, detectar oportunidades, priorizar problemas relevantes y transformar información dispersa en una dirección clara para el producto digital.",
      forWho: "Este servicio es ideal para startups, empresas, áreas de innovación, equipos de producto, negocios en etapa de crecimiento o compañías que necesitan entender mejor a sus usuarios antes de rediseñar, crear o escalar una solución digital. También es recomendable para organizaciones que tienen una idea, pero aún no saben con precisión qué problema resolver, qué funcionalidades priorizar o cómo alinear la experiencia con los objetivos del negocio.",
      whoShouldHire: "Lo deberían contratar founders, product managers, gerentes de innovación, líderes de transformación digital, equipos UX/UI, áreas comerciales, marketing, operaciones o cualquier equipo que necesite tomar decisiones de producto con mayor evidencia y menos intuición.",
      valueProp: "Este servicio permite tomar decisiones más informadas, evitar construir funcionalidades innecesarias, detectar fricciones en la experiencia actual, priorizar oportunidades de alto impacto y conectar las necesidades del usuario con los objetivos del negocio. El valor principal está en transformar incertidumbre en claridad estratégica.",
      whyNeed: "Porque antes de diseñar o desarrollar, necesitas saber qué problema vale la pena resolver, para quién lo estás resolviendo y cómo esa solución aporta al negocio. Este servicio ayuda a reducir incertidumbre, evitar decisiones basadas solo en intuición y priorizar con mayor claridad.",
      whatYouGet: "Obtendrás una visión clara del usuario, sus necesidades, fricciones y oportunidades; además de recomendaciones accionables, mapas de experiencia, flujos, hipótesis priorizadas y un roadmap inicial para avanzar con mayor seguridad hacia diseño, prototipo o desarrollo.",
      audienceCards: [
        { title: "Startups en etapa temprana", description: "Para equipos que tienen una idea, hipótesis o MVP inicial y necesitan entender mejor el problema, el usuario y la oportunidad antes de construir.", image: "/services/ux-strategy.png" },
        { title: "Empresas con productos digitales existentes", description: "Para organizaciones que ya tienen una plataforma, sitio, app o sistema, pero necesitan identificar fricciones, mejorar flujos o tomar decisiones con mayor evidencia.", image: "/services/ui-design.png" },
        { title: "Equipos de producto e innovación", description: "Para equipos que deben definir prioridades, validar oportunidades, ordenar requerimientos y conectar las necesidades del usuario con los objetivos del negocio.", image: "/services/ux-engineering.png" },
        { title: "Áreas comerciales, marketing u operaciones", description: "Para áreas que detectan problemas en la conversión, adopción, atención o eficiencia, pero necesitan traducirlos en oportunidades claras de experiencia.", image: "/services/ai-innovation.png" },
        { title: "Negocios que quieren rediseñar o escalar", description: "Para empresas que están creciendo y necesitan una base estratégica antes de rediseñar, lanzar nuevas funcionalidades o mejorar su producto digital.", image: "/services/ux-strategy.png" },
      ],
      roadmap: [
        { milestone: "Kickoff y entendimiento del negocio", percentage: "10%", description: "Reunión inicial para conocer objetivos, contexto, stakeholders, restricciones, métricas y expectativas del producto." },
        { milestone: "Revisión de información existente", percentage: "15%", description: "Análisis de documentación, analytics, flujos actuales, investigaciones previas, feedback de usuarios, métricas comerciales o insumos internos." },
        { milestone: "Investigación de usuarios y contexto", percentage: "25%", description: "Levantamiento cualitativo y/o cuantitativo mediante entrevistas, encuestas, observación, análisis de comportamiento o revisión competitiva." },
        { milestone: "Análisis y síntesis de hallazgos", percentage: "20%", description: "Organización de información, detección de patrones, necesidades, problemas críticos, oportunidades y fricciones de experiencia." },
        { milestone: "Definición estratégica UX", percentage: "20%", description: "Construcción de journeys, mapas de experiencia, flujos, hipótesis, principios de diseño, oportunidades priorizadas y recomendaciones accionables." },
        { milestone: "Presentación y roadmap de acción", percentage: "10%", description: "Entrega de conclusiones, prioridades, próximos pasos y recomendaciones para avanzar hacia diseño, prototipo o desarrollo." }
      ],
      plans: [
        {
          name: "Plan Inicial — Diagnóstico UX",
          subtitle: "Pensado para productos existentes que necesitan una revisión rápida y clara.",
          includes: [
            "Revisión experta de experiencia (Heuristic Evaluation).",
            "Análisis de flujos principales e identificación de fricciones.",
            "Benchmark básico con competidores clave.",
            "Reporte con recomendaciones accionables y priorizadas."
          ],
          idealFor: "Negocios que ya tienen un sitio, app o plataforma y quieren saber qué mejorar primero para optimizar la conversión."
        },
        {
          name: "Plan Estratégico — Research & Discovery",
          subtitle: "Para quienes necesitan entender usuarios, problemas y oportunidades antes del diseño.",
          includes: [
            "Entrevistas en profundidad o levantamiento con usuarios y stakeholders.",
            "Benchmark competitivo de experiencia de usuario.",
            "Mapa de problemas y oportunidades de producto.",
            "Journey Map o flujos de experiencia ideales.",
            "Priorización de iniciativas y Roadmap UX inicial."
          ],
          idealFor: "Startups, productos en etapa temprana o empresas que quieren validar antes de invertir recursos en desarrollo."
        },
        {
          name: "Plan Avanzado — Estrategia de Producto UX",
          subtitle: "Pensado para organizaciones que necesitan una base estratégica más robusta.",
          includes: [
            "Investigación cualitativa y cuantitativa de usuarios y mercado.",
            "Análisis del modelo de negocio conectado con UX.",
            "Definición completa de perfiles de usuario, journeys y flujos clave.",
            "Priorización estructurada de funcionalidades.",
            "Reporte estratégico de producto y Roadmap de Experiencia.",
            "Presentación ejecutiva para alineación de toma de decisiones."
          ],
          idealFor: "Empresas consolidadas que buscan rediseñar, escalar o lanzar un producto digital con un respaldo estratégico completo."
        }
      ],
      conditions: [
        "El cliente debe facilitar acceso a información relevante del negocio, producto, usuarios o métricas disponibles.",
        "La investigación puede variar según disponibilidad de usuarios, stakeholders y tiempos de respuesta.",
        "No incluye desarrollo visual avanzado ni programación, salvo que se contrate como servicio adicional.",
        "Los entregables pueden adaptarse según la etapa del producto.",
        "La profundidad del análisis dependerá del plan seleccionado.",
        "Se recomienda contar con al menos un responsable interno para validar avances y desbloquear información."
      ],
      imageUrl: "/services/ux-strategy.png",
      badge: "UX Strategy"
    },
    en: {
      title: "UX Research & Strategy",
      shortDesc: "Deep user and business understanding to define the product direction, map interaction flows, and ensure conceptual viability.",
      longDesc: "This service helps discover, organize, and validate the real needs of users, the business, and the product before investing valuable time and resources in design or development. Through research, context analysis, data review, user interviews, benchmarks, and strategic definition, we construct a solid foundation for making better decisions. The ultimate goal is to reduce uncertainty, discover growth opportunities, prioritize critical issues, and turn scattered data into a clear direction for the digital product.",
      forWho: "This service is ideal for startups, businesses, innovation areas, product teams, growing businesses, or companies that need to understand their users better before redesigning, creating, or scaling a digital solution. It is also highly recommended for organizations that have a business idea, but do not yet know exactly what user problem to solve, what features to prioritize, or how to align experience with business goals.",
      whoShouldHire: "It should be hired by founders, product managers, innovation leads, digital transformation heads, UX/UI teams, sales, marketing, operations, or any team that needs to make product decisions based on evidence rather than intuition.",
      valueProp: "This service enables more informed decisions, prevents building useless features, identifies points of friction in the current user experience, prioritizes high-impact opportunities, and connects user needs to business goals. The primary value lies in transforming uncertainty into strategic clarity.",
      whyNeed: "Because before designing or developing, you need to know what problem is worth solving, who you're solving it for, and how that solution contributes to the business. This service helps reduce uncertainty, avoid decisions based solely on intuition, and prioritize with greater clarity.",
      whatYouGet: "You'll get a clear vision of the user, their needs, frictions, and opportunities; plus actionable recommendations, experience maps, flows, prioritized hypotheses, and an initial roadmap to move forward with greater confidence toward design, prototype, or development.",
      audienceCards: [
        { title: "Early-stage startups", description: "For teams with an idea, hypothesis, or initial MVP that need to better understand the problem, the user, and the opportunity before building.", image: "/services/ux-strategy.png" },
        { title: "Companies with existing digital products", description: "For organizations that already have a platform, site, app, or system but need to identify friction, improve flows, or make decisions with more evidence.", image: "/services/ui-design.png" },
        { title: "Product & innovation teams", description: "For teams that need to define priorities, validate opportunities, organize requirements, and connect user needs with business goals.", image: "/services/ux-engineering.png" },
        { title: "Sales, marketing & operations areas", description: "For areas that detect conversion, adoption, support, or efficiency issues but need to translate them into clear experience opportunities.", image: "/services/ai-innovation.png" },
        { title: "Businesses looking to redesign or scale", description: "For growing companies that need a strategic foundation before redesigning, launching new features, or improving their digital product.", image: "/services/ux-strategy.png" },
      ],
      roadmap: [
        { milestone: "Kickoff & business understanding", percentage: "10%", description: "Initial meeting to learn about goals, context, stakeholders, constraints, metrics, and product expectations." },
        { milestone: "Review of existing information", percentage: "15%", description: "Analysis of documentation, analytics, current flows, previous research, user feedback, sales metrics, or internal inputs." },
        { milestone: "User and context research", percentage: "25%", description: "Qualitative and/or quantitative research via interviews, surveys, observation, behavior analysis, or competitive reviews." },
        { milestone: "Analysis & synthesis of findings", percentage: "20%", description: "Information organization, detecting patterns, user needs, critical issues, opportunities, and user experience friction." },
        { milestone: "Strategic UX definition", percentage: "20%", description: "Building journey maps, experience maps, user flows, hypotheses, design principles, prioritized opportunities, and actionable advice." },
        { milestone: "Presentation and action roadmap", percentage: "10%", description: "Delivering conclusions, priorities, next steps, and recommendations to proceed towards design, prototyping, or development." }
      ],
      plans: [
        {
          name: "Initial Plan — UX Diagnosis",
          subtitle: "Designed for existing products that need a quick and clear evaluation.",
          includes: [
            "Expert user experience review (Heuristic Evaluation).",
            "Analysis of primary flows and identifying friction points.",
            "Basic benchmark against key competitors.",
            "Report with prioritized, actionable recommendations."
          ],
          idealFor: "Businesses that already have a site, app, or platform and want to know what to improve first to optimize conversion."
        },
        {
          name: "Strategic Plan — Research & Discovery",
          subtitle: "Designed for teams needing to understand users, problems, and opportunities before design starts.",
          includes: [
            "In-depth interviews or research with users and stakeholders.",
            "Competitive user experience benchmark.",
            "Map of product problems and opportunities.",
            "Ideal Journey Map or user flows.",
            "Prioritization of initiatives and initial UX Roadmap."
          ],
          idealFor: "Startups, early-stage products, or companies that want to validate concepts before spending resources on development."
        },
        {
          name: "Advanced Plan — UX Product Strategy",
          subtitle: "Designed for organizations that require a more robust strategic foundation.",
          includes: [
            "Qualitative and quantitative research of users and market.",
            "Analysis of the business model connected with UX.",
            "Complete definition of user personas, journeys, and key flows.",
            "Structured feature prioritization.",
            "Strategic product report and Experience Roadmap.",
            "Executive presentation for decision-making alignment."
          ],
          idealFor: "Established companies looking to redesign, scale, or launch a digital product backed by complete strategic support."
        }
      ],
      conditions: [
        "The client must provide access to relevant business, product, user, or available metrics information.",
        "Research scope may vary based on availability of users, stakeholders, and response times.",
        "Does not include advanced visual design or programming, unless contracted as an additional service.",
        "Deliverables can be adapted depending on the current stage of the product.",
        "The depth of the analysis will depend on the selected plan.",
        "It is recommended to have at least one internal stakeholder to validate progress and unlock information."
      ],
      imageUrl: "/services/ux-strategy.png",
      badge: "UX Strategy"
    }
  },
  "ui-design": {
    es: {
      title: "Diseño UX/UI y Prototipado",
      shortDesc: "Creación de interfaces limpias, intuitivas y prototipos interactivos de alta fidelidad que se ven y sienten reales para validar ideas rápidamente.",
      longDesc: "Este servicio transforma ideas, requerimientos y hallazgos de investigación en experiencias digitales claras, funcionales y visualmente atractivas. Se diseñan flujos, wireframes, interfaces y prototipos interactivos que permiten visualizar cómo será el producto antes de desarrollarlo.\n\nEl foco está en diseñar soluciones que no solo se vean bien, sino que sean fáciles de usar, coherentes con el negocio y preparadas para ser validadas con usuarios o stakeholders.",
      forWho: "Es ideal para startups, empresas, equipos de producto, áreas de innovación, negocios digitales, SaaS, e-commerce, fintechs, plataformas internas o cualquier organización que necesite diseñar una nueva experiencia o mejorar una existente.\n\nTambién aplica para equipos que necesitan prototipos realistas para presentar una idea, levantar inversión, validar con usuarios, alinear stakeholders o preparar el desarrollo.",
      whoShouldHire: "Lo deberían contratar founders, product owners, product managers, gerentes de innovación, equipos de marketing, equipos de tecnología o empresas que necesitan convertir una idea en una experiencia visual, navegable y testeable.",
      valueProp: "Permite validar ideas antes de desarrollarlas, reducir retrabajo, alinear equipos, mejorar la percepción del producto y acelerar la toma de decisiones. Un buen prototipo permite detectar problemas de experiencia antes de que se conviertan en costos de desarrollo.\n\nEl valor principal está en pasar de una idea abstracta a una experiencia tangible.",
      whyNeed: "Porque una idea necesita verse, probarse y sentirse real antes de desarrollarse. Este servicio permite detectar errores, mejorar la experiencia y alinear expectativas antes de invertir tiempo y presupuesto en código.",
      whatYouGet: "Obtendrás interfaces limpias, flujos claros, pantallas de alta fidelidad y prototipos interactivos listos para presentar, validar con usuarios, alinear stakeholders o entregar como base al equipo de desarrollo.",
      audienceCards: [
        { title: "Startups que necesitan validar rápido", description: "Para equipos que quieren transformar una idea en un prototipo realista antes de invertir en desarrollo completo.", image: "/services/ux-strategy.png" },
        { title: "Founders que buscan presentar una solución", description: "Para emprendedores que necesitan mostrar su producto a inversionistas, socios, clientes o stakeholders de forma clara, visual y navegable.", image: "/services/ui-design.png" },
        { title: "Empresas que quieren mejorar su experiencia digital", description: "Para negocios que tienen interfaces confusas, desordenadas o poco intuitivas y necesitan rediseñar pantallas, flujos o módulos clave.", image: "/services/ux-engineering.png" },
        { title: "Equipos de producto y tecnología", description: "Para squads que necesitan alinear diseño, negocio y desarrollo mediante prototipos claros, componentes definidos y flujos bien resueltos.", image: "/services/ai-innovation.png" },
        { title: "Negocios que lanzan nuevos productos o funcionalidades", description: "Para organizaciones que necesitan visualizar, validar y ajustar una experiencia antes de pasar a construcción.", image: "/services/ui-design.png" },
      ],
      roadmap: [
        { milestone: "Entendimiento del desafío", percentage: "10%", description: "Revisión de objetivos, usuarios, requerimientos, referencias, funcionalidades y criterios de éxito." },
        { milestone: "Arquitectura y flujos UX", percentage: "20%", description: "Definición de estructura, navegación, jerarquía de contenidos, flujos principales y lógica de interacción." },
        { milestone: "Wireframes y diseño base", percentage: "20%", description: "Creación de pantallas iniciales en baja o media fidelidad para validar estructura antes de avanzar a visual." },
        { milestone: "Diseño UI de alta fidelidad", percentage: "25%", description: "Diseño visual de pantallas finales, componentes, estilos, estados, patrones e interacción." },
        { milestone: "Prototipo interactivo", percentage: "15%", description: "Construcción de un prototipo navegable en alta fidelidad para validación, presentación o pruebas con usuarios." },
        { milestone: "Ajustes y entrega final", percentage: "10%", description: "Iteraciones finales, documentación base y preparación del archivo para desarrollo o presentación." }
      ],
      plans: [
        {
          name: "Plan Inicial — Diseño de Flujo o Landing",
          subtitle: "Pensado para validar una idea o construir una experiencia acotada.",
          includes: [
            "Definición de flujo simple.",
            "Wireframes.",
            "Diseño UI de pantallas clave.",
            "Prototipo navegable básico.",
            "Archivo editable en Figma."
          ],
          idealFor: "Landing pages, MVPs pequeños, campañas, pruebas de concepto o ideas en etapa inicial."
        },
        {
          name: "Plan Prototipo MVP",
          subtitle: "Pensado para convertir una idea de producto en un prototipo funcional y realista.",
          includes: [
            "Arquitectura de información.",
            "Flujos principales.",
            "Wireframes.",
            "Diseño UI de alta fidelidad.",
            "Prototipo interactivo.",
            "Componentes base.",
            "Versión lista para validar con usuarios o negocio."
          ],
          idealFor: "Startups, nuevos productos, validación de inversión o definición previa al desarrollo."
        },
        {
          name: "Plan Producto Digital",
          subtitle: "Pensado para experiencias más completas que requieren mayor profundidad visual y funcional.",
          includes: [
            "Flujos completos.",
            "Diseño de múltiples pantallas.",
            "Sistema visual base.",
            "Componentes reutilizables.",
            "Prototipo avanzado.",
            "Estados de interfaz.",
            "Documentación para desarrollo.",
            "Ajustes por feedback."
          ],
          idealFor: "Plataformas SaaS, dashboards, aplicaciones internas, productos corporativos, e-commerce o rediseños completos."
        }
      ],
      conditions: [
        "El cliente debe entregar contenido, marca, lineamientos visuales o referencias si existen.",
        "Si no existe identidad visual, se puede proponer una dirección visual base, pero no reemplaza un proceso completo de branding.",
        "La cantidad de pantallas dependerá del plan seleccionado.",
        "Las pruebas con usuarios pueden contratarse como servicio complementario.",
        "El prototipo no corresponde a desarrollo funcional, sino a una simulación interactiva de alta fidelidad.",
        "Los cambios se gestionan por rondas de feedback previamente definidas."
      ],
      imageUrl: "/services/ui-design.png",
      badge: "UX/UI Design"
    },
    en: {
      title: "UX/UI Design & Prototyping",
      shortDesc: "Creating clean, intuitive interfaces and high-fidelity interactive prototypes that look and feel real to validate ideas quickly.",
      longDesc: "This service transforms ideas, requirements, and research findings into clear, functional, and visually appealing digital experiences. We design flows, wireframes, interfaces, and interactive prototypes that let you visualize the product before building it.\n\nThe focus is on designing solutions that not only look great, but are easy to use, aligned with business goals, and ready to be validated with users or stakeholders.",
      forWho: "Ideal for startups, companies, product teams, innovation areas, digital businesses, SaaS, e-commerce, fintechs, internal platforms, or any organization that needs to design a new experience or improve an existing one.\n\nAlso applicable for teams that need realistic prototypes to pitch an idea, raise investment, validate with users, align stakeholders, or prepare for development.",
      whoShouldHire: "It should be hired by founders, product owners, product managers, innovation leads, marketing teams, technology teams, or companies that need to turn an idea into a visual, navigable, and testable experience.",
      valueProp: "It allows validating ideas before building them, reducing rework, aligning teams, improving product perception, and accelerating decision-making. A good prototype helps detect experience issues before they become development costs.\n\nThe core value lies in moving from an abstract idea to a tangible experience.",
      whyNeed: "Because an idea needs to be seen, tested, and felt before being developed. This service helps detect errors, improve the experience, and align expectations before investing time and budget in code.",
      whatYouGet: "You'll get clean interfaces, clear flows, high-fidelity screens, and interactive prototypes ready to present, validate with users, align stakeholders, or deliver as a base to the development team.",
      audienceCards: [
        { title: "Startups that need to validate fast", description: "For teams that want to transform an idea into a realistic prototype before investing in full development.", image: "/services/ux-strategy.png" },
        { title: "Founders looking to present a solution", description: "For entrepreneurs who need to showcase their product to investors, partners, clients, or stakeholders in a clear, visual, and navigable way.", image: "/services/ui-design.png" },
        { title: "Companies wanting to improve their digital experience", description: "For businesses with confusing, cluttered, or unintuitive interfaces that need to redesign screens, flows, or key modules.", image: "/services/ux-engineering.png" },
        { title: "Product & technology teams", description: "For squads that need to align design, business, and development through clear prototypes, defined components, and well-resolved flows.", image: "/services/ai-innovation.png" },
        { title: "Businesses launching new products or features", description: "For organizations that need to visualize, validate, and refine an experience before moving to development.", image: "/services/ui-design.png" },
      ],
      roadmap: [
        { milestone: "Understanding the challenge", percentage: "10%", description: "Reviewing objectives, users, requirements, references, features, and success criteria." },
        { milestone: "Architecture & UX flows", percentage: "20%", description: "Defining structure, navigation, content hierarchy, main flows, and interaction logic." },
        { milestone: "Wireframes & base design", percentage: "20%", description: "Creating initial screens in low or medium fidelity to validate structure before moving to visual design." },
        { milestone: "High-fidelity UI design", percentage: "25%", description: "Visual design of final screens, components, styles, states, patterns, and interactions." },
        { milestone: "Interactive prototype", percentage: "15%", description: "Building a navigable high-fidelity prototype for validation, presentation, or user testing." },
        { milestone: "Adjustments & final delivery", percentage: "10%", description: "Final iterations, base documentation, and file preparation for development or presentation." }
      ],
      plans: [
        {
          name: "Initial Plan — Flow or Landing Design",
          subtitle: "Designed to validate an idea or build a focused experience.",
          includes: [
            "Simple flow definition.",
            "Wireframes.",
            "UI design of key screens.",
            "Basic navigable prototype.",
            "Editable Figma file."
          ],
          idealFor: "Landing pages, small MVPs, campaigns, proof of concepts, or early-stage ideas."
        },
        {
          name: "MVP Prototype Plan",
          subtitle: "Designed to turn a product idea into a functional, realistic prototype.",
          includes: [
            "Information architecture.",
            "Main user flows.",
            "Wireframes.",
            "High-fidelity UI design.",
            "Interactive prototype.",
            "Base components.",
            "Version ready to validate with users or business."
          ],
          idealFor: "Startups, new products, investment validation, or pre-development definition."
        },
        {
          name: "Digital Product Plan",
          subtitle: "Designed for more complete experiences requiring greater visual and functional depth.",
          includes: [
            "Complete user flows.",
            "Multi-screen design.",
            "Base visual system.",
            "Reusable components.",
            "Advanced prototype.",
            "Interface states.",
            "Development documentation.",
            "Feedback-driven adjustments."
          ],
          idealFor: "SaaS platforms, dashboards, internal applications, corporate products, e-commerce, or complete redesigns."
        }
      ],
      conditions: [
        "The client must provide content, branding, visual guidelines, or references if they exist.",
        "If no visual identity exists, a base visual direction can be proposed, but it does not replace a full branding process.",
        "The number of screens will depend on the selected plan.",
        "User testing can be contracted as a complementary service.",
        "The prototype is not functional development, but a high-fidelity interactive simulation.",
        "Changes are managed through pre-defined feedback rounds."
      ],
      imageUrl: "/services/ui-design.png",
      badge: "UX/UI Design"
    }
  },
  "ux-engineering": {
    es: {
      title: "UX Engineering y Frontend",
      shortDesc: "Desarrollo de interfaces front-end de alto nivel y construcción de sistemas de diseño estructurados que conectan diseño y código sin fricciones.",
      longDesc: "Este servicio conecta el diseño con el desarrollo mediante la creación de interfaces front-end escalables, consistentes y bien estructuradas. Permite transformar prototipos en componentes reales, mejorar la calidad visual del producto y construir sistemas de diseño que ordenan la experiencia desde el diseño hasta el código.\n\nEl foco está en reducir la brecha entre UX/UI y tecnología, asegurando que lo diseñado pueda implementarse con precisión, eficiencia y visión de producto.",
      forWho: "Es ideal para startups, empresas tecnológicas, equipos de producto, squads ágiles, áreas de diseño y desarrollo que necesitan acelerar la implementación de interfaces sin perder calidad.\n\nTambién es útil para organizaciones que tienen inconsistencias visuales, componentes duplicados, deuda de diseño, problemas de escalabilidad en front-end o una desconexión entre Figma y código.",
      whoShouldHire: "Lo deberían contratar CTOs, product managers, UX managers, founders, líderes técnicos, equipos de desarrollo, áreas de innovación o empresas que necesitan mejorar la calidad de sus interfaces y ordenar la relación entre diseño y tecnología.",
      valueProp: "Aporta valor al reducir inconsistencias, acelerar el desarrollo, mejorar la calidad de la interfaz, facilitar el mantenimiento del producto y crear una base escalable para futuras funcionalidades.\n\nEl valor principal está en construir experiencias que no solo se diseñan bien, sino que también se implementan bien.",
      whyNeed: "Porque muchas veces el diseño y el desarrollo avanzan separados, generando inconsistencias, retrabajo y pérdida de calidad en la experiencia final. Este servicio ayuda a conectar ambos mundos con una mirada técnica y de producto.",
      whatYouGet: "Obtendrás interfaces front-end mejor estructuradas, componentes reutilizables, sistemas de diseño más ordenados, mayor consistencia visual y una implementación más fiel entre lo diseñado y lo construido.",
      audienceCards: [
        { title: "Startups que necesitan construir rápido y bien", description: "Para equipos que requieren transformar diseños en interfaces front-end funcionales, escalables y visualmente consistentes.", image: "/services/ux-engineering.png" },
        { title: "Empresas con brechas entre diseño y desarrollo", description: "Para organizaciones donde lo diseñado en Figma no siempre se implementa con precisión en el producto final.", image: "/services/ui-design.png" },
        { title: "Equipos de diseño que necesitan sistematizar componentes", description: "Para áreas UX/UI que buscan ordenar estilos, patrones, componentes, variantes y reglas visuales en un sistema reutilizable.", image: "/services/ux-strategy.png" },
        { title: "Equipos de desarrollo que necesitan mejorar la calidad visual", description: "Para equipos técnicos que necesitan una capa de experiencia, consistencia visual y criterio de interfaz en la construcción front-end.", image: "/services/ai-innovation.png" },
        { title: "Productos digitales en crecimiento", description: "Para plataformas, SaaS, dashboards o sistemas internos que requieren escalar su interfaz sin acumular deuda visual o técnica.", image: "/services/ux-engineering.png" },
      ],
      roadmap: [
        { milestone: "Evaluación diseño/código", percentage: "10%", description: "Revisión del estado actual del diseño, componentes, front-end, stack tecnológico y principales brechas." },
        { milestone: "Definición técnica y visual", percentage: "15%", description: "Alineación de criterios de implementación, tokens, componentes, patrones, estructura y prioridades." },
        { milestone: "Construcción de componentes base", percentage: "25%", description: "Desarrollo de componentes reutilizables, consistentes y alineados al diseño UI." },
        { milestone: "Implementación de interfaces", percentage: "25%", description: "Maquetación o desarrollo front-end de vistas, flujos o módulos definidos." },
        { milestone: "Documentación y handoff", percentage: "15%", description: "Documentación de componentes, uso, variantes, estados, reglas visuales y criterios técnicos." },
        { milestone: "QA visual y ajustes", percentage: "10%", description: "Revisión de consistencia, responsividad, accesibilidad básica y ajustes finales." }
      ],
      plans: [
        {
          name: "Plan Inicial — Frontend de Prototipo",
          subtitle: "Pensado para transformar un diseño en una interfaz navegable o maqueta funcional.",
          includes: [
            "Revisión de diseño en Figma.",
            "Maquetación front-end de pantallas clave.",
            "Componentes básicos.",
            "Responsive base.",
            "Ajustes visuales.",
            "Entrega en código."
          ],
          idealFor: "MVPs, demos comerciales, validaciones técnicas o pruebas de concepto."
        },
        {
          name: "Plan Design System Base",
          subtitle: "Pensado para empresas que necesitan ordenar sus componentes y crear una base escalable.",
          includes: [
            "Auditoría de componentes.",
            "Definición de tokens.",
            "Componentes base.",
            "Variantes y estados.",
            "Documentación inicial.",
            "Conexión diseño/código."
          ],
          idealFor: "Productos en crecimiento, equipos con inconsistencias visuales o empresas que quieren escalar su UI."
        },
        {
          name: "Plan UX Engineering Avanzado",
          subtitle: "Pensado para productos digitales que requieren una integración más sólida entre diseño, front-end y sistema.",
          includes: [
            "Arquitectura de componentes.",
            "Implementación de vistas.",
            "Sistema de diseño estructurado.",
            "Tokens de diseño.",
            "Documentación técnica.",
            "QA visual.",
            "Revisión responsive.",
            "Integración con stack definido."
          ],
          idealFor: "SaaS, plataformas internas, dashboards, productos corporativos y equipos que necesitan velocidad sin sacrificar calidad."
        }
      ],
      conditions: [
        "El desarrollo se realiza según stack definido previamente, por ejemplo React, Next.js, Tailwind, shadcn/ui u otra tecnología acordada.",
        "No incluye backend, bases de datos ni lógica compleja de negocio, salvo que se acuerde como alcance adicional.",
        "El cliente debe entregar acceso a diseños, repositorios, documentación técnica o lineamientos existentes si aplica.",
        "La profundidad del sistema de diseño dependerá del plan contratado.",
        "La accesibilidad puede incluir una revisión base o una evaluación avanzada según alcance.",
        "La integración en ambientes productivos dependerá de los permisos, arquitectura y equipo técnico del cliente."
      ],
      imageUrl: "/services/ux-engineering.png",
      badge: "UX Engineering"
    },
    en: {
      title: "UX Engineering & Frontend",
      shortDesc: "High-level front-end interface development and structured design systems that bridge design and code without friction.",
      longDesc: "This service connects design and development through scalable, consistent, and well-structured front-end interfaces. It transforms prototypes into real components, improves the visual quality of the product, and builds design systems that bring order from design to code.\n\nThe focus is on reducing the gap between UX/UI and technology, ensuring that what is designed can be implemented with precision, efficiency, and product vision.",
      forWho: "Ideal for startups, tech companies, product teams, agile squads, and design/development areas that need to accelerate interface implementation without compromising quality.\n\nAlso useful for organizations with visual inconsistencies, duplicated components, design debt, front-end scalability issues, or a disconnect between Figma and code.",
      whoShouldHire: "It should be hired by CTOs, product managers, UX managers, founders, technical leads, development teams, innovation areas, or companies that need to improve interface quality and align design with technology.",
      valueProp: "It adds value by reducing inconsistencies, accelerating development, improving interface quality, simplifying product maintenance, and creating a scalable foundation for future features.\n\nThe core value lies in building experiences that are not only well-designed but also well-implemented.",
      whyNeed: "Because design and development often move separately, creating inconsistencies, rework, and quality loss in the final experience. This service helps connect both worlds with a technical and product perspective.",
      whatYouGet: "You'll get better-structured front-end interfaces, reusable components, more organized design systems, greater visual consistency, and a more faithful implementation between what's designed and what's built.",
      audienceCards: [
        { title: "Startups that need to build fast and well", description: "For teams that need to transform designs into functional, scalable, and visually consistent front-end interfaces.", image: "/services/ux-engineering.png" },
        { title: "Companies with design-to-development gaps", description: "For organizations where what's designed in Figma doesn't always get implemented accurately in the final product.", image: "/services/ui-design.png" },
        { title: "Design teams that need to systematize components", description: "For UX/UI areas looking to organize styles, patterns, components, variants, and visual rules into a reusable system.", image: "/services/ux-strategy.png" },
        { title: "Dev teams that need better visual quality", description: "For technical teams that need an experience layer, visual consistency, and interface criteria in front-end development.", image: "/services/ai-innovation.png" },
        { title: "Growing digital products", description: "For platforms, SaaS, dashboards, or internal systems that need to scale their interface without accumulating visual or technical debt.", image: "/services/ux-engineering.png" },
      ],
      roadmap: [
        { milestone: "Design/code evaluation", percentage: "10%", description: "Reviewing the current state of design, components, front-end, tech stack, and key gaps." },
        { milestone: "Technical & visual definition", percentage: "15%", description: "Aligning implementation criteria, tokens, components, patterns, structure, and priorities." },
        { milestone: "Base component development", percentage: "25%", description: "Building reusable, consistent components aligned with the UI design." },
        { milestone: "Interface implementation", percentage: "25%", description: "Front-end layout or development of defined views, flows, or modules." },
        { milestone: "Documentation & handoff", percentage: "15%", description: "Documenting components, usage, variants, states, visual rules, and technical criteria." },
        { milestone: "Visual QA & adjustments", percentage: "10%", description: "Reviewing consistency, responsiveness, basic accessibility, and final adjustments." }
      ],
      plans: [
        {
          name: "Initial Plan — Prototype Frontend",
          subtitle: "Designed to transform a design into a navigable interface or functional mockup.",
          includes: [
            "Figma design review.",
            "Front-end layout of key screens.",
            "Basic components.",
            "Base responsive layout.",
            "Visual adjustments.",
            "Code delivery."
          ],
          idealFor: "MVPs, commercial demos, technical validations, or proof of concepts."
        },
        {
          name: "Base Design System Plan",
          subtitle: "Designed for companies that need to organize their components and create a scalable foundation.",
          includes: [
            "Component audit.",
            "Token definition.",
            "Base components.",
            "Variants and states.",
            "Initial documentation.",
            "Design/code connection."
          ],
          idealFor: "Growing products, teams with visual inconsistencies, or companies looking to scale their UI."
        },
        {
          name: "Advanced UX Engineering Plan",
          subtitle: "Designed for digital products requiring a stronger integration between design, front-end, and system.",
          includes: [
            "Component architecture.",
            "View implementation.",
            "Structured design system.",
            "Design tokens.",
            "Technical documentation.",
            "Visual QA.",
            "Responsive review.",
            "Integration with defined stack."
          ],
          idealFor: "SaaS, internal platforms, dashboards, corporate products, and teams that need speed without sacrificing quality."
        }
      ],
      conditions: [
        "Development is done according to a pre-defined stack, e.g. React, Next.js, Tailwind, shadcn/ui, or other agreed technology.",
        "Does not include backend, databases, or complex business logic, unless agreed as additional scope.",
        "The client must provide access to designs, repositories, technical documentation, or existing guidelines if applicable.",
        "The depth of the design system will depend on the contracted plan.",
        "Accessibility may include a base review or an advanced evaluation depending on scope.",
        "Production environment integration will depend on the client's permissions, architecture, and technical team."
      ],
      imageUrl: "/services/ux-engineering.png",
      badge: "UX Engineering"
    }
  },
  "ai-innovation": {
    es: {
      title: "Integración de IA e Innovación",
      shortDesc: "Optimización de flujos y automatización de procesos mediante el uso estratégico de modelos de inteligencia artificial aplicados a la experiencia.",
      longDesc: "Este servicio ayuda a identificar, diseñar e implementar oportunidades donde la inteligencia artificial puede mejorar procesos, productos y experiencias digitales. No se trata de integrar IA por tendencia, sino de encontrar casos de uso reales que reduzcan esfuerzo operativo, aceleren tareas, mejoren la toma de decisiones o generen nuevas capacidades para usuarios y equipos.\n\nEl foco está en aplicar IA de manera estratégica, útil y medible, combinando visión de negocio, experiencia de usuario, automatización y prototipado rápido.",
      forWho: "Es ideal para startups, empresas, áreas de innovación, equipos de producto, operaciones, marketing, atención al cliente, recursos humanos o áreas internas que desean incorporar IA en sus procesos o productos.\n\nTambién es recomendable para empresas que saben que deben avanzar con IA, pero aún no tienen claridad sobre qué automatizar, qué caso de uso priorizar o cómo convertir la tecnología en valor real.",
      whoShouldHire: "Lo deberían contratar founders, gerentes de innovación, product managers, líderes de operaciones, líderes de experiencia, CTOs, equipos de transformación digital o empresas que buscan eficiencia, diferenciación y nuevas oportunidades mediante IA.",
      valueProp: "Permite automatizar tareas repetitivas, mejorar la eficiencia operativa, acelerar la generación de contenido o análisis, diseñar asistentes inteligentes, optimizar journeys y crear prototipos con IA antes de invertir en desarrollos mayores.\n\nEl valor principal está en convertir la inteligencia artificial en soluciones prácticas para el negocio y la experiencia.",
      whyNeed: "Porque la IA puede generar mucho valor, pero solo cuando se aplica a problemas reales. Este servicio ayuda a identificar dónde tiene sentido usar inteligencia artificial, qué procesos pueden optimizarse y qué casos de uso tienen mayor impacto.",
      whatYouGet: "Obtendrás oportunidades priorizadas, flujos optimizados, prototipos con IA, automatizaciones iniciales, recomendaciones de implementación y un roadmap para avanzar desde la idea hacia una solución útil, medible y escalable.",
      audienceCards: [
        { title: "Startups que quieren diferenciar su producto con IA", description: "Para equipos que buscan incorporar inteligencia artificial en su propuesta de valor, flujos o funcionalidades sin caer en soluciones innecesarias.", image: "/services/ai-innovation.png" },
        { title: "Empresas que necesitan optimizar procesos internos", description: "Para organizaciones que tienen tareas repetitivas, procesos manuales o flujos operativos que podrían automatizarse o acelerarse con IA.", image: "/services/ux-engineering.png" },
        { title: "Equipos de innovación y transformación digital", description: "Para áreas que necesitan explorar casos de uso, priorizar oportunidades y convertir ideas de IA en prototipos o soluciones aplicables.", image: "/services/ux-strategy.png" },
        { title: "Equipos de producto que buscan nuevas capacidades", description: "Para squads que quieren integrar asistentes, automatizaciones, análisis inteligente, generación de contenido o experiencias personalizadas.", image: "/services/ui-design.png" },
        { title: "Áreas de negocio que quieren mayor eficiencia", description: "Para marketing, operaciones, atención al cliente, recursos humanos o áreas comerciales que necesitan reducir esfuerzo, ordenar información o mejorar tiempos de respuesta.", image: "/services/ai-innovation.png" },
      ],
      roadmap: [
        { milestone: "Diagnóstico de oportunidades", percentage: "15%", description: "Revisión de procesos, dolores, tareas repetitivas, flujos críticos y oportunidades donde IA puede generar impacto." },
        { milestone: "Priorización de casos de uso", percentage: "20%", description: "Evaluación de factibilidad, impacto, esfuerzo, riesgo y valor esperado para seleccionar los casos más convenientes." },
        { milestone: "Diseño de solución IA", percentage: "20%", description: "Definición del flujo, interacción, prompts, modelo conceptual, experiencia del usuario y criterios de respuesta." },
        { milestone: "Prototipado o automatización inicial", percentage: "25%", description: "Construcción de prueba de concepto, flujo automatizado, asistente, agente, integración o demo funcional." },
        { milestone: "Validación y ajustes", percentage: "10%", description: "Revisión del desempeño, calidad de respuestas, utilidad, riesgos, fricciones y ajustes de experiencia." },
        { milestone: "Roadmap de escalamiento", percentage: "10%", description: "Definición de próximos pasos, mejoras, integraciones, gobierno, métricas y posibles fases de implementación." }
      ],
      plans: [
        {
          name: "Plan Inicial — Diagnóstico IA",
          subtitle: "Pensado para empresas que quieren descubrir oportunidades reales de uso de IA.",
          includes: [
            "Workshop o sesiones de levantamiento.",
            "Mapeo de procesos.",
            "Identificación de oportunidades.",
            "Priorización por impacto y esfuerzo.",
            "Recomendaciones de casos de uso.",
            "Roadmap inicial."
          ],
          idealFor: "Organizaciones que quieren comenzar con IA, pero no saben por dónde partir."
        },
        {
          name: "Plan Prototipo IA",
          subtitle: "Pensado para validar una solución concreta antes de desarrollarla a mayor escala.",
          includes: [
            "Definición de caso de uso.",
            "Diseño de flujo.",
            "Prompts o arquitectura conversacional.",
            "Prototipo funcional o demo.",
            "Validación inicial.",
            "Recomendaciones de mejora."
          ],
          idealFor: "Asistentes internos, automatizaciones, flujos de contenido, análisis de información, clasificación de datos o soporte a usuarios."
        },
        {
          name: "Plan Innovación Aplicada con IA",
          subtitle: "Pensado para empresas que quieren diseñar e implementar una solución más completa.",
          includes: [
            "Discovery de oportunidades.",
            "Priorización de casos.",
            "Diseño UX del flujo con IA.",
            "Prototipo avanzado.",
            "Automatización o integración inicial.",
            "Evaluación de riesgos.",
            "Documentación.",
            "Roadmap de escalamiento."
          ],
          idealFor: "Empresas con procesos complejos, productos digitales maduros o áreas que buscan eficiencia y diferenciación competitiva."
        }
      ],
      conditions: [
        "La implementación dependerá de las herramientas, APIs, datos y permisos disponibles.",
        "No todos los procesos son buenos candidatos para IA; se priorizarán aquellos donde exista impacto real y factibilidad.",
        "El cliente debe facilitar ejemplos, documentos, datos o procesos necesarios para evaluar casos de uso.",
        "La calidad de la solución dependerá de la calidad de la información disponible.",
        "Puede requerirse revisión legal, seguridad o cumplimiento si se trabaja con datos sensibles.",
        "La integración productiva puede requerir apoyo del equipo técnico del cliente.",
        "El servicio puede incluir prototipos, automatizaciones iniciales o diseño de solución, pero no necesariamente una plataforma completa lista para producción, salvo que se defina en alcance."
      ],
      imageUrl: "/services/ai-innovation.png",
      badge: "AI & Innovation"
    },
    en: {
      title: "AI Integration & Innovation",
      shortDesc: "Optimizing workflows and automating processes through strategic use of artificial intelligence models applied to the experience.",
      longDesc: "This service helps identify, design, and implement opportunities where artificial intelligence can improve processes, products, and digital experiences. It's not about integrating AI for the sake of trends, but about finding real use cases that reduce operational effort, speed up tasks, improve decision-making, or generate new capabilities for users and teams.\n\nThe focus is on applying AI strategically, usefully, and measurably, combining business vision, user experience, automation, and rapid prototyping.",
      forWho: "Ideal for startups, companies, innovation areas, product teams, operations, marketing, customer support, HR, or internal areas looking to incorporate AI into their processes or products.\n\nAlso recommended for companies that know they need to move forward with AI but still lack clarity on what to automate, which use case to prioritize, or how to turn technology into real value.",
      whoShouldHire: "It should be hired by founders, innovation managers, product managers, operations leads, experience leads, CTOs, digital transformation teams, or companies seeking efficiency, differentiation, and new opportunities through AI.",
      valueProp: "It enables automating repetitive tasks, improving operational efficiency, accelerating content or analysis generation, designing intelligent assistants, optimizing journeys, and creating AI prototypes before investing in larger developments.\n\nThe core value lies in turning artificial intelligence into practical solutions for business and experience.",
      whyNeed: "Because AI can generate a lot of value, but only when applied to real problems. This service helps identify where it makes sense to use artificial intelligence, what processes can be optimized, and which use cases have the greatest impact.",
      whatYouGet: "You'll get prioritized opportunities, optimized flows, AI prototypes, initial automations, implementation recommendations, and a roadmap to move from idea to a useful, measurable, and scalable solution.",
      audienceCards: [
        { title: "Startups looking to differentiate with AI", description: "For teams looking to incorporate artificial intelligence into their value proposition, flows, or features without falling into unnecessary solutions.", image: "/services/ai-innovation.png" },
        { title: "Companies needing to optimize internal processes", description: "For organizations with repetitive tasks, manual processes, or operational flows that could be automated or accelerated with AI.", image: "/services/ux-engineering.png" },
        { title: "Innovation & digital transformation teams", description: "For areas that need to explore use cases, prioritize opportunities, and turn AI ideas into prototypes or applicable solutions.", image: "/services/ux-strategy.png" },
        { title: "Product teams seeking new capabilities", description: "For squads wanting to integrate assistants, automations, intelligent analysis, content generation, or personalized experiences.", image: "/services/ui-design.png" },
        { title: "Business areas seeking greater efficiency", description: "For marketing, operations, customer support, HR, or sales areas that need to reduce effort, organize information, or improve response times.", image: "/services/ai-innovation.png" },
      ],
      roadmap: [
        { milestone: "Opportunity diagnosis", percentage: "15%", description: "Reviewing processes, pain points, repetitive tasks, critical flows, and opportunities where AI can generate impact." },
        { milestone: "Use case prioritization", percentage: "20%", description: "Evaluating feasibility, impact, effort, risk, and expected value to select the most suitable cases." },
        { milestone: "AI solution design", percentage: "20%", description: "Defining the flow, interaction, prompts, conceptual model, user experience, and response criteria." },
        { milestone: "Prototyping or initial automation", percentage: "25%", description: "Building a proof of concept, automated flow, assistant, agent, integration, or functional demo." },
        { milestone: "Validation & adjustments", percentage: "10%", description: "Reviewing performance, response quality, usefulness, risks, friction points, and experience adjustments." },
        { milestone: "Scaling roadmap", percentage: "10%", description: "Defining next steps, improvements, integrations, governance, metrics, and potential implementation phases." }
      ],
      plans: [
        {
          name: "Initial Plan — AI Diagnosis",
          subtitle: "Designed for companies that want to discover real AI usage opportunities.",
          includes: [
            "Workshop or discovery sessions.",
            "Process mapping.",
            "Opportunity identification.",
            "Prioritization by impact and effort.",
            "Use case recommendations.",
            "Initial roadmap."
          ],
          idealFor: "Organizations that want to start with AI but don't know where to begin."
        },
        {
          name: "AI Prototype Plan",
          subtitle: "Designed to validate a specific solution before scaling it.",
          includes: [
            "Use case definition.",
            "Flow design.",
            "Prompts or conversational architecture.",
            "Functional prototype or demo.",
            "Initial validation.",
            "Improvement recommendations."
          ],
          idealFor: "Internal assistants, automations, content flows, information analysis, data classification, or user support."
        },
        {
          name: "Applied Innovation with AI Plan",
          subtitle: "Designed for companies that want to design and implement a more complete solution.",
          includes: [
            "Opportunity discovery.",
            "Case prioritization.",
            "UX design of the AI flow.",
            "Advanced prototype.",
            "Initial automation or integration.",
            "Risk evaluation.",
            "Documentation.",
            "Scaling roadmap."
          ],
          idealFor: "Companies with complex processes, mature digital products, or areas seeking efficiency and competitive differentiation."
        }
      ],
      conditions: [
        "Implementation will depend on available tools, APIs, data, and permissions.",
        "Not all processes are good candidates for AI; those with real impact and feasibility will be prioritized.",
        "The client must provide examples, documents, data, or processes needed to evaluate use cases.",
        "Solution quality will depend on the quality of available information.",
        "Legal, security, or compliance review may be required when working with sensitive data.",
        "Production integration may require support from the client's technical team.",
        "The service may include prototypes, initial automations, or solution design, but not necessarily a complete production-ready platform, unless defined in scope."
      ],
      imageUrl: "/services/ai-innovation.png",
      badge: "AI & Innovation"
    }
  }
};
