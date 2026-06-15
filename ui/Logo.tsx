export default function Logo({ white }: { white?: boolean }) {
  return (
    <div className={`flex items-center ${white ? "text-white" : ""}`}>
      <img
        src="/safron-logo-transparent.png"
        alt="The Safron Hotel"
        className="h-10 lg:h-12 w-auto"
      />
    </div>
  );
}