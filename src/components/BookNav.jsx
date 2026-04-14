import { useState } from 'react'
import { books, getAllSections } from '../data/books'
import styles from './BookNav.module.css'

export default function BookNav({ bookId, sectionId, onSelect }) {
  // Track which books are expanded; default to expanding the active one
  const [expanded, setExpanded] = useState(
    () => new Set(bookId ? [bookId] : books.length > 0 ? [books[0].id] : [])
  )

  function toggleBook(id) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <nav className={styles.nav} aria-label="Book navigation">
      <div className={styles.header}>
        <span className={styles.headerPrompt}>nick@gordon:~$</span>
        <span className={styles.headerCmd}> ls writing/</span>
      </div>

      <ul className={styles.bookList} role="list">
        {books.map(book => {
          const isExpanded = expanded.has(book.id)
          const sections = getAllSections(book)

          return (
            <li key={book.id} className={styles.bookItem}>
              <button
                className={`${styles.bookBtn} ${book.id === bookId ? styles.activeBook : ''}`}
                onClick={() => toggleBook(book.id)}
                aria-expanded={isExpanded}
              >
                <span className={`${styles.caret} ${isExpanded ? styles.caretOpen : ''}`}>▶</span>
                <span className={styles.bookTitle}>{book.title}</span>
              </button>

              {isExpanded && (
                <ul className={styles.sectionList} role="list">
                  {sections.map(section => {
                    const isActive = book.id === bookId && section.id === sectionId
                    return (
                      <li key={section.id}>
                        <button
                          className={`${styles.sectionBtn} ${isActive ? styles.activeSection : ''}`}
                          onClick={() => onSelect(book.id, section.id)}
                        >
                          <span className={styles.sectionIcon}>
                            {getSectionIcon(section.id)}
                          </span>
                          <span>{section.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function getSectionIcon(id) {
  const icons = {
    novel:      '📖',
    characters: '👤',
    setting:    '🗺',
  }
  return icons[id] ?? '📄'
}
