import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELLOMOON_CLIENT } from "../../constants";

import { JupiterPairsBrokenDownWeeklyRequest } from "@hellomoon/api";
import { PublicKey } from "@solana/web3.js";
import { cleanSwapPair } from "@/lib/helloMoon";
configConstants();

const VALID_CATEGORY = ["per amm", "whole market", "jupiter only"];
// Make params case-insensitive so it's easier for LLMs to get right
const CATEGORY_MAP: { [key: string]: string } = {
  "per amm": "Per AMM",
  "whole market": "Whole market",
  "jupiter only": "Jupiter only",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, ammProgramId, swapPair, limit } = req.body;

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

  if ((category as string).toLocaleLowerCase() === "per amm" && ammProgramId) {
    try {
      new PublicKey(ammProgramId);
    } catch (error) {
      res.status(500).send("AMM Program ID is not a valid public key.");
      return;
    }
  }
  let mapped = CATEGORY_MAP[category as string] as any;
  let args = new JupiterPairsBrokenDownWeeklyRequest({
    category: mapped,
    subCategory: (ammProgramId as string).length ? ammProgramId : undefined,
    swapPair: swapPair ? cleanSwapPair(swapPair) : undefined,
    limit,
  });

  let data = await HELLOMOON_CLIENT.send(args)
    .then(result => result.data)
    .catch(console.error);

  res.status(200).send(data);
}
