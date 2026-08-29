import Link from "next/link";

export default function Logo({
  white,
  height,
}: {
  white?: boolean;
  height?: string;
}) {
  return (
    <Link
      href="/"
      className={`flex items-center ${
        white ? "text-white" : "text-gray-900"
      }`}
      aria-label="Palate"
    >
      <svg
        viewBox="0 0 180 48"
        className={`w-auto ${height ? height : "h-10 lg:h-12"}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Decorative plate */}
        <circle
          cx="22"
          cy="24"
          r="16"
          stroke="currentColor"
          strokeWidth="2.5"
        />

        <circle
          cx="22"
          cy="24"
          r="9"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Palate */}
        <text
          x="48"
          y="33"
          fill="currentColor"
          fontSize="30"
          fontWeight="700"
          fontFamily="Georgia, serif"
          letterSpacing="-1"
        >
          Palate
        </text>
      </svg>
    </Link>
  );
}