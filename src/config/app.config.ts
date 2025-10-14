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
  name: getEnv('VITE_APP_NAME', 'Sistema de Planeaciones Académicas'),
  version: getEnv('VITE_APP_VERSION', '1.0.0'),
  debug: getEnvBoolean('VITE_DEBUG', false),
  verboseLogs: getEnvBoolean('VITE_VERBOSE_LOGS', false),
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
 * Modelo actual: meta-llama/llama-4-scout-17b-16e-instruct
 * Actualizado: Octubre 12, 2025
 *
 * Razones del cambio desde llama-3.3-70b-versatile:
 * - 30K TPM vs 12K TPM (2.5x más capacidad de procesamiento)
 * - 500K TPD vs 100K TPD (5x más tokens diarios)
 * - Llama 4 con mejor razonamiento que Llama 3.3
 * - Especializado en seguir instrucciones (ideal para generación estructurada)
 * - Arquitectura MoE con 16 expertos (eficiente y preciso)
 *
 * Límites de la API:
 * - 30 requests por minuto
 * - 1,000 requests por día
 * - 30,000 tokens por minuto
 * - 500,000 tokens por día
 */
export const GROQ_CONFIG = {
  apiUrl: getEnv('VITE_GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions'),
  apiKey: getEnv('VITE_GROQ_API_KEY', ''),
  model: getEnv('VITE_GROQ_MODEL', 'meta-llama/llama-4-scout-17b-16e-instruct'),
  maxTokens: getEnvNumber('VITE_GROQ_MAX_TOKENS', 8000),
  temperature: parseFloat(getEnv('VITE_GROQ_TEMPERATURE', '0.7')),
  timeout: getEnvNumber('VITE_GROQ_REQUEST_TIMEOUT', 60000),
} as const

/**
 * Configuración de procesamiento de documentos
 */
export const DOCUMENT_CONFIG = {
  // Tamaño máximo de archivo en bytes (10MB por defecto)
  maxFileSize: getEnvNumber('VITE_MAX_FILE_SIZE', 10 * 1024 * 1024),

  // Extensiones permitidas
  allowedExtensions: ['.docx', '.DOCX'],

  // MIME types permitidos
  allowedMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],

  // Longitud mínima de texto extraído (caracteres)
  minTextLength: getEnvNumber('VITE_MIN_TEXT_LENGTH', 100),
} as const

/**
 * Configuración de planeaciones
 */
export const PLANNING_CONFIG = {
  // Número esperado de actividades a generar
  expectedActivitiesCount: getEnvNumber('VITE_EXPECTED_ACTIVITIES_COUNT', 6),

  // Longitud mínima de contenido por actividad
  minActivityContentLength: getEnvNumber('VITE_MIN_ACTIVITY_CONTENT_LENGTH', 50),

  // Distribución esperada de actividades
  expectedDistribution: {
    parcial: 6,
    ordinario: 1,
    extraordinario: 1,
  },

  // Actividades por período parcial
  activitiesPerPeriod: 2,
} as const

/**
 * Configuración de IA
 */
export const AI_CONFIG = {
  // Habilitar lógica de reintentos
  enableRetry: getEnvBoolean('VITE_ENABLE_AI_RETRY', true),

  // Máximo número de reintentos
  maxRetries: getEnvNumber('VITE_AI_MAX_RETRIES', 2),

  // Timeout para generación de IA
  timeout: getEnvNumber('VITE_AI_GENERATION_TIMEOUT', 60000),
} as const

/**
 * Configuración de PDF
 */
export const PDF_CONFIG = {
  // Habilitar preview de PDF
  enablePreview: getEnvBoolean('VITE_ENABLE_PDF_PREVIEW', true),

  // Formato de nombre de archivo
  filenameFormat: 'Planeacion_{subject}_{group}_{date}.pdf',

  // Configuración de página
  pageSize: 'letter' as const,
  pageOrientation: 'portrait' as const,
  pageMargins: [40, 60, 40, 60] as [number, number, number, number],
} as const

/**
 * Configuración de localStorage
 */
export const STORAGE_CONFIG = {
  // Habilitar persistencia en localStorage
  enabled: getEnvBoolean('VITE_ENABLE_LOCAL_STORAGE', true),

  // Key para almacenar datos
  storageKey: 'planning-store-data',

  // Habilitar compresión (futuro)
  enableCompression: false,
} as const

/**
 * Validaciones
 */
export const VALIDATION_CONFIG = {
  // Información general
  generalInfo: {
    minSubjectLength: 3,
    minProfessorLength: 3,
    minGroupLength: 1,
  },

  // Actividades
  activities: {
    minNameLength: 1,
    minContentLength: 50,
    maxNameLength: 200,
    maxContentLength: 5000,
  },

  // Texto extraído
  text: {
    minLength: 100,
    maxLength: 50000,
  },
} as const

/**
 * Configuración de timeouts
 */
export const TIMEOUT_CONFIG = {
  // Timeout general para operaciones
  default: 10000,

  // Timeout para extracción de documentos
  documentExtraction: 30000,

  // Timeout para generación de IA
  aiGeneration: 60000,

  // Timeout para generación de PDF
  pdfGeneration: 20000,

  // Timeout para operaciones CRUD
  crud: 5000,
} as const

/**
 * Logos institucionales (rutas)
 */
export const LOGOS_CONFIG = {
  utc: {
    path: 'src/assets/imgBase64/utcLogo.ts',
    name: 'Universidad Tecnológica de Chihuahua',
  },
  utm: {
    path: 'src/assets/imgBase64/utmLogo.ts',
    name: 'Universidad Tecnológica de la Tarahumara',
  },
} as const

/**
 * Configuración consolidada (exportación principal)
 */
export const CONFIG = {
  app: APP_CONFIG,
  api: API_CONFIG,
  groq: GROQ_CONFIG,
  document: DOCUMENT_CONFIG,
  planning: PLANNING_CONFIG,
  ai: AI_CONFIG,
  pdf: PDF_CONFIG,
  storage: STORAGE_CONFIG,
  validation: VALIDATION_CONFIG,
  timeout: TIMEOUT_CONFIG,
  logos: LOGOS_CONFIG,
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

  // Validar configuración de documentos
  if (DOCUMENT_CONFIG.maxFileSize <= 0) {
    errors.push('VITE_MAX_FILE_SIZE debe ser mayor a 0')
  }

  if (DOCUMENT_CONFIG.minTextLength <= 0) {
    errors.push('VITE_MIN_TEXT_LENGTH debe ser mayor a 0')
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
  console.log('Documentos:', DOCUMENT_CONFIG)
  console.log('Planeaciones:', PLANNING_CONFIG)
  console.log('IA:', AI_CONFIG)
  console.log('PDF:', PDF_CONFIG)
  console.log('Storage:', STORAGE_CONFIG)
  console.log('Validaciones:', VALIDATION_CONFIG)
  console.log('Timeouts:', TIMEOUT_CONFIG)
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
