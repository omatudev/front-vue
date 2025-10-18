import pdfMake, { getVfsWithArial, fonts } from '@/utils/pdfMake/PdfWrapper'
import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces'
import type { CollaborativeWork } from '@/domain/entities/CollaborativeWork'

export async function generateCollaborativeWorkPDF(work: CollaborativeWork): Promise<void> {
  console.log('📄 Preparando generación de PDF (formato APA)...')

  const vfs = await getVfsWithArial()
  console.log('✅ VFS listo con', Object.keys(vfs).length, 'archivos')

  const content: Content[] = []

  // Objetivo y nombre (tal cual input, sin formato extra)
  content.push({
    text: 'Objetivo: ' + (work.objective ?? ''),
    fontSize: 12,
    bold: false,
    margin: [0, 0, 0, 6],
  })
  content.push({
    text: 'Nombre: ' + (work.teacherName ?? ''),
    fontSize: 12,
    bold: false,
    margin: [0, 0, 0, 10],
  })

  // Tabla de actividades (layout y estilos originales)
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
              { text: work.workshopName ?? '', bold: false, fontSize: 11 },
            ],
            style: 'tableHeader',
          },
          { text: 'ACTIVIDAD', style: 'tableHeader' },
          { text: 'RECURSO MATERIAL', style: 'tableHeader' },
          { text: 'TIEMPO', style: 'tableHeader' },
        ],
        ...[
          [
            { text: 'INICIO', style: 'tableCell' },
            { text: work.start.activity, style: 'tableCell', alignment: 'left' },
            {
              ul: Array.isArray(work.start.materials)
                ? work.start.materials.map((m) => ({ text: m, fontSize: 11 }))
                : [],
              style: 'tableCell',
            },
            { text: `${work.start.timeMinutes} min`, style: 'tableCell', alignment: 'center' },
          ],
          [
            { text: 'DESARROLLO', style: 'tableCell' },
            { text: work.development.activity, style: 'tableCell', alignment: 'left' },
            {
              ul: Array.isArray(work.development.materials)
                ? work.development.materials.map((m) => ({ text: m, fontSize: 11 }))
                : [],
              style: 'tableCell',
            },
            {
              text: `${work.development.timeMinutes} min`,
              style: 'tableCell',
              alignment: 'center',
            },
          ],
          [
            { text: 'CIERRE', style: 'tableCell' },
            { text: work.closure.activity, style: 'tableCell', alignment: 'left' },
            {
              ul: Array.isArray(work.closure.materials)
                ? work.closure.materials.map((m) => ({ text: m, fontSize: 11 }))
                : [],
              style: 'tableCell',
            },
            { text: `${work.closure.timeMinutes} min`, style: 'tableCell', alignment: 'center' },
          ],
          [
            { text: 'EVALUACIÓN', style: 'tableCell' },
            { text: work.evaluation.activity, style: 'tableCell', alignment: 'left' },
            {
              ul: Array.isArray(work.evaluation.materials)
                ? work.evaluation.materials.map((m) => ({ text: m, fontSize: 11 }))
                : [],
              style: 'tableCell',
            },
            { text: `${work.evaluation.timeMinutes} min`, style: 'tableCell', alignment: 'center' },
          ],
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
    margin: [0, 0, 0, 0],
  })

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
    content,
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

  pdfMake
    .createPdf(docDefinition, undefined, fonts, vfs)
    .download(`Taller_${work.workshopName}.pdf`)
}
