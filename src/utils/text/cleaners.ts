/**
 * Limpiar texto extraído de archivos DOCX
 *
 * Elimina:
 * - Espacios múltiples
 * - Saltos de línea excesivos
 * - Caracteres de control invisibles
 * - Espacios al inicio y final
 *
 * @param text - Texto a limpiar
 * @returns Texto limpio y normalizado
 */
export function cleanDocxText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return (
    text
      // Eliminar caracteres de control invisibles (excepto \n y \t)
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

      // Normalizar saltos de línea (Windows \r\n → Unix \n)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')

      // Eliminar más de 3 saltos de línea consecutivos
      .replace(/\n{4,}/g, '\n\n\n')

      // Reemplazar tabs por espacios
      .replace(/\t/g, '  ')

      // Eliminar espacios al final de cada línea
      .replace(/[ \t]+$/gm, '')

      // Reemplazar múltiples espacios por uno solo
      .replace(/  +/g, ' ')

      // Eliminar espacios antes de puntuación
      .replace(/\s+([.,;:!?])/g, '$1')

      // Eliminar espacios al inicio y final del texto completo
      .trim()
  )
}

/**
 * Truncar texto a longitud máxima
 *
 * Intenta truncar en un espacio para no cortar palabras a la mitad
 *
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima (incluyendo '...')
 * @param suffix - Sufijo a agregar (default: '...')
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) {
    return text
  }

  // Ajustar longitud máxima para incluir el sufijo
  const targetLength = maxLength - suffix.length

  if (targetLength <= 0) {
    return suffix
  }

  // Truncar
  let truncated = text.substring(0, targetLength)

  // Intentar encontrar el último espacio para no cortar palabras
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > targetLength * 0.8) {
    // Solo truncar en espacio si está cerca del final (80% o más)
    truncated = truncated.substring(0, lastSpace)
  }

  return truncated.trim() + suffix
}

/**
 * Extraer las primeras N palabras de un texto
 *
 * @param text - Texto origen
 * @param wordCount - Número de palabras a extraer
 * @returns Texto con N palabras
 */
export function extractWords(text: string, wordCount: number): string {
  if (!text) return ''

  const words = text.trim().split(/\s+/)

  if (words.length <= wordCount) {
    return text
  }

  return words.slice(0, wordCount).join(' ') + '...'
}

/**
 * Contar palabras en un texto
 *
 * @param text - Texto a analizar
 * @returns Número de palabras
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0
  }

  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

/**
 * Contar líneas en un texto
 *
 * @param text - Texto a analizar
 * @returns Número de líneas
 */
export function countLines(text: string): number {
  if (!text) return 0

  return text.split('\n').length
}

/**
 * Extraer primer párrafo de un texto
 *
 * @param text - Texto completo
 * @returns Primer párrafo
 */
export function extractFirstParagraph(text: string): string {
  if (!text) return ''

  const paragraphs = text.split(/\n\n+/)
  return paragraphs[0]?.trim() || ''
}

/**
 * Dividir texto en párrafos
 *
 * @param text - Texto completo
 * @returns Array de párrafos
 */
export function splitIntoParagraphs(text: string): string[] {
  if (!text) return []

  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

/**
 * Normalizar espaciado de texto
 *
 * Asegura espaciado consistente entre oraciones y párrafos
 *
 * @param text - Texto a normalizar
 * @returns Texto normalizado
 */
export function normalizeSpacing(text: string): string {
  if (!text) return ''

  return text
    .split(/\n\n+/)
    .map((paragraph) =>
      paragraph
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(' ')
    )
    .filter((paragraph) => paragraph.length > 0)
    .join('\n\n')
}

/**
 * Resaltar palabras clave en texto
 *
 * Envuelve palabras clave con tags (útil para mostrar en HTML)
 *
 * @param text - Texto completo
 * @param keywords - Palabras clave a resaltar
 * @param tag - Tag HTML a usar (default: 'mark')
 * @returns Texto con palabras resaltadas
 */
export function highlightKeywords(text: string, keywords: string[], tag: string = 'mark'): string {
  if (!text || keywords.length === 0) {
    return text
  }

  let result = text

  keywords.forEach((keyword) => {
    // Escapar caracteres especiales de regex
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Reemplazar solo si no está ya dentro de un tag
    const regex = new RegExp(`(?<!<${tag}>)(${escapedKeyword})(?!</${tag}>)`, 'gi')
    result = result.replace(regex, `<${tag}>$1</${tag}>`)
  })

  return result
}

/**
 * Remover tags HTML de texto
 *
 * @param text - Texto con HTML
 * @returns Texto plano sin tags
 */
export function stripHtmlTags(text: string): string {
  if (!text) return ''

  return text.replace(/<[^>]*>/g, '')
}

/**
 * Convertir texto a slug (URL-friendly)
 *
 * @param text - Texto a convertir
 * @returns Slug
 *
 * @example
 * toSlug('Programación Orientada a Objetos') // "programacion-orientada-a-objetos"
 */
export function toSlug(text: string): string {
  if (!text) return ''

  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios → guiones
    .replace(/-+/g, '-') // Múltiples guiones → uno solo
    .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio/final
}

/**
 * Calcular tiempo estimado de lectura
 *
 * Asume velocidad promedio de lectura de 200 palabras por minuto
 *
 * @param text - Texto a analizar
 * @param wpm - Palabras por minuto (default: 200)
 * @returns Tiempo en minutos
 */
export function estimateReadingTime(text: string, wpm: number = 200): number {
  const words = countWords(text)
  return Math.ceil(words / wpm)
}

/**
 * Formatear tiempo de lectura para mostrar
 *
 * @param minutes - Minutos de lectura
 * @returns Texto formateado
 *
 * @example
 * formatReadingTime(1) // "1 minuto"
 * formatReadingTime(5) // "5 minutos"
 * formatReadingTime(0) // "< 1 minuto"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 minuto'
  }

  return `${minutes} minuto${minutes !== 1 ? 's' : ''}`
}

/**
 * Validar que el texto tenga longitud suficiente
 *
 * @param text - Texto a validar
 * @param minLength - Longitud mínima en caracteres
 * @returns true si es válido
 */
export function hasMinimumLength(text: string, minLength: number): boolean {
  if (!text) return false
  return text.trim().length >= minLength
}

/**
 * Obtener estadísticas de texto
 *
 * @param text - Texto a analizar
 * @returns Objeto con estadísticas
 */
export function getTextStats(text: string): {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  paragraphs: number
  readingTimeMinutes: number
} {
  const clean = text || ''

  return {
    characters: clean.length,
    charactersNoSpaces: clean.replace(/\s/g, '').length,
    words: countWords(clean),
    lines: countLines(clean),
    paragraphs: splitIntoParagraphs(clean).length,
    readingTimeMinutes: estimateReadingTime(clean),
  }
}
