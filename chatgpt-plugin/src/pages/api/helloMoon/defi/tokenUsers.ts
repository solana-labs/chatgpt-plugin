import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";

import { DefiTokenUsersDailyRequest } from "@hellomoon/api";
configConstants();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mint, day, limit } = req.body;

  let args = new DefiTokenUsersDailyRequest({
    mint,
    day: day ? new Date(day).toISOString() : undefined,
    limit: limit ?? 10,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
