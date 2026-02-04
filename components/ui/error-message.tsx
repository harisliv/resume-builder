import * as React from 'react';

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-destructive text-sm font-medium">{children}</p>;
}

export { ErrorMessage };
