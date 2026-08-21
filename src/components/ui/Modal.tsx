import * as React from "react"
import { X } from "./Icons"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        role="dialog" 
        aria-modal="true"
        className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
