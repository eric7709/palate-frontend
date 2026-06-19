export default function Logo({ white, height }: { white?: boolean, height?: string }) {
  return (
    <div className={`flex items-center ${white ? "text-white" : ""}`}>
      <img
        src="/safron-logo-transparent.png"
        alt="The Safron Hotel"
        className={` w-auto ${height ? height : "h-10 lg:h-12"}`}
      />
    </div>
  );
}