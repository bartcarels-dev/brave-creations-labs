import Header from '../components/Header.jsx'
import Intro from '../components/Intro.jsx'
import ProjectGrid from '../components/ProjectGrid.jsx'
import Footer from '../components/Footer.jsx'
import { useProjects } from '../hooks/useProjects.js'
import { visibleProjects } from '../lib/projectUtils.js'

export default function Home() {
  const { projects, loading, error } = useProjects()
  const shown = visibleProjects(projects)

  return (
    <>
      <main className="app__main">
        <Header />
        <Intro />
        {loading && (
          <p className="projects__state" role="status">
            Loading projects…
          </p>
        )}
        {error && (
          <p className="projects__state projects__state--error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && shown.length === 0 && (
          <p className="projects__state">No projects to show right now.</p>
        )}
        {!loading && shown.length > 0 && <ProjectGrid projects={shown} />}
      </main>
      <Footer />
    </>
  )
}
