import { Button } from '@/components/ui/button';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type TStyledAccordionProps = {
  children: React.ReactNode;
};

export function StyledAccordion({ children }: TStyledAccordionProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={['education-0']}
      className="rounded-none border-0 shadow-none"
    >
      {children}
    </Accordion>
  );
}

type TStyledAccordionItemProps = {
  value: string;
  children: React.ReactNode;
};

export function StyledAccordionItem({
  value,
  children
}: TStyledAccordionItemProps) {
  return (
    <AccordionItem
      value={value}
      className="mb-2 rounded-lg border border-slate-200 last:mb-0"
    >
      {children}
    </AccordionItem>
  );
}

type TStyledAccordionTriggerProps = {
  label: string;
  onDelete: () => void;
};

export function StyledAccordionTrigger({
  label,
  onDelete
}: TStyledAccordionTriggerProps) {
  return (
    <AccordionTrigger className="items-center px-4 py-3 text-sm hover:bg-slate-50/50 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:order-3 [&_[data-slot=accordion-trigger-icon]]:ml-0">
      <span className="order-1 flex-1 truncate text-left font-medium">
        {label}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="order-2 h-7 w-7 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
      </Button>
    </AccordionTrigger>
  );
}

type TStyledAccordionContentProps = {
  children: React.ReactNode;
};

export function StyledAccordionContent({
  children
}: TStyledAccordionContentProps) {
  return (
    <AccordionContent className="px-4 pb-4">
      <div className="space-y-4">{children}</div>
    </AccordionContent>
  );
}
