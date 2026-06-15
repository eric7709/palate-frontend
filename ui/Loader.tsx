import React from "react";

type LoaderProps = {
  /**
   * Accepts any valid Tailwind height class (e.g., "h-48", "h-[420px]", "h-full").
   * @default "h-screen"
   */
  height?: string;
  style?: string
};

export default function Loader({ height = "h-screen", style }: LoaderProps) {
  return (
    <div className={`flex w-full z-50 ${style} justify-center items-center ${height}`}>
      <div
        className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}