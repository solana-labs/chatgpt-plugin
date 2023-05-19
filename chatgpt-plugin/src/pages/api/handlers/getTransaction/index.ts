import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.body.signature;
  const transaction = await CONNECTION.getTransaction(signature, {
    maxSupportedTransactionVersion: 2,
  });
  res.status(200).send(JSON.stringify(transaction));
}
