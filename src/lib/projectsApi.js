import { defaultProjects } from '../data/defaultProjects.js'
import { normalizeProjects } from './projectUtils.js'

const API = '/api/projects'

export async function fetchProjects() {
  try {
    const res = await fetch(API)
    if (res.ok) {
      const data = await res.json()
      return normalizeProjects(data)
    }
  } catch {
    /* fall through */
  }

  try {
    const res = await fetch('/projects.json')
    if (res.ok) {
      const data = await res.json()
      return normalizeProjects(data)
    }
  } catch {
    /* fall through */
  }

  return normalizeProjects(defaultProjects)
}

export async function saveProjects(projects, password) {
  const res = await fetch(API, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`,
    },
    body: JSON.stringify(projects),
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(body.error || `Save failed (${res.status})`)
  }

  return normalizeProjects(body.projects ?? projects)
}
