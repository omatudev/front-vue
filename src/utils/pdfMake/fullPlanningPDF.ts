import pdfMake from '@/utils/pdfMake/PdfWrapper'
import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces'
import type { FullPlanning, ActivityFull } from '@/domain/entities/FullPlanning'
import { utcLogo } from '@/assets/images/utcLogo'

function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString)
  if (format === 'long') {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export async function generateFullPlanningPDF(planning: FullPlanning): Promise<void> {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [40, 60, 40, 60],

    header: {
      margin: [40, 20, 40, 0],
      columns: [
        {
          image: utcLogo,
          width: 50,
        },
        {
          text: 'PLANEACIÓN DIDÁCTICA',
          style: 'headerTitle',
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
        {
          text: '',
          width: 50,
        },
      ],
    },

    content: [
      buildGeneralInfo(planning),

      { text: '', margin: [0, 10] },

      buildParcialesSection(planning),

      buildOrdinariosSection(planning),

      buildExtraordinariosSection(planning),
    ],

    footer: (currentPage: number, pageCount: number) => {
      return {
        margin: [40, 10, 40, 0],
        columns: [
          {
            text: `Generado: ${formatDate(planning.generatedAt || new Date().toISOString(), 'long')}`,
            fontSize: 8,
            color: '#666',
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            fontSize: 8,
            color: '#666',
            alignment: 'right',
          },
        ],
      }
    },

    styles: {
      headerTitle: {
        fontSize: 16,
        bold: true,
        color: '#2c5282',
      },
      sectionTitle: {
        fontSize: 14,
        bold: true,
        color: '#2c5282',
        margin: [0, 15, 0, 10],
      },
      subsectionTitle: {
        fontSize: 12,
        bold: true,
        color: '#4a5568',
        margin: [0, 10, 0, 5],
      },
      activityName: {
        fontSize: 11,
        bold: true,
        color: '#2d3748',
        margin: [0, 8, 0, 4],
      },
      activityContent: {
        fontSize: 10,
        lineHeight: 1.4,
        alignment: 'justify',
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: '#ffffff',
        fillColor: '#2c5282',
      },
      tableCell: {
        fontSize: 10,
      },
    },

    defaultStyle: {
      font: 'Roboto',
    },
  }

  const filename = generateFilename(planning)
  const pdfMakeInstance = pdfMake as unknown as {
    createPdf: (docDef: TDocumentDefinitions) => { download: (name: string) => void }
  }
  pdfMakeInstance.createPdf(docDefinition).download(filename)
}

function buildGeneralInfo(planning: FullPlanning): Content {
  return {
    table: {
      widths: [120, '*'],
      body: [
        [
          { text: 'Profesor', style: 'tableHeader' },
          { text: planning.courseInfo.profesor, style: 'tableCell' },
        ],
        [
          { text: 'Asignatura', style: 'tableHeader' },
          { text: planning.courseInfo.asignatura, style: 'tableCell' },
        ],
        [
          { text: 'Carrera', style: 'tableHeader' },
          { text: planning.courseInfo.carrera, style: 'tableCell' },
        ],
        [
          { text: 'División', style: 'tableHeader' },
          { text: planning.courseInfo.division, style: 'tableCell' },
        ],
        [
          { text: 'Grupo', style: 'tableHeader' },
          { text: planning.courseInfo.grupo, style: 'tableCell' },
        ],
        [
          { text: 'Fecha', style: 'tableHeader' },
          { text: formatDate(planning.courseInfo.fecha, 'long'), style: 'tableCell' },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#cbd5e0',
      vLineColor: () => '#cbd5e0',
    },
  }
}

function buildParcialesSection(planning: FullPlanning): Content[] {
  const content: Content[] = [
    {
      text: 'ACTIVIDADES DE PARCIALES',
      style: 'sectionTitle',
      pageBreak: 'before',
    },
  ]

  planning.parciales.forEach((parcial) => {
    content.push({
      text: `PARCIAL ${parcial.number}`,
      style: 'subsectionTitle',
    })

    parcial.activities.forEach((activity) => {
      content.push(...buildActivity(activity))
    })
  })

  return content
}

function buildOrdinariosSection(planning: FullPlanning): Content[] {
  const content: Content[] = [
    {
      text: 'ACTIVIDADES ORDINARIAS',
      style: 'sectionTitle',
      pageBreak: 'before',
    },
  ]

  planning.ordinarios.forEach((ordinario) => {
    content.push({
      text: ordinario.name,
      style: 'subsectionTitle',
    })

    ordinario.activities.forEach((activity) => {
      content.push(...buildActivity(activity))
    })
  })

  return content
}

/**
 * Construye la sección de extraordinarios
 */
function buildExtraordinariosSection(planning: FullPlanning): Content[] {
  const content: Content[] = [
    {
      text: 'ACTIVIDADES EXTRAORDINARIAS',
      style: 'sectionTitle',
      pageBreak: 'before',
    },
  ]

  planning.extraordinarios.forEach((extraordinario) => {
    content.push({
      text: extraordinario.name,
      style: 'subsectionTitle',
    })

    extraordinario.activities.forEach((activity) => {
      content.push(...buildActivity(activity))
    })
  })

  return content
}

/**
 * Construye el contenido de una actividad individual
 */
function buildActivity(activity: ActivityFull): Content[] {
  const content: Content[] = []

  // Nombre de la actividad
  const activityHeader: string[] = [activity.name]

  if (activity.percentage) {
    activityHeader.push(` (${activity.percentage}%)`)
  }

  if (activity.deliveryDate) {
    activityHeader.push(` - Entrega: ${formatDate(activity.deliveryDate, 'short')}`)
  }

  content.push({
    text: activityHeader.join(''),
    style: 'activityName',
  })

  // Contenido de la actividad
  content.push({
    text: activity.content,
    style: 'activityContent',
    margin: [10, 0, 0, 15],
  })

  return content
}

/**
 * Genera el nombre del archivo
 */
function generateFilename(planning: FullPlanning): string {
  const { asignatura, grupo, fecha } = planning.courseInfo

  // Limpiar el nombre de la asignatura
  const cleanSubject = asignatura
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 30)

  return `Planeacion_${cleanSubject}_${grupo}_${fecha}.pdf`
}
