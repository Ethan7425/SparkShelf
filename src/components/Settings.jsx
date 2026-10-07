import { useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Moon, Plus, Sun, Trash2, X } from 'lucide-react'
import Modal from './Modal.jsx'
import TagIcon, { DEFAULT_TAG_ICON, TAG_ICONS } from './TagIcon.jsx'
import { STYLES } from '../styles.js'
import { DEFAULT_TAG_COLOR, TAG_COLORS } from '../tagColors.js'

function IconGrid({ value, onChange, label }) {
  return (
    <div className="icon-grid" role="radiogroup" aria-label={label}>
      {Object.keys(TAG_ICONS).map((key) => (
        <button
          key={key}
          className={`icon-choice${value === key ? ' is-selected' : ''}`}
          type="button"
          role="radio"
          aria-checked={value === key}
          title={key}
          aria-label={key}
          onClick={() => onChange(key)}
        >
          <TagIcon icon={key} size={17} />
        </button>
      ))}
    </div>
  )
}

function ColorPicker({ value, onChange, label }) {
  const options = [{ id: DEFAULT_TAG_COLOR, name: 'Theme default' }, ...TAG_COLORS]
  return (
    <div className="color-grid" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          className={`color-choice${value === option.id ? ' is-selected' : ''}`}
          data-color={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          title={option.name}
          aria-label={option.name}
          onClick={() => onChange(option.id)}
        >
          <span />
        </button>
      ))}
    </div>
  )
}

