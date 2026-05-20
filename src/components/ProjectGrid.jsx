import ProjectCard from './ProjectCard.jsx'

export default function ProjectGrid({ projects }) {
  return (
    <section className="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="projects__heading">
        Projects
      </h2>
      <ul className="projects__grid">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}
