'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function SidebarToggleButton() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        'size-10 rounded-xl border-2 transition-all duration-200',
        'bg-background hover:bg-accent hover:border-primary/50',
        'shadow-lg hover:shadow-xl',
        isCollapsed && 'animate-pulse-subtle border-primary/60 bg-primary/5'
      )}
      aria-label="Toggle Sidebar"
    >
      {isCollapsed ? (
        <ChevronRight className="text-primary size-5" />
      ) : (
        <ChevronLeft className="size-5" />
      )}
    </Button>
  );
}
