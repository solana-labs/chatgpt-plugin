import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
configConstants();

import { DefiTokenUsersDailyRequest } from "@hellomoon/api";
import { makeApiPostRequest } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { day, limit } = req.body;

  let args = new DefiTokenUsersDailyRequest({
    mint: req.body["mint"].toString(),
    day: day ? new Date(day).toISOString() : undefined,
    limit: limit ?? 10,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
export default makeApiPostRequest(handler, { tokens: ["mint"] });
