import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";

import { DefiTokenLeaderboardV3Request } from "@hellomoon/api";
configConstants();

const GRANULARITY = ["one_day", "one_week", "one_month", "thirty_min", "one_hour", "six_hour"];
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { granularity, mint, limit } = req.body;

  if (granularity && !GRANULARITY.includes(granularity.toLowerCase())) {
    res.status(500).send("Invalid granularity: " + granularity);
    return;
  }

  let args = new DefiTokenLeaderboardV3Request({
    granularity: granularity ? ((granularity as string).toLocaleUpperCase() as any) : "ONE_DAY",
    mint: mint ?? undefined,
    limit: limit ?? 10,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
