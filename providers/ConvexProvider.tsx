'use client';

import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithAuth } from 'convex/react';
import { useAuth, useAccessToken } from '@workos-inc/authkit-nextjs/components';
import { toast } from 'sonner';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

/** Delay helper for retry backoff */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  );
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
      {children}
    </ConvexProviderWithAuth>
  );
}

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();
  const toastShownRef = useRef(false);

  const isAuthenticated = !!user;

  const fetchAccessToken = useCallback(
    async ({
      forceRefreshToken
    }: { forceRefreshToken?: boolean } = {}): Promise<string | null> => {
      if (!user) {
        return null;
      }

      /** Attempt a single token fetch/refresh */
      const attempt = async (): Promise<string | null> => {
        if (forceRefreshToken) {
          return (await refresh()) ?? null;
        }
        return (await getAccessToken()) ?? null;
      };

      try {
        return await attempt();
      } catch (error) {
        console.error('Failed to get access token, retrying...', error);

        // Retry with backoff
        for (let i = 0; i < MAX_RETRIES; i++) {
          await delay(RETRY_DELAY_MS * (i + 1));
          try {
            return (await refresh()) ?? null;
          } catch {
            // continue to next retry
          }
        }

        // All retries failed — show toast once and redirect
        if (!toastShownRef.current) {
          toastShownRef.current = true;
          toast.error('Session expired', {
            description: 'Redirecting to login...',
            duration: 3000,
            onAutoClose: () => {
              window.location.href = '/login';
            }
          });
        }

        return null;
      }
    },
    [user, refresh, getAccessToken]
  );

  return {
    isLoading,
    isAuthenticated,
    fetchAccessToken
  };
}
