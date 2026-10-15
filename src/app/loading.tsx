import { Logo } from "@/components/layout/Logo";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-white"
      role="status"
      aria-live="polite"
    >
      <Logo className="pointer-events-none" />
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#f36a26] motion-reduce:animate-none"
      />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
