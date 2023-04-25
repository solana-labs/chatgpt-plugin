import { Request, Response } from "express";
import { CONNECTION } from "../../constants";

export async function getTransaction(req: Request, res: Response) {
  const signature = req.body.signature;
  const transaction = await CONNECTION.getTransaction(signature, {
    maxSupportedTransactionVersion: 2,
  });
  res.status(200).send(JSON.stringify(transaction));
}
