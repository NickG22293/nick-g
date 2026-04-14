import { useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BookNav from '../components/BookNav'
import DocViewer from '../components/DocViewer'
import { books } from '../data/books'
import styles from './Writing.module.css'

export default function Writing() {
  const [searchParams, setSearchParams] = useSearchParams()

  const bookId    = searchParams.get('book')    ?? books[0]?.id ?? null
  const sectionId = searchParams.get('section') ?? null

  const handleSelect = useCallback((newBookId, newSectionId) => {
    setSearchParams({ book: newBookId, section: newSectionId }, { replace: false })
  }, [setSearchParams])

  // Auto-select the first section when a book is active but no section is chosen
  useEffect(() => {
    if (bookId && !sectionId) {
      const book = books.find(b => b.id === bookId)
      const first = book?.sections[0]
      if (first) setSearchParams({ book: bookId, section: first.id }, { replace: true })
    }
  }, [bookId, sectionId, setSearchParams])

  const activeBook = books.find(b => b.id === bookId)
  const activeSection = activeBook
    ? [...activeBook.sections, ...activeBook.misc].find(s => s.id === sectionId)
    : null

  return (
    <div className={styles.root}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.backLink}>
            <span className={styles.backArrow}>←</span>
            <span>terminal</span>
          </Link>
          <span className={styles.sep}>/</span>
          <span className={styles.headerTitle}>writing</span>
        </div>
        <div className={styles.headerRight}>
          {activeSection && <span className={styles.docLabel}>{activeSection.label}</span>}
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <BookNav bookId={bookId} sectionId={sectionId} onSelect={handleSelect} />
        </aside>
        <main className={styles.main}>
          <div className={styles.docWrap}>
            <DocViewer bookId={bookId} sectionId={sectionId} />
          </div>
        </main>
      </div>
    </div>
  )
}
