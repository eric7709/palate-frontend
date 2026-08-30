import Link from "next/link";
import Image from "next/image";

export default function Logo({
  white,
  height,
  width,
  className,
}: {
  white?: boolean;
  height?: string | number;
  width?: string | number;
  className?: string;
}) {
  const logoHeight = height || 40;
  const logoWidth = width || logoHeight;

  return (
    <Link
      href="/"
      className={`flex items-center ${className || ""}`}
      aria-label="Palate"
    >
      <div
        className="relative shrink-0"
        style={{
          height:
            typeof logoHeight === "number"
              ? `${logoHeight}px`
              : logoHeight,

          width:
            typeof logoWidth === "number"
              ? `${logoWidth}px`
              : logoWidth,
        }}
      >
        <Image
          src="/palate.png"
          alt="Palate"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}