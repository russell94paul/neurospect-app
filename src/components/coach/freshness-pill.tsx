import { differenceInSeconds } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  createdAt: string;
  className?: string;
}

export function FreshnessPill({ createdAt, className }: Props) {
  const seconds = differenceInSeconds(new Date(), new Date(createdAt));
  const minutes = Math.floor(seconds / 60);

  let label: string;
  let style: string;

  if (seconds < 300) {
    label = 'Fresh';
    style = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  } else if (seconds < 1800) {
    label = `Stale (${minutes}m)`;
    style = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  } else {
    const hours = Math.floor(minutes / 60);
    label = `Stale (${hours}h)`;
    style = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }

  return (
    <Badge variant="outline" className={cn('border-0 text-xs', style, className)}>
      {label}
    </Badge>
  );
}
