import { computed, ref, watch } from 'vue'

const FAVORITES_KEY = 'research-nav:favorites'
const RECENTS_KEY = 'research-nav:recents'
const THEME_KEY = 'research-nav:theme'

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function useWorkspace() {
  const favoriteIds = ref<string[]>(readStored(FAVORITES_KEY, []))
  const recentIds = ref<string[]>(readStored(RECENTS_KEY, []))
  const initialTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  const theme = ref<'light' | 'dark'>(readStored(THEME_KEY, initialTheme))

  const favoriteSet = computed(() => new Set(favoriteIds.value))

  function toggleFavorite(id: string) {
    favoriteIds.value = favoriteSet.value.has(id)
      ? favoriteIds.value.filter((item) => item !== id)
      : [...favoriteIds.value, id]
  }

  function recordVisit(id: string) {
    recentIds.value = [id, ...recentIds.value.filter((item) => item !== id)].slice(0, 6)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(favoriteIds, (value) => window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(value)), { deep: true })
  watch(recentIds, (value) => window.localStorage.setItem(RECENTS_KEY, JSON.stringify(value)), { deep: true })
  watch(
    theme,
    (value) => {
      window.localStorage.setItem(THEME_KEY, JSON.stringify(value))
      document.documentElement.dataset.theme = value
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
        'content',
        value === 'dark' ? '#171b20' : '#153650',
      )
    },
    { immediate: true },
  )

  return { favoriteIds, favoriteSet, recentIds, theme, toggleFavorite, recordVisit, toggleTheme }
}
