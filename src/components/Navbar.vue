<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class=" bg-neutral-200">
    <div class="flex justify-between h-16">
      <div class="flex space-x-4 items-center">
        <RouterLink 
          to="/" 
          class="px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600"
          active-class="text-blue-600"
        >
          Home
        </RouterLink>
        <RouterLink 
          to="/stations" 
          class="px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600"
          :class="{ 'text-blue-600': $route.path.startsWith('/stations') }"
        >
          Stations
        </RouterLink>
      </div>
    </div>
  </nav>
</template>