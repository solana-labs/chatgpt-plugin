import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
import { Comparison, buildComparison } from "@/lib/helloMoon";

import { JupiterHistoricalTradingStatsRequest } from "@hellomoon/api";
configConstants();

const VALID_GRANULARITY = ["DAILY", "WEEKLY", "MONTHLY"];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { granularity, limit } = req.body;

  if (granularity && !VALID_GRANULARITY.includes((granularity as string).toLocaleUpperCase())) {
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
    granularity: ((granularity as string).toLocaleUpperCase() as any) ?? "DAILY",
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
