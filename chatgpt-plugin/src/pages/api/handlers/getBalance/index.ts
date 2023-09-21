import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import configConstants, { CONNECTION } from "../../constants";
configConstants();
import { makeApiPostRequest } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.body;
  const balance = await CONNECTION.getBalance(new PublicKey(address));
  res.status(200).send({ sol: balance / LAMPORTS_PER_SOL });
}

export default makeApiPostRequest(handler, { addresses: ["address"] });
