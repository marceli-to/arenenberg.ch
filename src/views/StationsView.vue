<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Stationen</h1>
    <nav class="flex flex-col gap-y-4">
      <RouterLink 
        v-for="station in stations" 
        :key="station.path"
        :to="station.path"
        class="block"
        :class="{ active: route.path === station.path }"
      >
        {{ station.name }}
      </RouterLink>
    </nav>
    <!-- Individual station details will go here -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

const route = useRoute()

const stations = [
  { name: 'Kapelle', path: '/stations/kapelle' },
  { name: 'Stall der Zukunft', path: '/stations/stall-der-zukunft' },
  { name: 'Präzis, smart, digital', path: '/stations/praezis-smart-digital' },
  { name: 'Gartenbaukunst', path: '/stations/gartenbaukunst' },
  { name: 'A la française', path: '/stations/a-la-francaise' }
]
</script>