// Deprecated - Not in use
import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";

import { DefiProgramOverlapRequest } from "@hellomoon/api";
configConstants();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { aProgramId, bProgramId, limit } = req.body;

  let args = new DefiProgramOverlapRequest({
    aProgramId,
    bProgramId,
    limit: limit ?? 10,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
