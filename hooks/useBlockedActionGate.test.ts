import { getBlockedActionInfo } from '@/lib/blockedActionGate';
import { describe, expect, it } from 'vitest';

const baseInput = {
  isLoggedIn: true,
  role: 'basic',
  isMember: false,
  isAdmin: false,
  resumeLimit: 20,
  resumeCount: 1,
  hasSelectedResume: true,
  isAiImproved: false,
  pdfAttempts: { remaining: 2, max: 3 },
  aiAttempts: { remaining: 4, max: 5 }
};

describe('getBlockedActionInfo', () => {
  it('asks logged-out users to log in without offering upgrade', () => {
    const blocker = getBlockedActionInfo('createResume', {
      ...baseInput,
      isLoggedIn: false,
      role: undefined,
      isMember: true,
      resumeCount: 0
    });

    expect(blocker).toMatchObject({
      title: 'Log in to continue',
      description: 'Please log in to use the platform.',
      confirmLabel: 'Got it',
      canUpgrade: false
    });
  });

  it('offers upgrade to logged-in members before running gated actions', () => {
    const blocker = getBlockedActionInfo('importPdf', {
      ...baseInput,
      role: 'member',
      isMember: true,
      resumeCount: 0
    });

    expect(blocker).toMatchObject({
      title: 'Upgrade to continue',
      description: 'Upgrade your plan to use Import PDF.',
      confirmLabel: 'Upgrade',
      canUpgrade: true
    });
    expect(blocker?.variant).toBeUndefined();
  });

  it('shows the PDF attempt limit before opening PDF import', () => {
    const blocker = getBlockedActionInfo('importPdf', {
      ...baseInput,
      pdfAttempts: { remaining: 0, max: 3 }
    });

    expect(blocker).toMatchObject({
      title: 'PDF import limit reached',
      description: 'PDF import limit reached (3/month). Try again next month.',
      confirmLabel: 'Got it',
      canUpgrade: false
    });
  });

  it('shows resume cap guidance when the user cannot create more resumes', () => {
    const blocker = getBlockedActionInfo('createResume', {
      ...baseInput,
      resumeLimit: 20,
      resumeCount: 20
    });

    expect(blocker).toMatchObject({
      title: 'Resume limit reached',
      description: 'Resume limit reached (20). Delete one to create more.',
      confirmLabel: 'Got it',
      canUpgrade: false
    });
  });

  it('prefers missing resume guidance for improve actions', () => {
    const blocker = getBlockedActionInfo('improveResume', {
      ...baseInput,
      hasSelectedResume: false
    });

    expect(blocker).toMatchObject({
      title: 'Select a resume first',
      description: 'Select a resume first.',
      confirmLabel: 'Got it'
    });
  });

  it('guides users to improve before matching jobs', () => {
    const blocker = getBlockedActionInfo('matchJob', {
      ...baseInput,
      isAiImproved: false
    });

    expect(blocker).toMatchObject({
      title: 'Improve your resume first',
      description: 'Improve your resume first.',
      confirmLabel: 'Got it'
    });
  });

  it('shows action-state guidance before generic member upgrade', () => {
    const blocker = getBlockedActionInfo('matchJob', {
      ...baseInput,
      role: 'member',
      isMember: true,
      isAiImproved: false
    });

    expect(blocker).toMatchObject({
      title: 'Improve your resume first',
      description: 'Improve your resume first.',
      confirmLabel: 'Got it',
      canUpgrade: false
    });
  });

  it('points already-improved resumes toward Match Job', () => {
    const blocker = getBlockedActionInfo('improveResume', {
      ...baseInput,
      isAiImproved: true
    });

    expect(blocker).toMatchObject({
      title: 'Already AI-improved',
      description: 'Already AI-improved. Use Match Job instead.',
      confirmLabel: 'Got it'
    });
  });

  it('allows actions when no blocker applies', () => {
    const blocker = getBlockedActionInfo('matchJob', {
      ...baseInput,
      isAiImproved: true
    });

    expect(blocker).toBeNull();
  });

  it('blocks create actions while resume limits are still loading', () => {
    const blocker = getBlockedActionInfo('createResume', {
      ...baseInput,
      resumeCount: undefined
    });

    expect(blocker).toMatchObject({
      title: 'Checking resume limit',
      description: 'We are still checking your resume limit. Try again in a moment.',
      confirmLabel: 'Got it'
    });
  });

  it('blocks import while PDF attempts are still loading', () => {
    const blocker = getBlockedActionInfo('importPdf', {
      ...baseInput,
      pdfAttempts: undefined
    });

    expect(blocker).toMatchObject({
      title: 'Checking PDF limit',
      description: 'We are still checking your PDF import limit. Try again in a moment.',
      confirmLabel: 'Got it'
    });
  });
});
