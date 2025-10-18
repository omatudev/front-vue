/**
 * Configuración central de la aplicación
 *
 * Este archivo centraliza toda la configuración del sistema,
 * leyendo variables de entorno y proporcionando valores por defecto.
 *
 * Las variables de entorno deben estar definidas en .env
 * Ver .env.example para todas las opciones disponibles.
 */

/**
 * Obtener variable de entorno de Vite con valor por defecto
 */
function getEnv(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue
}

/**
 * Obtener variable de entorno como número
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key]
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Obtener variable de entorno como boolean
 */
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key]
  if (value === undefined || value === null) return defaultValue
  return value === 'true' || value === '1' || value === 'yes'
}

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
  name: 'Sistema de Planeaciones Académicas',
  version: '1.0.0',
  debug: getEnvBoolean('VITE_DEBUG', false),
  verboseLogs: false,
} as const

/**
 * Configuración de la API base
 */
export const API_CONFIG = {
  baseUrl: getEnv('VITE_API_BASE_URL', 'https://api.omatu.dev'),
  timeout: getEnvNumber('VITE_API_TIMEOUT', 10000),
} as const

/**
 * Configuración de Groq API (IA)
 *
 * Modelo actual: llama-3.3-70b-versatile
 * Actualizado: Octubre 17, 2025
 *
 * Razones del cambio desde meta-llama/llama-4-scout-17b-16e-instruct:
 * - Mejor capacidad de razonamiento y creatividad para generación de actividades
 * - Context window de 131K tokens
 * - Max completion tokens: 32,768
 * - Especializado en tareas de generación estructurada
 *
 * Límites de la API:
 * - 12K TPM (tokens por minuto)
 * - 100K TPD (tokens por día)
 */
export const GROQ_CONFIG = {
  apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
  apiKey: getEnv('VITE_GROQ_API_KEY', ''),
  model: 'llama-3.3-70b-versatile',
  maxTokens: 32768,
  temperature: 0.7,
  timeout: 60000,
} as const

/**
 * Configuración consolidada (exportación principal)
 */
export const CONFIG = {
  app: APP_CONFIG,
  api: API_CONFIG,
  groq: GROQ_CONFIG,
} as const

/**
 * Type helper para acceder a la configuración
 */
export type AppConfig = typeof CONFIG

/**
 * Validar que la configuración esté correcta
 * Lanza error si falta configuración crítica
 */
export function validateConfig(): void {
  const errors: string[] = []

  // Validar API key de Groq
  if (!GROQ_CONFIG.apiKey || GROQ_CONFIG.apiKey === 'gsk_your_api_key_here') {
    errors.push(
      'VITE_GROQ_API_KEY no está configurada. Obtén tu API key en https://console.groq.com/keys'
    )
  }

  // Validar URL de Groq
  if (!GROQ_CONFIG.apiUrl) {
    errors.push('VITE_GROQ_API_URL no está configurada')
  }

  // Si hay errores críticos, lanzar excepción
  if (errors.length > 0) {
    const errorMessage = `Errores de configuración:\n${errors.join('\n')}`

    if (APP_CONFIG.debug) {
      console.error(errorMessage)
    }

    throw new Error(errorMessage)
  }
}

/**
 * Log de configuración (solo en modo debug)
 */
export function logConfig(): void {
  if (!APP_CONFIG.debug && !APP_CONFIG.verboseLogs) {
    return
  }

  console.group('📋 Configuración del Sistema')
  console.log('App:', APP_CONFIG)
  console.log('API:', API_CONFIG)
  console.log('Groq:', {
    ...GROQ_CONFIG,
    apiKey: GROQ_CONFIG.apiKey ? '***' + GROQ_CONFIG.apiKey.slice(-4) : 'NO CONFIGURADA',
  })
  console.groupEnd()
}

/**
 * Inicializar configuración
 * Llamar al inicio de la aplicación (main.ts)
 */
export function initConfig(): void {
  try {
    validateConfig()
    logConfig()

    if (APP_CONFIG.debug) {
      console.log('✅ Configuración inicializada correctamente')
    }
  } catch (error) {
    console.error('❌ Error al inicializar configuración:', error)
    throw error
  }
}

// Export default para importación simplificada
export default CONFIG
