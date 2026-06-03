import { create } from "zustand";

type ImageStore = {
    image: File | null
    previewUrl: string
    setImage: (e: File | null) => void
    setPreviewImage: (previewUrl: string) => void
    clearImageData: () => void
}

export const useImageStore = create<ImageStore>((set) => ({
    image: null,
    previewUrl: "/",
    setImage(image) {
        set({ image })
    },
    setPreviewImage(previewUrl) {
        set({ previewUrl })
    },
    clearImageData() {
        set({
            image: null,
            previewUrl: ""
        })
    },

}))