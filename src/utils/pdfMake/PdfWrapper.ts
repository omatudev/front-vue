import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { loadArialFonts, arialFonts } from '@/assets/fonts/arial-fonts'

// Configurar fuentes disponibles
const fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
  Arial: arialFonts.Arial,
}

// Variable para almacenar el VFS completo con Arial
let completeVfs: Record<string, string> | null = null

// Función para obtener el VFS con Arial cargado
export async function getVfsWithArial(): Promise<Record<string, string>> {
  if (completeVfs) {
    console.log('✅ Usando VFS en caché')
    return completeVfs
  }

  console.log('🔄 Cargando fuentes Arial para VFS...')
  try {
    const arialVfs = await loadArialFonts()

    console.log('📦 Fuentes Arial cargadas:', Object.keys(arialVfs))

    // Combinar VFS de pdfmake con Arial
    completeVfs = {
      ...pdfFonts.vfs,
      ...arialVfs,
    }

    console.log('✅ VFS completo creado con', Object.keys(completeVfs).length, 'archivos')
    return completeVfs
  } catch (error) {
    console.error('❌ Error cargando fuentes Arial:', error)
    throw error
  }
}

// Exportar fonts para usarlos en createPdf
export { fonts }

export default pdfMake
