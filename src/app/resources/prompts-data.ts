export interface PromptItem {
  id: number;
  title: string;
  template: string;
}

export interface PromptStage {
  title: string;
  icon: string;
  prompts: PromptItem[];
}

export const promptStages: PromptStage[] = [
  {
    title: "🔍 ETAPA 1 — Descubrimiento e investigación",
    icon: "search",
    prompts: [
      {
        id: 1,
        title: "1. Definir preguntas de investigación",
        template: "Soy [rol] trabajando en [producto/proyecto]. Mi objetivo de negocio es [objetivo] y necesito entender [tema a investigar]. Genera 8-10 preguntas de investigación bien formuladas que me ayuden a obtener insights accionables. Para cada una, indica qué método de research sería el más adecuado para responderla."
      },
      {
        id: 2,
        title: "2. Diseñar guion de entrevista",
        template: "Crea un guion de entrevista semiestructurada para entrevistar a [tipo de usuario] sobre [tema]. Quiero entender [objetivo del estudio]. Incluye: una intro para romper el hielo, 8-12 preguntas abiertas ordenadas de general a específico, preguntas de seguimiento sugeridas, y un cierre. Evita preguntas sesgadas o que sugieran respuestas."
      },
      {
        id: 3,
        title: "3. Detectar sesgos en mis preguntas",
        template: "Revisa estas preguntas de entrevista y señala cuáles tienen sesgos (preguntas guía, dobles, que asumen algo, etc.). Para cada una sesgada, explica el problema y reescríbela de forma neutral: [pega tus preguntas]"
      },
      {
        id: 4,
        title: "4. Crear screener de reclutamiento",
        template: "Necesito reclutar participantes para un estudio sobre [tema]. Mi perfil objetivo es [describe usuario: edad, comportamiento, contexto]. Crea un cuestionario de screening de 6-8 preguntas que filtre correctamente a los participantes ideales y descarte a los que no califican, sin revelar qué respuestas estoy buscando."
      },
      {
        id: 5,
        title: "5. Investigación de escritorio (desk research)",
        template: "Resume el estado actual de [tema/industria/tendencia] enfocándote en: comportamientos de usuario relevantes, principales players, problemas comunes que enfrentan los usuarios, y oportunidades de diseño. Organízalo en secciones claras y señala qué afirmaciones requieren validación adicional."
      },
      {
        id: 6,
        title: "6. Análisis competitivo estructurado",
        template: "Voy a analizar estos competidores: [lista]. Para mi producto [descripción], crea una matriz de análisis competitivo que evalúe: propuesta de valor, funcionalidades clave, fortalezas UX, debilidades UX, y oportunidades de diferenciación. Preséntalo en formato de tabla."
      },
      {
        id: 7,
        title: "7. Hipótesis de usuario",
        template: "Para [producto/feature], ayúdame a formular 5 hipótesis claras sobre el comportamiento o necesidades de [tipo de usuario]. Cada hipótesis debe ser específica, falsable y con una forma propuesta de validarla."
      }
    ]
  },
  {
    title: "🧩 ETAPA 2 — Síntesis y análisis",
    icon: "puzzle",
    prompts: [
      {
        id: 8,
        title: "8. Sintetizar notas de entrevistas",
        template: "Aquí están mis notas crudas de [N] entrevistas con [tipo de usuario]: [pega notas]. Identifica los patrones y temas recurrentes, agrúpalos por categoría, y para cada tema indica cuántos participantes lo mencionaron. Destaca las citas más reveladoras y señala las tensiones o contradicciones entre usuarios."
      },
      {
        id: 9,
        title: "9. Extraer insights accionables",
        template: "A partir de estos hallazgos de investigación [pega hallazgos], transforma los datos en insights accionables. Cada insight debe seguir el formato: \"Observamos que [comportamiento], porque [motivo], lo que significa que [implicación de diseño]\". Genera 5-8 insights priorizados por impacto."
      },
      {
        id: 10,
        title: "10. Crear affinity map",
        template: "Tengo estas observaciones sueltas de mi investigación: [pega lista de observaciones/notas]. Agrúpalas en clusters temáticos como en un affinity diagram. Nombra cada cluster con una etiqueta clara y explica brevemente qué representa cada grupo."
      },
      {
        id: 11,
        title: "11. Construir un User Persona",
        template: "Con base en estos datos de investigación [pega datos/hallazgos], crea un user persona realista. Incluye: nombre y foto-descripción, datos demográficos relevantes, objetivos, frustraciones (pain points), motivaciones, comportamientos clave, y una cita representativa. Evita estereotipos y básate solo en lo que respaldan los datos."
      },
      {
        id: 12,
        title: "12. Mapa de empatía",
        template: "A partir de esta información sobre [tipo de usuario]: [pega datos], completa un mapa de empatía con las cuatro secciones: qué Dice, qué Piensa, qué Hace y qué Siente. Añade abajo sus principales dolores (pains) y ganancias esperadas (gains)."
      },
      {
        id: 13,
        title: "13. Customer Journey Map",
        template: "Crea un customer journey map para [tipo de usuario] que busca [objetivo] usando [producto/servicio]. Divide el recorrido en etapas, y para cada una detalla: acciones del usuario, puntos de contacto, pensamientos, emociones (de 1 a 5), pain points y oportunidades de mejora. Preséntalo en tabla."
      },
      {
        id: 14,
        title: "14. Priorizar problemas detectados",
        template: "Tengo esta lista de problemas de usuario detectados en investigación: [pega lista]. Ayúdame a priorizarlos usando un criterio de impacto vs. frecuencia. Crea una tabla que clasifique cada problema y recomienda cuáles atacar primero, justificando el orden."
      },
      {
        id: 15,
        title: "15. Definir el problema (Problem Statement)",
        template: "Con base en mi investigación [resume hallazgos], ayúdame a redactar un problem statement claro y enfocado. Usa el formato: \"[Usuario] necesita [necesidad] porque [insight], pero actualmente [obstáculo]\". Genera 3 versiones alternativas para elegir."
      }
    ]
  },
  {
    title: "💡 ETAPA 3 — Ideación y definición",
    icon: "lightbulb",
    prompts: [
      {
        id: 16,
        title: "16. Generar ideas de solución",
        template: "Para resolver este problema: [problem statement], genera 15 ideas de solución diversas, desde las más obvias hasta las más disruptivas. No te autocensures. Después, agrúpalas por tipo de enfoque y marca las 3 con mejor relación impacto/esfuerzo."
      },
      {
        id: 17,
        title: "17. Reformular con \"How Might We\"",
        template: "Convierte estos problemas de usuario [pega problemas] en preguntas tipo \"¿Cómo podríamos...?\" (How Might We). Genera 2-3 reformulaciones por problema, en distintos niveles de amplitud, para abrir el espacio de soluciones."
      },
      {
        id: 18,
        title: "18. Definir propuesta de valor",
        template: "Para [producto/feature] dirigido a [usuario], ayúdame a articular la propuesta de valor. Usa la estructura: para quién es, qué problema resuelve, cómo lo resuelve, y qué lo hace diferente de las alternativas. Dame 2 versiones: una corta tipo tagline y una desarrollada."
      },
      {
        id: 19,
        title: "19. Priorización con matriz RICE / MoSCoW",
        template: "Tengo esta lista de features candidatas: [pega lista]. Ayúdame a priorizarlas usando el método [RICE o MoSCoW]. Explica el razonamiento detrás de cada clasificación y entrega el resultado en una tabla ordenada por prioridad."
      },
      {
        id: 20,
        title: "20. Definir alcance de un MVP",
        template: "Para [producto], cuyo objetivo principal es [objetivo] y cuyo usuario clave es [usuario], ayúdame a definir el MVP. Lista qué funcionalidades son imprescindibles para validar la propuesta, cuáles dejar para después, y justifica cada decisión pensando en el menor esfuerzo que entrega valor real."
      },
      {
        id: 21,
        title: "21. Crear historias de usuario",
        template: "Convierte estos requerimientos [pega lista] en historias de usuario con el formato: \"Como [tipo de usuario], quiero [acción] para [beneficio]\". Para cada historia añade criterios de aceptación claros en formato Gherkin (Dado/Cuando/Entonces)."
      }
    ]
  },
  {
    title: "✏️ ETAPA 4 — Diseño y prototipado",
    icon: "pencil",
    prompts: [
      {
        id: 22,
        title: "22. Estructurar flujo de usuario (user flow)",
        template: "Diseña el user flow para que [tipo de usuario] logre [objetivo] en [producto]. Describe cada paso, las decisiones que toma el usuario, los estados posibles (éxito, error, vacío) y los puntos donde podría abandonar. Preséntalo como una secuencia numerada con ramificaciones."
      },
      {
        id: 23,
        title: "23. Arquitectura de información",
        template: "Tengo este conjunto de contenidos/secciones para [producto]: [pega lista]. Propón una arquitectura de información lógica: agrupa los elementos, sugiere una jerarquía de navegación, y nombra cada sección de forma clara para el usuario. Justifica el agrupamiento."
      },
      {
        id: 24,
        title: "24. Generar contenido para wireframes",
        template: "Estoy diseñando la pantalla de [nombre de pantalla] para [producto]. Su objetivo es [objetivo de la pantalla]. Genera el contenido placeholder realista que debería ir: títulos, microcopys, etiquetas de botones, textos de ayuda y estados vacíos. Nada de \"Lorem ipsum\"."
      },
      {
        id: 25,
        title: "25. Brief de diseño para prototipo con IA",
        template: "Quiero generar un prototipo de [tipo de pantalla/app] usando una herramienta de IA. Redacta un prompt detallado y bien estructurado que pueda copiar en esa herramienta, describiendo: tipo de pantalla, elementos de UI necesarios, jerarquía visual, comportamiento esperado y estilo general. El producto es [descripción]."
      },
      {
        id: 26,
        title: "26. Escribir microcopy UX",
        template: "Escribe el microcopy para [componente/situación: ej. mensaje de error al fallar el pago]. El tono de marca es [tono]. Dame 3 variantes que sean claras, humanas y ordenadas a la acción. Evita jerga técnica y culpar al usuario."
      },
      {
        id: 27,
        title: "27. Diseñar estados de un componente",
        template: "Para el componente [nombre: ej. formulario de registro], lista y describe todos los estados que debo diseñar: default, hover, focus, activo, deshabilitado, cargando, error, éxito y vacío. Para cada uno indica qué debe comunicar al usuario."
      },
      {
        id: 28,
        title: "28. Generar variantes de una pantalla",
        template: "Estoy diseñando [pantalla] con el objetivo de [objetivo]. Propón 3 enfoques de layout distintos para esta pantalla, explicando las ventajas y desventajas UX de cada uno y para qué tipo de usuario o contexto funciona mejor cada propuesta."
      },
      {
        id: 29,
        title: "29. Checklist de accesibilidad",
        template: "Genera un checklist de accesibilidad (WCAG) aplicable a [tipo de pantalla/componente]. Organízalo por categoría (contraste, navegación por teclado, lectores de pantalla, formularios, etc.) y redáctalo de forma que pueda verificar punto por punto durante el diseño."
      },
      {
        id: 30,
        title: "30. Sistema de diseño — tokens base",
        template: "Para un producto [descripción y tono de marca], propón los design tokens fundamentales: escala tipográfica, paleta de colores con sus usos (primario, secundario, semántico), escala de espaciado y radios de borde. Justifica cada decisión en función de la legibilidad y la coherencia."
      }
    ]
  },
  {
    title: "🧪 ETAPA 5 — Evaluación y testing",
    icon: "test-tube",
    prompts: [
      {
        id: 31,
        title: "31. Evaluación heurística (Nielsen)",
        template: "Actúa como experto en usabilidad. Evalúa [pantalla/flujo: describe o pega contexto] contra las 10 heurísticas de Nielsen. Para cada heurística, da un puntaje de cumplimiento (0-100), identifica problemas concretos y propón una mejora accionable."
      },
      {
        id: 32,
        title: "32. Diseñar test de usabilidad",
        template: "Crea un plan de test de usabilidad para evaluar [producto/flujo]. Incluye: objetivos del test, perfil de participantes, 4-6 tareas realistas con su criterio de éxito, preguntas post-tarea y preguntas finales. Las tareas no deben dar pistas de cómo completarlas."
      },
      {
        id: 33,
        title: "33. Definir métricas UX",
        template: "Para [producto/feature] cuyo objetivo es [objetivo], recomienda qué métricas UX debería medir. Combina métricas de comportamiento y de actitud (ej. tasa de éxito, tiempo en tarea, SUS, CSAT). Para cada una explica qué revela y cómo capturarla."
      },
      {
        id: 34,
        title: "34. Analizar resultados de test",
        template: "Aquí están los resultados de mi test de usabilidad: [pega observaciones/datos]. Identifica los problemas de usabilidad encontrados, clasifícalos por severidad (crítico, alto, medio, bajo) según frecuencia e impacto, y recomienda una solución para cada uno."
      },
      {
        id: 35,
        title: "35. Redactar encuesta post-uso",
        template: "Diseña una encuesta breve (máx. 8 preguntas) para medir la experiencia de usuarios que ya usaron [producto/feature]. Combina escalas (Likert, NPS) con preguntas abiertas. Asegúrate de que cada pregunta tenga un propósito claro y no induzca respuestas."
      },
      {
        id: 36,
        title: "36. Comparar dos versiones de diseño (A/B)",
        template: "Tengo dos versiones de [pantalla/flujo]: Versión A [describe] y Versión B [describe]. Analiza desde la perspectiva UX cuál tiene más probabilidades de funcionar mejor para [objetivo], qué hipótesis debería testear con un A/B test y qué métrica usaría para decidir."
      }
    ]
  },
  {
    title: "📣 ETAPA 6 — Comunicación y handoff",
    icon: "megaphone",
    prompts: [
      {
        id: 37,
        title: "37. Presentar hallazgos a stakeholders",
        template: "Tengo estos hallazgos de investigación/diseño: [pega resumen]. Ayúdame a estructurar una presentación clara para stakeholders no-diseñadores. Organiza el mensaje en: contexto, qué descubrimos, por qué importa para el negocio, y qué recomendamos hacer. Lenguaje directo, sin jerga."
      },
      {
        id: 38,
        title: "38. Justificar una decisión de diseño",
        template: "Necesito defender esta decisión de diseño: [describe la decisión]. Ayúdame a construir un argumento sólido que conecte la decisión con: datos de investigación, principios de usabilidad y objetivos de negocio. Anticipa 3 posibles objeciones y cómo responderlas."
      },
      {
        id: 39,
        title: "39. Documentar para handoff a desarrollo",
        template: "Para el componente/pantalla [nombre], ayúdame a redactar la documentación de handoff para el equipo de desarrollo. Incluye: comportamiento esperado, estados, reglas de validación, casos borde, y notas de interacción. Estructúralo de forma que un dev pueda implementarlo sin ambigüedades."
      },
      {
        id: 40,
        title: "40. Escribir un caso de estudio para portafolio",
        template: "Ayúdame a estructurar un caso de estudio de portafolio sobre este proyecto: [describe proyecto, rol, problema y resultado]. Usa la narrativa: contexto y rol, el problema, el proceso (research → ideación → diseño → test), las decisiones clave, el resultado con impacto, y los aprendizajes. Tono profesional pero personal."
      }
    ]
  }
];

