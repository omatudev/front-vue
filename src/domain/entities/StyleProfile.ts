/**
 * Perfil de estilo de redacción del profesor
 * Obtenido del análisis de un documento previo
 */
export interface StyleProfile {
  /** Tono general de redacción (formal, informal, técnico, coloquial) */
  tono: string

  /** Expresiones características que usa frecuentemente */
  expresiones: string[]

  /** Tipo de estructura en sus instrucciones (detallada, concisa, numerada) */
  estructura: string

  /** Vocabulario técnico que prefiere usar */
  vocabulario: string[]

  /** Estilo de redacción general (imperativo, descriptivo, con ejemplos) */
  estilo: string
}

/**
 * DTO para el análisis de estilo
 */
export interface StyleAnalysisDTO {
  /** Texto extraído del documento */
  text: string

  /** Propósito del análisis */
  purpose?: string
}
