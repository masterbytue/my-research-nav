<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import HeroSearch from '@/components/HeroSearch.vue'
import ResourceCard from '@/components/ResourceCard.vue'
import ResourceSection from '@/components/ResourceSection.vue'
import { allResources, categories, searchEngines } from '@/data/navigation'
import { useWorkspace } from '@/composables/useWorkspace'

const query = ref('')
const engineId = ref('scholar')
const activeId = ref('ai')
const heroSearch = ref<InstanceType<typeof HeroSearch> | null>(null)
const { favoriteIds, favoriteSet, recentIds, theme, toggleFavorite, recordVisit, toggleTheme } = useWorkspace()

const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase('zh-CN'))
const filteredCategories = computed(() => {
  if (!normalizedQuery.value) return categories
  return categories
    .map((category) => ({
      ...category,
      resources: category.resources.filter((resource) =>
        [resource.name, resource.description, ...resource.tags]
          .join(' ')
          .toLocaleLowerCase('zh-CN')
          .includes(normalizedQuery.value),
      ),
    }))
    .filter((category) => category.resources.length > 0)
})

const favoriteResources = computed(() => allResources.filter((item) => favoriteSet.value.has(item.id)))
const recentResources = computed(() =>
  recentIds.value.map((id) => allResources.find((item) => item.id === id)).filter((item) => item !== undefined),
)
const visibleCount = computed(() => filteredCategories.value.reduce((sum, item) => sum + item.resources.length, 0))

function navigateTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function externalSearch() {
  const keyword = query.value.trim()
  const engine = searchEngines.find((item) => item.id === engineId.value)
  if (keyword && engine) window.open(`${engine.searchUrl}${encodeURIComponent(keyword)}`, '_blank', 'noopener,noreferrer')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
    event.preventDefault()
    heroSearch.value?.focus()
  }
  if (event.key === 'Escape' && query.value) query.value = ''
}

let scrollFrame: number | null = null

function updateActiveSection() {
  const marker = window.scrollY + 180
  for (const category of categories) {
    const section = document.getElementById(category.id)
    if (section && section.offsetTop <= marker) activeId.value = category.id
  }
}

function onScroll() {
  if (scrollFrame !== null) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = null
    updateActiveSection()
  })
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
  if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <a class="skip-link" href="#content">跳到主要内容</a>
  <div class="app-shell">
    <AppSidebar
      :categories="categories"
      :active-id="activeId"
      :favorite-count="favoriteIds.length"
      :theme="theme"
      @navigate="navigateTo"
      @toggle-theme="toggleTheme"
    />

    <main id="content">
      <HeroSearch
        ref="heroSearch"
        v-model="query"
        :engine-id="engineId"
        :engines="searchEngines"
        :resource-count="allResources.length"
        @update:engine-id="engineId = $event"
        @search="externalSearch"
      />

      <div class="desk-content">
        <section v-if="!normalizedQuery && (favoriteResources.length || recentResources.length)" class="personal-shelf">
          <div v-if="favoriteResources.length" class="shelf-block">
            <header><span>MY INDEX</span><h2>我的收藏</h2></header>
            <div class="compact-grid">
              <ResourceCard
                v-for="resource in favoriteResources"
                :key="resource.id"
                :resource="resource"
                :favorite="true"
                :order="0"
                @toggle-favorite="toggleFavorite"
                @visit="recordVisit"
              />
            </div>
          </div>
          <div v-if="recentResources.length" class="shelf-block recent-block">
            <header><span>RECENT</span><h2>最近访问</h2></header>
            <ol>
              <li v-for="resource in recentResources" :key="resource.id">
                <a :href="resource.url" target="_blank" rel="noopener noreferrer" @click="recordVisit(resource.id)">
                  {{ resource.name }} <span>↗</span>
                </a>
              </li>
            </ol>
          </div>
        </section>

        <div v-if="normalizedQuery" class="results-summary" aria-live="polite">
          <span>SEARCH RESULT</span>
          <p>找到 <strong>{{ visibleCount }}</strong> 个与“{{ query }}”相关的资源</p>
          <button type="button" @click="query = ''">清除筛选</button>
        </div>

        <ResourceSection
          v-for="category in filteredCategories"
          :key="category.id"
          :category="category"
          :favorite-ids="favoriteSet"
          @toggle-favorite="toggleFavorite"
          @visit="recordVisit"
        />

        <div v-if="!filteredCategories.length" class="empty-state">
          <span>∅</span><h2>暂时没有匹配项</h2><p>换一个更短的关键词，或使用上方学术引擎继续检索。</p>
          <button type="button" @click="query = ''">查看全部资源</button>
        </div>

        <section class="studio-section" aria-labelledby="studio-title">
          <div class="studio-mark" aria-hidden="true">LW</div>
          <div class="studio-copy">
            <span class="studio-kicker">平台维护信息</span>
            <h2 id="studio-title">由砺文工作室建设与维护</h2>
            <p>研途持续整理科研工作流中的常用平台与开放资源，并对分类、链接及使用说明进行维护。</p>
          </div>
          <dl class="studio-meta">
            <div><dt>服务对象</dt><dd>研究人员与高校师生</dd></div>
            <div><dt>更新原则</dt><dd>可靠、清晰、可访问</dd></div>
          </dl>
        </section>

        <footer class="site-footer">
          <div><span class="footer-mark">LW</span><p><strong>砺文工作室 · 研途</strong><br />学术资源导航与科研工具索引</p></div>
          <div class="footer-meta"><span>LIWEN STUDIO ACADEMIC SERVICES</span><a href="mailto:946883902@qq.com">提交资源或反馈问题</a></div>
        </footer>
      </div>
    </main>
  </div>
</template>
