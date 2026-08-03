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
  <header class="sidebar" aria-label="网站导航">
    <div class="header-branding">
      <button class="brand" type="button" aria-label="返回顶部" @click="emit('navigate', 'top')">
        <span class="brand-mark">LW</span>
        <span class="brand-copy"><strong>砺文工作室</strong><small>ACADEMIC SERVICES</small></span>
      </button>
      <div class="product-name"><strong>研途</strong><span>学术资源导航平台</span></div>
    </div>

    <nav class="section-nav" aria-label="资源分类目录">
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
      <div class="saved-count"><span>收藏</span><strong>{{ favoriteCount }}</strong></div>
      <button
        class="theme-button"
        type="button"
        :aria-label="theme === 'light' ? '切换到夜间主题' : '切换到日间主题'"
        @click="emit('toggleTheme')"
      >
        <span aria-hidden="true">{{ theme === 'light' ? '◐' : '☼' }}</span>
        <span class="theme-label">{{ theme === 'light' ? '夜间' : '日间' }}</span>
      </button>
    </div>
  </header>
</template>
