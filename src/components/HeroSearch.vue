<script setup lang="ts">
import { ref } from 'vue'
import type { SearchEngine } from '@/types/navigation'

defineProps<{
  modelValue: string
  engineId: string
  engines: SearchEngine[]
  resourceCount: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:engineId': [value: string]
  search: []
}>()

const input = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <header id="top" class="hero">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-eyebrow"><span>科研资源索引</span><span>VOL. 01 / 2026</span></div>

    <div class="hero-copy">
      <p class="edition">A CURATED DESK FOR RESEARCHERS</p>
      <h1>把研究的路，<br /><em>走得更清楚。</em></h1>
      <p class="hero-intro">检索、阅读、写作与分析——{{ resourceCount }} 个可靠入口，按真实科研流程重新编排。</p>
    </div>

    <div class="search-panel" role="search">
      <div class="search-label"><span>01</span><strong>站内筛选 / 学术搜索</strong><kbd>/</kbd></div>
      <div class="search-row">
        <label class="engine-select">
          <span class="sr-only">搜索引擎</span>
          <select :value="engineId" @change="emit('update:engineId', ($event.target as HTMLSelectElement).value)">
            <option v-for="engine in engines" :key="engine.id" :value="engine.id">{{ engine.name }}</option>
          </select>
        </label>
        <label class="query-field">
          <span class="sr-only">搜索关键词</span>
          <input
            ref="input"
            :value="modelValue"
            type="search"
            autocomplete="off"
            placeholder="输入论文主题、工具名称或关键词…"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            @keydown.enter="emit('search')"
          />
        </label>
        <button type="button" class="submit-search" :disabled="!modelValue.trim()" @click="emit('search')">
          外部检索 <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p>输入时自动筛选本站资源，按回车则使用所选学术引擎检索。</p>
    </div>

    <div class="hero-note" aria-label="本站特点">
      <span>CURATED</span>
      <strong>人工整理</strong>
      <i></i>
      <span>LOCAL FIRST</span>
      <strong>偏好仅存本机</strong>
    </div>
  </header>
</template>
