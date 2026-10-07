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

export function useSaves() {
  const [saves, setSaves] = useState(readSaves)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
  }, [saves])

  function addSave({ link, title, note, tags }) {
    const save = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  return { saves, addSave, updateSave, deleteSave, removeTagFromSaves }
}