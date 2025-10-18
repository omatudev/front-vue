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
      class="bg-primary-700 placeholder:text-primary-300 focus:outline-primary-100 w-full rounded-xl p-3 transition-all duration-300 focus:outline"
    />
  </p>
</template>
