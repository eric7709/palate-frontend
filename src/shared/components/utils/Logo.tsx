import Link from "next/link";

export default function Logo({
  white,
  height,
}: {
  white?: boolean;
  height?: string;
}) {
  const textColor = white ? "text-white" : "text-gray-900";
  const accentColor = white ? "text-white" : "text-blue-600";

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${textColor}`}
      aria-label="Palate"
    >
      {/* Icon */}
      <div className={`relative ${height ? height : "h-10 w-10 lg:h-12 lg:w-12"}`}>
        <svg
          viewBox="0 0 48 48"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 2L4 12V20C4 30.5 12 40 24 44C36 40 44 30.5 44 20V12L24 2Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className={accentColor}
          />
          <path
            d="M24 6L8 14V20C8 28.5 14 36 24 39.5C34 36 40 28.5 40 20V14L24 6Z"
            fill="currentColor"
            className={accentColor}
            opacity="0.12"
          />
          <circle cx="24" cy="26" r="4" fill="currentColor" className={accentColor} />
        </svg>
      </div>

      {/* Text */}
      <span className={`text-xl font-bold tracking-tight ${textColor}`}>
        Palate
        <span className={accentColor}>.</span>
      </span>
    </Link>
  );
}