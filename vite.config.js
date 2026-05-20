import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'

function projectsApiPlugin() {
  const projectsPath = path.resolve('public', 'projects.json')

  return {
    name: 'projects-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      const adminPassword = env.ADMIN_PASSWORD || 'dev-admin'

      server.middlewares.use('/api/projects', async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'PUT') {
          return next()
        }

        res.setHeader('Content-Type', 'application/json')

        if (req.method === 'GET') {
          try {
            const raw = await fs.readFile(projectsPath, 'utf-8')
            res.statusCode = 200
            res.end(raw)
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to read projects' }))
          }
          return
        }

        const auth = req.headers.authorization || ''
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
        if (token !== adminPassword) {
          res.statusCode = 401
          res.end(JSON.stringify({ error: 'Unauthorized' }))
          return
        }

        try {
          const chunks = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          const body = Buffer.concat(chunks).toString('utf-8')
          const projects = JSON.parse(body)

          if (!Array.isArray(projects)) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Expected an array of projects' }))
            return
          }

          await fs.writeFile(
            projectsPath,
            `${JSON.stringify(projects, null, 2)}\n`,
            'utf-8',
          )

          res.statusCode = 200
          res.end(JSON.stringify({ ok: true, projects }))
        } catch (err) {
          console.error('PUT /api/projects', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Failed to save projects' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), projectsApiPlugin()],
})
