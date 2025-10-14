<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  rows?: number
  modelValue: string | undefined
}

interface Emits {
  (e: 'update:modelValue', value: string | undefined): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  rows: 4,
})

const emit = defineEmits<Emits>()

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
})
</script>

<template>
  <p>
    <label :for="id">{{ label }}</label>
    <textarea
      :id="id"
      v-model="value"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      class="w-full resize-none rounded-lg border border-white/30 bg-white/20 p-3 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-200 placeholder:text-gray-400 focus:border-white/50 focus:bg-white/30 focus:outline-none"
    ></textarea>
  </p>
</template>
