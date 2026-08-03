<script setup lang="ts">
import ResourceCard from './ResourceCard.vue'
import type { ResourceCategory } from '@/types/navigation'

defineProps<{ category: ResourceCategory; favoriteIds: Set<string> }>()
const emit = defineEmits<{ toggleFavorite: [id: string]; visit: [id: string] }>()
</script>

<template>
  <section :id="category.id" class="resource-section" :aria-labelledby="`${category.id}-title`">
    <header class="section-heading">
      <span>{{ category.index }}</span>
      <div>
        <h2 :id="`${category.id}-title`">{{ category.label }}</h2>
        <p>{{ category.description }}</p>
      </div>
      <small>{{ String(category.resources.length).padStart(2, '0') }} ENTRIES</small>
    </header>
    <div class="resource-grid">
      <ResourceCard
        v-for="resource in category.resources"
        :key="resource.id"
        :resource="resource"
        :favorite="favoriteIds.has(resource.id)"
        @toggle-favorite="emit('toggleFavorite', $event)"
        @visit="emit('visit', $event)"
      />
    </div>
  </section>
</template>
