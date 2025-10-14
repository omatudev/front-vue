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
    class="rounded-2xl bg-zinc-800 px-4 py-2 text-white shadow-lg shadow-black/30"
  >
    <slot />
  </button>
</template>
