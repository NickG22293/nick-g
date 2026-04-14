import { Link } from 'react-router-dom'
import styles from './NavMenu.module.css'

const ITEMS = [
  {
    key: 'writing',
    label: 'Writing',
    to: '/writing',         // internal route
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
      {ITEMS.map(item => {
        const className = `${styles.item} ${styles[item.color]}`
        const inner = (
          <>
            <div className={styles.row}>
              <span className={styles.arrow}>▶</span>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
            <p className={styles.desc}>{item.description}</p>
          </>
        )
        return (
          <li key={item.key}>
            {item.to
              ? <Link to={item.to} className={className}>{inner}</Link>
              : <a href={item.href} className={className}>{inner}</a>
            }
          </li>
        )
      })}
    </ul>
  )
}
