/**
 * Índice para fuentes Arial con lazy loading
 * Generado automáticamente - No editar manualmente
 */

export const arialFonts = {
  Arial: {
    normal: 'Arial.ttf',
    bold: 'Arial-Bold.ttf',
    italics: 'Arial-Italic.ttf',
    bolditalics: 'Arial-BoldItalic.ttf',
  },
}

// Función para cargar dinámicamente las fuentes Arial en el VFS
export async function loadArialFonts() {
  const { Arial_ttf } = await import('./Arial_ttf')
  const { Arial_Bold_ttf } = await import('./Arial_Bold_ttf')
  const { Arial_Italic_ttf } = await import('./Arial_Italic_ttf')
  const { Arial_BoldItalic_ttf } = await import('./Arial_BoldItalic_ttf')

  return {
    'Arial.ttf': Arial_ttf,
    'Arial-Bold.ttf': Arial_Bold_ttf,
    'Arial-Italic.ttf': Arial_Italic_ttf,
    'Arial-BoldItalic.ttf': Arial_BoldItalic_ttf,
  }
}
