import * as React from 'react';

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-destructive font-medium">{children}</p>;
}

export { ErrorMessage };
