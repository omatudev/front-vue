import { ref } from 'vue'
import mammoth from 'mammoth'
import axios from 'axios'
import type { StyleProfile } from '@/domain/entities/StyleProfile'
import { cleanDocxText } from '@/utils/text/cleaners'
import { API_URLS } from '@/config/prompts'

/**
 * Composable para analizar el estilo de redacción de un profesor
 * a partir de un documento DOCX previo
 *
 * @example
 * ```ts
 * const { analyzeStyle, isAnalyzing, analysisError } = useStyleAnalysis()
 *
 * const profile = await analyzeStyle(file)
 * if (profile) {
 *   console.log('Tono:', profile.tono)
 *   console.log('Expresiones:', profile.expresiones)
 * }
 * ```
 */
export function useStyleAnalysis() {
  const isAnalyzing = ref(false)
  const analysisError = ref<string | null>(null)
  const styleProfile = ref<StyleProfile | null>(null)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  /**
   * Prompt para análisis de estilo
   */
  const getStyleAnalysisPrompt = (text: string): string => {
    return `Eres un experto en análisis lingüístico y pedagógico.

Analiza el siguiente texto escrito por un profesor universitario y extrae características de su estilo de redacción.

INSTRUCCIONES:
1. Identifica el tono general (formal, informal, técnico, coloquial, etc.)
2. Lista las expresiones características que usa frecuentemente
3. Determina su estructura preferida (numerada, con viñetas, párrafos extensos, concisa, etc.)
4. Identifica el vocabulario técnico y términos académicos que prefiere
5. Define su estilo general (imperativo, descriptivo, narrativo, con ejemplos, con referencias, etc.)

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "tono": "descripción del tono",
  "expresiones": ["expresión 1", "expresión 2", "expresión 3"],
  "estructura": "descripción de la estructura",
  "vocabulario": ["término 1", "término 2", "término 3"],
  "estilo": "descripción del estilo"
}

IMPORTANTE: 
- NO generes comentarios fuera del JSON
- NO uses bloques de código con \`\`\`
- Solo devuelve el objeto JSON válido

TEXTO DEL PROFESOR:
${text}`
  }

  /**
   * Extrae texto de un archivo DOCX
   * @param file Archivo DOCX
   * @returns Texto limpio extraído
   */
  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const cleanText = cleanDocxText(result.value)

      if (cleanText.length < 100) {
        throw new Error(
          'El documento es demasiado corto para analizar el estilo (mínimo 100 caracteres)'
        )
      }

      return cleanText
    } catch (error) {
      console.error('Error al extraer texto del DOCX:', error)
      throw error
    }
  }

  /**
   * Valida que la respuesta de IA tenga el formato correcto
   */
  const validateStyleProfile = (profile: unknown): profile is StyleProfile => {
    if (!profile || typeof profile !== 'object') return false

    const p = profile as Record<string, unknown>
    const hasRequiredFields =
      typeof p.tono === 'string' &&
      Array.isArray(p.expresiones) &&
      typeof p.estructura === 'string' &&
      Array.isArray(p.vocabulario) &&
      typeof p.estilo === 'string'

    return hasRequiredFields
  }

  /**
   * Analiza el estilo de redacción de un documento
   * @param file Archivo DOCX con planeación anterior del profesor
   * @returns Perfil de estilo o null si hay error
   */
  const analyzeStyle = async (file: File): Promise<StyleProfile | null> => {
    isAnalyzing.value = true
    analysisError.value = null
    styleProfile.value = null

    try {
      // 1. Extraer texto del DOCX
      console.log('[StyleAnalysis] Extrayendo texto del documento...')
      const text = await extractTextFromDocx(file)

      // 2. Truncar si es muy largo (máximo 3000 caracteres para análisis)
      const textToAnalyze = text.length > 3000 ? text.substring(0, 3000) + '...' : text

      // 3. Generar prompt
      const prompt = getStyleAnalysisPrompt(textToAnalyze)

      // 4. Llamar a Groq para análisis
      console.log('[StyleAnalysis] Enviando a IA para análisis de estilo...')

      const response = await axios.post(
        API_URLS.groq,
        {
          model: import.meta.env.VITE_GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content:
                'Eres un experto en análisis lingüístico. Respondes únicamente con JSON válido.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3, // Baja temperatura para análisis más preciso
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )

      const aiResponse = response.data.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error('La IA no devolvió ninguna respuesta')
      }

      // 5. Parsear respuesta
      console.log('[StyleAnalysis] Parseando respuesta de IA...')
      let profileData: StyleProfile

      try {
        // Limpiar respuesta por si viene con bloques de código
        let cleanResponse = aiResponse.trim()
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()
        }

        profileData = JSON.parse(cleanResponse)
      } catch (parseError) {
        console.error('[StyleAnalysis] Error al parsear JSON:', parseError)
        throw new Error('La IA no devolvió un JSON válido')
      }

      // 6. Validar estructura
      if (!validateStyleProfile(profileData)) {
        throw new Error('El perfil de estilo no tiene la estructura correcta')
      }

      console.log('[StyleAnalysis] ✅ Análisis de estilo completado')
      styleProfile.value = profileData
      return profileData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('[StyleAnalysis] ❌ Error:', error)
      analysisError.value = errorMessage
      return null
    } finally {
      isAnalyzing.value = false
    }
  }

  return {
    /** Función para analizar el estilo de un documento */
    analyzeStyle,

    /** Indica si está analizando */
    isAnalyzing,

    /** Mensaje de error si falla el análisis */
    analysisError,

    /** Último perfil de estilo analizado */
    styleProfile,
  }
}
