interface Props {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: Props) {
  return (
    <header className="bg-surface/95 backdrop-blur-sm w-full h-16 flex flex-col justify-center px-gutter sticky top-0 z-50 border-b border-outline-variant md:ml-64">
      <span className="text-sm font-semibold text-on-surface">{title}</span>
      {subtitle && <span className="text-xs text-on-surface-variant">{subtitle}</span>}
    </header>
  );
}
