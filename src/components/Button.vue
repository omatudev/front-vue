<script setup lang="ts">
interface Props {
  type?: 'submit' | 'button' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'rounded-2xl px-4 py-2 shadow-lg shadow-black/30 transition-colors',
      variant === 'secondary'
        ? 'text-primary-300 border-primary-200 hover:text-primary-100 active:bg-primary-300 border'
        : 'bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-300',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
  >
    <slot />
  </button>
</template>
