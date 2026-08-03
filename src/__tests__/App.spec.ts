import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.querySelector('meta[name="theme-color"]')?.remove()
  })

  it('renders the research workspace and resource catalogue', () => {
    const wrapper = mount(App)
    expect(wrapper.get('h1').text()).toContain('研途学术资源导航')
    expect(wrapper.text()).toContain('文献检索')
    expect(wrapper.text()).toContain('Zotero')
    expect(wrapper.text()).toContain('砺文工作室')
  })

  it('filters resources by name, description, and tag', async () => {
    const wrapper = mount(App)
    await wrapper.get('input[type="search"]').setValue('文献管理')

    expect(wrapper.text()).toContain('Zotero')
    expect(wrapper.text()).not.toContain('DeepSeek')
    expect(wrapper.text()).toContain('找到 1 个')
  })

  it('stores favorites locally and surfaces them on the personal shelf', async () => {
    const wrapper = mount(App)
    const zoteroCard = wrapper.findAll('.resource-card').find((card) => card.text().includes('Zotero'))
    expect(zoteroCard).toBeDefined()

    await zoteroCard!.get('.favorite-button').trigger('click')
    expect(zoteroCard!.get('.favorite-button').attributes('aria-pressed')).toBe('true')
    expect(wrapper.text()).toContain('我的收藏')
  })

  it('opens the selected academic search engine', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const wrapper = mount(App)
    await wrapper.get('input[type="search"]').setValue('graph neural networks')
    await wrapper.get('.submit-search').trigger('click')

    expect(open).toHaveBeenCalledWith(
      'https://scholar.google.com/scholar?q=graph%20neural%20networks',
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('switches theme and keeps browser chrome in sync', async () => {
    const themeColor = document.createElement('meta')
    themeColor.name = 'theme-color'
    themeColor.content = '#113752'
    document.head.append(themeColor)

    const wrapper = mount(App)
    await wrapper.get('[aria-label="切换到夜间主题"]').trigger('click')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(themeColor.content).toBe('#111820')
    expect(window.localStorage.getItem('research-nav:theme')).toBe('"dark"')
  })

  it('records a visited resource and shows it on the personal shelf', async () => {
    const wrapper = mount(App)
    const zoteroCard = wrapper.findAll('.resource-card').find((card) => card.text().includes('Zotero'))
    expect(zoteroCard).toBeDefined()

    await zoteroCard!.get('a').trigger('click')

    expect(wrapper.text()).toContain('最近访问')
    expect(window.localStorage.getItem('research-nav:recents')).toBe('["zotero"]')
  })

  it('focuses search with slash, clears with Escape, and renders the empty state', async () => {
    const wrapper = mount(App, { attachTo: document.body })
    const input = wrapper.get<HTMLInputElement>('input[type="search"]')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
    expect(document.activeElement).toBe(input.element)

    await input.setValue('不存在的学术资源xyz')
    expect(wrapper.text()).toContain('暂时没有匹配项')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(input.element.value).toBe('')
    expect(wrapper.text()).not.toContain('暂时没有匹配项')

    wrapper.unmount()
  })

  it('ignores stored workspace values with an invalid shape', () => {
    window.localStorage.setItem('research-nav:favorites', '{}')
    window.localStorage.setItem('research-nav:recents', '"not-an-array"')
    window.localStorage.setItem('research-nav:theme', '"sepia"')

    const wrapper = mount(App)
    expect(wrapper.text()).not.toContain('我的收藏')
    expect(wrapper.text()).not.toContain('最近访问')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
