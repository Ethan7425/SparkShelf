import { useEffect, useState } from 'react'

const STORAGE_KEY = 'saves'

function readSaves() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useSaves() {
  const [saves, setSaves] = useState(readSaves)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
  }, [saves])

  function addSave({ link, title, note, tags }) {
    const save = {
      id: newId(),
      link,
      title,
      note,
      tags,
      createdAt: Date.now(),
      starred: false,
    }
    setSaves((current) => [save, ...current])
    return save
  }

  function updateSave(id, changes) {
    setSaves((current) => current.map((save) => (
      save.id === id ? { ...save, ...changes } : save
    )))
  }

  function deleteSave(id) {
    setSaves((current) => current.filter((save) => save.id !== id))
  }

  function removeTagFromSaves(tag) {
    setSaves((current) => current.map((save) => (
      save.tags?.includes(tag) ? { ...save, tags: save.tags.filter((item) => item !== tag) } : save
    )))
  }

  // Adds saves from a backup, skipping ones already here (same id or same link).
  function importSaves(incoming) {
    const knownIds = new Set(saves.map((save) => save.id))
    const knownLinks = new Set(saves.map((save) => save.link))
    const additions = []
    let skipped = 0

    for (const save of incoming) {
      // Only real Instagram links; a hand-edited backup must not smuggle in other URLs
      const validLink = typeof save?.link === 'string' && /^https:\/\/(www\.)?instagram\.com\//i.test(save.link)
      if (!validLink || knownLinks.has(save.link) || knownIds.has(save.id)) {
        skipped += 1
        continue
      }
      knownLinks.add(save.link)
      const id = typeof save.id === 'string' && save.id ? save.id : newId()
      knownIds.add(id)
      additions.push({
        id,
        link: save.link,
        title: typeof save.title === 'string' ? save.title : '',
        note: typeof save.note === 'string' ? save.note : '',
        tags: Array.isArray(save.tags) ? save.tags.filter((tag) => typeof tag === 'string') : [],
        createdAt: Number.isFinite(save.createdAt) ? save.createdAt : Date.now(),
        starred: Boolean(save.starred),
      })
    }

    if (additions.length) setSaves((current) => [...current, ...additions])
    return { added: additions.length, skipped }
  }

  return { saves, addSave, updateSave, deleteSave, removeTagFromSaves, importSaves }
}