<template>
  <svg :width="size" :height="size" :class="css" :viewBox="icon.viewBox" aria-hidden="true">
    <path v-for="(d, i) in icon.paths" :key="i" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import iconsDataJson from '@/assets/icon.json'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  css: { type: String, default: 'currentColor' },
})

interface IIconData {
  viewBox: string
  paths: string[]
}

const iconsData = iconsDataJson as Record<string, IIconData>

function getIconData(iconName: string): IIconData {
  if (iconsData[iconName]) return iconsData[iconName]
  console.error(`icon '${iconName}' not found`)
  // Fallback to doc icon
  return iconsData['doc']!
}

const icon = getIconData(props.name)
</script>
