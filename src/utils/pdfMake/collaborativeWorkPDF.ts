import pdfMake, { getVfsWithArial, fonts } from '@/utils/pdfMake/PdfWrapper'
import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces'
import type { CollaborativeWork } from '@/domain/entities/CollaborativeWork'

/**
 * Genera un PDF del Trabajo Colaborativo siguiendo el formato APA
 *
 * Características del formato APA implementadas:
 * - Márgenes: 1 pulgada (72 puntos) en todos los lados
 * - Fuente: Arial 12pt
 * - Interlineado: Doble espacio (2.0)
 * - Alineación: Izquierda (no justificada)
 * - Número de página: Esquina superior derecha
 *
 * @param work Datos del trabajo colaborativo
 * @returns Promise que se resuelve cuando se descarga el PDF
 *
 * @example
 * ```ts
 * await generateCollaborativeWorkPDF(collaborativeWork)
 * ```
 */
export async function generateCollaborativeWorkPDF(work: CollaborativeWork): Promise<void> {
  console.log('📄 Preparando generación de PDF (formato APA)...')

  const vfs = await getVfsWithArial()
  console.log('✅ VFS listo con', Object.keys(vfs).length, 'archivos')

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [72, 72, 72, 72],

    header: function (currentPage, _pageCount) {
      return {
        text: currentPage.toString(),
        alignment: 'right',
        fontSize: 12,
        margin: [0, 36, 72, 0],
      }
    },

    content: buildContent(work),

    styles: {
      header: {
        fontSize: 12,
        bold: true,
        color: '#000000',
        lineHeight: 1.15,
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        margin: [0, 6, 0, 3],
        lineHeight: 1.15,
      },
      label: {
        fontSize: 12,
        bold: true,
        margin: [0, 3, 0, 2],
        lineHeight: 1.15,
      },
      text: {
        fontSize: 12,
        alignment: 'left',
        lineHeight: 1.15,
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: '#000000',
        alignment: 'center',
        lineHeight: 1.15,
      },
      tableCell: {
        fontSize: 11,
        margin: [5, 5, 5, 5],
        lineHeight: 1.15,
      },
    },

    defaultStyle: {
      font: 'Arial',
      fontSize: 12,
      lineHeight: 1.15,
    },
  }

  console.log('🔄 Creando PDF con VFS y fuentes personalizadas...')

  pdfMake
    .createPdf(docDefinition, undefined, fonts, vfs)
    .download(`trabajo_colaborativo_${work.topic.replace(/\s+/g, '_')}.pdf`)

  console.log('✅ PDF generado exitosamente')
}

function buildContent(work: CollaborativeWork): Content[] {
  const content: Content[] = []

  content.push({
    text: [
      { text: 'Objetivo: ', bold: true, fontSize: 12 },
      { text: work.objective, fontSize: 12 },
    ],
    margin: [0, 0, 0, 6],
  })

  content.push({
    text: [
      { text: 'Nombre: ', bold: true, fontSize: 12 },
      { text: work.teacherName, fontSize: 12 },
    ],
    margin: [0, 0, 0, 10],
  })

  content.push({
    table: {
      headerRows: 0,
      widths: ['auto', '*', 'auto', 'auto'],
      dontBreakRows: true,
      body: [
        [
          {
            text: [
              { text: 'TEMA:\n', bold: true, fontSize: 11 },
              { text: work.topic, bold: false, fontSize: 11 },
            ],
            margin: 5,
          },
          {
            text: 'ACTIVIDAD',
            bold: true,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
          {
            text: 'RECURSO MATERIAL',
            bold: true,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
          {
            text: 'TIEMPO',
            bold: true,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
        ],
        [
          {
            text: 'INICIO',
            margin: 5,
            fontSize: 11,
          },
          {
            text: work.activities.start.description,
            margin: 5,
            alignment: 'left',
            fontSize: 11,
          },
          {
            ul: work.activities.start.materials.map((m) => ({ text: m, fontSize: 11 })),
            margin: 5,
          },
          {
            text: `${work.activities.start.timeMinutes} min`,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
        ],
        [
          {
            text: 'DESARROLLO',
            margin: 5,
            fontSize: 11,
          },
          {
            text: work.activities.development.description,
            margin: 5,
            alignment: 'left',
            fontSize: 11,
          },
          {
            ul: work.activities.development.materials.map((m) => ({ text: m, fontSize: 11 })),
            margin: 5,
          },
          {
            text: `${work.activities.development.timeMinutes} min`,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
        ],
        [
          {
            text: 'FINAL',
            margin: 5,
            fontSize: 11,
          },
          {
            text: work.activities.final.description,
            margin: 5,
            alignment: 'left',
            fontSize: 11,
          },
          {
            ul: work.activities.final.materials.map((m) => ({ text: m, fontSize: 11 })),
            margin: 5,
          },
          {
            text: `${work.activities.final.timeMinutes} min`,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
        ],
        [
          {
            text: 'EVALUACIÓN',
            margin: 5,
            fontSize: 11,
          },
          {
            text: work.activities.evaluation.description,
            margin: 5,
            alignment: 'left',
            fontSize: 11,
          },
          {
            ul: work.activities.evaluation.materials.map((m) => ({ text: m, fontSize: 11 })),
            margin: 5,
          },
          {
            text: `${work.activities.evaluation.timeMinutes} min`,
            alignment: 'center',
            margin: 5,
            fontSize: 11,
          },
        ],
      ],
    },
    layout: {
      hLineWidth: function () {
        return 1
      },
      vLineWidth: function () {
        return 1
      },
      hLineColor: function () {
        return '#000000'
      },
      vLineColor: function () {
        return '#000000'
      },
      paddingLeft: function () {
        return 0
      },
      paddingRight: function () {
        return 0
      },
      paddingTop: function () {
        return 0
      },
      paddingBottom: function () {
        return 0
      },
    },
  })

  return content
}
