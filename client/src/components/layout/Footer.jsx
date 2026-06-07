export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-white py-8 dark:border-brand-950/50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6">
        <p>
          Copyright {new Date().getFullYear()} Raz Surprise Hub. Curated gifts, delivered with
          love.
        </p>
      </div>
    </footer>
  );
}
