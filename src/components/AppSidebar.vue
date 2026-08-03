<script setup lang="ts">
import type { ResourceCategory } from '@/types/navigation'

defineProps<{
  categories: ResourceCategory[]
  activeId: string
  favoriteCount: number
  theme: 'light' | 'dark'
}>()

const emit = defineEmits<{
  navigate: [id: string]
  toggleTheme: []
}>()
</script>

<template>
  <aside class="sidebar" aria-label="页面导航">
    <button class="brand" type="button" aria-label="返回顶部" @click="emit('navigate', 'top')">
      <span class="brand-mark">砺</span>
      <span class="brand-copy"><strong>研途</strong><small>砺文工作室出品</small></span>
    </button>

    <nav class="section-nav" aria-label="资源分类">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :class="{ active: activeId === category.id }"
        @click="emit('navigate', category.id)"
      >
        <span>{{ category.index }}</span>
        {{ category.label }}
      </button>
    </nav>

    <div class="sidebar-foot">
      <div class="saved-count"><span>已收藏</span><strong>{{ favoriteCount }}</strong></div>
      <button class="theme-button" type="button" @click="emit('toggleTheme')">
        <span aria-hidden="true">{{ theme === 'light' ? '◐' : '☼' }}</span>
        {{ theme === 'light' ? '夜间阅读' : '日间阅读' }}
      </button>
    </div>
  </aside>
</template>
