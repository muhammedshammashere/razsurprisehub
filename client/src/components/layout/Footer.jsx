export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-900/10 bg-white/80 py-8 backdrop-blur dark:border-brand-400/20 dark:bg-brand-950/90">
      <div className="h-0.5 w-full brand-gradient" />
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6">
        <p>
          Copyright {new Date().getFullYear()} Raz Surprise Hub. Curated gifts, delivered with
          love.
        </p>
      </div>
    </footer>
  );
}
