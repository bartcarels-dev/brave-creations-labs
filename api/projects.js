import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Redis } from '@upstash/redis'
import { head, put } from '@vercel/blob'

const REDIS_KEY = 'brave-creations:projects'
const BLOB_PATH = 'projects.json'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
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

async function readFromBlob() {
  if (!hasBlobStorage()) return null

  try {
    const meta = await head(BLOB_PATH, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    const res = await fetch(meta.url)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function writeToBlob(projects) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is missing. Redeploy after connecting Blob storage.')
  }

  await put(BLOB_PATH, JSON.stringify(projects, null, 2), {
    access: 'public',
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

async function writeToRedis(redis, projects) {
  await redis.set(REDIS_KEY, projects)
}

function checkAuth(req) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  return token === expected
}

function storageSetupHint() {
  return (
    'Saving is not configured on Vercel yet. In your project dashboard: ' +
    'Storage → Create → Blob, then set ADMIN_PASSWORD and redeploy. ' +
    'Locally, use npm run dev to save to public/projects.json.'
  )
}

async function readJsonBody(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf-8').trim()
  if (!raw) return null
  return JSON.parse(raw)
}

function errorMessage(err) {
  if (err instanceof Error) return err.message
  return String(err)
}

async function loadProjects() {
  if (hasBlobStorage()) {
    const blobData = await readFromBlob()
    if (blobData) return blobData
  }

  const redis = getRedis()
  if (redis) {
    const stored = await redis.get(REDIS_KEY)
    if (stored) return stored
  }

  return readStaticProjects()
}

async function persistProjects(projects) {
  if (hasBlobStorage()) {
    try {
      await writeToBlob(projects)
      return { ok: true, projects, storage: 'blob' }
    } catch (err) {
      throw new Error(`Blob save failed: ${errorMessage(err)}`)
    }
  }

  const redis = getRedis()
  if (redis) {
    try {
      await writeToRedis(redis, projects)
      return { ok: true, projects, storage: 'redis' }
    } catch (err) {
      throw new Error(`Redis save failed: ${errorMessage(err)}`)
    }
  }

  throw new Error(storageSetupHint())
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await loadProjects()
      return res.status(200).json(data ?? [])
    } catch (err) {
      console.error('GET /api/projects', err)
      return res.status(500).json({ error: 'Failed to load projects' })
    }
  }

  if (req.method === 'PUT') {
    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        error: 'ADMIN_PASSWORD is not set in Vercel environment variables.',
      })
    }

    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    let projects
    try {
      projects = await readJsonBody(req)
    } catch (err) {
      console.error('PUT /api/projects parse', err)
      return res.status(400).json({ error: 'Invalid JSON body' })
    }

    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Expected an array of projects' })
    }

    try {
      const result = await persistProjects(projects)
      return res.status(200).json(result)
    } catch (err) {
      console.error('PUT /api/projects', err)
      const message = errorMessage(err)
      const status = message.includes('not configured') ? 503 : 500
      return res.status(status).json({ error: message })
    }
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed' })
}
