interface Props {
  label: string;
  value: number | string;
  icon: string;
  tone?: 'primary' | 'tertiary' | 'secondary';
}

const toneMap = {
  primary: 'text-primary',
  tertiary: 'text-tertiary',
  secondary: 'text-secondary'
};

export default function StatCard({ label, value, icon, tone = 'primary' }: Props) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className={`material-symbols-outlined text-6xl ${toneMap[tone]}`}>{icon}</span>
      </div>
      <div className="flex flex-col gap-1 z-10">
        <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">{label}</span>
        <span className="text-3xl font-bold text-on-surface mt-2">{value}</span>
      </div>
    </div>
  );
}