export const vibeCodingStages: PromptStage[] = [
  {
    title: "🚀 FASE 1 — Arranque y definición",
    icon: "lightbulb",
    prompts: [
      {
        id: 101,
        title: "1. Definir el prototipo antes de codear",
        template: "Quiero construir un prototipo de [tipo de app/web: ej. app de hábitos]. Antes de escribir código, ayúdame a definir: qué hace exactamente, las 3-5 pantallas principales, las funcionalidades imprescindibles del prototipo, y qué dejamos fuera por ahora. No generes código todavía, solo el plan."
      },
      {
        id: 102,
        title: "2. Elegir el stack adecuado",
        template: "Voy a construir un prototipo de [descripción] que necesita [requisitos: ej. funcionar en móvil, guardar datos localmente]. Recomiéndame el stack más simple y rápido para prototipar esto. Prioriza facilidad y velocidad sobre escalabilidad. Justifica brevemente tu elección."
      },
      {
        id: 103,
        title: "3. Pedir un plan antes de construir",
        template: "Quiero construir [descripción del prototipo]. Antes de generar código, descríbeme tu plan: qué archivos vas a crear, qué hace cada uno, y en qué orden los construirás. Espera mi confirmación antes de empezar."
      },
      {
        id: 104,
        title: "4. Brief técnico desde un mockup/idea",
        template: "Tengo esta idea de pantalla: [describe o pega el wireframe/idea]. Tradúcela a un brief técnico que incluya: componentes de UI necesarios, jerarquía de la pantalla, comportamiento esperado de cada elemento y los estados que debo contemplar. Luego pregúntame si quiero que lo construyas."
      },
      {
        id: 105,
        title: "5. Definir el \"vibe\" visual del proyecto",
        template: "Para mi prototipo de [descripción], quiero un estilo visual [adjetivos: ej. minimalista, cálido, moderno]. Propón una dirección de diseño concreta: paleta de colores (con códigos), tipografía, estilo de bordes y espaciado, y referencias de productos con ese vibe. No codees aún."
      },
      {
        id: 106,
        title: "6. Dividir un proyecto grande en partes",
        template: "Quiero construir [descripción de app completa]. Es grande, así que divídelo en fases construibles de forma incremental, donde cada fase entregue algo funcional. Dame la lista de fases ordenadas y empezaremos por la primera."
      }
    ]
  },
  {
    title: "🏗️ FASE 2 — Scaffolding y estructura",
    icon: "puzzle",
    prompts: [
      {
        id: 107,
        title: "7. Crear la base del proyecto",
        template: "Crea la estructura base de un prototipo de [tipo] usando [stack/herramienta]. Incluye solo el esqueleto: estructura de archivos, navegación entre pantallas y un layout vacío para cada una. Que compile y se vea, aunque las pantallas estén en blanco."
      },
      {
        id: 108,
        title: "8. Configurar la navegación",
        template: "Configura la navegación de mi prototipo entre estas pantallas: [lista de pantallas]. Quiero [tipo: ej. una barra inferior en móvil / un menú lateral]. Asegúrate de que pueda moverme entre todas las pantallas aunque estén vacías."
      },
      {
        id: 109,
        title: "9. Crear un layout base reutilizable",
        template: "Crea un layout base que se repita en todas las pantallas de mi prototipo: [describe: ej. header con logo, contenido central, footer]. Que las pantallas individuales solo tengan que rellenar el contenido central."
      },
      {
        id: 110,
        title: "10. Estructura de componentes",
        template: "Para mi prototipo de [descripción], propón cómo organizar los componentes en piezas reutilizables. Lista qué componentes crear (ej. botón, card, input) y cuáles serían específicos de cada pantalla. Luego créalos como componentes vacíos pero tipados."
      },
      {
        id: 111,
        title: "11. Preparar el sistema de estilos",
        template: "Configura un sistema de estilos para mi prototipo con estos tokens: colores [lista], tipografía [fuente], espaciados base y radios de borde. Déjalo centralizado para poder cambiar el look de todo el proyecto desde un solo lugar."
      },
      {
        id: 112,
        title: "12. Setup de un prototipo de una sola pantalla",
        template: "Quiero un prototipo rápido de una sola pantalla que muestre [descripción]. Hazlo en un solo archivo, sin complejidad innecesaria, listo para previsualizar de inmediato. Prioriza que se vea y funcione rápido."
      }
    ]
  },
  {
    title: "🧱 FASE 3 — UI y componentes",
    icon: "pencil",
    prompts: [
      {
        id: 113,
        title: "13. Construir una pantalla completa",
        template: "Construye la pantalla de [nombre] de mi prototipo. Debe contener: [lista de elementos]. El objetivo de la pantalla es [objetivo]. Usa contenido realista (nada de \"Lorem ipsum\") y respeta el estilo visual [describe vibe]."
      },
      {
        id: 114,
        title: "14. Crear un componente específico",
        template: "Crea un componente de [tipo: ej. card de producto] que muestre [datos que contiene]. Debe verse [estilo] y comportarse así: [comportamiento al interactuar]. Hazlo reutilizable para poder pasarle datos distintos."
      },
      {
        id: 115,
        title: "15. Formulario funcional",
        template: "Crea un formulario de [propósito: ej. registro] con los campos [lista de campos]. Incluye validación básica, mensajes de error claros bajo cada campo, estado de carga al enviar y un mensaje de éxito. El tono de los textos debe ser [tono]."
      },
      {
        id: 116,
        title: "16. Construir una lista o feed",
        template: "Crea una [lista/feed/grilla] que muestre elementos de tipo [descripción]. Cada elemento muestra [datos]. Incluye un estado vacío amigable cuando no haya elementos y un estado de carga. Llénalo con datos de ejemplo realistas por ahora."
      },
      {
        id: 117,
        title: "17. Modal o ventana emergente",
        template: "Añade un modal que se abra al [acción: ej. hacer clic en un botón] y muestre [contenido]. Debe poder cerrarse haciendo clic fuera, con la tecla Escape y con un botón de cierre. Que oscurezca el fondo al abrirse."
      },
      {
        id: 118,
        title: "18. Barra de navegación / header",
        template: "Crea el header de mi prototipo con: [elementos: ej. logo a la izquierda, menú al centro, botón de perfil a la derecha]. Que sea responsive y en móvil se colapse en un menú tipo hamburguesa."
      },
      {
        id: 119,
        title: "19. Tabla de datos",
        template: "Crea una tabla que muestre [tipo de datos] con las columnas [lista]. Incluye la posibilidad de ordenar por columna al hacer clic en el encabezado y filas con hover. Rellénala con 8-10 filas de datos de ejemplo realistas."
      },
      {
        id: 120,
        title: "20. Tarjetas con acciones",
        template: "Crea una card que muestre [contenido] e incluya estas acciones: [lista de botones/acciones]. Define el comportamiento visual al hacer hover y al hacer clic en cada acción. Hazla reutilizable."
      }
    ]
  },
  {
    title: "📐 FASE 4 — Layout y responsive",
    icon: "search",
    prompts: [
      {
        id: 121,
        title: "21. Hacer una pantalla responsive",
        template: "Toma esta pantalla [nombre] y hazla responsive. Define cómo debe verse y reorganizarse en móvil, tablet y escritorio. En móvil prioriza [qué priorizar]. Mantén la jerarquía visual en todos los tamaños."
      },
      {
        id: 122,
        title: "22. Ajustar un layout que se ve mal",
        template: "El layout de [pantalla/componente] no se ve bien: [describe el problema, ej. los elementos se amontonan en móvil]. Arréglalo y explícame qué estaba causando el problema para aprender de ello."
      },
      {
        id: 123,
        title: "23. Crear una grilla responsive",
        template: "Crea una grilla responsive para mostrar [elementos]. En escritorio quiero [N] columnas, en tablet [N] y en móvil [N]. Que los elementos mantengan proporciones consistentes y buen espaciado entre ellos."
      },
      {
        id: 124,
        title: "24. Layout tipo dashboard",
        template: "Crea un layout de dashboard con: una barra lateral de navegación, un área principal de contenido y [otros elementos]. Que la barra lateral se colapse en móvil. El contenido principal debe acomodar [tipo de widgets/secciones]."
      },
      {
        id: 125,
        title: "25. Centrar y espaciar correctamente",
        template: "Revisa el espaciado de [pantalla/sección] y mejóralo aplicando una jerarquía visual clara: más aire entre secciones, espaciado consistente entre elementos relacionados, y márgenes que respiren. Usa una escala de espaciado coherente."
      },
      {
        id: 126,
        title: "26. Landing page de una sección",
        template: "Crea una sección de landing tipo [hero/features/pricing/testimonios] para [producto]. Debe ser visualmente atractiva, responsive, con un titular potente, [elementos] y un llamado a la acción claro. Usa el estilo [vibe]."
      }
    ]
  },
  {
    title: "⚙️ FASE 5 — Interactividad y estado",
    icon: "megaphone",
    prompts: [
      {
        id: 127,
        title: "27. Añadir interactividad básica",
        template: "Haz que [elemento] reaccione cuando el usuario [acción]. El comportamiento esperado es: [describe qué debe pasar]. Asegúrate de dar feedback visual inmediato al usuario."
      },
      {
        id: 128,
        title: "28. Manejar estado de la app",
        template: "Mi prototipo necesita recordar [qué dato/estado: ej. los ítems agregados al carrito]. Implementa el manejo de ese estado para que persista mientras navego entre pantallas. Mantenlo simple, es un prototipo."
      },
      {
        id: 129,
        title: "29. Filtros y búsqueda",
        template: "Añade a [lista/feed] la capacidad de filtrar por [criterios] y buscar por texto. Los resultados deben actualizarse en tiempo real mientras el usuario escribe o cambia filtros. Muestra un estado claro cuando no haya resultados."
      },
      {
        id: 130,
        title: "30. Toggle / cambio de estados",
        template: "Añade un control para alternar entre [estado A] y [estado B] (ej. modo claro/oscuro, vista lista/grilla). El cambio debe ser instantáneo y recordar la última elección del usuario."
      },
      {
        id: 131,
        title: "31. Flujo de varios pasos",
        template: "Crea un flujo de [N] pasos para [propósito: ej. onboarding, checkout]. Cada paso muestra [contenido], el usuario puede avanzar y retroceder, y debe haber un indicador de progreso. Al terminar, muestra [pantalla final]."
      },
      {
        id: 132,
        title: "32. Feedback y notificaciones",
        template: "Añade notificaciones tipo toast que aparezcan cuando el usuario [acciones: ej. guarda, elimina, hay un error]. Deben ser breves, claras, desaparecer solas tras unos segundos y diferenciar éxito de error visualmente."
      },
      {
        id: 133,
        title: "33. Animaciones y microinteracciones",
        template: "Añade microinteracciones sutiles a [elementos]: transiciones suaves al aparecer, feedback al hacer hover y clic, y animaciones de entrada cuando carga la pantalla. Que se sientan fluidas y no exageradas."
      }
    ]
  },
  {
    title: "🗂️ FASE 6 — Datos y contenido",
    icon: "test-tube",
    prompts: [
      {
        id: 134,
        title: "34. Generar datos de ejemplo realistas",
        template: "Genera datos de ejemplo realistas para mi prototipo de [descripción]. Necesito [N] elementos de tipo [describe estructura: ej. usuarios con nombre, avatar, rol]. Que parezcan datos reales, no genéricos, y úsalos para poblar la interfaz."
      },
      {
        id: 135,
        title: "35. Conectar datos a la interfaz",
        template: "Toma estos datos de ejemplo [pega o describe] y conéctalos a [pantalla/componente] para que se muestren dinámicamente. Que la interfaz se adapte automáticamente según la cantidad de datos."
      },
      {
        id: 136,
        title: "36. Simular una respuesta de API",
        template: "Simula que mi prototipo obtiene [datos] desde una API, incluyendo un estado de carga mientras \"llegan\" los datos y un posible estado de error. No necesito una API real, solo simular el comportamiento de forma creíble."
      },
      {
        id: 137,
        title: "37. Formulario que guarda y muestra datos",
        template: "Haz que cuando el usuario complete el formulario de [propósito], los datos se guarden y aparezcan inmediatamente en [dónde: ej. una lista abajo]. Sin recargar la página. Es un prototipo, así que basta con que persista durante la sesión."
      },
      {
        id: 138,
        title: "38. Contenido para estados vacíos y de error",
        template: "Genera el contenido para los estados especiales de mi prototipo: estado vacío (sin datos), estado de carga, y estado de error. Cada uno debe tener un mensaje claro, amigable y, cuando aplique, una acción sugerida para el usuario."
      }
    ]
  },
  {
    title: "🎨 FASE 7 — Estilo y pulido visual",
    icon: "lightbulb",
    prompts: [
      {
        id: 139,
        title: "39. Aplicar una identidad visual",
        template: "Aplica esta identidad visual a todo mi prototipo: colores [lista], tipografía [fuente], estilo [describe vibe]. Mantén la coherencia en todas las pantallas y asegúrate de que el contraste sea legible."
      },
      {
        id: 140,
        title: "40. Mejorar el aspecto de una pantalla",
        template: "Esta pantalla [nombre] funciona pero se ve genérica/sosa. Mejórala visualmente: mejor jerarquía tipográfica, uso intencional del color, espaciado más cuidado y detalles que la hagan sentir profesional. Mantén la funcionalidad intacta."
      },
      {
        id: 141,
        title: "41. Asegurar consistencia visual",
        template: "Revisa todo mi prototipo y detecta inconsistencias visuales: botones que no coinciden, espaciados irregulares, tamaños de texto dispares, colores fuera de la paleta. Corrígelas para que todo se sienta parte del mismo producto."
      },
      {
        id: 142,
        title: "42. Modo oscuro",
        template: "Añade modo oscuro a mi prototipo. Define los colores para fondo, texto, superficies y acentos en ambos modos asegurando buen contraste. Incluye un control para alternar entre claro y oscuro."
      },
      {
        id: 143,
        title: "43. Pulir tipografía y legibilidad",
        template: "Mejora la tipografía de mi prototipo: establece una escala clara de tamaños para títulos y cuerpo, ajusta interlineado y longitud de línea para buena lectura, y asegura jerarquía visual entre niveles de texto."
      },
      {
        id: 144,
        title: "44. Añadir detalles de calidad",
        template: "Añade detalles que eleven la percepción de calidad de mi prototipo: estados hover/focus en elementos interactivos, transiciones suaves, esquinas y sombras consistentes, e íconos donde aporten claridad. Sin recargar el diseño."
      }
    ]
  },
  {
    title: "🐛 FASE 8 — Debugging y corrección",
    icon: "search",
    prompts: [
      {
        id: 145,
        title: "45. Arreglar un error explicado",
        template: "Mi prototipo tiene este error: [pega el mensaje de error o describe qué pasa]. Diagnostica la causa, arréglalo, y explícame brevemente por qué ocurría para no repetirlo."
      },
      {
        id: 146,
        title: "46. Algo no funciona como espero",
        template: "Cuando hago [acción], esperaba que pasara [resultado esperado], pero en cambio pasa [resultado real]. Investiga por qué y corrígelo. Si necesitas más contexto, pregúntame antes de cambiar código."
      },
      {
        id: 147,
        title: "47. Revisar antes de avanzar",
        template: "Antes de seguir construyendo, revisa el código actual de mi prototipo y dime: si hay errores o cosas frágiles, qué se puede simplificar, y si algo se va a romper cuando agregue más funcionalidades. No cambies nada todavía, solo diagnostica."
      },
      {
        id: 148,
        title: "48. Deshacer un cambio que empeoró todo",
        template: "El último cambio que hicimos rompió [qué se rompió]. Antes funcionaba [describe]. Revierte o corrige para volver al comportamiento correcto, sin perder lo demás que sí estaba bien."
      },
      {
        id: 149,
        title: "49. Limpiar y ordenar el código",
        template: "Mi prototipo funciona pero el código está desordenado. Límpialo: elimina código sin usar, agrupa lo relacionado, dale nombres claros a las cosas y deja comentarios donde ayude. No cambies el comportamiento, solo la organización."
      },
      {
        id: 150,
        title: "50. Preparar para compartir / desplegar",
        template: "Mi prototipo está listo para mostrarlo. Revisa que todo funcione de punta a punta, que no haya textos de prueba ni elementos rotos, y dime los pasos para [desplegarlo / compartir un link / exportarlo] con la herramienta que estoy usando."
      }
    ]
  }
];
