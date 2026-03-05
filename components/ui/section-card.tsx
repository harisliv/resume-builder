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
    <Card className={cn('p-7 flex flex-col h-full', className)}>
      {children}
    </Card>
  );
}

function SectionCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-end gap-3 mb-6 shrink-0 md:flex-row md:items-center md:justify-between md:gap-0">
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
    <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight w-full self-stretch md:w-auto md:self-auto">
      <div className={cn('p-2.5 rounded-xl shrink-0', iconGradientClass)}>
        <HugeiconsIcon icon={icon} strokeWidth={1.5} size={24} />
      </div>
      {children}
    </h3>
  );
}

function SectionCardActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 shrink-0 md:w-auto">
      {children}
    </div>
  );
}

function SectionCardContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 min-h-0 p-1">{children}</div>;
}

export {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardActions,
  SectionCardContent
};
