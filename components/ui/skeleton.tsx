// file: components/ui/skeleton.tsx
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn('animate-pulse rounded-xl bg-muted', className)} {...props} />;
}

export { Skeleton };
// ✅ Verified: tip yoxlaması və build ilə.
