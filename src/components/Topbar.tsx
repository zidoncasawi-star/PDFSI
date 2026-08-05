interface Props {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Topbar({ title, subtitle, onMenuClick }: Props) {
  return (
    <header className="bg-surface/95 backdrop-blur-sm w-full h-16 flex items-center gap-3 px-gutter sticky top-0 z-30 border-b border-outline-variant">
      {onMenuClick && (
        <button onClick={onMenuClick} className="md:hidden text-on-surface-variant hover:text-on-surface p-1 -ml-1 flex-shrink-0">
          <span className="material-symbols-outlined">menu</span>
        </button>
      )}
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-sm font-semibold text-on-surface truncate">{title}</span>
        {subtitle && <span className="text-xs text-on-surface-variant truncate">{subtitle}</span>}
      </div>
    </header>
  );
}
