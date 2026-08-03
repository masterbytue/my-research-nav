<script setup lang="ts">
import type { Resource } from '@/types/navigation'

defineProps<{ resource: Resource; favorite: boolean }>()
const emit = defineEmits<{ toggleFavorite: [id: string]; visit: [id: string] }>()
</script>

<template>
  <article class="resource-card" :class="{ featured: resource.featured }">
    <a
      :href="resource.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`打开 ${resource.name}（新窗口）`"
      @click="emit('visit', resource.id)"
    >
      <div class="resource-monogram" :style="{ '--resource-accent': resource.accent }">
        {{ resource.name.slice(0, 1).toUpperCase() }}
      </div>
      <div class="resource-copy">
        <h3>{{ resource.name }}</h3>
        <p>{{ resource.description }}</p>
        <div class="resource-tags"><span v-for="tag in resource.tags" :key="tag">{{ tag }}</span></div>
      </div>
      <span class="open-arrow" aria-hidden="true">↗</span>
    </a>
    <button
      type="button"
      class="favorite-button"
      :class="{ active: favorite }"
      :aria-label="favorite ? `取消收藏 ${resource.name}` : `收藏 ${resource.name}`"
      :aria-pressed="favorite"
      @click="emit('toggleFavorite', resource.id)"
    >
      {{ favorite ? '★' : '☆' }}
    </button>
  </article>
</template>
