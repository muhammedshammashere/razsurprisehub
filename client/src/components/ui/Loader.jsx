export default function Loader({ fullScreen = false }) {
  const cls = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80'
    : 'flex justify-center py-12';
  return (
    <div className={cls}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}
