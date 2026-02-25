'use client';

import { useState } from 'react';
import { format, setMonth } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

interface MonthYearPickerProps {
  /** Currently selected date */
  value: Date | null;
  /** Callback when a month/year is selected */
  onChange: (date: Date) => void;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** HTML id for the trigger button */
  id?: string;
}

/**
 * A month/year date picker using a popover with a 4x3 month grid
 * and year navigation arrows.
 */
export function MonthYearPicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  id
}: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    () => value?.getFullYear() ?? new Date().getFullYear()
  );

  /** Handle month button click */
  function handleSelect(monthIndex: number) {
    const date = setMonth(new Date(viewYear, 0, 1), monthIndex);
    onChange(date);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            'w-full justify-start border font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, 'MMM yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="flex items-center justify-between mb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setViewYear((y) => y - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium">{viewYear}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setViewYear((y) => y + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {MONTHS.map((month, i) => {
            const isSelected =
              value?.getFullYear() === viewYear && value?.getMonth() === i;
            return (
              <Button
                key={month}
                type="button"
                variant={isSelected ? 'default' : 'ghost'}
                size="xs"
                onClick={() => handleSelect(i)}
              >
                {month}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
