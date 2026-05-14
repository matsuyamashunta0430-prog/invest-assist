import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-bold tracking-tight">
          invest-assist
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/simulator" className="text-slate-700 hover:text-slate-900">
            シミュレーター
          </Link>
          <Link href="/learn/videos" className="text-slate-700 hover:text-slate-900">
            学ぶ
          </Link>
          <Link href="/about" className="text-slate-700 hover:text-slate-900">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
