/**
 * Book structure for the /writing nav.
 *
 * This file defines titles, section labels, and ordering — no doc IDs.
 * Doc IDs live in books.config.json (gitignored, server-side only).
 *
 * To add a book:
 *   1. Add an entry here with its sections.
 *   2. Add the matching entry to books.config.json with the Google Doc IDs.
 *   3. Share each doc with your service account email (view-only).
 */

export const books = [
  {
    id: 'book-1',
    title: 'Book Title',
    sections: [
      { id: 'novel',      label: 'Novel' },
      { id: 'characters', label: 'Characters' },
      { id: 'setting',    label: 'Setting' },
    ],
    misc: [
      // { id: 'outline',  label: 'Outline' },
      // { id: 'timeline', label: 'Timeline' },
    ],
  },
  // {
  //   id: 'book-2',
  //   title: 'Another Book',
  //   sections: [
  //     { id: 'novel',      label: 'Novel' },
  //     { id: 'characters', label: 'Characters' },
  //     { id: 'setting',    label: 'Setting' },
  //   ],
  //   misc: [],
  // },
]

export function getAllSections(book) {
  return [...book.sections, ...book.misc]
}

export function findSection(bookId, sectionId) {
  const book = books.find(b => b.id === bookId)
  if (!book) return null
  return getAllSections(book).find(s => s.id === sectionId) ?? null
}
