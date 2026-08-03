import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders the research workspace and resource catalogue', () => {
    const wrapper = mount(App)
    expect(wrapper.get('h1').text()).toContain('把研究的路')
    expect(wrapper.text()).toContain('文献检索')
    expect(wrapper.text()).toContain('Zotero')
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
})
