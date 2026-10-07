import { Settings2 } from 'lucide-react'
import TagIcon from './TagIcon.jsx'

export default function TagPicker({ tags, selected, onChange, onOpenSettings, labelledBy, label }) {
  function toggle(name) {
    onChange(selected.includes(name) ? selected.filter((item) => item !== name) : [...selected, name])
  }

  if (tags.length === 0) {
    return (
      <p className="tag-picker-empty">
        No tags yet.
        {onOpenSettings && (
          <button className="text-button" type="button" onClick={onOpenSettings}>
            <Settings2 size={13} /> Set up tags
          </button>
        )}
      </p>
    )
  }

  return (
    <div className="tag-picker" role="group" aria-labelledby={labelledBy} aria-label={label}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag.name)
        return (
          <button
            key={tag.name}
            className={`tag-chip${isSelected ? ' is-selected' : ''}`}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(tag.name)}
          >
            <TagIcon icon={tag.icon} /> {tag.name}
          </button>
        )
      })}
    </div>
  )
}
