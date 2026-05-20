import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
