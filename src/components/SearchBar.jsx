import { Search } from 'lucide-react'
import TagIcon from './TagIcon.jsx'

export default function SearchBar({ query, onQueryChange, tags, selectedTag, onTagChange, sort, onSortChange }) {
  return (
    <div className="library-toolbar">
      <div className="library-tools">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search your saves</span>
          <input
            type="search"
            placeholder="Looking for something?"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        <div className="filter-controls">
          <label className="sr-only" htmlFor="sort-saves">Sort saves</label>
          <select id="sort-saves" value={sort} onChange={(event) => onSortChange(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="alphabetical">A to Z</option>
          </select>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="tag-filter" role="group" aria-label="Filter by tag">
          <button
            className={`tag-chip${selectedTag ? '' : ' is-selected'}`}
            type="button"
            aria-pressed={!selectedTag}
            onClick={() => onTagChange('')}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.name}
              className={`tag-chip${selectedTag === tag.name ? ' is-selected' : ''}`}
              type="button"
              aria-pressed={selectedTag === tag.name}
              onClick={() => onTagChange(selectedTag === tag.name ? '' : tag.name)}
            >
              <TagIcon icon={tag.icon} /> {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
