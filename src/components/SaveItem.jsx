import { useState } from 'react'
import { ArrowUpRight, Check, Instagram, Pencil, Star, Trash2, X } from 'lucide-react'
import TagIcon from './TagIcon.jsx'
import TagPicker from './TagPicker.jsx'

// Only the Bento style reads this: favorites get big tiles, long notes get wide ones.
function tileSize(save) {
  if (save.starred) return 'large'
  if ((save.note?.length ?? 0) > 140 || (save.tags?.length ?? 0) > 3) return 'wide'
  return 'normal'
}

export default function SaveItem({ save, tagOptions, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(save.title ?? '')
  const [draft, setDraft] = useState(save.note)
  const [tagsDraft, setTagsDraft] = useState(save.tags ?? [])
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function saveNote(event) {
    event.preventDefault()
    const trimmedTitle = titleDraft.trim()
    if (!trimmedTitle) return
    onUpdate(save.id, { title: trimmedTitle, note: draft.trim(), tags: tagsDraft })
    setEditing(false)
  }

  function cancelEdit() {
    setTitleDraft(save.title ?? '')
    setDraft(save.note)
    setTagsDraft(save.tags ?? [])
    setEditing(false)
  }

  return (
    <article className="save-card" data-size={tileSize(save)}>
      <div className="save-card-top">
        <span className="post-source"><Instagram size={15} /> INSTAGRAM</span>
        <div className="card-actions">
          <button
            className={`icon-button star-button${save.starred ? ' is-starred' : ''}`}
            type="button"
            title={save.starred ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={save.starred ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onUpdate(save.id, { starred: !save.starred })}
          >
            <Star size={17} fill={save.starred ? 'currentColor' : 'none'} />
          </button>
          {confirmingDelete ? (
            <div className="delete-confirm" role="group" aria-label="Confirm delete">
              <span>Delete?</span>
              <button className="button delete-confirm-yes" type="button" onClick={() => onDelete(save.id)} autoFocus>Delete</button>
              <button className="button button-quiet" type="button" onClick={() => setConfirmingDelete(false)}>Keep</button>
            </div>
          ) : (
            <button
              className="icon-button delete-button"
              type="button"
              title="Delete"
              aria-label="Delete this save"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="save-card-body">
        {editing ? (
          <form className="note-edit-form" onSubmit={saveNote}>
            <label className="sr-only" htmlFor={`title-${save.id}`}>Title</label>
            <input
              id={`title-${save.id}`}
              className="edit-title-input"
              type="text"
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              placeholder="Add a title"
              required
            />
            <label className="sr-only" htmlFor={`note-${save.id}`}>Description</label>
            <textarea
              id={`note-${save.id}`}
              rows="3"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Add a description..."
              autoFocus
            />
            <TagPicker tags={tagOptions} selected={tagsDraft} onChange={setTagsDraft} label="Tags" />
            <div className="note-edit-actions">
              <button className="icon-button confirm-button" type="submit" title="Save changes" aria-label="Save changes"><Check size={16} /></button>
              <button className="icon-button" type="button" title="Cancel" aria-label="Cancel edit" onClick={cancelEdit}><X size={16} /></button>
            </div>
          </form>
        ) : (
          <>
            <div className="save-title-row">
              <h3 className={`save-title${save.title ? '' : ' fallback-title'}`}>
                {save.title || (save.note ? 'Instagram save' : 'Saved Instagram post')}
              </h3>
              <button
                className="icon-button edit-button"
                type="button"
                title="Edit title, note and tags"
                aria-label="Edit title, note and tags"
                onClick={() => setEditing(true)}
              >
                <Pencil size={15} />
              </button>
            </div>
            {save.note && <p className="save-note">{save.note}</p>}
          </>
        )}

        {!editing && save.tags?.length > 0 && (
          <ul className="tag-list" aria-label="Tags">
            {save.tags.map((tag) => (
              <li className="tag" key={tag}>
                <TagIcon icon={tagOptions.find((option) => option.name === tag)?.icon} size={13} /> {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="save-card-footer">
        <time dateTime={new Date(save.createdAt).toISOString()}>
          {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(save.createdAt)}
        </time>
        <a className="open-link" href={save.link} target="_blank" rel="noopener noreferrer">
          Open <ArrowUpRight size={15} />
        </a>
      </footer>
    </article>
  )
}