import { defaultProjects } from '../data/defaultProjects.js'

export const PHASE_OPTIONS = [
  'Prototype',
  'In development',
  'Concept',
  'Live',
  'Paused',
]

const SLUG_RE = /[^a-z0-9]+/g

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(SLUG_RE, '-')
    .replace(/^-|-$/g, '')
}

/** Normalize legacy `status` → `phase` and default `visible`. */
export function normalizeProject(raw) {
  return {
    id: raw.id || slugify(raw.name || 'project'),
    name: raw.name?.trim() || 'Untitled',
    tagline: raw.tagline?.trim() || '',
    description: raw.description?.trim() || '',
    phase: (raw.phase || raw.status || 'Concept').trim(),
    visible: raw.visible !== false,
    accent: raw.accent || '#7c9cff',
    url: raw.url?.trim() || '#',
  }
}

export function normalizeProjects(list) {
  if (!Array.isArray(list)) return defaultProjects.map(normalizeProject)
  return list.map(normalizeProject)
}

export function visibleProjects(projects) {
  return projects.filter((p) => p.visible)
}

export function createEmptyProject() {
  return normalizeProject({
    id: `project-${Date.now()}`,
    name: 'New Project',
    tagline: '',
    description: '',
    phase: 'Concept',
    visible: false,
    accent: '#7c9cff',
    url: '#',
  })
}
