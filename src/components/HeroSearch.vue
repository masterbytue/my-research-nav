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
    <div class="hero-eyebrow"><span>砺文工作室 · 科研信息服务</span><span>ACADEMIC RESOURCE PORTAL</span></div>

    <div class="hero-copy">
      <p class="edition">科研工具与开放资源目录</p>
      <h1>研途学术资源导航</h1>
      <p class="hero-intro">面向研究人员与高校师生，集中检索文献、阅读管理、学术写作、数据分析及 AI 辅助工具。</p>
    </div>

    <div class="search-panel" role="search">
      <div class="search-label"><span>资源统一检索</span><strong>输入名称、用途或关键词</strong><kbd>/</kbd></div>
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
          开始检索 <span aria-hidden="true">→</span>
        </button>
      </div>
      <p><span>使用说明</span> 输入关键词可即时筛选站内资源；按回车将使用所选学术数据库继续检索。</p>
    </div>

    <div class="hero-note" aria-label="平台信息">
      <div><strong>07</strong><span>研究环节</span></div>
      <div><strong>{{ resourceCount }}</strong><span>已收录资源</span></div>
      <div><strong>本地</strong><span>偏好数据存储</span></div>
    </div>
  </header>
</template>
