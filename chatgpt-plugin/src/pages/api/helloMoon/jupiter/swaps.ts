import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";
configConstants();

import { JupiterPairsBrokenDownWeeklyRequest } from "@hellomoon/api";
import { cleanSwapPair } from "@/lib/helloMoon";
import { makeApiPostRequest } from "@/lib/middleware";

const VALID_CATEGORY = ["per amm", "whole market", "jupiter only"];
// Make params case-insensitive so it's easier for LLMs to get right
const CATEGORY_MAP: { [key: string]: string } = {
  "per amm": "Per AMM",
  "whole market": "Whole market",
  "jupiter only": "Jupiter only",
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, swapPair, limit } = req.body;

  if (category && !VALID_CATEGORY.includes((category as string).toLocaleLowerCase())) {
    res
      .status(500)
      .send(
        "Invalid category: " +
          category +
          ". Valid categories are: " +
          VALID_CATEGORY.join(", ") +
          ".",
      );
    return;
  }

  let mapped = CATEGORY_MAP[category as string] as any;
  let args = new JupiterPairsBrokenDownWeeklyRequest({
    category: mapped,
    swapPair: swapPair ? cleanSwapPair(swapPair) : undefined,
    limit,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}

export default makeApiPostRequest(handler);
