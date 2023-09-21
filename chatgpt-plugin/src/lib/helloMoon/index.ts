export const VALID_OPERATORS = ["=", "!=", ">", "<", ">="];
export type Comparison =
  | {
      operator: "=" | "!=" | ">" | "<" | ">=";
      value: number;
    }
  | undefined;

export function buildComparison(
  operator: string | undefined,
  value: number | undefined,
): Comparison {
  if (operator && !VALID_OPERATORS.includes(operator)) {
    throw new Error(
      "Invalid operator: " +
        operator +
        ". Valid operators are: " +
        VALID_OPERATORS.join(", ") +
        ".",
    );
  }

  const comparison =
    operator && value !== undefined
      ? {
          operator,
          value: new Number(value).valueOf(),
        }
      : undefined;

  return comparison as Comparison;
}

/**
 * Rewrites a "B - A" pair to "A-B" pair
 * @param pair
 */
export function cleanSwapPair(pair: string) {
  let cleaned = pair.replaceAll(" ", "");
  let split = cleaned.split("-");
  let pairA = split[0];
  let pairB = split[1];
  if (pairA < pairB) {
    return `${pairA} - ${pairB}`;
  }
  return `${pairB} - ${pairA}`;
}
