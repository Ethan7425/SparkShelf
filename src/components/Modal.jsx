import { useRef, useState } from 'react'

const CLOSE_DISTANCE = 110

// A centered dialog on wide screens and a bottom sheet on phones, where the
// handle at the top can be dragged down to close it.
export default function Modal({ labelledBy, className = '', onClose, children }) {
  const [dragY, setDragY] = useState(0)
  const dragStart = useRef(null)

  function startDrag(event) {
    dragStart.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event) {
    if (dragStart.current === null) return
    setDragY(Math.max(0, event.clientY - dragStart.current))
  }

  function endDrag() {
    if (dragStart.current === null) return
    dragStart.current = null
    if (dragY > CLOSE_DISTANCE) onClose()
    else setDragY(0)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        className={`dialog-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        <div
          className="sheet-handle"
          aria-hidden="true"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span />
        </div>
        {children}
      </section>
    </div>
  )
}
