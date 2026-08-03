<script setup lang="ts">
import type { Resource } from '@/types/navigation'

defineProps<{ resource: Resource; favorite: boolean; order: number }>()
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
      <span class="entry-index">{{ String(order + 1).padStart(2, '0') }}</span>
      <div class="resource-copy">
        <div class="resource-title-row">
          <h3>{{ resource.name }}</h3>
          <span v-if="resource.featured" class="recommended">馆员推荐</span>
        </div>
        <p>{{ resource.description }}</p>
        <div class="resource-tags"><span v-for="tag in resource.tags" :key="tag">{{ tag }}</span></div>
      </div>
      <span class="open-arrow" aria-hidden="true">访问 ↗</span>
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
