import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
import { Comparison, buildComparison } from "@/lib/helloMoon";

import { JupiterSwapStatsRequest } from "@hellomoon/api";
configConstants();

const VALID_GRANULARITY = ["DAILY", "WEEKLY", "MONTHLY"];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { swapPair, limit } = req.body;

  let dailyVolume: Comparison;
  let weeklyVolume: Comparison;
  let monthlyVolume: Comparison;

  try {
    dailyVolume = buildComparison(req.body.usdVolume24HrOperator, req.body.usdVolume24HrValue);
    weeklyVolume = buildComparison(req.body.usdVolume7DOperator, req.body.usdVolume7DValue);
    monthlyVolume = buildComparison(req.body.usdVolume30DOperator, req.body.usdVolume30DValue);
  } catch (error) {
    res.status(500).send((error as Error).message);
    return;
  }

  let args = new JupiterSwapStatsRequest({
    swapPair: swapPair,
    limit: limit ?? 10,
    usdVolume24Hr: dailyVolume,
    usdVolume7D: weeklyVolume,
    usdVolume30D: monthlyVolume,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
