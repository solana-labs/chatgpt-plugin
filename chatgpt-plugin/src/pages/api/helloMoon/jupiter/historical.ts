import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
import { JupiterCurrentStatsRequest, JupiterHistoricalTradingStatsRequest } from "@hellomoon/api";
configConstants();

// granularity?: Array<"DAILY" | "WEEKLY" | "MONTHLY"> | "DAILY" | "WEEKLY" | "MONTHLY";
/**
 * The date being measured, for month and week if will be first day of that month or week
 * `optional field`
 */
// date?: string;

const VALID_OPERATORS = ["=", "!=", ">", "<", ">=", "!="];
type Comparison =
  | {
      operator: "=" | "!=" | ">" | "<" | ">=" | "!=";
      value: number;
    }
  | undefined;

function buildComparison(operator: string | undefined, value: number | undefined): Comparison {
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

const VALID_GRANULARITY = ["DAILY", "WEEKLY", "MONTHLY"];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { granularity, limit } = req.body;

  if (granularity && !VALID_GRANULARITY.includes(granularity)) {
    res
      .status(500)
      .send(
        "Invalid granularity: " +
          granularity +
          ". Valid granularities are: " +
          VALID_GRANULARITY.join(", ") +
          ".",
      );
    return;
  }

  let numTxns: Comparison;
  let usdVolume: Comparison;
  let numUsers: Comparison;

  try {
    numTxns = buildComparison(req.body.numTxnsOperator, req.body.numTxnsValue);
    usdVolume = buildComparison(req.body.usdVolumeOperator, req.body.usdVolumeValue);
    numUsers = buildComparison(req.body.numUsersOperator, req.body.numUsersValue);
  } catch (error) {
    res.status(500).send((error as Error).message);
    return;
  }

  console.log(numUsers);
  let args = new JupiterHistoricalTradingStatsRequest({
    granularity: granularity ?? "DAILY",
    limit: limit ?? 10,
    numTxns,
    usdVolume,
    numUsers,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
