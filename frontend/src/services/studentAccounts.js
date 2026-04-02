import { parseCsv } from '../utils/parseCsv'

let cachedAccounts = null

const norm = (v) => String(v ?? '').trim()
const lower = (v) => norm(v).toLowerCase()

const findHeaderIndex = (headers, candidates) => {
  const map = headers.map((h) => lower(h))
  for (const c of candidates) {
    const idx = map.indexOf(lower(c))
    if (idx !== -1) return idx
  }
  return -1
}

export const loadStudentAccounts = async ({ bustCache = false } = {}) => {
  if (!bustCache && cachedAccounts) return cachedAccounts

  // Prefer JSON
  try {
    const resJson = await fetch('/students.json', { cache: 'no-store' })
    if (resJson.ok) {
      const raw = await resJson.json()
      const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.students) ? raw.students : []

      cachedAccounts = arr
        .map((s, i) => ({
          id: `acc-${i + 1}`,
          name: norm(s?.name),
          studentId: norm(s?.studentId),
          email: norm(s?.email),
          username: norm(s?.username),
          password: norm(s?.password),
          batch: norm(s?.batch),
          section: norm(s?.section),
          isCR: Boolean(s?.isCR),
          photoDataUrl: norm(s?.photoDataUrl),
        }))
        .filter((a) => a.username && a.password)

      return cachedAccounts
    }
  } catch (_) {
    // fall through
  }

  // Fallback: CSV (legacy)
  const res = await fetch('/students.csv', { cache: 'no-store' })
  if (!res.ok) {
    cachedAccounts = []
    return cachedAccounts
  }

  const text = await res.text()
  const rows = parseCsv(text)
    .map((r) => r.map((c) => norm(c)))
    .filter((r) => r.some((c) => c !== ''))

  if (rows.length === 0) {
    cachedAccounts = []
    return cachedAccounts
  }

  const headers = rows[0]
  const data = rows.slice(1)

  const idxName = findHeaderIndex(headers, ['name', 'full name'])
  const idxId = findHeaderIndex(headers, ['studentid', 'student id', 'id'])
  const idxEmail = findHeaderIndex(headers, ['email'])
  const idxUsername = findHeaderIndex(headers, ['username', 'user', 'user name'])
  const idxPassword = findHeaderIndex(headers, ['password', 'pass'])
  const idxBatch = findHeaderIndex(headers, ['batch'])

  cachedAccounts = data
    .map((r, i) => {
      const username = idxUsername >= 0 ? norm(r[idxUsername]) : ''
      const password = idxPassword >= 0 ? norm(r[idxPassword]) : ''

      return {
        id: `acc-${i + 1}`,
        name: idxName >= 0 ? norm(r[idxName]) : '',
        studentId: idxId >= 0 ? norm(r[idxId]) : '',
        email: idxEmail >= 0 ? norm(r[idxEmail]) : '',
        username,
        password,
        batch: idxBatch >= 0 ? norm(r[idxBatch]) : '',
        section: '',
        isCR: false,
        photoDataUrl: '',
      }
    })
    .filter((a) => a.username && a.password)

  return cachedAccounts
}
