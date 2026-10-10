import { Video as LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  sublabel?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = 'green',
  sublabel,
}: StatCardProps) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className={`rounded-xl border-2 p-5 ${colorMap[color] || colorMap.green}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <Icon className="w-6 h-6 opacity-70" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sublabel && <p className="text-xs mt-1 opacity-60">{sublabel}</p>}
    </div>
  );
}
