import { Button } from '@/components/ui/button';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

type TStyledAccordionProps = {
  children: React.ReactNode;
  /** Default open item values (e.g. ['experience-0']). */
  defaultValue?: string[];
};

/** Shared accordion for Experience, Education, Skills sections. */
export function StyledAccordion({
  children,
  defaultValue = []
}: TStyledAccordionProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue}
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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
};

export function StyledAccordionTrigger({
  label,
  onDelete,
  onMoveUp,
  onMoveDown,
  disableMoveUp = false,
  disableMoveDown = false
}: TStyledAccordionTriggerProps) {
  return (
    <AccordionTrigger className="items-center px-4 py-3 text-sm hover:bg-slate-50/50 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:order-3 [&_[data-slot=accordion-trigger-icon]]:ml-0">
      {onMoveUp && onMoveDown && (
        <div
          className="order-0 mr-3 flex shrink-0 flex-col rounded-md bg-slate-100 p-0.5"
          onClick={(e) => e.stopPropagation()}
          role="group"
          aria-label="Reorder category"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disableMoveUp}
            aria-label="Move category up"
            className="h-5 w-5 shrink-0 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 disabled:opacity-40"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
          >
            <HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disableMoveDown}
            aria-label="Move category down"
            className="h-5 w-5 shrink-0 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 disabled:opacity-40"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} className="h-3 w-3" />
          </Button>
        </div>
      )}
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
