'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  documentStyleSchema,
  documentStyleDefaultValues,
  type TDocumentStyle
} from '@/types';
import { PaletteSelect, FontSelect, StyleSelect } from './';
import { Button } from '@/components/ui/button';

interface IDocumentStyleControlsProps {
  defaultValue?: TDocumentStyle;
  onApply: (style: TDocumentStyle) => void;
}

export default function DocumentStyleControls({
  defaultValue,
  onApply
}: IDocumentStyleControlsProps) {
  const form = useForm<TDocumentStyle>({
    resolver: zodResolver(documentStyleSchema),
    defaultValues: defaultValue ?? documentStyleDefaultValues
  });

  const handleApply = form.handleSubmit((data) => {
    onApply(data);
  });

  return (
    <FormProvider {...form}>
      <div className="flex gap-4 items-end">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <PaletteSelect />
          <FontSelect />
          <StyleSelect />
        </div>
        <Button type="button" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </FormProvider>
  );
}
