import { useEffect, useRef, useState } from 'react'
import styles from './DocViewer.module.css'

export default function DocViewer({ bookId, sectionId }) {
  const [state, setState] = useState({ status: 'idle', title: null, blocks: [] })
  const abortRef = useRef(null)

  useEffect(() => {
    if (!bookId || !sectionId) {
      setState({ status: 'idle', title: null, blocks: [] })
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ status: 'loading', title: null, blocks: [] })

    fetch(`/api/docs/${encodeURIComponent(bookId)}/${encodeURIComponent(sectionId)}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) return res.json().then(j => Promise.reject(new Error(j.error ?? res.statusText)))
        return res.json()
      })
      .then(data => setState({ status: 'ready', title: data.title, blocks: data.blocks }))
      .catch(err => {
        if (err.name === 'AbortError') return
        setState({ status: 'error', error: err.message, title: null, blocks: [] })
      })

    return () => controller.abort()
  }, [bookId, sectionId])

  if (state.status === 'idle')    return <EmptyState />
  if (state.status === 'loading') return <Loading />
  if (state.status === 'error')   return <ErrorView message={state.error} />

  return (
    <article className={styles.page}>
      {state.title && <h1 className={styles.docTitle}>{state.title}</h1>}
      <div className={styles.body}>
        {state.blocks.map((block, i) => <Block key={i} block={block} />)}
      </div>
    </article>
  )
}

// ── Block renderer ─────────────────────────────────────────────────────────────

function Block({ block }) {
  switch (block.type) {
    case 'title':
      return <h1 className={styles.title}><Runs runs={block.runs} /></h1>
    case 'subtitle':
      return <h2 className={styles.subtitle}><Runs runs={block.runs} /></h2>
    case 'heading':
      return <Heading level={block.level} runs={block.runs} />
    case 'paragraph': {
      if (!block.runs || block.runs.every(r => !r.text)) {
        return <div className={styles.spacer} />
      }
      return <p className={styles.paragraph}><Runs runs={block.runs} /></p>
    }
    case 'list-item':
      return (
        <div
          className={`${styles.listItem} ${block.ordered ? styles.ordered : styles.unordered}`}
          style={{ '--level': block.level }}
        >
          <span className={styles.bullet}>{block.ordered ? `${block.level + 1}.` : '•'}</span>
          <span><Runs runs={block.runs} /></span>
        </div>
      )
    case 'page-break':
      return <div className={styles.pageBreak} aria-hidden="true" />
    case 'hr':
      return <hr className={styles.hr} />
    default:
      return null
  }
}

const HEADING_CLASS = ['', styles.h1, styles.h2, styles.h3, styles.h4, styles.h5, styles.h6]

function Heading({ level, runs }) {
  const Tag = `h${level}`
  return <Tag className={HEADING_CLASS[level] ?? styles.h6}><Runs runs={runs} /></Tag>
}

function Runs({ runs }) {
  if (!runs) return null
  return runs.map((run, i) => {
    let el = run.text
    if (run.bold)        el = <strong key={`b${i}`}>{el}</strong>
    if (run.italic)      el = <em key={`i${i}`}>{el}</em>
    if (run.underline && !run.link) el = <u key={`u${i}`}>{el}</u>
    if (run.strikethrough) el = <s key={`s${i}`}>{el}</s>
    if (run.link)        el = (
      <a key={`a${i}`} href={run.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {el}
      </a>
    )
    return <span key={i}>{el}</span>
  })
}

// ── States ─────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>✎</div>
      <p>Select a section from the left to begin reading.</p>
    </div>
  )
}

function Loading() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.loadingDots}><span /><span /><span /></div>
      <p>Loading document…</p>
    </div>
  )
}

function ErrorView({ message }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.errorIcon}>⚠</div>
      <p className={styles.errorMsg}>{message}</p>
    </div>
  )
}
