import 'dotenv/config'
import { readFileSync } from 'fs'
import express from 'express'
import cors from 'cors'
import { google } from 'googleapis'
import { parseDocument } from './docsParser.js'

const app = express()
const PORT = process.env.API_PORT ?? 3001

const corsOrigin = process.env.NODE_ENV === 'production'
  ? false
  : 'http://localhost:5173'

app.use(cors({ origin: corsOrigin }))
app.use(express.json())

// ── Books config ─────────────────────────────────────────────────────────────
// books.config.json maps bookId/sectionId → { docId, tabId? } or just "docId".
// It is gitignored — copy books.config.example.json to get started.

function loadBooksConfig() {
  const configPath = new URL('../books.config.json', import.meta.url).pathname
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Returns { docId, tabId } for a given book/section pair.
 * Config values may be a plain string (docId only) or { docId, tabId }.
 */
function resolveDocConfig(bookId, sectionId) {
  const config = loadBooksConfig()
  if (!config) return null

  const book = config.find(b => b.id === bookId)
  if (!book) return null

  const raw = book.sections?.[sectionId] ?? book.misc?.[sectionId] ?? null
  if (!raw) return null

  if (typeof raw === 'string') return { docId: raw, tabId: null }
  return { docId: raw.docId, tabId: raw.tabId ?? null }
}

// ── Google Auth ──────────────────────────────────────────────────────────────

function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON env var is not set. ' +
      'See .env.example for setup instructions.'
    )
  }
  let credentials
  try {
    credentials = JSON.parse(raw)
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.')
  }
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents.readonly'],
  })
}

// ── Shared doc fetcher ───────────────────────────────────────────────────────

async function fetchDoc(docId, tabId) {
  const auth = getAuthClient()
  const authClient = await auth.getClient()
  const docsApi = google.docs({ version: 'v1', auth: authClient })

  if (tabId) {
    // Fetch all tabs so we can locate the one we want by ID
    const response = await docsApi.documents.get({
      documentId: docId,
      includeTabsContent: true,
    })
    const doc = response.data
    const tab = (doc.tabs ?? []).find(t => t.tabProperties?.tabId === tabId)
    if (!tab) {
      const available = (doc.tabs ?? [])
        .map(t => `"${t.tabProperties?.tabId}" (${t.tabProperties?.title})`)
        .join(', ')
      throw Object.assign(
        new Error(`Tab "${tabId}" not found in document. Available tabs: ${available || 'none'}`),
        { status: 404 }
      )
    }
    return { title: doc.title, source: tab.documentTab }
  }

  // No tabId — fetch the whole doc (first/only tab by default)
  const response = await docsApi.documents.get({ documentId: docId })
  return { title: response.data.title, source: response.data }
}

// ── API Routes ───────────────────────────────────────────────────────────────

// Fetch and render a section's document content
app.get('/api/docs/:bookId/:sectionId', async (req, res) => {
  const { bookId, sectionId } = req.params

  if (!/^[\w-]+$/.test(bookId) || !/^[\w-]+$/.test(sectionId)) {
    return res.status(400).json({ error: 'Invalid book or section ID.' })
  }

  const cfg = resolveDocConfig(bookId, sectionId)

  if (!cfg) {
    if (!loadBooksConfig()) {
      return res.status(503).json({
        error: 'books.config.json not found. Copy books.config.example.json and fill in your doc IDs.'
      })
    }
    return res.status(404).json({ error: 'No document configured for this section.' })
  }

  try {
    const { title, source } = await fetchDoc(cfg.docId, cfg.tabId)
    const blocks = parseDocument(source)
    res.json({ title, blocks })
  } catch (err) {
    console.error('[/api/docs]', err.message)
    const status = err.status ?? err.code ?? 500
    if (status === 403) {
      return res.status(403).json({
        error: 'The service account does not have access to this document. ' +
               'Share the doc with the service account email (view-only) and try again.'
      })
    }
    if (status === 404) return res.status(404).json({ error: err.message })
    if (err.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
      return res.status(500).json({ error: err.message })
    }
    res.status(500).json({ error: 'Failed to fetch document.' })
  }
})

// List the tabs in a document — useful for finding tab IDs to put in config
app.get('/api/tabs/:docId', async (req, res) => {
  const { docId } = req.params

  if (!/^[A-Za-z0-9_-]{10,}$/.test(docId)) {
    return res.status(400).json({ error: 'Invalid document ID.' })
  }

  try {
    const auth = getAuthClient()
    const authClient = await auth.getClient()
    const docsApi = google.docs({ version: 'v1', auth: authClient })

    const response = await docsApi.documents.get({
      documentId: docId,
      includeTabsContent: false,
    })

    const tabs = (response.data.tabs ?? []).map(t => ({
      tabId: t.tabProperties?.tabId,
      title: t.tabProperties?.title,
      index: t.tabProperties?.index,
    }))

    res.json({ documentTitle: response.data.title, tabs })
  } catch (err) {
    console.error('[/api/tabs]', err.message)
    res.status(err.code ?? 500).json({ error: err.message })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ── Production: serve Vite build ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = new URL('../dist', import.meta.url).pathname
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: distPath })
  })
}

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})
