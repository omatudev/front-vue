/**
 * Actividad individual dentro de una planeación
 */
export interface ActivityFull {
  /** Número de actividad */
  activity: string

  /** Tipo de actividad */
  type: string

  /** Nombre completo de la actividad */
  name: string

  /** Contenido detallado con instrucciones */
  content: string

  /** Porcentaje de evaluación (opcional) */
  percentage?: number

  /** Fecha de entrega (opcional) */
  deliveryDate?: string
}

/**
 * Parcial con sus 2 actividades
 */
export interface Parcial {
  /** Número de parcial (1, 2, 3) */
  number: number

  /** Lista de actividades del parcial (2) */
  activities: ActivityFull[]
}

/**
 * Ordinario con sus actividades
 */
export interface Ordinario {
  /** Número de ordinario */
  number: number

  /** Nombre del ordinario */
  name: string

  /** Lista de actividades */
  activities: ActivityFull[]
}

/**
 * Extraordinario con sus actividades
 */
export interface Extraordinario {
  /** Número de extraordinario */
  number: number

  /** Nombre del extraordinario */
  name: string

  /** Lista de actividades */
  activities: ActivityFull[]
}

/**
 * Información general del curso
 */
export interface CourseInfo {
  /** Nombre completo del profesor */
  profesor: string

  /** Nombre de la asignatura */
  asignatura: string

  /** Carrera */
  carrera: string

  /** División académica */
  division: string

  /** Grupo */
  grupo: string

  /** Fecha de aplicación (YYYY-MM-DD) */
  fecha: string
}

/**
 * Planeación didáctica completa
 * Incluye parciales, ordinarios y extraordinarios
 */
export interface FullPlanning {
  /** Información general del curso */
  courseInfo: CourseInfo

  /** 3 parciales con 2 actividades cada uno (6 total) */
  parciales: Parcial[]

  /** Ordinarios (4 actividades) */
  ordinarios: Ordinario[]

  /** Extraordinarios (4 actividades) */
  extraordinarios: Extraordinario[]

  /** Fecha de generación */
  generatedAt?: string
}

/**
 * DTO para generar planeación completa
 */
export interface GeneratePlanningDTO extends CourseInfo {
  /** Perfil de estilo opcional */
  styleProfile?: {
    tono: string
    expresiones: string[]
    estructura: string
    vocabulario: string[]
    estilo: string
  } | null
}
