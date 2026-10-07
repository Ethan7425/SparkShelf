import { useEffect, useState } from 'react'
import { DEFAULT_TAG_ICON } from '../components/TagIcon.jsx'

const STORAGE_KEY = 'sparkshelf-tags'

export function cleanTagName(value) {
  return value.trim().replace(/^#+/, '').trim()
}

// First run: build the tag list from tags already used on saves.
function readTags(saves) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(stored)) return stored
  } catch {
    // fall through to seeding
  }
  const names = [...new Set(saves.flatMap((save) => save.tags ?? []))]
  return names.sort((a, b) => a.localeCompare(b, 'en')).map((name) => ({ name, icon: DEFAULT_TAG_ICON }))
}

export function useTags(saves) {
  const [tags, setTags] = useState(() => readTags(saves))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
    } catch {
      // storage unavailable; tags last for this session only
    }
  }, [tags])

  function addTag(name, icon) {
    const cleanName = cleanTagName(name)
    if (!cleanName) throw new Error('Give the tag a name.')
    if (tags.some((tag) => tag.name.toLocaleLowerCase('en') === cleanName.toLocaleLowerCase('en'))) {
      throw new Error('You already have that tag.')
    }
    setTags((current) => [...current, { name: cleanName, icon }])
  }

  function updateTagIcon(name, icon) {
    setTags((current) => current.map((tag) => (tag.name === name ? { ...tag, icon } : tag)))
  }

  function deleteTag(name) {
    setTags((current) => current.filter((tag) => tag.name !== name))
  }

  return { tags, addTag, updateTagIcon, deleteTag }
}
