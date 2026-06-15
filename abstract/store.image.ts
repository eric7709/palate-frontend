import { create } from "zustand";

type ImageStore = {
    image: File | null
    previewUrl: string
    removed: boolean
    setImage: (e: File | null) => void
    setPreviewImage: (previewUrl: string) => void
    clearImageData: () => void
}

export const useImageStore = create<ImageStore>((set) => ({
    image: null,
    previewUrl: "",
    removed: false,
    setImage(image) {
        set({ image, removed: false })
    },
    setPreviewImage(previewUrl) {
        set({ previewUrl })
    },
    clearImageData() {
        set({
            image: null,
            previewUrl: "",
            removed: true
        })
    },

}))