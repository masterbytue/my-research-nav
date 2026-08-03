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
    <div class="hero-ornament" aria-hidden="true"><span>研</span></div>
    <div class="hero-eyebrow"><span>LIWEN STUDIO ACADEMIC SERVICES</span><span>EST. 2026</span></div>

    <div class="hero-copy">
      <p class="edition">砺文工作室 · 学术资源索引</p>
      <h1>研途学术资源导航</h1>
      <p class="english-title">RESEARCH RESOURCE GATEWAY</p>
      <p class="hero-intro">为研究者编目可靠的检索、阅读、写作与分析工具。目前收录 {{ resourceCount }} 项资源。</p>
    </div>

    <div class="search-panel" role="search">
      <div class="search-label"><span>统一检索</span><strong>RESOURCE DISCOVERY</strong><kbd>/</kbd></div>
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
      <p><span>检索说明</span> 输入关键词可即时筛选本馆资源；按回车将使用所选数据库进行外部检索。</p>
    </div>

    <div class="hero-note" aria-label="平台信息">
      <div><strong>07</strong><span>学术主题</span></div>
      <div><strong>{{ resourceCount }}</strong><span>精选资源</span></div>
      <div><strong>LOCAL</strong><span>隐私优先</span></div>
    </div>
  </header>
</template>
