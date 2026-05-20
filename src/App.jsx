import Header from './components/Header.jsx'
import Intro from './components/Intro.jsx'
import ProjectGrid from './components/ProjectGrid.jsx'
import Footer from './components/Footer.jsx'
import { projects } from './data/projects.js'

export default function App() {
  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__orb app__orb--1" />
        <div className="app__orb app__orb--2" />
        <div className="app__grid" />
      </div>
      <main className="app__main">
        <Header />
        <Intro />
        <ProjectGrid projects={projects} />
      </main>
      <Footer />
    </div>
  )
}
