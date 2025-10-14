import { ref } from 'vue'
import axios from 'axios'
import type { FullPlanning, GeneratePlanningDTO } from '@/domain/entities/FullPlanning'
import { API_URLS } from '@/config/prompts'

/**
 * Composable para generar una planeación didáctica completa con IA
 * Genera parciales (6 actividades), ordinarios (4) y extraordinarios (4)
 *
 * @example
 * ```ts
 * const { generateFullPlanning, isGenerating } = usePlanningGeneration()
 *
 * const planning = await generateFullPlanning({
 *   profesor: 'Ing. Juan Pérez',
 *   asignatura: 'Programación OO',
 *   carrera: 'TSU Desarrollo SW',
 *   division: 'DAIS',
 *   grupo: '4A',
 *   fecha: '2025-10-12',
 *   styleProfile: { ... } // opcional
 * })
 * ```
 */
export function usePlanningGeneration() {
  const isGenerating = ref(false)
  const generationError = ref<string | null>(null)
  const generatedPlanning = ref<FullPlanning | null>(null)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  /**
   * Prompt para generar planeación completa
   */
  const getGenerationPrompt = (data: GeneratePlanningDTO): string => {
    const styleSection = data.styleProfile
      ? `
ESTILO DE REDACCIÓN DEL PROFESOR:
Imita este estilo en todas las actividades generadas:
- Tono: ${data.styleProfile.tono}
- Expresiones típicas: ${data.styleProfile.expresiones.join(', ')}
- Estructura preferida: ${data.styleProfile.estructura}
- Vocabulario técnico: ${data.styleProfile.vocabulario.join(', ')}
- Estilo general: ${data.styleProfile.estilo}
`
      : ''

    return `Eres un experto en diseño instruccional para educación superior.

Genera una planeación didáctica COMPLETA en formato JSON válido.

INFORMACIÓN DEL CURSO:
- Profesor: ${data.profesor}
- Asignatura: ${data.asignatura}
- Carrera: ${data.carrera}
- División: ${data.division}
- Grupo: ${data.grupo}
- Fecha: ${data.fecha}
${styleSection}

ESTRUCTURA JSON REQUERIDA:
{
  "parciales": [
    {
      "number": 1,
      "activities": [
        {
          "activity": "1",
          "type": "investigacion",
          "name": "I.E.1 TRABAJO DE INVESTIGACIÓN (SABER)",
          "content": "INSTRUCCIONES DETALLADAS (mínimo 200 palabras):\\n\\n1. La actividad deberá realizarse...\\n\\nREQUISITOS DE FONDO:\\n...\\n\\nREQUISITOS DE FORMA:\\n...",
          "percentage": 15
        },
        {
          "activity": "2",
          "type": "proyecto",
          "name": "I.E.1 PROYECTO (SABER HACER)",
          "content": "INSTRUCCIONES DETALLADAS (mínimo 200 palabras)...",
          "percentage": 20
        }
      ]
    },
    {
      "number": 2,
      "activities": [ /* 2 actividades similares */ ]
    },
    {
      "number": 3,
      "activities": [ /* 2 actividades similares */ ]
    }
  ],
  "ordinarios": [
    {
      "number": 1,
      "name": "ORDINARIO 1",
      "activities": [
        {
          "activity": "1",
          "type": "prueba_clave",
          "name": "PRUEBA CLAVE (SABER)",
          "content": "INSTRUCCIONES DETALLADAS...",
          "percentage": 40
        }
      ]
    },
    {
      "number": 2,
      "name": "ORDINARIO 2",
      "activities": [ /* 1 actividad */ ]
    },
    {
      "number": 3,
      "name": "ORDINARIO 3",
      "activities": [ /* 1 actividad */ ]
    },
    {
      "number": 4,
      "name": "ORDINARIO GLOBAL",
      "activities": [ /* 1 actividad */ ]
    }
  ],
  "extraordinarios": [
    {
      "number": 1,
      "name": "EXTRAORDINARIO 1",
      "activities": [
        {
          "activity": "1",
          "type": "ensayo",
          "name": "ENSAYO/INFORME (SABER)",
          "content": "INSTRUCCIONES DETALLADAS...",
          "percentage": 50
        }
      ]
    },
    {
      "number": 2,
      "name": "EXTRAORDINARIO 2",
      "activities": [ /* 1 actividad */ ]
    },
    {
      "number": 3,
      "name": "EXTRAORDINARIO 3",
      "activities": [ /* 1 actividad */ ]
    },
    {
      "number": 4,
      "name": "EXTRAORDINARIO 4",
      "activities": [ /* 1 actividad */ ]
    }
  ]
}

REQUISITOS CRÍTICOS:
1. Devuelve SOLO el JSON, sin comentarios ni bloques de código
2. Cada actividad debe tener contenido extenso (200-800 palabras)
3. Incluir en cada actividad:
   - Instrucciones numeradas paso a paso
   - Requisitos de fondo (contenido, investigación, etc.)
   - Requisitos de forma (formato, tipografía, márgenes, etc.)
   - Criterios de evaluación
4. Los parciales siempre tienen 2 actividades cada uno (total 6)
5. Los ordinarios tienen 1 actividad cada uno (total 4)
6. Los extraordinarios tienen 1 actividad cada uno (total 4)
7. Usa vocabulario académico profesional
8. Instrucciones claras y ejecutables
9. No uses comillas triples ni marcadores de código

NO generes nada fuera del JSON.`
  }

  /**
   * Valida la estructura de la planeación generada
   */
  const validateFullPlanning = (data: unknown): data is FullPlanning => {
    if (!data || typeof data !== 'object') return false

    const p = data as Record<string, unknown>

    // Validar parciales
    if (!Array.isArray(p.parciales) || p.parciales.length !== 3) return false

    // Validar ordinarios
    if (!Array.isArray(p.ordinarios) || p.ordinarios.length !== 4) return false

    // Validar extraordinarios
    if (!Array.isArray(p.extraordinarios) || p.extraordinarios.length !== 4) return false

    // Validar que cada parcial tenga 2 actividades
    for (const parcial of p.parciales) {
      if (!Array.isArray(parcial.activities) || parcial.activities.length !== 2) {
        return false
      }
    }

    return true
  }

  /**
   * Genera una planeación didáctica completa
   * @param data Datos del curso y estilo opcional
   * @returns Planeación completa o null si hay error
   */
  const generateFullPlanning = async (data: GeneratePlanningDTO): Promise<FullPlanning | null> => {
    isGenerating.value = true
    generationError.value = null
    generatedPlanning.value = null

    try {
      console.log('[PlanningGeneration] Generando planeación completa...')

      // 1. Validar datos de entrada
      if (!data.profesor || !data.asignatura || !data.carrera) {
        throw new Error('Faltan datos obligatorios del curso')
      }

      // 2. Construir prompt
      const prompt = getGenerationPrompt(data)

      // 3. Llamar a Groq
      console.log('[PlanningGeneration] Enviando a IA...')

      const response = await axios.post(
        API_URLS.groq,
        {
          model: import.meta.env.VITE_GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content:
                'Eres un experto en diseño instruccional. Respondes únicamente con JSON válido, sin comentarios ni bloques de código.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 60000, // 60 segundos para generación completa
        }
      )

      const aiResponse = response.data.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error('La IA no devolvió ninguna respuesta')
      }

      // 4. Parsear respuesta
      console.log('[PlanningGeneration] Parseando respuesta...')
      let planningData: FullPlanning

      try {
        // Limpiar respuesta
        let cleanResponse = aiResponse.trim()
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()
        }

        const parsed = JSON.parse(cleanResponse)

        // Agregar información del curso
        planningData = {
          courseInfo: {
            profesor: data.profesor,
            asignatura: data.asignatura,
            carrera: data.carrera,
            division: data.division,
            grupo: data.grupo,
            fecha: data.fecha,
          },
          parciales: parsed.parciales,
          ordinarios: parsed.ordinarios,
          extraordinarios: parsed.extraordinarios,
          generatedAt: new Date().toISOString(),
        }
      } catch (parseError) {
        console.error('[PlanningGeneration] Error al parsear JSON:', parseError)
        console.error('[PlanningGeneration] Respuesta recibida:', aiResponse.substring(0, 500))
        throw new Error('La IA no devolvió un JSON válido')
      }

      // 5. Validar estructura
      if (!validateFullPlanning(planningData)) {
        throw new Error(
          'La planeación generada no tiene la estructura correcta (debe tener 3 parciales, 4 ordinarios, 4 extraordinarios)'
        )
      }

      console.log('[PlanningGeneration] ✅ Planeación generada exitosamente')
      console.log(
        `- ${planningData.parciales.length} parciales (${planningData.parciales.reduce((sum, p) => sum + p.activities.length, 0)} actividades)`
      )
      console.log(`- ${planningData.ordinarios.length} ordinarios`)
      console.log(`- ${planningData.extraordinarios.length} extraordinarios`)

      generatedPlanning.value = planningData
      return planningData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('[PlanningGeneration] ❌ Error:', error)
      generationError.value = errorMessage
      return null
    } finally {
      isGenerating.value = false
    }
  }

  return {
    /** Función para generar planeación completa */
    generateFullPlanning,

    /** Indica si está generando */
    isGenerating,

    /** Mensaje de error si falla la generación */
    generationError,

    /** Última planeación generada */
    generatedPlanning,
  }
}
