import type { Language } from '@/utils/enums/Language'

/**
 * Respuesta esperada del modelo de IA para talleres colaborativos
 */
export interface AIWorkshopResponse {
  start: WorkshopSection
  development: WorkshopSection
  closure: WorkshopSection
  evaluation: WorkshopSection
}

/**
 * Sección individual del taller
 */
export interface WorkshopSection {
  activity: string
  materials: string[]
  timeMinutes: number
}

/**
 * Entidad principal del trabajo colaborativo generado
 */
export interface CollaborativeWork {
  id: string
  teacherName: string
  workshopName: string
  objective: string
  duration: number
  start: WorkshopSection
  development: WorkshopSection
  closure: WorkshopSection
  evaluation: WorkshopSection
  createdAt: Date
}

/**
 * DTO para solicitar generación de trabajo colaborativo al modelo de IA
 */
export interface GenerateCollaborativeWorkDTO {
  teacherName: string
  workshopName: string
  objective: string
  duration: number
  language?: Language
}
