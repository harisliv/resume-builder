export type TBlockedAction =
  | 'createResume'
  | 'importPdf'
  | 'improveResume'
  | 'matchJob'
  | 'saveResume'
  | 'downloadResume';

type TAttemptInfo = {
  remaining: number;
  max: number;
} | null;

export type TBlockedActionInput = {
  isLoggedIn: boolean;
  role?: string | null;
  isMember: boolean;
  isAdmin: boolean;
  resumeLimit: number;
  resumeCount?: number;
  hasSelectedResume: boolean;
  isAiImproved?: boolean;
  pdfAttempts?: TAttemptInfo;
  aiAttempts?: TAttemptInfo;
};

export type TBlockedActionInfo = {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'default' | 'destructive' | 'success';
  canUpgrade: boolean;
  requiresLogin?: boolean;
};

const ACTION_LABELS: Record<TBlockedAction, string> = {
  createResume: 'Create new',
  importPdf: 'Import PDF',
  improveResume: 'Improve Resume',
  matchJob: 'Match Job',
  saveResume: 'Save',
  downloadResume: 'Download'
};

/** Returns whether the current member role can upgrade through the modal. */
function canUpgrade(input: TBlockedActionInput) {
  return input.isLoggedIn && input.isMember;
}

/** Creates a neutral modal blocker with a single acknowledgement action. */
function acknowledge(title: string, description: string): TBlockedActionInfo {
  return {
    title,
    description,
    confirmLabel: 'Got it',
    canUpgrade: false
  };
}

/** Creates an upgrade blocker for logged-in users who can move to Basic. */
function upgrade(title: string, description: string): TBlockedActionInfo {
  return {
    title,
    description,
    confirmLabel: 'Upgrade',
    canUpgrade: true
  };
}

/** Creates a login blocker with a primary sign-in action. */
function signIn(title: string, description: string): TBlockedActionInfo {
  return {
    title,
    description,
    confirmLabel: 'Sign in',
    canUpgrade: false,
    requiresLogin: true
  };
}

/** Resolves the highest-priority reason an action should be blocked. */
export function getBlockedActionInfo(
  action: TBlockedAction,
  input: TBlockedActionInput
): TBlockedActionInfo | null {
  if (!input.isLoggedIn) {
    return signIn('Log in to continue', 'Please log in to use the platform.');
  }

  if (
    (action === 'improveResume' ||
      action === 'matchJob' ||
      action === 'saveResume' ||
      action === 'downloadResume') &&
    !input.hasSelectedResume
  ) {
    return acknowledge('Select a resume first', 'Select a resume first.');
  }

  if (action === 'createResume' || action === 'importPdf') {
    if (input.resumeCount === undefined && !input.isMember && !input.isAdmin) {
      return acknowledge(
        'Checking resume limit',
        'We are still checking your resume limit. Try again in a moment.'
      );
    }

    const atResumeLimit =
      input.resumeCount !== undefined && input.resumeCount >= input.resumeLimit;
    if (atResumeLimit) {
      if (canUpgrade(input)) {
        return upgrade(
          'Resume limit reached',
          'Resume limit reached. Upgrade to create more.'
        );
      }

      return acknowledge(
        'Resume limit reached',
        `Resume limit reached (${input.resumeLimit}). Delete one to create more.`
      );
    }
  }

  if (
    action === 'importPdf' &&
    !input.isAdmin &&
    !input.isMember &&
    input.pdfAttempts === undefined
  ) {
    return acknowledge(
      'Checking PDF limit',
      'We are still checking your PDF import limit. Try again in a moment.'
    );
  }

  if (action === 'importPdf' && !input.isAdmin && input.pdfAttempts?.remaining === 0) {
    return acknowledge(
      'PDF import limit reached',
      `PDF import limit reached (${input.pdfAttempts.max}/month). Try again next month.`
    );
  }

  if (action === 'improveResume' && input.isAiImproved) {
    return acknowledge(
      'Already AI-improved',
      'Already AI-improved. Use Match Job instead.'
    );
  }

  if (action === 'matchJob' && !input.isAiImproved) {
    return acknowledge('Improve your resume first', 'Improve your resume first.');
  }

  if (
    (action === 'improveResume' || action === 'matchJob') &&
    !input.isAdmin &&
    !input.isMember &&
    input.aiAttempts === undefined
  ) {
    return acknowledge(
      'Checking AI limit',
      'We are still checking your AI limit. Try again in a moment.'
    );
  }

  if (
    (action === 'improveResume' || action === 'matchJob') &&
    !input.isAdmin &&
    input.aiAttempts?.remaining === 0
  ) {
    return acknowledge(
      'AI limit reached',
      `AI limit reached (${input.aiAttempts.max}/day). Try again tomorrow.`
    );
  }

  if (input.isMember) {
    return upgrade(
      'Upgrade to continue',
      `Upgrade your plan to use ${ACTION_LABELS[action]}.`
    );
  }

  return null;
}
