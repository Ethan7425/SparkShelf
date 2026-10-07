import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

const VISIBLE_MS = 2600

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onDone, VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [toast, onDone])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <CheckCircle2 size={17} aria-hidden="true" /> {toast.message}
        </div>
      )}
    </div>
  )
}
