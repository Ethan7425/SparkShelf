import { useState } from 'react'
import { Moon, Plus, Sun, Trash2, X } from 'lucide-react'
import TagIcon, { DEFAULT_TAG_ICON, TAG_ICONS } from './TagIcon.jsx'
import { STYLES } from '../styles.js'

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

export default function Settings({
  tags, saves, onAddTag, onUpdateTagIcon, onDeleteTag, style, onStyleChange, darkMode, onDarkModeChange, onClose,
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(DEFAULT_TAG_ICON)
  const [error, setError] = useState('')
  const [editingIcon, setEditingIcon] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState('')

  function handleAdd(event) {
    event.preventDefault()
    try {
      onAddTag(name, icon)
      setName('')
      setIcon(DEFAULT_TAG_ICON)
      setError('')
    } catch (addError) {
      setError(addError.message)
    }
  }

  function usageCount(tagName) {
    return saves.filter((save) => save.tags?.includes(tagName)).length
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog-panel help-panel settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
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

        <section className="settings-section" aria-labelledby="tags-heading">
          <div className="settings-section-heading">
            <h3 id="tags-heading">Tags</h3>
          </div>
          <form className="tag-create" onSubmit={handleAdd}>
            <label className="field-label" htmlFor="new-tag-name">New tag</label>
            <div className="tag-create-row">
              <span className="tag-create-preview"><TagIcon icon={icon} size={17} /></span>
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
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>

          {tags.length === 0 ? (
            <p className="guide-intro">Add a few tags you use often, like recipes or workouts. They show up as buttons when you save a post.</p>
          ) : (
            <ul className="tag-settings-list">
              {tags.map((tag) => {
                const count = usageCount(tag.name)
                return (
                  <li key={tag.name}>
                    <div className="tag-settings-row">
                      <button
                        className={`icon-choice${editingIcon === tag.name ? ' is-selected' : ''}`}
                        type="button"
                        title="Change icon"
                        aria-label={`Change icon for ${tag.name}`}
                        aria-expanded={editingIcon === tag.name}
                        onClick={() => setEditingIcon(editingIcon === tag.name ? '' : tag.name)}
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
                    {editingIcon === tag.name && (
                      <IconGrid
                        value={tag.icon}
                        onChange={(key) => { onUpdateTagIcon(tag.name, key); setEditingIcon('') }}
                        label={`Icon for ${tag.name}`}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </section>
    </div>
  )
}
