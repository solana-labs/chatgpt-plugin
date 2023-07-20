export const VALID_OPERATORS = ["=", "!=", ">", "<", ">=", "!="];
export type Comparison =
  | {
      operator: "=" | "!=" | ">" | "<" | ">=" | "!=";
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
    operator && value
      ? {
          operator,
          value: new Number(value).valueOf(),
        }
      : undefined;

  return comparison as Comparison;
}
