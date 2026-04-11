import { useEffect, useState } from 'react'
import AsciiPhoto from './AsciiPhoto'
import NavMenu from './NavMenu'
import Links from './Links'
import styles from './Terminal.module.css'

export default function Terminal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Small delay so the fade-in feels intentional after boot
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`${styles.window} ${visible ? styles.visible : ''}`}>
      {/* Title bar */}
      <div className={styles.titleBar}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.gold}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={styles.title}>nick@gordon — bash</span>
        <div className={styles.dotsSpacer} />
      </div>

      {/* Prompt header */}
      <div className={styles.promptHeader}>
        <span className={styles.promptUser}>nick@gordon</span>
        <span className={styles.promptSep}>:</span>
        <span className={styles.promptPath}>~</span>
        <span className={styles.promptDollar}>$</span>
        <span className={styles.promptCmd}> whoami</span>
      </div>

      {/* Big name */}
      <div className={styles.nameBlock}>
        <span className={styles.name}>Nick Gordon</span>
      </div>

      {/* Two-panel content */}
      <div className={styles.panels}>
        <div className={styles.photoPanel}>
          <AsciiPhoto />
        </div>
        <div className={styles.menuPanel}>
          <div className={styles.menuPrompt}>
            <span className={styles.promptUser}>nick@gordon</span>
            <span className={styles.promptSep}>:</span>
            <span className={styles.promptPath}>~</span>
            <span className={styles.promptDollar}>$</span>
            <span className={styles.promptCmd}> ls apps/</span>
          </div>
          <NavMenu />
        </div>
      </div>

      {/* Links bar */}
      <Links />
    </div>
  )
}
