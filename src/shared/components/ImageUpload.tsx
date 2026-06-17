"use client"
import { ChangeEvent, useRef } from "react"
import { useImageStore } from "../store/store.image"
import { X, ImagePlus, RefreshCw } from "lucide-react"

export default function ImageUpload() {
    const { previewUrl, setImage, setPreviewImage, clearImageData } = useImageStore()

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }

    const inputRef = useRef<HTMLInputElement | null>(null)
    const hasPreview = Boolean(previewUrl)

    return (
        <div className="w-full mt-2">
            <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={onFileChange} />
            <div className={`w-full mb-3 duration-500 overflow-hidden rounded-lg shadow-md relative ${hasPreview ? "h-40" : "h-0"}`}>
                {hasPreview && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
                {hasPreview && (
                    <button
                        type="button"
                        onClick={() => clearImageData()}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all active:scale-90"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 cursor-pointer text-[13px] font-semibold text-gray-800 transition-all active:scale-[0.98]"
            >
                {!hasPreview ? (
                    <><ImagePlus className="w-3.5 h-3.5" /> Select Image</>
                ) : (
                    <><RefreshCw className="w-3.5 h-3.5" /> Change Image</>
                )}
            </button>
        </div>
    )
}