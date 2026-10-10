import type { ProduceCondition } from '@/types';
import { getConditionOption } from '@/data/sampleData';
import {
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  Clock,
  XCircle,
  CircleHelp as HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CONDITION_ICONS: Record<ProduceCondition, LucideIcon> = {
  fresh_good: CheckCircle,
  cosmetically_damaged: AlertCircle,
  overripe: Clock,
  rotten_decayed: XCircle,
  uncertain: HelpCircle,
};

interface ConditionBadgeProps {
  condition: ProduceCondition;
  size?: 'sm' | 'md';
}

export default function ConditionBadge({ condition, size = 'sm' }: ConditionBadgeProps) {
  const option = getConditionOption(condition);
  const Icon = CONDITION_ICONS[condition] ?? HelpCircle;
  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2.5 py-1 gap-1'
      : 'text-sm px-3 py-1.5 gap-1.5';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${option.badgeClass} ${sizeClasses}`}
    >
      <Icon className={`${iconSize} ${option.iconClass}`} />
      {option.label}
    </span>
  );
}
