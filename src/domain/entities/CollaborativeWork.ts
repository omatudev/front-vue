/**
 * Entidad que representa un Trabajo Colaborativo educativo
 */
export interface CollaborativeWork {
  id: string
  objective: string
  topic: string
  teacherName: string
  activities: {
    start: ActivitySection
    development: ActivitySection
    final: ActivitySection
    evaluation: ActivitySection
  }
  createdAt: Date
}

/**
 * Sección de actividad del trabajo colaborativo
 */
export interface ActivitySection {
  description: string
  materials: string[]
  timeMinutes: number
}

/**
 * DTO para solicitar generación de trabajo colaborativo al modelo de IA
 * El maestro llena estos datos básicos y la IA genera el contenido completo
 */
export interface GenerateCollaborativeWorkDTO {
  teacherName: string
  school: string
  topic: string
  subject: string
  gradeLevel: string
  numberOfStudents?: number
  duration?: number
  additionalRequirements?: string
}
