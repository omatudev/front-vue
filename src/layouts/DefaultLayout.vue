<script setup lang="ts">
import { RouterView } from 'vue-router'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <main class="grid h-full w-full gap-4 p-4">
    <Analytics />
    <SpeedInsights />
    <RouterView />
  </main>
</template>
