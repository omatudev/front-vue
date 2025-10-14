<script setup lang="ts">
import IconComp from './IconComp.vue'
</script>

<template>
  <nav
    class="flex h-12 w-full items-center justify-center gap-4 rounded-2xl bg-zinc-800 shadow-lg shadow-black/30"
  >
    <router-link to="/">
      <IconComp name="home" size="24" css="fill-white" />
    </router-link>
    <router-link to="/collaborative-work">
      <IconComp name="doc" size="24" css="fill-white" />
    </router-link>
  </nav>
</template>
