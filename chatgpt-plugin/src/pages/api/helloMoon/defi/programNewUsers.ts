import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";

import { DefiProgramNetNewUsersDailyRequest } from "@hellomoon/api";
configConstants();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { programId, limit, day } = req.body;

  let date: Date = new Date();
  if (day) {
    try {
      date = new Date(day);
    } catch (e) {
      res.status(500).send("Invalid day: " + day);
      return;
    }
  }

  let args = new DefiProgramNetNewUsersDailyRequest({
    programId,
    limit: limit ?? 10,
    day: date ? date.toISOString() : undefined,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
