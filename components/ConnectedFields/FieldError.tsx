'use client';

import { ErrorMessage } from '@hookform/error-message';

/**
 * Renders the RHF error message for `name` using form context.
 * Sits in ConnectedFields — reads from RHF, delegates styling to the `<p>` primitive.
 */
export default function FieldError({ name }: { name: string }) {
  return (
    <ErrorMessage
      name={name}
      render={({ message }) => (
        <p
          role="alert"
          className="text-destructive text-xs/relaxed font-normal"
        >
          {message}
        </p>
      )}
    />
  );
}
