import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, BookOpenText, Layers3, Moon, Plus, Settings2, Sparkles, Sun } from 'lucide-react'
import SaveForm from './components/SaveForm.jsx'
import SavesList from './components/SavesList.jsx'
import SearchBar from './components/SearchBar.jsx'
import ShortcutGuide from './components/ShortcutGuide.jsx'
import Settings from './components/Settings.jsx'
import { useSaves } from './hooks/useSaves.js'
import { useTags } from './hooks/useTags.js'
import { DEFAULT_STYLE, STYLES } from './styles.js'
import { version } from '../package.json'

function initialTheme() {
  try {
    return localStorage.getItem('sparkshelf-theme') === 'dark'
  } catch {
    return false
  }
}

function initialStyle() {
  try {
    const stored = localStorage.getItem('sparkshelf-style')
    return STYLES.some((option) => option.id === stored) ? stored : DEFAULT_STYLE
  } catch {
    return DEFAULT_STYLE
  }
}

export default function App() {
  const { saves, addSave, updateSave, deleteSave, removeTagFromSaves } = useSaves()
  const { tags, addTag, updateTagIcon, deleteTag } = useTags(saves)
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sort, setSort] = useState('newest')
  const [darkMode, setDarkMode] = useState(initialTheme)
  const [style, setStyle] = useState(initialStyle)
  // null when closed; otherwise the link to prefill ('' for a manual add)
  const [saveDialogLink, setSaveDialogLink] = useState(null)
  const [showShortcutGuide, setShowShortcutGuide] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const incomingLink = params.get('share')
    if (!incomingLink) return

    setSaveDialogLink(incomingLink)
    params.delete('share')
    const remainingQuery = params.toString()
    const cleanUrl = `${window.location.pathname}${remainingQuery ? `?${remainingQuery}` : ''}${window.location.hash}`
    window.history.replaceState(window.history.state, '', cleanUrl)
  }, [])

  useEffect(() => {
    if (saveDialogLink === null && !showShortcutGuide && !showSettings) return undefined

    function closeOnEscape(event) {
      if (event.key !== 'Escape') return
      // Close only the top dialog; settings can open over the save form.
      if (showSettings) setShowSettings(false)
      else if (showShortcutGuide) setShowShortcutGuide(false)
      else setSaveDialogLink(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [saveDialogLink, showShortcutGuide, showSettings])

  // Stop the page behind an open dialog from scrolling
  const dialogOpen = saveDialogLink !== null || showShortcutGuide || showSettings
  useEffect(() => {
    document.body.classList.toggle('has-dialog', dialogOpen)
  }, [dialogOpen])

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    try {
      localStorage.setItem('sparkshelf-theme', darkMode ? 'dark' : 'light')
    } catch {
      // storage unavailable; the mode resets next visit
    }
  }, [darkMode])

  useEffect(() => {
    document.documentElement.dataset.style = style
    try {
      localStorage.setItem('sparkshelf-style', style)
    } catch {
      // storage unavailable; the style resets next visit
    }
  }, [style])

  function handleDeleteTag(name) {
    deleteTag(name)
    removeTagFromSaves(name)
    if (selectedTag === name) setSelectedTag('')
  }

  const visibleSaves = useMemo(() => {
    const search = query.trim().toLocaleLowerCase('en')
    return saves
      .filter((save) => !selectedTag || save.tags?.includes(selectedTag))
      .filter((save) => !search || `${save.title ?? ''} ${save.link} ${save.note} ${(save.tags ?? []).join(' ')}`.toLocaleLowerCase('en').includes(search))
      .sort((a, b) => {
        if (sort === 'alphabetical') return (a.title || a.note || a.link).localeCompare(b.title || b.note || b.link, 'en')
        return sort === 'oldest' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
      })
  }, [saves, query, selectedTag, sort])

  function exportSaves() {
    const blob = new Blob([JSON.stringify(saves, null, 2)], { type: 'application/json' })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `sparkshelf-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(downloadUrl)
  }

  // Opens the Home Screen web app on recent iOS; plain links always open Safari
  const webAppUrl = `webapp://${window.location.host}${import.meta.env.BASE_URL}`

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SparkShelf home">
          <span className="brand-mark"><Sparkles size={19} strokeWidth={2.2} /></span>
          <span>spark<span className="brand-light">shelf</span></span>
        </a>
        <div className="topbar-actions">
          <span className="local-indicator"><span /> On this device</span>
          <button
            className="icon-button theme-button"
            type="button"
            title="Settings"
            aria-label="Settings"
            onClick={() => setShowSettings(true)}
          >
            <Settings2 size={18} />
          </button>
          <button
            className="icon-button theme-button guide-button"
            type="button"
            title="iPhone Shortcut setup guide"
            aria-label="iPhone Shortcut setup guide"
            onClick={() => setShowShortcutGuide(true)}
          >
            <BookOpenText size={18} />
          </button>
          <button
            className="icon-button theme-button"
            type="button"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setDarkMode((value) => !value)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main id="top" className="page-content">
        <section className="intro-row">
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL COLLECTION</p>
            <h1>Good ideas,<br /><em>right where you need them.</em></h1>
            <p className="intro-subtitle">Recipes, routines, little tips. Find the things you saved before they disappear into the scroll.</p>
          </div>
          <div className="shelf-stats" aria-label="Collection statistics">
            <div className="stat-number">{String(saves.length).padStart(2, '0')}</div>
            <div className="stat-caption">{saves.length === 1 ? 'save organized' : 'saves organized'}</div>
            <div className="stat-rule" />
            <div className="stat-foot"><Layers3 size={14} /> on your shelf</div>
          </div>
        </section>

        <div className="workspace">
          <section className="library" aria-labelledby="library-title">
            <div className="library-heading">
              <div>
                <p className="section-index">01 <span>—</span> YOUR COLLECTION</p>
                <h2 id="library-title">Your shelf <span className="count-pill">{visibleSaves.length}</span></h2>
              </div>
              <div className="library-actions">
                <button className="button button-quiet export-button" type="button" onClick={exportSaves} disabled={saves.length === 0}>
                  <ArrowDownToLine size={16} /> <span>Export</span>
                </button>
                <button
                  className="add-button"
                  type="button"
                  title="Add a link manually"
                  aria-label="Add a link manually"
                  onClick={() => setSaveDialogLink('')}
                >
                  <Plus size={20} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            <SearchBar
              query={query}
              onQueryChange={setQuery}
              tags={tags}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              sort={sort}
              onSortChange={setSort}
            />
            <SavesList saves={visibleSaves} allSavesCount={saves.length} tagOptions={tags} onUpdate={updateSave} onDelete={deleteSave} />
          </section>
        </div>
      </main>

      <footer className="page-footer">
        <span className="footer-brand">SPARKSHELF <span className="app-version">v{version}</span></span>
        <span>A place for the ideas worth keeping.</span>
      </footer>

      {saveDialogLink !== null && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSaveDialogLink(null)}>
          <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="dialog-save-heading">
            <SaveForm
              key={saveDialogLink}
              idPrefix="dialog-save"
              initialLink={saveDialogLink}
              onAdd={addSave}
              tagOptions={tags}
              onOpenSettings={() => setShowSettings(true)}
              onCancel={() => setSaveDialogLink(null)}
              onSaved={() => setSaveDialogLink(null)}
            />
          </section>
        </div>
      )}
      {showShortcutGuide && (
        <ShortcutGuide webAppUrl={webAppUrl} onClose={() => setShowShortcutGuide(false)} />
      )}
      {showSettings && (
        <Settings
          tags={tags}
          saves={saves}
          onAddTag={addTag}
          onUpdateTagIcon={updateTagIcon}
          onDeleteTag={handleDeleteTag}
          style={style}
          onStyleChange={setStyle}
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}