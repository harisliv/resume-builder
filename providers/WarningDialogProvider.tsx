'use client';

import { createContext, useContext, useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

type WarningDialogOptions = {
  title: string;
  description: string;
  /** @default "Confirm" */
  confirmLabel?: string;
  /** @default "default" */
  variant?: 'default' | 'destructive';
};

type ConfirmFn = (options: WarningDialogOptions) => Promise<boolean>;

const WarningDialogContext = createContext<ConfirmFn | null>(null);

/**
 * Promise-based global warning dialog.
 *
 * How it works:
 * 1. A consumer calls `const ok = await confirm({ title, description })`.
 * 2. `confirm` creates a new Promise and stashes its `resolve` function in `resolveRef`.
 *    It also sets `state` with the dialog options, which opens the AlertDialog.
 *    The consumer's code is now *paused* at the `await`.
 * 3. The user clicks Confirm or Cancel (or dismisses the overlay).
 * 4. `settle(true/false)` calls `resolveRef.current(value)`, which resolves the
 *    Promise — unpausing the consumer's `await` with `true` or `false`.
 *    It then clears the ref and sets `state` back to `null` to close the dialog.
 *
 * Why `useRef` instead of `useState` for the resolve function:
 * - The resolve function is an internal implementation detail, not render-driving state.
 * - Storing it in a ref avoids an extra re-render when it changes.
 *
 * Why `useCallback(confirm, [])` (empty deps):
 * - Makes `confirm` a **stable reference** that never changes across renders.
 * - The context value is this single function, so it never changes →
 *   components calling `useWarningDialog()` never re-render when the dialog opens/closes.
 * - `confirm` can still read/write `resolveRef` and call `setState` because
 *   refs and state setters are stable by nature in React.
 */
export function WarningDialogProvider({ children }: { children: ReactNode }) {
  /** Dialog options when open, `null` when closed. Drives the AlertDialog's `open` prop. */
  const [state, setState] = useState<WarningDialogOptions | null>(null);

  /** Holds the Promise's `resolve` function between `confirm()` and user action. */
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  /**
   * Opens the dialog and returns a Promise that resolves to `true` (confirmed)
   * or `false` (cancelled). Stable reference — never changes across renders.
   */
  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        resolveRef.current = resolve; // stash resolve so settle() can call it later
        setState(options);            // open the dialog
      }),
    []
  );

  /** Resolves the pending Promise with `value`, then closes the dialog. */
  const settle = useCallback((value: boolean) => {
    resolveRef.current?.(value); // unblock the consumer's `await`
    resolveRef.current = null;
    setState(null);              // close the dialog
  }, []);

  return (
    <WarningDialogContext.Provider value={confirm}>
      {children}
      <AlertDialog open={!!state} onOpenChange={(open) => !open && settle(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state?.title}</AlertDialogTitle>
            <AlertDialogDescription>{state?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => settle(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={state?.variant ?? 'default'}
              onClick={() => settle(true)}
            >
              {state?.confirmLabel ?? 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WarningDialogContext.Provider>
  );
}

/** Returns a stable `confirm()` function that opens the global warning dialog. */
export function useWarningDialog(): ConfirmFn {
  const ctx = useContext(WarningDialogContext);
  if (!ctx) throw new Error('useWarningDialog must be used within WarningDialogProvider');
  return ctx;
}
