import { BookmarkPlus, Layers3 } from 'lucide-react'
import SaveItem from './SaveItem.jsx'

export default function SavesList({ saves, allSavesCount, tagOptions, newSaveId, onUpdate, onToggleStar, onDelete }) {
  if (saves.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><BookmarkPlus size={23} /></span>
        <h3>{allSavesCount === 0 ? 'Your shelf starts here' : 'Nothing to show'}</h3>
        <p>{allSavesCount === 0 ? 'Share a post from Instagram, or tap + to add a link.' : 'Try another search or clear a filter.'}</p>
      </div>
    )
  }

  return (
    <div className="saves-grid">
      {saves.map((save) => (
        <SaveItem
          key={save.id}
          save={save}
          tagOptions={tagOptions}
          isNew={save.id === newSaveId}
          onUpdate={onUpdate}
          onToggleStar={onToggleStar}
          onDelete={onDelete}
        />
      ))}
      <div className="shelf-end" aria-hidden="true"><Layers3 size={15} /> That’s everything for now</div>
    </div>
  )
}