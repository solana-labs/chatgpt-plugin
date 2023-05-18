import { Request, Response } from "express";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CONNECTION } from "../../constants";

export async function getBalance(req: Request, res: Response) {
  const { address } = req.body;
  const balance = await CONNECTION.getBalance(new PublicKey(address));
  res.status(200).send({ sol: balance / LAMPORTS_PER_SOL });
}
