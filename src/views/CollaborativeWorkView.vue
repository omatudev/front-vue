<script setup lang="ts">
import { reactive } from 'vue'
import { useCollaborativeWork } from '@/composables/useCollaborativeWork'
import type { GenerateCollaborativeWorkDTO } from '@/domain/entities/CollaborativeWork'
import GlassInput from '@/components/GlassInput.vue'
import GlassSelect from '@/components/GlassSelect.vue'
import GlassTextarea from '@/components/GlassTextarea.vue'
import Button from '@/components/Button.vue'

const { loading, error, currentWork, generateWithAI, downloadPDF, clear } = useCollaborativeWork()

const form = reactive<GenerateCollaborativeWorkDTO>({
  teacherName: '',
  topic: '',
  subject: '',
  gradeLevel: '',
  numberOfStudents: undefined,
  duration: 53,
  additionalRequirements: '',
})

const gradeLevelOptions = [
  { value: 'Secundaria', text: 'Secundaria' },
  { value: 'Preparatoria', text: 'Preparatoria' },
  { value: 'Universidad', text: 'Universidad' },
  { value: 'Posgrado', text: 'Posgrado' },
]

async function handleGenerate() {
  try {
    await generateWithAI(form)
  } catch (err) {
    console.error('Error al generar:', err)
  }
}

async function handleDownloadPDF() {
  try {
    await downloadPDF()
  } catch (err) {
    console.error('Error al descargar PDF:', err)
  }
}

function handleClear() {
  clear()
  Object.assign(form, {
    teacherName: '',
    topic: '',
    subject: '',
    gradeLevel: '',
    numberOfStudents: undefined,
    duration: 53,
    additionalRequirements: '',
  })
}
</script>

<template>
  <p>Completa el formulario y genera el plan con IA</p>

  <section v-if="error">
    <strong>⚠️ Error:</strong>
    <p>{{ error }}</p>
  </section>

  <section v-if="!currentWork">
    <form @submit.prevent="handleGenerate">
      <fieldset>
        <GlassInput
          id="teacherName"
          v-model="form.teacherName"
          label="Nombre del Maestro *"
          placeholder="Ej: Oscar Aldair Matu Miranda"
          required
        />

        <GlassInput
          id="topic"
          v-model="form.topic"
          label="Tema *"
          placeholder="Ej: Trabajo colaborativo"
          required
        />

        <GlassInput
          id="subject"
          v-model="form.subject"
          label="Materia *"
          placeholder="Ej: Orfebrería"
          required
        />

        <GlassSelect
          id="gradeLevel"
          v-model="form.gradeLevel"
          label="Nivel educativo *"
          :options="gradeLevelOptions"
          required
        />
        <GlassInput
          id="numberOfStudents"
          v-model="form.numberOfStudents"
          type="number"
          :min="1"
          label="Número de estudiantes"
          placeholder="Ej: 30"
        />

        <GlassInput
          id="duration"
          v-model="form.duration"
          type="number"
          label="Duración (minutos)"
          placeholder="53"
        />

        <GlassTextarea
          id="additionalRequirements"
          v-model="form.additionalRequirements"
          label="Requerimientos adicionales"
          placeholder="Cualquier instrucción especial o requisito adicional..."
        />
      </fieldset>

      <Button type="submit" :disabled="loading">
        {{ loading ? 'Generando...' : 'Generar' }}
      </Button>
    </form>
  </section>

  <section v-if="currentWork">
    <h2>✅ Plan Generado Exitosamente</h2>
    <p>Tu documento está listo para descargar</p>
    <p>
      <Button :disabled="loading" @click="handleDownloadPDF">
        {{ loading ? '⏳ Generando PDF...' : '📥 Descargar' }}
      </Button>
      <Button variant="secondary" @click="handleClear"> 🔄 Generar Otro Plan </Button>
    </p>
  </section>
</template>
