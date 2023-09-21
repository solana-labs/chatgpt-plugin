import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
configConstants();

import { DefiTokenLeaderboardV3Request } from "@hellomoon/api";
import { makeApiPostRequest } from "@/lib/middleware";

const GRANULARITY = ["one_day", "one_week", "one_month", "thirty_min", "one_hour", "six_hour"];
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { granularity, limit } = req.body;

  if (granularity && !GRANULARITY.includes(granularity.toLowerCase())) {
    res.status(500).send("Invalid granularity: " + granularity);
    return;
  }

  let args = new DefiTokenLeaderboardV3Request({
    granularity: granularity ? ((granularity as string).toLocaleUpperCase() as any) : "ONE_DAY",
    mint: req.body["mint"].toString(),
    limit: limit ?? 10,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}

export default makeApiPostRequest(handler, { tokens: ["mint"] });
