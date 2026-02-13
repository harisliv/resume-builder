import type { ComponentProps } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
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
        <CardTitle className="text-muted-foreground text-xs font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-2">{children}</CardContent>
    </Card>
  );
}

export function ComparisonGrid({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid grid-cols-2 gap-4', className)} {...props} />;
}

export function MutedText({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap',
        className
      )}
      {...props}
    />
  );
}

export function ExperienceLabel({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-muted-foreground text-xs font-semibold', className)}
      {...props}
    />
  );
}

export function BulletList({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn('mt-2 space-y-2', className)} {...props} />;
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
      <span className="text-muted-foreground/50 mt-0.5 shrink-0">&bull;</span>
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
          'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}

type TRemovableSkillBadgeProps = ComponentProps<typeof Badge> & {
  isNew: boolean;
  onRemove?: () => void;
};

/** Skill badge with an X button visible on hover for new skills. */
export function RemovableSkillBadge({
  isNew,
  onRemove,
  children,
  className,
  ...props
}: TRemovableSkillBadgeProps) {
  return (
    <NewSkillBadge
      isNew={isNew}
      className={cn('group/skill relative pr-1.5', isNew && 'pr-5', className)}
      {...props}
    >
      {children}
      {isNew && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-0.5 cursor-pointer"
          aria-label={`Remove ${children}`}
        >
          <X className="size-3" />
        </button>
      )}
    </NewSkillBadge>
  );
}

type TSelectableFieldProps = ComponentProps<'div'> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/** Wrapper that adds a checkbox and dims content when unchecked. */
export function SelectableField({
  checked,
  onCheckedChange,
  children,
  className,
  ...props
}: TSelectableFieldProps) {
  return (
    <div className={cn('flex items-start gap-2', className)} {...props}>
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5 shrink-0"
      />
      <div
        className={cn('flex-1 transition-opacity', !checked && 'opacity-40')}
      >
        {children}
      </div>
    </div>
  );
}
