export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} invest-assist — 本サイトの情報は一般的な参考情報であり、
          特定の銘柄・取引の推奨や投資助言ではありません。
          実際の投資判断はご自身の責任で行ってください。
        </p>
      </div>
    </footer>
  );
}
