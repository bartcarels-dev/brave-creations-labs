import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLogin from '../components/admin/AdminLogin.jsx'
import ProjectForm from '../components/admin/ProjectForm.jsx'
import { useProjects } from '../hooks/useProjects.js'
import { saveProjects } from '../lib/projectsApi.js'
import {
  createEmptyProject,
  normalizeProject,
  normalizeProjects,
} from '../lib/projectUtils.js'

const SESSION_KEY = 'brave-admin-session'

export default function Admin() {
  const { projects, loading, reload } = useProjects()
  const [draft, setDraft] = useState([])
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [loginError, setLoginError] = useState('')
  const [saveStatus, setSaveStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  const isAuthed = Boolean(password)

  useEffect(() => {
    if (projects.length > 0) {
      setDraft(normalizeProjects(projects))
    }
  }, [projects])

  function handleLogin(pwd) {
    sessionStorage.setItem(SESSION_KEY, pwd)
    setPassword(pwd)
    setLoginError('')
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setPassword('')
  }

  function updateProject(id, updated) {
    setDraft((list) =>
      list.map((p) =>
        p.id === id ? normalizeProject({ ...updated, id: p.id }) : p,
      ),
    )
  }

  function removeProject(id) {
    setDraft((list) => list.filter((p) => p.id !== id))
  }

  function addProject() {
    setDraft((list) => [...list, createEmptyProject()])
  }

  async function handleSave() {
    setSaving(true)
    setSaveStatus(null)
    try {
      const saved = await saveProjects(draft, password)
      setDraft(saved)
      setSaveStatus({ type: 'success', message: 'Projects saved. Changes are live.' })
      await reload()
    } catch (err) {
      if (err.message?.toLowerCase().includes('unauthorized')) {
        handleLogout()
        setLoginError('Invalid password. Please sign in again.')
        return
      }
      setSaveStatus({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthed) {
    return (
      <main className="app__main app__main--narrow">
        <Link to="/" className="admin-back">
          ← Back to hub
        </Link>
        <AdminLogin
          onLogin={handleLogin}
          error={loginError}
        />
      </main>
    )
  }

  return (
    <main className="app__main app__main--admin">
      <header className="admin-header">
        <div>
          <Link to="/" className="admin-back">
            ← Back to hub
          </Link>
          <h1 className="admin-header__title">Project admin</h1>
          <p className="admin-header__subtitle">
            Edit title, tagline, description, phase, visibility, and URLs.
            Hidden projects stay off the public hub.
          </p>
        </div>
        <div className="admin-header__actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={addProject}
          >
            Add project
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      {saveStatus && (
        <p
          className={`admin-banner admin-banner--${saveStatus.type}`}
          role="alert"
        >
          {saveStatus.message}
        </p>
      )}

      {loading && <p className="projects__state">Loading…</p>}

      <div className="admin-list">
        {draft.map((project) => (
          <ProjectForm
            key={project.id}
            project={project}
            onChange={(updated) => updateProject(project.id, updated)}
            onRemove={removeProject}
          />
        ))}
      </div>
    </main>
  )
}