function AppearanceSection({ style, onStyleChange, darkMode, onDarkModeChange }) {
  return (
    <section className="settings-section" aria-labelledby="appearance-heading">
      <div className="settings-section-heading">
        <h3 id="appearance-heading">Appearance</h3>
        <div className="mode-toggle" role="group" aria-label="Light or dark mode">
          <button type="button" aria-pressed={!darkMode} onClick={() => onDarkModeChange(false)}><Sun size={14} /> Light</button>
          <button type="button" aria-pressed={darkMode} onClick={() => onDarkModeChange(true)}><Moon size={14} /> Dark</button>
        </div>
      </div>
      <div className="style-grid">
        {STYLES.map((option) => (
          <button
            key={option.id}
            className={`style-option${style === option.id ? ' is-selected' : ''}`}
            type="button"
            aria-pressed={style === option.id}
            onClick={() => onStyleChange(option.id)}
          >
            <span className="style-preview" data-style-preview={option.id} aria-hidden="true">
              <span className="style-preview-card">
                <span className="style-preview-title">Spicy noodles</span>
                <span className="style-preview-tag">food</span>
              </span>
              <span className="style-preview-button" />
            </span>
            <span className="style-option-name">{option.name}</span>
            <span className="style-option-desc">{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function TagsSection({ tags, saves, onAddTag, onUpdateTag, onDeleteTag }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(DEFAULT_TAG_ICON)
  const [color, setColor] = useState(DEFAULT_TAG_COLOR)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState('')

  function handleAdd(event) {
    event.preventDefault()
    try {
      onAddTag(name, icon, color)
      setName('')
      setIcon(DEFAULT_TAG_ICON)
      setColor(DEFAULT_TAG_COLOR)
      setError('')
    } catch (addError) {
      setError(addError.message)
    }
  }

  function usageCount(tagName) {
    return saves.filter((save) => save.tags?.includes(tagName)).length
  }

  return (
    <section className="settings-section" aria-labelledby="tags-heading">
      <div className="settings-section-heading">
        <h3 id="tags-heading">Tags</h3>
      </div>
      <form className="tag-create" onSubmit={handleAdd}>
        <label className="field-label" htmlFor="new-tag-name">New tag</label>
        <div className="tag-create-row">
          <span className="tag tag-create-preview" data-color={color}><TagIcon icon={icon} size={17} /></span>
          <input
            id="new-tag-name"
            type="text"
            placeholder="e.g. recipes"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="button button-primary" type="submit"><Plus size={16} /> Add</button>
        </div>
        <IconGrid value={icon} onChange={setIcon} label="Icon for the new tag" />
        <ColorPicker value={color} onChange={setColor} label="Color for the new tag" />
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>

      {tags.length === 0 ? (
        <p className="guide-intro">Add a few tags you use often, like recipes or workouts. They show up as buttons when you save a post.</p>
      ) : (
        <ul className="tag-settings-list">
          {tags.map((tag) => {
            const count = usageCount(tag.name)
            const isEditing = editing === tag.name
            return (
              <li key={tag.name}>
                <div className="tag-settings-row">
                  <button
                    className={`tag tag-settings-badge${isEditing ? ' is-selected' : ''}`}
                    data-color={tag.color}
                    type="button"
                    title="Change icon and color"
                    aria-label={`Change icon and color for ${tag.name}`}
                    aria-expanded={isEditing}
                    onClick={() => setEditing(isEditing ? '' : tag.name)}
                  >
                    <TagIcon icon={tag.icon} size={17} />
                  </button>
                  <span className="tag-settings-name">{tag.name}</span>
                  <span className="tag-settings-count">{count} {count === 1 ? 'save' : 'saves'}</span>
                  {confirmingDelete === tag.name ? (
                    <div className="delete-confirm" role="group" aria-label={`Confirm deleting ${tag.name}`}>
                      <button
                        className="button delete-confirm-yes"
                        type="button"
                        onClick={() => { onDeleteTag(tag.name); setConfirmingDelete('') }}
                        autoFocus
                      >
                        Delete
                      </button>
                      <button className="button button-quiet" type="button" onClick={() => setConfirmingDelete('')}>Keep</button>
                    </div>
                  ) : (
                    <button
                      className="icon-button delete-button"
                      type="button"
                      title="Delete tag"
                      aria-label={`Delete tag ${tag.name}`}
                      onClick={() => setConfirmingDelete(tag.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {confirmingDelete === tag.name && count > 0 && (
                  <p className="tag-settings-warning">This also removes it from {count} {count === 1 ? 'save' : 'saves'}.</p>
                )}
                {isEditing && (
                  <div className="tag-settings-editor">
                    <IconGrid value={tag.icon} onChange={(key) => onUpdateTag(tag.name, { icon: key })} label={`Icon for ${tag.name}`} />
                    <ColorPicker
                      value={tag.color ?? DEFAULT_TAG_COLOR}
                      onChange={(key) => onUpdateTag(tag.name, { color: key })}
                      label={`Color for ${tag.name}`}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function lastMonths(count) {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1)
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      fullLabel: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date),
    }
  })
}

function StatsSection({ saves, tags }) {
  if (saves.length === 0) {
    return (
      <section className="settings-section" aria-labelledby="stats-heading">
        <div className="settings-section-heading"><h3 id="stats-heading">Stats</h3></div>
        <p className="guide-intro">Stats show up once you save a few posts.</p>
      </section>
    )
  }

  const favorites = saves.filter((save) => save.starred).length
  const months = lastMonths(6).map((month) => ({
    ...month,
    count: saves.filter((save) => {
      const date = new Date(save.createdAt)
      return `${date.getFullYear()}-${date.getMonth()}` === month.key
    }).length,
  }))
  const thisMonth = months[months.length - 1].count
  const maxMonth = Math.max(1, ...months.map((month) => month.count))

  const byTag = tags
    .map((tag) => ({ ...tag, count: saves.filter((save) => save.tags?.includes(tag.name)).length }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en'))
  const untagged = saves.filter((save) => !save.tags?.length).length
  const maxTag = Math.max(1, untagged, ...byTag.map((tag) => tag.count))

  return (
    <section className="settings-section" aria-labelledby="stats-heading">
      <div className="settings-section-heading"><h3 id="stats-heading">Stats</h3></div>

      <div className="stat-tiles">
        <div className="stat-tile"><strong>{saves.length}</strong><span>{saves.length === 1 ? 'save' : 'saves'}</span></div>
        <div className="stat-tile"><strong>{favorites}</strong><span>{favorites === 1 ? 'favorite' : 'favorites'}</span></div>
        <div className="stat-tile"><strong>{thisMonth}</strong><span>this month</span></div>
      </div>

      {(byTag.length > 0 || untagged > 0) && (
        <figure className="stat-chart">
          <figcaption>Saves by tag</figcaption>
          <ul className="tag-bars">
            {byTag.map((tag) => (
              <li key={tag.name} title={`${tag.name}: ${tag.count} ${tag.count === 1 ? 'save' : 'saves'}`}>
                <span className="tag-bar-label"><TagIcon icon={tag.icon} size={13} /> {tag.name}</span>
                <span className="tag-bar-track"><span className="tag-bar" style={{ width: `${(tag.count / maxTag) * 100}%` }} /></span>
                <span className="tag-bar-value">{tag.count}</span>
              </li>
            ))}
            {untagged > 0 && (
              <li className="is-untagged" title={`No tag: ${untagged} ${untagged === 1 ? 'save' : 'saves'}`}>
                <span className="tag-bar-label">No tag</span>
                <span className="tag-bar-track"><span className="tag-bar" style={{ width: `${(untagged / maxTag) * 100}%` }} /></span>
                <span className="tag-bar-value">{untagged}</span>
              </li>
            )}
          </ul>
        </figure>
      )}

      <figure className="stat-chart">
        <figcaption>Saves per month</figcaption>
        <ol className="month-bars">
          {months.map((month) => (
            <li key={month.key} title={`${month.fullLabel}: ${month.count} ${month.count === 1 ? 'save' : 'saves'}`}>
              <span className="month-bar-value">{month.count}</span>
              <span className="month-bar-track"><span className="month-bar" style={{ height: `${(month.count / maxMonth) * 100}%` }} /></span>
              <span className="month-bar-label">{month.label}</span>
            </li>
          ))}
        </ol>
      </figure>
    </section>
  )
}

function BackupSection({ hasSaves, onExport, onImport }) {
  const fileInput = useRef(null)
  const [message, setMessage] = useState(null)

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setMessage(await onImport(file))
  }

  return (
    <section className="settings-section" aria-labelledby="backup-heading">
      <div className="settings-section-heading"><h3 id="backup-heading">Backup</h3></div>
      <p className="guide-intro">Your saves only live on this device. Export a backup now and then, and import it to restore or to move to another browser.</p>
      <div className="backup-actions">
        <button className="button button-quiet" type="button" onClick={onExport} disabled={!hasSaves}>
          <ArrowDownToLine size={16} /> Export backup
        </button>
        <button className="button button-quiet" type="button" onClick={() => fileInput.current?.click()}>
          <ArrowUpFromLine size={16} /> Import backup
        </button>
        <input ref={fileInput} className="sr-only" type="file" accept="application/json,.json" onChange={handleFile} tabIndex={-1} />
      </div>
      {message && <p className={message.error ? 'form-error' : 'backup-message'} role="status">{message.text}</p>}
    </section>
  )
}

export default function Settings({
  tags, saves, onAddTag, onUpdateTag, onDeleteTag, style, onStyleChange, darkMode, onDarkModeChange, onExport, onImport, onClose,
}) {
  return (
    <Modal labelledBy="settings-title" className="help-panel settings-panel" onClose={onClose}>
      <header className="dialog-heading">
        <div>
          <p className="section-index">SPARKSHELF · SETTINGS</p>
          <h2 id="settings-title">Settings</h2>
        </div>
        <button className="icon-button" type="button" title="Close settings" aria-label="Close settings" onClick={onClose}>
          <X size={18} />
        </button>
      </header>

      <AppearanceSection style={style} onStyleChange={onStyleChange} darkMode={darkMode} onDarkModeChange={onDarkModeChange} />
      <TagsSection tags={tags} saves={saves} onAddTag={onAddTag} onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag} />
      <StatsSection saves={saves} tags={tags} />
      <BackupSection hasSaves={saves.length > 0} onExport={onExport} onImport={onImport} />
    </Modal>
  )
}
