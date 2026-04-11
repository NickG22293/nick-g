import { useState } from 'react'
import BootSequence from './components/BootSequence'
import Terminal from './components/Terminal'
import styles from './App.module.css'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <div className={styles.root}>
      {!booted ? (
        <BootSequence onComplete={() => setBooted(true)} />
      ) : (
        <Terminal />
      )}
    </div>
  )
}
