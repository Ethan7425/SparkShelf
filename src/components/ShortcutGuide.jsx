import { useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import Modal from './Modal.jsx'

export default function ShortcutGuide({ webAppUrl, onClose }) {
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(webAppUrl)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal labelledBy="shortcut-guide-title" className="help-panel" onClose={onClose}>
      <header className="dialog-heading">
        <div>
          <p className="section-index">SPARKSHELF · IOS SHORTCUT</p>
          <h2 id="shortcut-guide-title">Save from Instagram</h2>
        </div>
        <button className="icon-button" type="button" title="Close guide" aria-label="Close guide" onClick={onClose}>
          <X size={18} />
        </button>
      </header>

      <p className="guide-intro">Set up a Shortcut once. Sharing a post copies its link and opens SparkShelf, where you paste it in.</p>

      <ol className="guide-steps">
        <li><span><strong>Add SparkShelf to your Home Screen</strong><br />In Safari, tap <b>Share → Add to Home Screen</b> and keep <b>Open as Web App</b> on.</span></li>
        <li><span><strong>Create a Shortcut</strong><br />In Apple’s Shortcuts app, tap <b>+</b> and name it “Save to SparkShelf.” In its details (<b>ⓘ</b>), turn on <b>Show in Share Sheet</b> and set it to receive <b>URLs</b> only.</span></li>
        <li><span><strong>Copy the link</strong><br />Add the <b>Copy to Clipboard</b> action with <b>Shortcut Input</b>.</span></li>
        <li>
          <span>
            <strong>Open SparkShelf</strong><br />Add the <b>Open URLs</b> action and type this address into it:
            <span className="guide-url-row">
              <code className="guide-url">{webAppUrl}</code>
              <button className="button button-quiet copy-prefix" type="button" onClick={copyAddress}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy address'}
              </button>
            </span>
          </span>
        </li>
        <li><span><strong>Save a post</strong><br />In Instagram, tap <b>Share → Save to SparkShelf</b>. When SparkShelf opens, tap <b>+</b>, then <b>Paste</b>.</span></li>
      </ol>

      <aside className="guide-note">
        <strong>If the address doesn’t open</strong>
        <p>The webapp:// address opens the Home Screen app on recent iOS versions. If your iPhone says the address is invalid, replace webapp:// with https:// in the Shortcut. It will open SparkShelf in Safari instead, which keeps its own separate saves.</p>
      </aside>
    </Modal>
  )
}
