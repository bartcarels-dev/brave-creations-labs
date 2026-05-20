import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Redis } from '@upstash/redis'

const STORAGE_KEY = 'brave-creations:projects'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

async function readStaticProjects() {
  try {
    const filePath = join(process.cwd(), 'public', 'projects.json')
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function checkAuth(req) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  return token === expected
}

export default async function handler(req, res) {
  const redis = getRedis()

  if (req.method === 'GET') {
    try {
      if (redis) {
        const stored = await redis.get(STORAGE_KEY)
        if (stored) {
          return res.status(200).json(stored)
        }
      }

      const staticData = await readStaticProjects()
      if (staticData) {
        return res.status(200).json(staticData)
      }

      return res.status(200).json([])
    } catch (err) {
      console.error('GET /api/projects', err)
      return res.status(500).json({ error: 'Failed to load projects' })
    }
  }

  if (req.method === 'PUT') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const projects = req.body
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Expected an array of projects' })
    }

    try {
      if (redis) {
        await redis.set(STORAGE_KEY, projects)
        return res.status(200).json({ ok: true, projects })
      }

      return res.status(503).json({
        error:
          'Storage not configured. Add Upstash Redis to your Vercel project, or save locally via npm run dev.',
      })
    } catch (err) {
      console.error('PUT /api/projects', err)
      return res.status(500).json({ error: 'Failed to save projects' })
    }
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed' })
}
