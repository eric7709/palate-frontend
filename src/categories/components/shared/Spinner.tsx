export function Spinner() {
  return (
    <div className="flex items-center justify-center flex-1 w-full ">
      <div className="relative w-10 h-10">
        {/* Background ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        {/* Animated active ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    </div>
  );
}