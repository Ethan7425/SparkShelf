import { useEffect, useState } from 'react'
import { DEFAULT_TAG_ICON } from '../components/TagIcon.jsx'
import { DEFAULT_TAG_COLOR } from '../tagColors.js'

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
  return names.sort((a, b) => a.localeCompare(b, 'en')).map((name) => ({ name, icon: DEFAULT_TAG_ICON, color: DEFAULT_TAG_COLOR }))
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

  function addTag(name, icon, color = DEFAULT_TAG_COLOR) {
    const cleanName = cleanTagName(name)
    if (!cleanName) throw new Error('Give the tag a name.')
    if (tags.some((tag) => tag.name.toLocaleLowerCase('en') === cleanName.toLocaleLowerCase('en'))) {
      throw new Error('You already have that tag.')
    }
    setTags((current) => [...current, { name: cleanName, icon, color }])
  }

  function updateTag(name, changes) {
    setTags((current) => current.map((tag) => (tag.name === name ? { ...tag, ...changes } : tag)))
  }

  // Adds tags from a backup; existing tags keep their own icon and color.
  function mergeTags(incoming) {
    setTags((current) => {
      const known = new Set(current.map((tag) => tag.name.toLocaleLowerCase('en')))
      const additions = []
      for (const tag of incoming) {
        const name = typeof tag === 'string' ? cleanTagName(tag) : cleanTagName(tag?.name ?? '')
        if (!name || known.has(name.toLocaleLowerCase('en'))) continue
        known.add(name.toLocaleLowerCase('en'))
        additions.push({ name, icon: tag?.icon ?? DEFAULT_TAG_ICON, color: tag?.color ?? DEFAULT_TAG_COLOR })
      }
      return additions.length ? [...current, ...additions] : current
    })
  }

  function deleteTag(name) {
    setTags((current) => current.filter((tag) => tag.name !== name))
  }

  return { tags, addTag, updateTag, mergeTags, deleteTag }
}
