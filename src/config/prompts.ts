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
# GENERATION PROCESS
Follow these steps in order:

1. TOPIC ANALYSIS (before selecting activities):
   - Identify 3-4 key concepts of the topic
   - Define what participants should understand by the end
   - Determine which practical activities would demonstrate understanding
   - Consider cultural and educational context of Mexican schools

2. DYNAMICS SELECTION:
   PROHIBITED DYNAMICS:
   - NO lluvia de ideas
   - NO discusiones abiertas sin estructura
   - NO actividades estáticas/sentados
   
   PREFERRED ALTERNATIVES:
   - Representación mímica de conceptos
   - Recorridos por estaciones de aprendizaje
   - Juegos de rol educativos
   - Creación de mapas humanos
   - Dramatizaciones de situaciones
   - Carreras de relevos conceptuales
   - Construcción colaborativa
   
   SELECTION RULES:
   - Use EXCLUSIVELY "Mis 500 dinámicas grupales para el trabajo escolar"
   - Must involve physical movement
   - Must have clear structure and rules
   - Must be engaging and participative

3. TIME DISTRIBUTION:
   START: 20% of total time
   - Physical movement/activity required
   - Introduce topic through practice
   - Must engage immediately

   DEVELOPMENT: 50% of total time
   - 20% brief, clear explanation
   - 80% main practical activity
   - Must integrate theory with practice

   CLOSURE: 20% of total time
   - Activity demonstrating learning
   - Must be dynamic and participative
   - Should verify understanding

   EVALUATION: 10% (optional)
   - Only if necessary
   - Skip if closure verifies learning
   - Redistribute time to closure if skipped

4. CRITICAL RULES FOR OUTPUT:
   - Write ALL activities in Spanish
   - NEVER use English terms
   - NEVER specify team sizes
   - USE simple, clear Spanish
   - INCLUDE only basic materials
   - DESCRIBE activities step by step
   - ENSURE instructions are immediately actionable

5. ACTIVITY DESCRIPTION FORMAT:
   Structure each activity description ONLY with:
   a) Main action (what will be done)
   b) Specific steps (how to do it)
   - Do NOT include timing in description
   - Do NOT include materials in description
   - Do NOT repeat information that belongs in other columns
   
   BAD example:
   "Los participantes realizarán una actividad durante 10 minutos usando papeles y lápices..."
   
   GOOD example:
   "Los participantes formarán un círculo y cada uno representará un concepto mediante mímica. El resto intentará adivinar el concepto representado."

6. VERIFICATION CRITERIA:
   Activities must demonstrate participants:
   - Understand core concepts
   - Can apply knowledge practically
   - Participated actively
   - Show measurable learning

7. ALLOWED MATERIALS:
   Basic classroom materials only:
   - Paper sheets
   - Pencils/Pens
   - Board and markers
   - Cards or cardboard
   - Common classroom items

8. DYNAMICS ADAPTATION:
   When adapting from "Mis 500 dinámicas":
   - Keep core structure
   - Adapt to specific topic
   - Maintain physical movement
   - Simplify if needed
   - No source attribution

9. CULTURAL CONSIDERATIONS:
   - Use Mexican educational terminology
   - Consider local school context
   - Adapt to available resources
   - Use familiar activity formats
   - Keep language regionally appropriate

# OUTPUT FORMAT
Return ONLY a valid JSON object following this example structure:
{
  "start": {
    "activity": "Los participantes formarán un círculo y cada uno representará mediante mímica un concepto del tema. Los demás intentarán adivinar. Cuando se adivine, el siguiente participante continúa con otro concepto.",
    "materials": ["espacio amplio para moverse"],
    "timeMinutes": 10
  },
  "development": {
    "activity": "Se organizará un recorrido por tres estaciones. En cada estación habrá una actividad diferente relacionada con el tema: en la primera crearán representaciones visuales, en la segunda realizarán demostraciones prácticas, y en la tercera resolverán desafíos aplicados.",
    "materials": ["tarjetas con instrucciones", "materiales por estación", "cronómetro"],
    "timeMinutes": 25
  },
  "closure": {
    "activity": "Los participantes formarán una línea donde cada uno representará un concepto aprendido. Deberán organizarse en secuencia lógica, explicando la conexión con sus compañeros adyacentes.",
    "materials": ["tarjetas con conceptos"],
    "timeMinutes": 10
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
