import { Loader2, Trash2 } from 'lucide-react'
import { useEffect } from 'react'

type Props = {
  show: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  title: string
  description?: string
  children?: React.ReactNode
}

export default function DeleteModal({ show, onClose, onConfirm, isDeleting, title, description, children }: Props) {
  useEffect(() => {
    if (!show) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [show, onClose])
  if (!show) return null



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/20">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-81.25 bg-linear-to-br from-blue-500/20 border border-blue-500/20 to-gray-950 shadow-xl p-5 rounded-3xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
        </div>
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {description && <p className="text-[11px] text-gray-400 mt-1">{description}</p>}
        </div>
        {/* Children */}
        {children && (
          <div className="mb-4 p-3 bg-white/4 border border-white/8 rounded-xl text-xs text-gray-400">
            {children}
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium text-gray-400 bg-white/5 hover:bg-white/10 cursor-pointer rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 cursor-pointer rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isDeleting && <Loader2 size={13} className="animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}