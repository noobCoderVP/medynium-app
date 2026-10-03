/** The evidence ids that belong to one statement, from the answer's statement map. */
export function evidenceFor(map: Record<string, string[]>, statementId: string | null): Set<string> {
  return new Set(statementId ? (map[statementId] ?? []) : []);
}
