import { Analytics } from '@vercel/analytics/react'
import { Outlet } from 'react-router-dom'

export default function AppShell() {
  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true">
        <div className="app__orb app__orb--1" />
        <div className="app__orb app__orb--2" />
        <div className="app__grid" />
      </div>
      <Outlet />
      <Analytics />
    </div>
  )
}
