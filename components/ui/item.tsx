/**
 * @file item.tsx
 * @description Styled item primitives for combobox/list item rendering.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

/** Flex container for a list item row. */
function Item({
  className,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="item"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

/** Column wrapper for item text content. */
function ItemContent({
  className,
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
}

/** Primary text line. */
function ItemTitle({
  className,
  ...props
}: React.ComponentPropsWithRef<'span'>) {
  return (
    <span
      data-slot="item-title"
      className={cn('whitespace-nowrap text-xs', className)}
      {...props}
    />
  );
}

/** Secondary muted text line. */
function ItemDescription({
  className,
  ...props
}: React.ComponentPropsWithRef<'span'>) {
  return (
    <span
      data-slot="item-description"
      className={cn(
        'text-muted-foreground whitespace-nowrap text-[10px]',
        className
      )}
      {...props}
    />
  );
}

export { Item, ItemContent, ItemTitle, ItemDescription };
