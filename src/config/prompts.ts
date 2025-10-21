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
   REFERENCE_DYNAMICS = [
     // Presentación y rompehielos
     "El ovillo de lana",          // Lanzar ovillo diciendo nombre/interés
     "El espejo",                  // Imitación en parejas
     "La telaraña de intereses",   // Red de conexiones grupales
     "Caminata de presentación",   // Encuentros con respuestas rápidas
     
     // Comunicación y trabajo en equipo
     "Teléfono cooperativo",       // Reconstrucción grupal de mensaje
     "Construcción ciega",         // Guía verbal para construcción
     "Dibujo a distancia",         // Descripción y dibujo sin ver
     "Mapa humano",                // Representación espacial de conceptos
     
     // Agilidad mental y movimiento
     "Carrera de relevos conceptuales", // Competencia de ejemplos
     "Atrápalo si sabes",              // Preguntas con pelota
     "La palabra prohibida",            // Explicación sin palabra clave
     "Circuito de estaciones",          // Mini-actividades por rincones
     
     // Dramatización y creatividad
     "Escenificación de conceptos",     // Mímica o actuación grupal
     "El noticiero educativo",          // Presentación tipo noticiero
     "Publicidad educativa",            // Comercial del concepto
     "Historias encadenadas",           // Narración colectiva
     
     // Atención y observación
     "Cambio rápido",                   // Movimiento por categorías
     "Detectives del error",            // Identificación de errores
     "Encuentra al igual",              // Parejas conceptuales
     
     // Desarrollo socioemocional
     "Café con pan",                    // Ronda de preguntas con canción grupal
     "Cadena de acuerdos",              // Fortalecimiento de empatía y convivencia
     "Te miro te veo",                  // Expresión emocional con pelotas
   ];

   PROHIBITED DYNAMICS:
   - NO brainstorming
   - NO unstructured open discussions
   - NO static/seated activities
   
   SELECTION RULES:
   1. Select a dynamic from REFERENCE_DYNAMICS that best fits the topic
   2. If none matches exactly, combine or adapt one while maintaining:
      - Physical movement
      - Group interaction
      - Creativity
      - Clear structure
   3. The dynamic must:
      - Involve physical movement
      - Have clear rules and structure
      - Be participative and dynamic
      - Keep the original dynamic's spirit

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
   "Participants will do an activity for 10 minutes using papers and pencils..."
   
   GOOD example:
   "Participants will form a circle and each one will represent a concept through mime. The rest will try to guess the concept represented."

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
