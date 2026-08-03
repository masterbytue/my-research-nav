export interface Resource {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
  accent: string
  featured?: boolean
}

export interface ResourceCategory {
  id: string
  label: string
  index: string
  description: string
  resources: Resource[]
}

export interface SearchEngine {
  id: string
  name: string
  searchUrl: string
}
