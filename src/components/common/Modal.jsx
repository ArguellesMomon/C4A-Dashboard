import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from './icons.jsx'
export default function Modal({ title, onClose, children, maxWidth = 'max-w-md' }) {
  const ref = useRef(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () => [...ref.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length)
    ;(focusable()[0] || ref.current).focus()
    function keydown(e) {
      if(e.key === 'Escape') { e.stopPropagation(); close.current() }
      if(e.key === 'Tab') {
        const items = focusable(), first = items[0], last = items[items.length-1]
        if(!first) { e.preventDefault(); ref.current.focus() }
        else if(e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus() }
        else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    ref.current.addEventListener('keydown', keydown)
    const element = ref.current
    return () => { element.removeEventListener('keydown',keydown); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return createPortal(<div className="modal-overlay" onMouseDown={e => { if(e.target === e.currentTarget)onClose() }}><div ref={ref} tabIndex="-1" className={'modal-surface animate-modal-in w-full '+maxWidth} role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Close dialog" className="icon-button"><XIcon/></button></div><div className="px-6 py-5">{children}</div></div></div>,document.body)
}
