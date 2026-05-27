// components/Loader.tsx
export default function Loader() {
    return (
        <div className="flex h-screen z-5000 pb-10 justify-center items-center">
            <div
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}