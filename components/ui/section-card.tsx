import * as React from 'react';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type IconVariant = 'primary' | 'emerald';

function SectionCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('flex h-full flex-col p-7', className)}>
      {children}
    </Card>
  );
}

function SectionCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex shrink-0 items-center justify-between">
      {children}
    </div>
  );
}

function SectionCardTitle({
  icon,
  iconVariant = 'primary',
  children
}: {
  icon: IconSvgElement;
  iconVariant?: IconVariant;
  children: React.ReactNode;
}) {
  const iconGradientClass =
    iconVariant === 'primary'
      ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25'
      : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25';

  return (
    <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight">
      <div className={cn('rounded-xl p-2.5', iconGradientClass)}>
        <HugeiconsIcon icon={icon} strokeWidth={1.5} size={24} />
      </div>
      {children}
    </h3>
  );
}

function SectionCardActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}

function SectionCardContent({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 flex-1 p-1">{children}</div>;
}

export {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardActions,
  SectionCardContent
};
