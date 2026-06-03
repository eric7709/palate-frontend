import { X, Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'

type Props = {
  title: string
  description?: string
  onClose: () => void
  onSave: () => void
  children: React.ReactNode
  show?: boolean
  isSubmitting: boolean
}
export default function CompactModal({ title, description, isSubmitting, onClose, onSave, children, show }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className={`fixed duration-150 inset-0 z-50 flex items-center justify-center p-4    bg-black/20 backdrop-blur-3xl ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      <form
        onSubmit={onSave}
        className="w-full max-w-sm bg-linear-to-br from-blue-500/20 border border-blue-500/20 to-gray-950 shadow-xl p-5 rounded-3xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {description && <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 cursor-pointer hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mb-6 max-h-72 overflow-y-auto modal-content-area">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Save
          </button>
        </div>
      </form>
    </div>
  )
}