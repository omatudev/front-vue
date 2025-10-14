<template>
  <main>
    <h1>🎓 Generador de Planeaciones Didácticas</h1>
    <p>Crea planeaciones académicas completas con ayuda de IA</p>

    <!-- Formulario -->
    <form @submit.prevent="handleGenerate">
      <h2>📋 Información del Curso</h2>

      <div>
        <label>
          Nombre del Profesor:
          <input
            v-model="formData.profesor"
            type="text"
            required
            placeholder="Ej: Ing. Juan Pérez"
            @blur="() => markTouched('profesor')"
          />
          <span v-if="fieldState.profesor.error && fieldState.profesor.touched">
            ❌ Campo requerido
          </span>
        </label>
      </div>

      <div>
        <label>
          Asignatura:
          <input
            v-model="formData.asignatura"
            type="text"
            required
            placeholder="Ej: Programación Orientada a Objetos"
            @blur="() => markTouched('asignatura')"
          />
          <span v-if="fieldState.asignatura.error && fieldState.asignatura.touched">
            ❌ Campo requerido
          </span>
        </label>
      </div>

      <div>
        <label>
          Carrera:
          <input
            v-model="formData.carrera"
            type="text"
            required
            placeholder="Ej: TSU en Desarrollo de Software"
            @blur="() => markTouched('carrera')"
          />
          <span v-if="fieldState.carrera.error && fieldState.carrera.touched">
            ❌ Campo requerido
          </span>
        </label>
      </div>

      <div>
        <label>
          División:
          <input
            v-model="formData.division"
            type="text"
            required
            placeholder="Ej: DAIS"
            @blur="() => markTouched('division')"
          />
          <span v-if="fieldState.division.error && fieldState.division.touched">
            ❌ Campo requerido
          </span>
        </label>
      </div>

      <div>
        <label>
          Grupo:
          <input
            v-model="formData.grupo"
            type="text"
            required
            placeholder="Ej: 4A"
            @blur="() => markTouched('grupo')"
          />
          <span v-if="fieldState.grupo.error && fieldState.grupo.touched">
            ❌ Campo requerido
          </span>
        </label>
      </div>

      <div>
        <label>
          Fecha de Aplicación:
          <input v-model="formData.fecha" type="date" required @blur="() => markTouched('fecha')" />
          <span v-if="fieldState.fecha.error && fieldState.fecha.touched">
            ❌ Campo requerido
          </span>
        </label>
      </div>

      <hr />

      <!-- Upload de documento opcional -->
      <h3>📄 Documento de Referencia (Opcional)</h3>

      <div>
        <input ref="fileInput" type="file" accept=".docx" @change="handleFileSelect" />

        <div v-if="uploadedFile">
          <p>📎 {{ uploadedFile.name }} ({{ formatFileSize(uploadedFile.size) }})</p>
          <button type="button" @click="removeFile">❌ Remover</button>
        </div>

        <p>⚠️ Este documento solo se usa para analizar tu estilo de redacción.</p>
      </div>

      <!-- Botones -->
      <div>
        <button type="button" :disabled="!isFormDirty" @click="resetForm">🧹 Limpiar</button>

        <button type="submit" :disabled="!isFormValid || isGenerating">
          {{ isGenerating ? '⏳ Generando...' : '🚀 Generar Planeación' }}
        </button>
      </div>
    </form>

    <!-- Resultado -->
    <div v-if="generatedPlanning">
      <hr />
      <h3>✅ Planeación Generada Exitosamente</h3>
      <p>
        {{ getTotalActivities() }} actividades generadas •
        {{ generatedPlanning.parciales.length }} parciales •
        {{ generatedPlanning.ordinarios.length }} ordinarios •
        {{ generatedPlanning.extraordinarios.length }} extraordinarios
      </p>

      <div>
        <button @click="downloadPDF">📥 Descargar PDF</button>
        <button @click="regenerate">🔄 Regenerar</button>
        <button @click="resetAll">➕ Nueva</button>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMessage">
      <hr />
      <h4>❌ Error al generar planeación</h4>
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Notificación -->
    <div
      v-if="notification.show"
      style="
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px;
        background: #fff;
        border: 1px solid #ccc;
      "
    >
      <p>
        <strong>{{ notification.type }}:</strong> {{ notification.msg }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStyleAnalysis } from '@/composables/useStyleAnalysis'
import { usePlanningGeneration } from '@/composables/usePlanningGeneration'
import { generateFullPlanningPDF } from '@/utils/pdfMake/fullPlanningPDF'
import type { FullPlanning } from '@/domain/entities/FullPlanning'
import type { StyleProfile } from '@/domain/entities/StyleProfile'

