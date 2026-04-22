/**
 * Flattens a pg_graphql Relay connection { edges: [{ node }] } into T[].
 * Accepts Apollo's DeepPartialObject-wrapped shapes (all fields optional)
 * by using `unknown` + runtime shape check, then asserts nodes as T.
 * Returns a strictly T[] type so templates and array methods stay type-clean.
 */
export function unwrapNodes<T>(collection: unknown): T[] {
  if (!collection || typeof collection !== 'object') return [];
  const edges = (collection as { edges?: unknown }).edges;
  if (!Array.isArray(edges)) return [];
  const result: T[] = [];
  for (const edge of edges) {
    const node =
      edge && typeof edge === 'object'
        ? (edge as { node?: unknown }).node
        : null;
    if (node != null) result.push(node as T);
  }
  return result;
}
