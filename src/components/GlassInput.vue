<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  label: string
  type?: 'text' | 'number' | 'email' | 'password' | 'tel'
  placeholder?: string
  required?: boolean
  min?: number
  modelValue: string | number | undefined
}

interface Emits {
  (e: 'update:modelValue', value: string | number | undefined): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  min: undefined,
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
    <input
      :id="id"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      class="w-full rounded-lg border border-white/30 bg-white/20 p-3 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-200 placeholder:text-gray-400 focus:border-white/50 focus:bg-white/30 focus:outline-none"
    />
  </p>
</template>
