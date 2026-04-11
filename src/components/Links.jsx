import styles from './Links.module.css'

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/NickG22293' },
  // Add more links here, e.g.:
  // { label: 'LinkedIn', href: 'https://linkedin.com/in/nickgordon' },
  // { label: 'Twitter',  href: 'https://twitter.com/nickgordon' },
]

export default function Links() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.prompt}>
        <span className={styles.promptUser}>nick@gordon</span>
        <span className={styles.promptSep}>:</span>
        <span className={styles.promptPath}>~</span>
        <span className={styles.promptDollar}>$</span>
        <span className={styles.promptCmd}> cat links.txt</span>
      </div>
      <ul className={styles.list} role="list">
        {LINKS.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.bracket}>[</span>
              {link.label}
              <span className={styles.bracket}>]</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
