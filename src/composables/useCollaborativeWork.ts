import { ref, computed } from 'vue'
import type {
  CollaborativeWork,
  GenerateCollaborativeWorkDTO,
} from '@/domain/entities/CollaborativeWork'
import { generateCollaborativeWorkPDF } from '@/utils/pdfMake/collaborativeWorkPDF'
import { COLLABORATIVE_WORK_SYSTEM_PROMPT, PROMPT_AI_CONFIG, API_URLS } from '@/config/prompts'
import { v4 as uuidv4 } from 'uuid'

/**
 * Composable para gestionar trabajos colaborativos
 * El maestro llena un formulario básico y la IA genera todo el contenido
 */
export function useCollaborativeWork() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentWork = ref<CollaborativeWork | null>(null)

  /**
   * Genera un trabajo colaborativo usando el modelo de IA
   */
  async function generateWithAI(request: GenerateCollaborativeWorkDTO): Promise<CollaborativeWork> {
    loading.value = true
    error.value = null

    try {
      const userPrompt = buildUserPrompt(request)
      const apiKey = import.meta.env.VITE_GROQ_API_KEY

      if (!apiKey) {
        throw new Error('VITE_GROQ_API_KEY no está configurada')
      }

      const response = await fetch(API_URLS.groq, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: PROMPT_AI_CONFIG.model,
          messages: [
            { role: 'system', content: COLLABORATIVE_WORK_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: PROMPT_AI_CONFIG.temperature,
          max_tokens: PROMPT_AI_CONFIG.maxTokens,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('La respuesta del modelo está vacía')
      }

      // Parsear la respuesta JSON
      const parsedData = parseAIResponse(content)

      // Crear el objeto CollaborativeWork completo
      const work: CollaborativeWork = {
        id: uuidv4(),
        objective: parsedData.objective,
        topic: parsedData.topic,
        teacherName: request.teacherName,
        activities: parsedData.activities,
        createdAt: new Date(),
      }

      currentWork.value = work
      return work
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Genera y descarga el PDF del trabajo colaborativo
   */
  async function downloadPDF(work?: CollaborativeWork): Promise<void> {
    const workToExport = work || currentWork.value

    if (!workToExport) {
      throw new Error('No hay trabajo colaborativo para exportar')
    }

    try {
      loading.value = true
      error.value = null
      await generateCollaborativeWorkPDF(workToExport)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar PDF'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpia el estado actual
   */
  function clear() {
    currentWork.value = null
    error.value = null
  }

  return {
    // Estado
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    currentWork: computed(() => currentWork.value),

    // Métodos
    generateWithAI,
    downloadPDF,
    clear,
  }
}

/**
 * Construye el prompt del usuario basado en los parámetros del maestro
 */
function buildUserPrompt(request: GenerateCollaborativeWorkDTO): string {
  let prompt = `Genera un plan de trabajo colaborativo con las siguientes especificaciones:

Maestro: ${request.teacherName}
Escuela: ${request.school}
Tema: ${request.topic}
Materia: ${request.subject}
Nivel educativo: ${request.gradeLevel}`

  if (request.numberOfStudents) {
    prompt += `\nNúmero aproximado de estudiantes: ${request.numberOfStudents}`
  }

  if (request.duration) {
    prompt += `\nDuración total deseada: ${request.duration} minutos`
  }

  if (request.additionalRequirements) {
    prompt += `\nRequerimientos adicionales: ${request.additionalRequirements}`
  }

  prompt +=
    '\n\nGenera un plan completo que fomente la colaboración, comunicación y trabajo en equipo.'

  return prompt
}

/**
 * Parsea la respuesta del modelo de IA
 */
function parseAIResponse(content: string): {
  objective: string
  topic: string
  activities: CollaborativeWork['activities']
} {
  // Limpiar la respuesta de posibles bloques de código
  let cleaned = content.trim()

  // Remover bloques de código si existen
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '')
  }

  // Intentar parsear el JSON
  try {
    const parsed = JSON.parse(cleaned)
    return parsed
  } catch {
    console.error('Error al parsear respuesta:', cleaned)
    throw new Error('La respuesta del modelo no tiene formato JSON válido')
  }
}
