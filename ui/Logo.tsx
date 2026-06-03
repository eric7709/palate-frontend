import { ChefHat } from 'lucide-react'

export default function Logo({white}: {white?: boolean}) {
    return (
        <div className={`flex items-center ${white && "text-white"}`}>
            <div className="w-8 h-8 rounded-xl border-2 border-blue-700 flex items-center justify-center">
                <ChefHat className={`w-4 h-4 text-blue-700 ${white && "text-white"}`} />
            </div>
            <h1 className="ml-2 text-sm font-semibold text-blue-700">Palate</h1>
        </div>)
}
