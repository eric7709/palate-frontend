"use client"
import { ChangeEvent, useRef, useState } from "react"
import { useImageStore } from "./store.image"
import { X, ImagePlus, RefreshCw } from "lucide-react"

export default function ImageUpload() {
    const { image, setImage, setPreviewImage, previewUrl, clearImageData } = useImageStore()
    const [update, setUpdate] = useState(1)
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }
    const inputRef = useRef<HTMLInputElement | null>(null)
    return (
        <div className="w-full mt-2">
            <input type="file" className="hidden" ref={inputRef} onChange={onFileChange} />
            <div className={`w-full mb-3 duration-500 overflow-hidden rounded-lg shadow-md relative ${image ? "h-40" : "h-0"}`}>
                {previewUrl && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
                {image !== null && (
                    <button
                        type="button"
                        onClick={() => { clearImageData(); setUpdate(update + 1) }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all active:scale-90"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/4 border border-white/10 hover:bg-white/8 hover:border-white/20 text-sm text-gray-400 hover:text-white transition-all active:scale-[0.98]"
            >
                {!image ? (
                    <><ImagePlus className="w-4 h-4" /> Select Image</>
                ) : (
                    <><RefreshCw className="w-4 h-4" /> Change Image</>
                )}
            </button>
        </div>
    )
}