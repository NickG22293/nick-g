import { useState, useEffect, useRef } from 'react'
import styles from './BootSequence.module.css'

const LINES = [
  { text: 'NICK-GORDON-OS v2.0.1 (tty1)', color: 'gold',   delay: 0   },
  { text: 'Loading kernel modules........... OK', color: 'green',  delay: 120 },
  { text: 'Starting filesystem check........ OK', color: 'green',  delay: 230 },
  { text: 'Mounting /home/nick.............. OK', color: 'green',  delay: 340 },
  { text: 'Initializing network stack....... OK', color: 'green',  delay: 450 },
  { text: 'Starting personal-site.service.. OK', color: 'green',  delay: 560 },
  { text: '', color: 'fg', delay: 660 },
  { text: 'Welcome, traveller.', color: 'cyan', delay: 720 },
]

export default function BootSequence({ onComplete }) {
  const [visible, setVisible] = useState([])
  const doneRef = useRef(false)

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, line])
        if (i === LINES.length - 1 && !doneRef.current) {
          doneRef.current = true
          setTimeout(onComplete, 420)
        }
      }, line.delay)
    })
  }, [onComplete])

  return (
    <div className={styles.boot}>
      {visible.map((line, i) => (
        <div key={i} className={`${styles.line} ${styles[line.color]}`}>
          {line.text}
          {i === visible.length - 1 && <span className={styles.cursor} />}
        </div>
      ))}
    </div>
  )
}
