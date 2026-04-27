/**
 * Parse a Google Docs API document response into a simplified block array
 * that the frontend can render without knowing the Docs API schema.
 *
 * Block types returned:
 *   { type: 'title' | 'subtitle' | 'heading', level: 1-6, runs: Run[] }
 *   { type: 'paragraph', runs: Run[] }
 *   { type: 'list-item', ordered: boolean, level: number, runs: Run[] }
 *   { type: 'page-break' }
 *   { type: 'hr' }
 *
 * Run: { text: string, bold, italic, underline, strikethrough, link }
 */

/**
 * Parse a full document or a single tab's documentTab object.
 * Both shapes have { body, lists } at their top level, so this
 * works identically for either — just pass the right object in.
 *
 *   Whole doc:   parseDocument(response.data)
 *   Single tab:  parseDocument(tab.documentTab)
 */
export function parseDocument(doc) {
  if (!doc?.body?.content) return []

  // Build a map of list IDs to whether they're ordered
  const listOrdered = buildListMap(doc.lists)

  const blocks = []
  let currentList = null // tracks consecutive list items to group them

  for (const element of doc.body.content) {
    if (element.sectionBreak) {
      // Only emit page-break for explicit page breaks (not the opening section break)
      if (element.sectionBreak.sectionStyle?.sectionType === 'NEXT_PAGE') {
        flushList(blocks, currentList)
        currentList = null
        blocks.push({ type: 'page-break' })
      }
      continue
    }

    if (element.paragraph) {
      const para = element.paragraph
      const runs = parseRuns(para.elements)
      const styleType = para.paragraphStyle?.namedStyleType ?? 'NORMAL_TEXT'

      // Detect explicit page break inside paragraph elements
      if (para.elements?.some(el => el.pageBreak)) {
        flushList(blocks, currentList)
        currentList = null
        blocks.push({ type: 'page-break' })
        continue
      }

      // Skip empty paragraphs (just a newline)
      if (runs.length === 0 || (runs.length === 1 && runs[0].text.trim() === '')) {
        flushList(blocks, currentList)
        currentList = null
        blocks.push({ type: 'paragraph', runs: [{ text: '' }] })
        continue
      }

      if (para.bullet) {
        const listId = para.bullet.listId
        const level = para.bullet.nestingLevel ?? 0
        const ordered = listOrdered[listId] ?? false
        blocks.push({ type: 'list-item', ordered, level, runs })
        continue
      }

      flushList(blocks, currentList)
      currentList = null

      if (styleType === 'TITLE') {
        blocks.push({ type: 'title', runs })
      } else if (styleType === 'SUBTITLE') {
        blocks.push({ type: 'subtitle', runs })
      } else if (styleType.startsWith('HEADING_')) {
        const level = parseInt(styleType.replace('HEADING_', ''), 10)
        blocks.push({ type: 'heading', level, runs })
      } else {
        blocks.push({ type: 'paragraph', runs })
      }
    }
  }

  return blocks
}

function buildListMap(lists) {
  if (!lists) return {}
  const map = {}
  for (const [listId, list] of Object.entries(lists)) {
    const glyphType = list.listProperties?.nestingLevels?.[0]?.glyphType
    // DECIMAL or ALPHA_* = ordered; GLYPH_TYPE_UNSPECIFIED / bullet symbols = unordered
    map[listId] = glyphType && glyphType !== 'GLYPH_TYPE_UNSPECIFIED'
  }
  return map
}

function flushList() {
  // Lists are emitted inline as individual list-item blocks — nothing to flush
  // (kept for potential future grouping logic)
}

function parseRuns(elements) {
  if (!elements) return []
  const runs = []
  for (const el of elements) {
    if (el.textRun) {
      const text = el.textRun.content
      // Strip trailing newline from each run
      const cleaned = text.replace(/\n$/, '')
      if (cleaned === '') continue
      const style = el.textRun.textStyle ?? {}
      runs.push({
        text: cleaned,
        bold: style.bold ?? false,
        italic: style.italic ?? false,
        underline: style.underline ?? false,
        strikethrough: style.strikethrough ?? false,
        link: style.link?.url ?? null,
      })
    } else if (el.inlineObjectElement) {
      // Images/objects: skip for now
    }
  }
  return runs
}
