export default function Loading() {
  return (
    <div
      className="space-y-5"
      aria-busy="true"
      aria-label="Loading journal studio"
    >
      <div className="h-14 w-2/3 animate-pulse rounded-xl bg-[#e8dccb]" />
      <div className="h-[450px] animate-pulse rounded-2xl bg-white/70" />
    </div>
  );
}
