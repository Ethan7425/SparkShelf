import { useEffect, useRef, useState } from 'react'
import { ClipboardPaste, Instagram, Plus, X } from 'lucide-react'
import TagPicker from './TagPicker.jsx'

// Shared or copied text can wrap the link, e.g. "Check out this reel https://…"
function findInstagramLink(text) {
  return text.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/\S+/i)?.[0] ?? null
}

export function normalizeInstagramLink(value) {
  const input = findInstagramLink(value) ?? value.trim()
  const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`
  let url

  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error('Enter a valid Instagram link.')
  }

  if (!['instagram.com', 'www.instagram.com'].includes(url.hostname.toLowerCase())) {
    throw new Error('The link must point to instagram.com.')
  }

  const match = url.pathname.match(/^\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i)
  if (!match) throw new Error('This link does not contain a post ID.')

  return `https://www.instagram.com/p/${match[1]}/`
}

export default function SaveForm({ onAdd, tagOptions, onOpenSettings, initialLink = '', onCancel, onSaved, idPrefix = 'save' }) {
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [tags, setTags] = useState([])
  const [error, setError] = useState('')
  const linkInput = useRef(null)
  const titleInput = useRef(null)

  useEffect(() => {
    if (initialLink) {
      setLink(initialLink)
      titleInput.current?.focus()
    } else {
      linkInput.current?.focus()
    }
  }, [initialLink])

  async function pasteLink() {
    setError('')
    if (!navigator.clipboard?.readText) {
      setError('This browser can’t paste from here. Long-press the link field and choose Paste.')
      return
    }

    try {
      const found = findInstagramLink(await navigator.clipboard.readText())
      if (!found) {
        setError('Your clipboard doesn’t have an Instagram link.')
        return
      }
      setLink(found)
      titleInput.current?.focus()
    } catch {
      setError('Couldn’t read the clipboard. Long-press the link field and choose Paste.')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const normalizedLink = normalizeInstagramLink(link)
      const trimmedTitle = title.trim()
      if (!trimmedTitle) throw new Error('Give this save a title.')
      onAdd({
        link: normalizedLink,
        title: trimmedTitle,
        note: note.trim(),
        tags,
      })
      setLink('')
      setTitle('')
      setNote('')
      setTags([])
      onSaved?.()
    } catch (submissionError) {
      setError(submissionError.message)
    }
  }

  return (
    <form className="save-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="form-icon"><Plus size={18} strokeWidth={2.2} /></span>
        <div>
          <h2 id={`${idPrefix}-heading`}>{initialLink ? 'Save shared post' : 'Save a find'}</h2>
          <p>{initialLink ? 'Add a few details before it goes on your shelf.' : 'Paste an Instagram link to add it.'}</p>
        </div>
        {onCancel && (
          <button className="icon-button form-close" type="button" title="Close" aria-label="Close save dialog" onClick={onCancel}>
            <X size={18} />
          </button>
        )}
      </div>

      <label className="field-label" htmlFor={`${idPrefix}-instagram-link`}>Instagram link</label>
      <div className="input-with-icon">
        <Instagram size={17} aria-hidden="true" />
        <input
          id={`${idPrefix}-instagram-link`}
          ref={linkInput}
          type="text"
          inputMode="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          required
        />
        <button className="paste-button" type="button" onClick={pasteLink}>
          <ClipboardPaste size={14} /> Paste
        </button>
      </div>

      <label className="field-label" htmlFor={`${idPrefix}-title`}>Title</label>
      <input
        id={`${idPrefix}-title`}
        ref={titleInput}
        type="text"
        placeholder="e.g. Spicy noodles"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <label className="field-label" htmlFor={`${idPrefix}-note`}>Description <span>optional</span></label>
      <textarea
        id={`${idPrefix}-note`}
        rows="3"
        placeholder="What should you remember about it?"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <p className="field-label" id={`${idPrefix}-tags-label`}>Tags <span>optional</span></p>
      <TagPicker
        tags={tagOptions}
        selected={tags}
        onChange={setTags}
        onOpenSettings={onOpenSettings}
        labelledBy={`${idPrefix}-tags-label`}
      />

      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary submit-button" type="submit">
        <Plus size={17} /> Add to shelf
      </button>
      <p className="privacy-note">Saved on this device. Nothing leaves your browser.</p>
    </form>
  )
}