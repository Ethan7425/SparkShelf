// Forgiving search: every word in the query must match some word in the save,
// either as a substring or within a small typo distance.

function normalize(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('en')
}

function words(text) {
  return normalize(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean)
}

// Levenshtein distance, giving up early once it exceeds `max`
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
      rowMin = Math.min(rowMin, current[j])
    }
    if (rowMin > max) return max + 1
    previous = current
  }
  return previous[b.length]
}

function allowedTypos(word) {
  if (word.length >= 7) return 2
  if (word.length >= 4) return 1
  return 0
}

function wordMatches(queryWord, saveWords, saveText) {
  if (saveText.includes(queryWord)) return true
  const typos = allowedTypos(queryWord)
  if (!typos) return false
  // Compare against the start of each word too, so "noodl" with a typo still finds "noodles"
  return saveWords.some((word) => (
    editDistance(queryWord, word, typos) <= typos
    || (word.length > queryWord.length && editDistance(queryWord, word.slice(0, queryWord.length), typos) <= typos)
  ))
}

export function matchesSearch(save, query) {
  const queryWords = words(query)
  if (queryWords.length === 0) return true
  const text = `${save.title ?? ''} ${save.note ?? ''} ${(save.tags ?? []).join(' ')} ${save.link}`
  const saveText = normalize(text)
  const saveWords = words(text)
  return queryWords.every((word) => wordMatches(word, saveWords, saveText))
}
