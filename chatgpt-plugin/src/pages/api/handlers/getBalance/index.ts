import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { address } = req.body;
  const balance = await CONNECTION.getBalance(new PublicKey(address));
  res.status(200).send({ sol: balance / LAMPORTS_PER_SOL });
}
