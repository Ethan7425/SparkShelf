import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Instagram, Pencil, Star, Trash2, X } from 'lucide-react'
import TagIcon from './TagIcon.jsx'
import TagPicker from './TagPicker.jsx'

const SWIPE_TRIGGER = 80
const SWIPE_MAX = 130

// Only the Bento style reads this: favorites get big tiles, long notes get wide ones.
function tileSize(save) {
  if (save.starred) return 'large'
  if ((save.note?.length ?? 0) > 140 || (save.tags?.length ?? 0) > 3) return 'wide'
  return 'normal'
}

export default function SaveItem({ save, tagOptions, isNew, onUpdate, onToggleStar, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(save.title ?? '')
  const [draft, setDraft] = useState(save.note)
  const [tagsDraft, setTagsDraft] = useState(save.tags ?? [])
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [swipeX, setSwipeX] = useState(0)
  const swipe = useRef(null)
  const justSwiped = useRef(false)
  const openLink = useRef(null)

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

  // Swipe right to star, swipe left to ask about deleting (touch only)
  function startSwipe(event) {
    if (event.pointerType !== 'touch' || editing) return
    swipe.current = { x: event.clientX, y: event.clientY, axis: null }
    justSwiped.current = false
  }

  function moveSwipe(event) {
    const current = swipe.current
    if (!current) return
    const dx = event.clientX - current.x
    const dy = event.clientY - current.y
    if (!current.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      current.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }
    if (current.axis !== 'x') return
    justSwiped.current = true
    setSwipeX(Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, dx)))
  }

  function endSwipe() {
    const current = swipe.current
    swipe.current = null
    if (current?.axis !== 'x') return
    if (swipeX > SWIPE_TRIGGER) onToggleStar(save)
    else if (swipeX < -SWIPE_TRIGGER) setConfirmingDelete(true)
    setSwipeX(0)
  }

  // Tapping anywhere on the card that isn't a control opens the post
  function openFromCard(event) {
    if (justSwiped.current) {
      justSwiped.current = false
      return
    }
    if (editing || confirmingDelete) return
    if (event.target.closest('button, a, input, textarea, select, label, form')) return
    openLink.current?.click()
  }

  const swipeProgress = Math.min(1, Math.abs(swipeX) / SWIPE_TRIGGER)

  return (
    <div className={`save-tile${isNew ? ' is-new' : ''}`} data-size={tileSize(save)}>
      <div
        className={`swipe-hint${swipeX > 0 ? ' is-star' : ''}${swipeX < 0 ? ' is-delete' : ''}`}
        style={{ '--swipe-progress': swipeProgress }}
        aria-hidden="true"
      >
        <Star size={20} fill={save.starred ? 'none' : 'currentColor'} />
        <Trash2 size={20} />
      </div>

      <article
        className="save-card"
        style={swipeX ? { transform: `translateX(${swipeX}px)`, transition: 'none' } : undefined}
        onPointerDown={startSwipe}
        onPointerMove={moveSwipe}
        onPointerUp={endSwipe}
        onPointerCancel={endSwipe}
        onClick={openFromCard}
      >
        <div className="save-card-top">
          <span className="post-source"><Instagram size={15} /> INSTAGRAM</span>
          <div className="card-actions">
            <button
              className={`icon-button star-button${save.starred ? ' is-starred' : ''}`}
              type="button"
              title={save.starred ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={save.starred ? 'Remove from favorites' : 'Add to favorites'}
              onClick={() => onToggleStar(save)}
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
              {save.tags.map((tag) => {
                const option = tagOptions.find((item) => item.name === tag)
                return (
                  <li className="tag" data-color={option?.color} key={tag}>
                    <TagIcon icon={option?.icon} size={13} /> {tag}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <footer className="save-card-footer">
          <time dateTime={new Date(save.createdAt).toISOString()}>
            {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(save.createdAt)}
          </time>
          <a ref={openLink} className="open-link" href={save.link} target="_blank" rel="noopener noreferrer">
            Open <ArrowUpRight size={15} />
          </a>
        </footer>
      </article>
    </div>
  )
}
