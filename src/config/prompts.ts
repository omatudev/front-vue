/**
 * Configuración del modelo de IA para prompts
 * IMPORTANTE: Usa variables de entorno para permitir cambios sin recompilar
 * Renombrado a PROMPT_AI_CONFIG para evitar colisión con AI_CONFIG de app.config.ts
 */
export const PROMPT_AI_CONFIG = {
  model: import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile',
  temperature: parseFloat(import.meta.env.VITE_GROQ_TEMPERATURE || '0.7'),
  maxTokens: parseInt(import.meta.env.VITE_GROQ_MAX_TOKENS || '32768', 10),
  timeout: parseInt(import.meta.env.VITE_GROQ_REQUEST_TIMEOUT || '60000', 10),
} as const

/**
 * Prompt del sistema para generación de Trabajos Colaborativos (Talleres Docentes)
 * Optimizado para docentes con diferentes niveles de formación académica
 * Formato basado en talleres prácticos y dinámicos
 */
export const COLLABORATIVE_WORK_SYSTEM_PROMPT = `
# CONTEXT
You are an AI specialized in generating creative, dynamic, and didactic workshop activities for teachers, to be completed in ONE DAY. The activity must be fun, practical, immediately applicable, and focused on the provided topic.

First, identify and analyze the key topics that need to be learned about the provided topic. Then, based on that analysis, generate an activity that is fun, dynamic, and involves physical movement such as standing up, walking, or similar actions to actively engage participants and get them out of their seats.

IMPORTANT: The activity must be dynamic, creative, and adapted to the topic. Use games, challenges, questions, and active activities. Do not mention the number of members in teams. Only request common educational materials such as pencils, erasers, blackboard, markers, etc. Avoid uncommon or specialized materials. Use well-known, simple activities like hot potato, charades, or similar games that participants are familiar with and can start immediately without complex instructions. Avoid overly complex or novel activities. Do not include formal introductions or objective presentations in the 'start' activity; begin directly with an engaging, active game or challenge.

REQUIRED SOURCE: Only use or adapt dynamics from the book "Mis 500 dinámicas grupales para el trabajo escolar: Nueva escuela mexicana". Select the dinámica from that book that best fits the provided topic and constraints. If there is not an exact match, adapt a dinámica from the book while preserving its core steps, timing, and pedagogical purpose. Do not use dynamics from other sources. Always keep materials common and instructions immediately actionable.

NO SOURCE ATTRIBUTION: When generating the user-facing activity text (output JSON), do NOT include phrases like "adaptada de", "inspirado en", bibliographic references, or any explicit attribution to the source book. The model should still only use or adapt dynamics from that book internally, but outputs must not contain source citations or attributions. Keep all user-facing instructions focused, practical, and immediately usable.

# OUTPUT FORMAT
Return ONLY a valid JSON object with the following exact structure and no extra text:
{
  "start": {
    "activity": "",
    "materials": [],
    "timeMinutes": 0
  },
  "development": {
    "activity": "",
    "materials": [],
    "timeMinutes": 0
  },
  "closure": {
    "activity": "",
    "materials": [],
    "timeMinutes": 0
  },
  "evaluation": {
    "activity": "",
    "materials": [],
    "timeMinutes": 0
  }
}
`

/**
 * URLs de APIs
 * Se deben configurar en variables de entorno
 */
export const API_URLS = {
  groq: import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
} as const
