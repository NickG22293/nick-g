import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import BootSequence from './components/BootSequence'
import Terminal from './components/Terminal'
import Writing from './pages/Writing'
import HockeyBot from './pages/HockeyBot'
import LoadedQuestions from './pages/LoadedQuestions'
import styles from './App.module.css'

const WRITING_ENABLED = import.meta.env.VITE_FEATURE_WRITING === 'true'

export default function App() {
  const [booted, setBooted] = useState(
    // If landing directly on a sub-page, skip the boot animation
    () => sessionStorage.getItem('booted') === 'true'
  )
  const location = useLocation()

  function handleBootComplete() {
    sessionStorage.setItem('booted', 'true')
    setBooted(true)
  }

  // Home page: show boot sequence on first visit, then the terminal
  const homePage = !booted
    ? <BootSequence onComplete={handleBootComplete} />
    : <Terminal />

  return (
    <div className={`${styles.root} ${location.pathname !== '/' ? styles.page : ''}`}>
      <Routes>
        <Route path="/" element={homePage} />
        {WRITING_ENABLED && <Route path="/writing" element={<Writing />} />}
        <Route path="/hockey-bot" element={<HockeyBot />} />
        <Route path="/loaded-questions" element={<LoadedQuestions />} />
      </Routes>
    </div>
  )
}
