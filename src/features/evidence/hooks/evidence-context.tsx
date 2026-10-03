import { createContext, use, useMemo, useState, type PropsWithChildren } from 'react';

import { EvidenceDrawer } from '../components/evidence-drawer';

export interface EvidenceTarget {
  answerId: string;
  statementId?: string | null;
}

interface EvidenceValue {
  /** Open the Why? drawer for an answer, optionally highlighting one statement's evidence. */
  open: (target: EvidenceTarget) => void;
}

const EvidenceContext = createContext<EvidenceValue | null>(null);

/** Mounted once near the root, so any screen can open Why? without passing evidence through props. */
export function EvidenceProvider({ children }: PropsWithChildren) {
  const [target, setTarget] = useState<EvidenceTarget | null>(null);
  const value = useMemo(() => ({ open: setTarget }), []);
  return (
    <EvidenceContext value={value}>
      {children}
      <EvidenceDrawer target={target} onClose={() => setTarget(null)} />
    </EvidenceContext>
  );
}

export function useEvidenceDrawer() {
  const ctx = use(EvidenceContext);
  if (!ctx) throw new Error('useEvidenceDrawer must be used inside EvidenceProvider');
  return ctx;
}
