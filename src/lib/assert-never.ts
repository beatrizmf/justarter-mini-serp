/**
 * Makes sure a `switch` handled every member of a union.
 *
 * If a case is left over, the value that reaches this call is not `never` and
 * the code does not compile. If something still arrives at runtime (unexpected
 * data from outside), the function throws.
 */
export function assertNever(value: never): never {
  throw new Error(`Caso não tratado: ${JSON.stringify(value)}`)
}
