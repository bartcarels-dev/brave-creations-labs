import { PHASE_OPTIONS } from '../../lib/projectUtils.js'

export default function ProjectForm({ project, onChange, onRemove }) {
  function update(field, value) {
    onChange({ ...project, [field]: value })
  }

  return (
    <article className="admin-card">
      <div className="admin-card__header">
        <h3 className="admin-card__title">{project.name || 'Untitled'}</h3>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={project.visible}
            onChange={(e) => update('visible', e.target.checked)}
          />
          <span className="admin-toggle__track" />
          <span className="admin-toggle__label">
            {project.visible ? 'Visible' : 'Hidden'}
          </span>
        </label>
      </div>

      <div className="admin-card__fields">
        <label className="admin-field">
          <span className="admin-field__label">Title</span>
          <input
            className="admin-field__input"
            value={project.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Tagline</span>
          <input
            className="admin-field__input"
            value={project.tagline}
            onChange={(e) => update('tagline', e.target.value)}
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Description</span>
          <textarea
            className="admin-field__input admin-field__input--area"
            rows={3}
            value={project.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Phase</span>
          <input
            className="admin-field__input"
            list={`phase-options-${project.id}`}
            value={project.phase}
            onChange={(e) => update('phase', e.target.value)}
          />
          <datalist id={`phase-options-${project.id}`}>
            {PHASE_OPTIONS.map((phase) => (
              <option key={phase} value={phase} />
            ))}
          </datalist>
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Project URL</span>
          <input
            className="admin-field__input"
            type="url"
            value={project.url}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://"
          />
        </label>

        <label className="admin-field admin-field--inline">
          <span className="admin-field__label">Accent color</span>
          <input
            className="admin-field__color"
            type="color"
            value={project.accent}
            onChange={(e) => update('accent', e.target.value)}
          />
          <span className="admin-field__mono">{project.accent}</span>
        </label>
      </div>

      <button
        type="button"
        className="admin-btn admin-btn--danger admin-btn--ghost"
        onClick={() => onRemove(project.id)}
      >
        Remove project
      </button>
    </article>
  )
}
