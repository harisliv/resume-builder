import type { ComponentProps } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TComparisonCardProps = ComponentProps<typeof Card> & {
  title: string;
  suggested?: boolean;
};

export function ComparisonCard({
  title,
  suggested,
  children,
  className,
  ...props
}: TComparisonCardProps) {
  return (
    <Card
      size="sm"
      className={cn(suggested && 'border-primary/40', className)}
      {...props}
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ComparisonGrid({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)} {...props} />
  );
}

export function HighlightedText({
  changed,
  className,
  ...props
}: ComponentProps<'p'> & { changed?: boolean }) {
  return (
    <p
      className={cn(
        'whitespace-pre-wrap text-xs',
        changed && 'rounded-md bg-emerald-500/10 px-2 py-1',
        className
      )}
      {...props}
    />
  );
}

export function MutedText({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-muted-foreground whitespace-pre-wrap text-xs',
        className
      )}
      {...props}
    />
  );
}

export function ExperienceLabel({
  className,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-xs font-semibold text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export function BulletList({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn('mt-2 space-y-1', className)} {...props} />;
}

export function BulletItem({
  changed,
  className,
  children,
  ...props
}: ComponentProps<'li'> & { changed?: boolean }) {
  return (
    <li
      className={cn(
        'flex items-start gap-1.5 text-xs',
        changed && 'rounded-md bg-emerald-500/10 px-2 py-0.5',
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground/50 mt-0.5 shrink-0">
        &bull;
      </span>
      {children}
    </li>
  );
}

export function BadgeGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-wrap gap-1.5', className)} {...props} />;
}

export function NewSkillBadge({
  isNew,
  children,
  className,
  ...props
}: ComponentProps<typeof Badge> & { isNew: boolean }) {
  return (
    <Badge
      variant={isNew ? 'default' : 'outline'}
      className={cn(
        isNew &&
          'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
