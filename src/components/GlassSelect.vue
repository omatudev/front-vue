<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  label: string
  options: Array<{ value: string; text: string }>
  placeholder?: string
  required?: boolean
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccionar...',
  required: false,
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
    <select
      :id="id"
      v-model="value"
      :required="required"
      class="w-full cursor-pointer rounded-lg border border-white/30 bg-white/20 p-3 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-200 focus:border-white/50 focus:bg-white/30 focus:outline-none"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </p>
</template>
