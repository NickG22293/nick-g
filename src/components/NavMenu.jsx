import styles from './NavMenu.module.css'

const ITEMS = [
  {
    key: 'writing',
    label: 'Writing',
    href: 'https://www.nick-gordon.com/writing',
    description: 'Short fiction, essays, and other creative work.',
    color: 'cyan',
    icon: '✎',
  },
  {
    key: 'fantasy-bot',
    label: 'Fantasy Bot',
    href: 'https://www.nick-gordon.com/fantasy-bot',
    description: 'AI companion for Yahoo & ESPN fantasy hockey.',
    color: 'gold',
    icon: '⬡',
  },
]

export default function NavMenu() {
  return (
    <ul className={styles.list} role="list">
      {ITEMS.map(item => (
        <li key={item.key}>
          <a
            href={item.href}
            className={`${styles.item} ${styles[item.color]}`}
          >
            <div className={styles.row}>
              <span className={styles.arrow}>▶</span>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
            <p className={styles.desc}>{item.description}</p>
          </a>
        </li>
      ))}
    </ul>
  )
}
