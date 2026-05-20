export default function ProjectCard({ project }) {
  const { name, tagline, description, phase, accent, url } = project

  return (
    <article
      className="project-card"
      style={{ '--accent': accent }}
    >
      <div className="project-card__glow" aria-hidden="true" />
      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__status">{phase}</span>
        </div>
        <h3 className="project-card__title">{name}</h3>
        <p className="project-card__tagline">{tagline}</p>
        <p className="project-card__description">{description}</p>
        <a
          href={url}
          className="project-card__btn"
          target={url.startsWith('http') ? '_blank' : undefined}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          Open project
          <span className="project-card__btn-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </article>
  )
}
