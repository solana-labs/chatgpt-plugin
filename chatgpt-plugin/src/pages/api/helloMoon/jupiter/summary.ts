import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
import { JupiterCurrentStatsRequest } from "@hellomoon/api";
import { makeApiPostRequest } from "@/lib/middleware";
configConstants();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let data = await HELLOMOON_CLIENT.send(new JupiterCurrentStatsRequest({}))
    .then(result => result.data[0])
    .catch(console.error);

  res.status(200).send(data);
}

export default makeApiPostRequest(handler);
