<script setup lang="ts">
import DefaultNavegation from '@/components/DefaultNavegation.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="grid h-full w-full gap-4 p-4">
    <DefaultNavegation />
    <RouterView />
  </main>
</template>
