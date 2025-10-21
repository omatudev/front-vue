<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { CollaborativeWork } from '@/domain/entities/CollaborativeWork'
import { useCollaborativeWork } from '@/composables/useCollaborativeWork'

import GlassInput from '@/components/GlassInput.vue'
import Button from '@/components/Button.vue'
import { useTeacherStore } from '@/stores/teacher.store'

const { loading, error, currentWork, generateWithAI, downloadPDF, clear } = useCollaborativeWork()
const teacherStore = useTeacherStore()

const form = reactive({
  teacherName: teacherStore.name,
  workshopName: '',
  objective: '',
  duration: 50,
})

watch(
  () => form.teacherName,
  (val) => {
    if (val) teacherStore.setName(val)
  }
)

async function handleGenerate() {
  try {
    await generateWithAI({
      teacherName: form.teacherName,
      workshopName: form.workshopName,
      objective: form.objective,
      duration: form.duration,
    })
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
    teacherName: teacherStore.name,
    workshopName: '',
    objective: '',
    duration: 53,
  })
}

const currentWorkPreview = computed(() => {
  if (!currentWork) return ''

  const work = (currentWork as unknown as { value: CollaborativeWork | null }).value
  if (!work) return ''

  const parts: string[] = []
  parts.push(`Taller: ${work.workshopName || ''}`)
  parts.push(`Docente: ${work.teacherName || ''}`)
  parts.push(`Objetivo: ${work.objective || ''}`)
  parts.push(`Duración: ${work.duration ?? ''} minutos`)
  parts.push('')
  parts.push('INICIO:')
  parts.push(`  Actividad: ${work.start.activity}`)
  parts.push(
    `  Materiales: ${Array.isArray(work.start.materials) ? work.start.materials.join(', ') : work.start.materials}`
  )
  parts.push(`  Tiempo: ${work.start.timeMinutes} min`)
  parts.push('')
  parts.push('DESARROLLO:')
  parts.push(`  Actividad: ${work.development.activity}`)
  parts.push(
    `  Materiales: ${Array.isArray(work.development.materials) ? work.development.materials.join(', ') : work.development.materials}`
  )
  parts.push(`  Tiempo: ${work.development.timeMinutes} min`)
  parts.push('')
  parts.push('CIERRE:')
  parts.push(`  Actividad: ${work.closure.activity}`)
  parts.push(
    `  Materiales: ${Array.isArray(work.closure.materials) ? work.closure.materials.join(', ') : work.closure.materials}`
  )
  parts.push(`  Tiempo: ${work.closure.timeMinutes} min`)
  parts.push('')
  parts.push('EVALUACIÓN:')
  parts.push(`  Actividad: ${work.evaluation.activity}`)
  parts.push(
    `  Materiales: ${Array.isArray(work.evaluation.materials) ? work.evaluation.materials.join(', ') : work.evaluation.materials}`
  )
  parts.push(`  Tiempo: ${work.evaluation.timeMinutes} min`)

  return parts.join('\n')
})
</script>

<template>
  <section v-if="error">
    <strong>⚠️ Error:</strong>
    <p>{{ error }}</p>
  </section>

  <section v-if="!currentWork">
    <form class="grid gap-4 p-2" @submit.prevent="handleGenerate">
      <GlassInput
        id="teacherName"
        v-model="form.teacherName"
        label="Nombre *"
        placeholder="Oscar Aldair Matu Miranda"
        required
      />
      <GlassInput
        id="workshopName"
        v-model="form.workshopName"
        label="Taller *"
        placeholder="Trabajo Colaborativo"
        required
      />
      <GlassInput
        id="objective"
        v-model="form.objective"
        label="Objetivo*"
        placeholder="Que los docentes conozcan estrategias de trabajo colaborativo"
        required
      />
      <GlassInput
        id="duration"
        v-model="form.duration"
        type="number"
        label="Duración (minutos)"
        placeholder="50"
        required
      />

      <Button type="submit" :disabled="loading" class="ml-auto w-fit">
        {{ loading ? 'Generando...' : 'Generar' }}
      </Button>
    </form>
  </section>

  <section v-if="currentWork">
    <div class="flex gap-2">
      <Button variant="secondary" class="mr-auto" @click="handleClear">Generar Otro</Button>
      <Button :disabled="loading" class="ml-auto" @click="handleDownloadPDF">
        {{ loading ? 'Generando PDF...' : 'Descargar' }}
      </Button>
    </div>

    <div
      class="bg-primary-100/5 mt-4 max-h-[calc(100vh-100px)] min-h-[40vh] w-full overflow-auto rounded-lg p-4"
    >
      <h3 class="mb-2 font-semibold">Contenido</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ currentWorkPreview }}</pre>
    </div>
  </section>
</template>