// Estado del formulario
const formData = reactive({
  profesor: '',
  asignatura: '',
  carrera: '',
  division: '',
  grupo: '',
  fecha: new Date().toISOString().split('T')[0] as string,
})

// Estado de campos
const fieldState = reactive({
  profesor: { error: false, touched: false },
  asignatura: { error: false, touched: false },
  carrera: { error: false, touched: false },
  division: { error: false, touched: false },
  grupo: { error: false, touched: false },
  fecha: { error: false, touched: false },
})

// Upload de archivo
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)

// Resultado
const generatedPlanning = ref<FullPlanning | null>(null)
const analyzedStyle = ref<StyleProfile | null>(null)
const errorMessage = ref<string | null>(null)

// Notificación
const notification = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  msg: '',
})

// Composables
const { analyzeStyle } = useStyleAnalysis()
const { generateFullPlanning, isGenerating } = usePlanningGeneration()

// Validación
function markTouched(field: keyof typeof fieldState) {
  fieldState[field].touched = true
  validateField(field)
}

function validateField(field: keyof typeof fieldState) {
  const value = formData[field]
  const hasError = value ? !value.toString().trim() : true
  fieldState[field].error = hasError
}

const isFormValid = computed(() => {
  return Object.keys(formData).every((key) => {
    const value = formData[key as keyof typeof formData]
    return value ? value.toString().trim() !== '' : false
  })
})

const isFormDirty = computed(() => {
  return Object.values(formData).some((v) => (v ? v.toString().trim() !== '' : false))
})

// Manejo de archivo
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadedFile.value = file
    showNotification('success', `Documento cargado: ${file.name}`)
  }
}

function removeFile() {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Generación
async function handleGenerate() {
  errorMessage.value = null
  generatedPlanning.value = null

  try {
    // Paso 1: Analizar estilo si hay documento
    let styleProfile: StyleProfile | null = null

    if (uploadedFile.value) {
      showNotification('info', 'Analizando estilo de redacción...')
      styleProfile = await analyzeStyle(uploadedFile.value)

      if (!styleProfile) {
        showNotification('warning', 'No se pudo analizar el estilo.')
      } else {
        analyzedStyle.value = styleProfile
        showNotification('success', '✅ Estilo analizado')
      }
    }

    // Paso 2: Generar planeación completa
    showNotification('info', 'Generando planeación con IA...')

    const planning = await generateFullPlanning({
      ...formData,
      styleProfile,
    })

    if (!planning) {
      throw new Error('No se pudo generar la planeación')
    }

    generatedPlanning.value = planning
    showNotification('success', '🎉 ¡Planeación generada!')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    errorMessage.value = message
    showNotification('error', `Error: ${message}`)
  }
}

// Acciones
async function downloadPDF() {
  if (!generatedPlanning.value) return

  try {
    showNotification('info', 'Generando PDF...')
    await generateFullPlanningPDF(generatedPlanning.value)
    showNotification('success', '📄 PDF descargado')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al generar PDF'
    showNotification('error', message)
  }
}

function regenerate() {
  generatedPlanning.value = null
  handleGenerate()
}

function resetForm() {
  Object.keys(formData).forEach((key) => {
    const k = key as keyof typeof formData
    if (k === 'fecha') {
      formData[k] = (new Date().toISOString().split('T')[0] || '') as string
    } else {
      formData[k] = ''
    }
  })

  Object.keys(fieldState).forEach((key) => {
    fieldState[key as keyof typeof fieldState] = { error: false, touched: false }
  })

  removeFile()
}

function resetAll() {
  resetForm()
  generatedPlanning.value = null
  analyzedStyle.value = null
  errorMessage.value = null
}

function getTotalActivities(): number {
  if (!generatedPlanning.value) return 0

  const parcialCount = generatedPlanning.value.parciales.reduce(
    (sum, p) => sum + p.activities.length,
    0
  )
  const ordinarioCount = generatedPlanning.value.ordinarios.reduce(
    (sum, o) => sum + o.activities.length,
    0
  )
  const extraordinarioCount = generatedPlanning.value.extraordinarios.reduce(
    (sum, e) => sum + e.activities.length,
    0
  )

  return parcialCount + ordinarioCount + extraordinarioCount
}

function showNotification(type: 'success' | 'error' | 'warning' | 'info', msg: string) {
  notification.value = { show: true, type, msg }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}
</script>
