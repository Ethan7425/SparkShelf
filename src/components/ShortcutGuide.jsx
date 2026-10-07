import { useState } from 'react'
import { Check, Copy, X } from 'lucide-react'

export default function ShortcutGuide({ appUrlPrefix, onClose }) {
  const [copied, setCopied] = useState(false)

  async function copyPrefix() {
    try {
      await navigator.clipboard.writeText(appUrlPrefix)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog-panel help-panel" role="dialog" aria-modal="true" aria-labelledby="shortcut-guide-title">
        <header className="dialog-heading">
          <div>
            <p className="section-index">SPARKSHELF · IOS SHORTCUT</p>
            <h2 id="shortcut-guide-title">Save from Instagram</h2>
          </div>
          <button className="icon-button" type="button" title="Close guide" aria-label="Close guide" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <p className="guide-intro">Create a Shortcut once, then send an Instagram link to SparkShelf from the Share menu.</p>

        <ol className="guide-steps">
          <li><span><strong>Create a Shortcut</strong><br />In Apple’s Shortcuts app, tap <b>+</b>, name it “Save to SparkShelf,” then open its details.</span></li>
          <li><span><strong>Enable sharing</strong><br />Turn on <b>Show in Share Sheet</b> and set the accepted input to URLs.</span></li>
          <li><span><strong>Encode the shared link</strong><br />Add the <b>URL Encode</b> action and pass it the Shortcut Input.</span></li>
          <li>
            <span>
              <strong>Build the SparkShelf address</strong><br />Add a <b>Text</b> action. Paste this prefix, then insert the encoded result variable after it:
              <span className="guide-url-row">
                <code className="guide-url">{appUrlPrefix}</code>
                <button className="button button-quiet copy-prefix" type="button" onClick={copyPrefix}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy prefix'}
                </button>
              </span>
            </span>
          </li>
          <li><span><strong>Open it</strong><br />Add <b>Open URLs</b> using the Text result. From Instagram, tap <b>Share → Save to SparkShelf</b>. The post link will be ready in a save dialog.</span></li>
        </ol>

        <aside className="guide-note">
          <strong>Before you start</strong>
          <p>This needs a deployed HTTPS address. On iPhone, the Shortcut may open Safari rather than the Home Screen app. Test one save first and make sure you keep using the same browser storage.</p>
        </aside>
      </section>
    </div>
  )
}