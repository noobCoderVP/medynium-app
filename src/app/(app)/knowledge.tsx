import { useLocalSearchParams } from 'expo-router';

import { KnowledgeView } from '@/features/knowledge';

/** Reached from More, above the tabs, so the bar stays at five and Back returns to More. A `q` param pre-fills the search. */
export default function KnowledgeScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  return <KnowledgeView key={q ?? ''} back initialQuery={q ?? ''} />;
}
